import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type Rating = "up" | "down";

type Citation = {
  label: string;
  url?: string;
};

type FeedbackPayload = {
  question: string;
  answer: string;
  rating: Rating;
  comment?: string;
  confidence?: number;
  citations?: Citation[];
};

const isRating = (value: unknown): value is Rating =>
  value === "up" || value === "down";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as FeedbackPayload | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!question || !answer || !isRating(body.rating)) {
    return NextResponse.json(
      { error: "question, answer, and rating are required." },
      { status: 400 }
    );
  }

  const citations = Array.isArray(body.citations)
    ? body.citations
        .flatMap((item) => {
          if (!item || typeof item !== "object") return [];
          const label =
            "label" in item && typeof item.label === "string" ? item.label.trim() : "";
          const url =
            "url" in item && typeof item.url === "string" && item.url.trim()
              ? item.url.trim()
              : undefined;
          if (!label) return [];
          return [{ label, url }];
        })
    : [];

  const record = {
    question,
    answer,
    rating: body.rating,
    comment,
    confidence:
      typeof body.confidence === "number"
        ? Math.max(0, Math.min(1, body.confidence))
        : null,
    citations,
    createdAt: new Date().toISOString(),
  };

  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "feedback.jsonl");
    await mkdir(dataDir, { recursive: true });
    await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
