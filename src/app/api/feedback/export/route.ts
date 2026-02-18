import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type Rating = "up" | "down";

type Citation = {
  label: string;
  url?: string;
};

type FeedbackRecord = {
  question: string;
  answer: string;
  rating: Rating;
  comment?: string;
  confidence?: number | null;
  citations?: Citation[];
  createdAt?: string;
};

const csvEscape = (value: string | number | null | undefined) => {
  const text = value == null ? "" : String(value);
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "feedback.jsonl");
    const raw = await readFile(filePath, "utf8").catch(() => "");

    const records = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as FeedbackRecord;
        } catch {
          return null;
        }
      })
      .filter((item): item is FeedbackRecord => Boolean(item));

    const headers = [
      "createdAt",
      "rating",
      "confidence",
      "question",
      "answer",
      "comment",
      "citations",
    ];

    const rows = records.map((record) => {
      const citationsText = Array.isArray(record.citations)
        ? record.citations
            .map((citation) => (citation.url ? `${citation.label} (${citation.url})` : citation.label))
            .join(" | ")
        : "";

      return [
        csvEscape(record.createdAt || ""),
        csvEscape(record.rating),
        csvEscape(
          typeof record.confidence === "number"
            ? Number(record.confidence.toFixed(2))
            : ""
        ),
        csvEscape(record.question || ""),
        csvEscape(record.answer || ""),
        csvEscape(record.comment || ""),
        csvEscape(citationsText),
      ].join(",");
    });

    const csv = [headers.map((header) => csvEscape(header)).join(","), ...rows].join("\n");
    const fileName = `feedback-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to export feedback CSV.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
