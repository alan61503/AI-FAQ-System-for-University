import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHRIST_SOURCES, fetchSourceText } from "@/lib/christ-sources";
import { searchMockFaqs, rankMockFaqs } from "@/lib/mock-faqs";
import { getUserDataContext, USER_DATA_SOURCE_LABEL } from "@/lib/user-data";

const apiKey = process.env.GEMINI_API_KEY;

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

const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const clampConfidence = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.4;

const buildSourceLabel = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
    return cleanPath ? `${hostname}/${cleanPath}` : hostname;
  } catch {
    return url;
  }
};

const scoreTextMatch = (query: string, text: string) => {
  const q = normalize(query);
  const hay = normalize(text);
  if (!q || !hay) return 0;

  const tokens = q.split(" ").filter((token) => token.length > 2);
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += 1;
  }
  return score;
};

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
    return NextResponse.json({
      answer: mockHit.answer,
      confidence: 0.55,
      citations,
      sources: citations.map((item) => item.label),
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const sourceResults = await Promise.allSettled(
      CHRIST_SOURCES.map((url) => fetchSourceText(url))
    );
    const sourceTexts = sourceResults
      .map((result, index) => ({
        url: CHRIST_SOURCES[index],
        text: result.status === "fulfilled" ? result.value : "",
      }))
      .filter((item) => item.text.length > 0)
      .slice(0, 5);

    const rankedOfficialCitations = sourceTexts
      .map((item) => ({
        ...item,
        score: scoreTextMatch(question, `${item.url} ${item.text.slice(0, 6000)}`),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => ({
        label: buildSourceLabel(item.url),
        url: item.url,
      }));

    const userDataContext = getUserDataContext(question);

    const mockContextItems = rankMockFaqs(question, 5)
      .map(
        (item, idx) =>
          `Mock ${idx + 1}: Q: ${item.question}\nA: ${item.answer}`
      )
      .join("\n\n");

    const context = sourceTexts
      .map(
        (item, idx) =>
          `Source ${idx + 1} (${item.url}):\n${item.text.slice(0, 4000)}`
      )
      .join("\n\n");

    const prompt = `You are a Christ University FAQ assistant. Use the provided official sources first. If they do not contain the answer, you may use the user-provided dataset. If still unavailable, you may use the mock FAQ snippets as a fallback.\n\nRules:\n- Return only valid JSON (no markdown, no extra text).\n- JSON shape: {"answer": string, "confidence": number, "citations": Array<{"label": string, "url"?: string}>}.\n- confidence must be a number between 0 and 1.\n- Keep answer concise, accurate, and in plain text.\n- Only claim a detail is in official sources if explicitly present in source text.\n- If data is missing, clearly say it is not available in the provided sources and suggest contacting the relevant office.\n\nCandidate official citation URLs:\n${sourceTexts.map((item) => item.url).join("\n") || "No official URLs available."}\n\nOfficial Sources:\n${context || "No sources available."}\n\nUser Data:\n${userDataContext || "No user data available."}\n\nMock FAQs:\n${mockContextItems || "No mock FAQs available."}\n\nQuestion: ${question}`;

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

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
