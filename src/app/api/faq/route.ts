import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHRIST_SOURCES, fetchSourceText } from "@/lib/christ-sources";
import { searchMockFaqs, rankMockFaqs } from "@/lib/mock-faqs";

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

    const prompt = `You are a Christ University FAQ assistant. Use the provided official sources first. If they do not contain the answer, you may use the mock FAQ snippets as a fallback. Provide a detailed, structured response with bullet points or short sections when helpful. If the answer isn't in sources or mock FAQs, say you don't have the official information and suggest contacting the relevant office.\n\nOfficial Sources:\n${context || "No sources available."}\n\nMock FAQs:\n${mockContextItems || "No mock FAQs available."}\n\nQuestion: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      answer: text,
      sources: [
        ...sourceTexts.map((item) => item.url),
        ...(mockContextItems ? ["Mock FAQ Dataset"] : []),
      ],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
