import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHRIST_SOURCES, fetchSourceText } from "@/lib/christ-sources";
import { searchMockFaqs, rankMockFaqs } from "@/lib/mock-faqs";
import { getUserDataContext, USER_DATA_SOURCE_LABEL } from "@/lib/user-data";

const apiKey = process.env.GEMINI_API_KEY;

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
    return NextResponse.json({
      answer: mockHit.answer,
      sources: ["Mock FAQ Dataset"],
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

    const prompt = `You are a Christ University FAQ assistant. Use the provided official sources first. If they do not contain the answer, you may use the user-provided dataset. If still unavailable, you may use the mock FAQ snippets as a fallback. Provide a detailed, structured response with short sentences.\n\nRules:\n- Output plain text only. Do not use Markdown, bullets, or formatting symbols.\n- Only claim a detail is in official sources if it is explicitly present in the source text.\n- If the sources do NOT mention the requested detail, say it is not available in the provided sources.\n- Do NOT refer to sources by numbers (e.g., “Source 1”).\n- If the answer isn't in sources, user data, or mock FAQs, say you don't have the official information and suggest contacting the relevant office.\n\nOfficial Sources:\n${context || "No sources available."}\n\nUser Data:\n${userDataContext || "No user data available."}\n\nMock FAQs:\n${mockContextItems || "No mock FAQs available."}\n\nQuestion: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      answer: text,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
