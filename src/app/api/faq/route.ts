import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getRankedSourceChunks,
  getSourceCacheDiagnostics,
} from "@/lib/christ-sources";
import { searchMockFaqs, rankMockFaqs } from "@/lib/mock-faqs";
import { getUserDataContext, USER_DATA_SOURCE_LABEL } from "@/lib/user-data";

const apiKey = process.env.GEMINI_API_KEY;
const debugFromEnv = process.env.DEBUG === "true";

const isTruthyDebugParam = (value: string | null) => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
};

type Citation = {
  label: string;
  url?: string;
};

type FaqResponse = {
  answer: string;
  confidence: number;
  citations: Citation[];
  sources: string[];
};

const clampConfidence = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.4;

const parseModelJson = (raw: string) => {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]) as {
      answer?: unknown;
      confidence?: unknown;
      citations?: unknown;
    };

    const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    const confidence =
      typeof parsed.confidence === "number"
        ? clampConfidence(parsed.confidence)
        : 0.65;

    const citations = Array.isArray(parsed.citations)
      ? parsed.citations
          .flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const label =
              "label" in item && typeof item.label === "string"
                ? item.label.trim()
                : "";
            const url =
              "url" in item && typeof item.url === "string" && item.url.trim()
                ? item.url.trim()
                : undefined;
              if (!label) return [];
              return [{ label, url }];
          })
      : [];

    if (!answer) return null;
    return { answer, confidence, citations };
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const debugEnabled =
    debugFromEnv || isTruthyDebugParam(requestUrl.searchParams.get("debug"));

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json(
      { error: "Question is required." },
      { status: 400 }
    );
  }

  const mockHit = searchMockFaqs(question);
  if (mockHit) {
    const citations: Citation[] = [{ label: "Mock FAQ Dataset" }];
    const payload: Record<string, unknown> = {
      answer: mockHit.answer,
      confidence: 0.55,
      citations,
      sources: citations.map((item) => item.label),
    };

    if (debugEnabled) {
      payload.debug = {
        scraperCache: getSourceCacheDiagnostics(),
        retrieval: {
          officialChunkCount: 0,
          officialCitationCount: 0,
          usedMockFallback: true,
          usedUserData: false,
        },
      };
    }

    return NextResponse.json(payload);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const rankedSourceChunks = await getRankedSourceChunks(question, 8);

    const rankedOfficialCitations = Array.from(
      new Map(
        rankedSourceChunks.map((item) => [
          item.url,
          {
            label: item.label,
            url: item.url,
          },
        ])
      ).values()
    ).slice(0, 3);

    const userDataContext = getUserDataContext(question);

    const mockContextItems = rankMockFaqs(question, 5)
      .map(
        (item, idx) =>
          `Mock ${idx + 1}: Q: ${item.question}\nA: ${item.answer}`
      )
      .join("\n\n");

    const context = rankedSourceChunks
      .map(
        (item, idx) =>
          `Source ${idx + 1} (${item.url}) [score=${item.score}]:\n${item.chunk}`
      )
      .join("\n\n");

    const candidateOfficialUrls = rankedOfficialCitations
      .map((item) => item.url)
      .filter((url): url is string => Boolean(url));

    const prompt = `You are a Christ University FAQ assistant. Use the provided official sources first. If they do not contain the answer, you may use the user-provided dataset. If still unavailable, you may use the mock FAQ snippets as a fallback.\n\nRules:\n- Return only valid JSON (no markdown, no extra text).\n- JSON shape: {"answer": string, "confidence": number, "citations": Array<{"label": string, "url"?: string}>}.\n- confidence must be a number between 0 and 1.\n- Keep answer concise, accurate, and in plain text.\n- Only claim a detail is in official sources if explicitly present in source text.\n- If data is missing, clearly say it is not available in the provided sources and suggest contacting the relevant office.\n\nCandidate official citation URLs:\n${candidateOfficialUrls.join("\n") || "No official URLs available."}\n\nOfficial Sources:\n${context || "No sources available."}\n\nUser Data:\n${userDataContext || "No user data available."}\n\nMock FAQs:\n${mockContextItems || "No mock FAQs available."}\n\nQuestion: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    const parsed = parseModelJson(text);

    const fallbackCitations: Citation[] = [];
    if (rankedOfficialCitations.length > 0) {
      fallbackCitations.push(...rankedOfficialCitations);
    }
    if (userDataContext) {
      fallbackCitations.push({ label: USER_DATA_SOURCE_LABEL });
    }
    if (fallbackCitations.length === 0 && mockContextItems) {
      fallbackCitations.push({ label: "Mock FAQ Dataset" });
    }

    const payload: FaqResponse = {
      answer: parsed?.answer || text || "I could not generate an answer right now.",
      confidence:
        parsed?.confidence ??
        (rankedOfficialCitations.length > 0
          ? 0.78
          : userDataContext
            ? 0.68
            : mockContextItems
              ? 0.52
              : 0.4),
      citations: parsed?.citations?.length ? parsed.citations : fallbackCitations,
      sources: [],
    };

    payload.sources = payload.citations.map((item) => item.label);

    const responsePayload: Record<string, unknown> = { ...payload };

    if (debugEnabled) {
      responsePayload.debug = {
        scraperCache: getSourceCacheDiagnostics(),
        retrieval: {
          officialChunkCount: rankedSourceChunks.length,
          officialCitationCount: rankedOfficialCitations.length,
          usedMockFallback: fallbackCitations.some(
            (item) => item.label === "Mock FAQ Dataset"
          ),
          usedUserData: Boolean(userDataContext),
        },
      };
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
