import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type Rating = "up" | "down";

type FeedbackRecord = {
  question: string;
  answer: string;
  rating: Rating;
  comment?: string;
  confidence?: number | null;
  createdAt?: string;
};

type TopicCount = {
  term: string;
  count: number;
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "have",
  "not",
  "are",
  "was",
  "were",
  "you",
  "your",
  "about",
  "what",
  "when",
  "where",
  "which",
  "please",
  "could",
  "would",
  "should",
  "into",
  "there",
  "they",
  "them",
  "then",
  "than",
  "been",
  "also",
  "only",
  "more",
  "very",
  "some",
  "need",
  "help",
  "university",
  "christ",
  "answer",
]);

const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const tokenize = (text: string) =>
  normalize(text)
    .split(" ")
    .filter((token) => token.length > 3 && !STOP_WORDS.has(token));

const emptySummary = {
  totalFeedback: 0,
  upVotes: 0,
  downVotes: 0,
  upRate: 0,
  downRate: 0,
  withComment: 0,
  averageConfidence: null as number | null,
  topNegativeTopics: [] as TopicCount[],
  recentFeedback: [] as Array<{
    question: string;
    rating: Rating;
    comment: string;
    createdAt: string;
  }>,
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "feedback.jsonl");
    const raw = await readFile(filePath, "utf8").catch(() => "");

    if (!raw.trim()) {
      return NextResponse.json(emptySummary);
    }

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

    const totalFeedback = records.length;
    const upVotes = records.filter((item) => item.rating === "up").length;
    const downVotes = records.filter((item) => item.rating === "down").length;
    const withComment = records.filter((item) => item.comment?.trim()).length;

    const confidenceValues = records
      .map((item) => item.confidence)
      .filter((value): value is number => typeof value === "number");

    const averageConfidence =
      confidenceValues.length > 0
        ? Number(
            (
              confidenceValues.reduce((sum, value) => sum + value, 0) /
              confidenceValues.length
            ).toFixed(2)
          )
        : null;

    const topicCounter = new Map<string, number>();
    records
      .filter((item) => item.rating === "down")
      .forEach((item) => {
        const text = `${item.question || ""} ${item.comment || ""}`;
        for (const token of tokenize(text)) {
          topicCounter.set(token, (topicCounter.get(token) || 0) + 1);
        }
      });

    const topNegativeTopics = Array.from(topicCounter.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const recentFeedback = records
      .slice(-8)
      .reverse()
      .map((item) => ({
        question: item.question,
        rating: item.rating,
        comment: item.comment || "",
        createdAt: item.createdAt || "",
      }));

    return NextResponse.json({
      totalFeedback,
      upVotes,
      downVotes,
      upRate: totalFeedback ? Number((upVotes / totalFeedback).toFixed(2)) : 0,
      downRate: totalFeedback ? Number((downVotes / totalFeedback).toFixed(2)) : 0,
      withComment,
      averageConfidence,
      topNegativeTopics,
      recentFeedback,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load feedback summary.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
