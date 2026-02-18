"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Button as MTButton, Input as MTInput } from "@material-tailwind/react";

const Button = MTButton as any;
const Input = MTInput as any;

type Citation = {
  label: string;
  url?: string;
};

type FaqApiResponse = {
  answer?: string;
  confidence?: number;
  citations?: Citation[];
  error?: string;
};

type FeedbackRating = "up" | "down";

function Hero() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    setError("");
    setAnswer("");
    setConfidence(null);
    setCitations([]);
    setFeedbackRating(null);
    setFeedbackComment("");
    setFeedbackMessage("");
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as FaqApiResponse;
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
      } else {
        setAnswer(data?.answer || "");
        if (typeof data?.confidence === "number") {
          setConfidence(Math.max(0, Math.min(1, data.confidence)));
        }
        if (Array.isArray(data?.citations)) {
          setCitations(
            data.citations.filter(
              (item): item is Citation => Boolean(item?.label)
            )
          );
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackRating || !answer) {
      setFeedbackMessage("Please choose thumbs up or thumbs down first.");
      return;
    }

    setFeedbackLoading(true);
    setFeedbackMessage("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          rating: feedbackRating,
          comment: feedbackComment,
          confidence,
          citations,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFeedbackMessage(data?.error || "Could not save feedback.");
        return;
      }
      setFeedbackMessage("Thanks! Your feedback was saved.");
      setFeedbackComment("");
    } catch {
      setFeedbackMessage("Network error while sending feedback.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <header id="home" className="mt-6 section-pad">
      <div className="container mx-auto max-w-5xl pt-12 pb-10">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-12 shadow-sm">
          <div className="text-center">
        <h1
              className="mx-auto w-full text-[32px] lg:text-[52px] font-bold leading-[42px] lg:leading-[62px] tracking-tight text-gray-900 dark:text-gray-100"
        >
          AI-Powered FAQ for University Students
        </h1>
        <p
              className="mx-auto mt-5 mb-8 w-full text-lg text-gray-600 dark:text-gray-300"
        >
          Get verified answers for admissions, academics, fees, and campus
          services—fast and reliable.
        </p>
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-3 md:flex-row">
          <div className="w-full md:w-[26rem]">
            {/* @ts-ignore */}
            <Input
              id="faq-question"
              label="Ask a question (e.g., exam schedule)"
              value={question}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
            />
          </div>
          <Button
            size="md"
            className="md:w-auto shadow-none"
            fullWidth
            color="gray"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? "Asking..." : "Ask the AI"}
          </Button>
        </div>
        <p className="mt-4 text-sm font-normal text-gray-700 dark:text-gray-300">
          No login required. Updated by university offices.
        </p>
        {error ? (
          <p className="mt-4 text-sm font-normal text-red-600">
            {error}
          </p>
        ) : null}
        {answer ? (
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 p-5 text-left">
            <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              Answer
            </p>
            <p
              className="whitespace-pre-line text-gray-700 dark:text-gray-200"
            >
              {answer
                .replace(/\*\*/g, "")
                .replace(/^\s*[-*]\s+/gm, "• ")}
            </p>
            {confidence !== null ? (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            ) : null}
            {citations.length > 0 ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Sources
                </p>
                <ul className="mt-1 space-y-1">
                  {citations.map((item, idx) => (
                    <li key={`${item.label}-${idx}`} className="text-sm text-gray-700 dark:text-gray-200">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 dark:text-blue-300 underline"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Was this helpful?
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  color={feedbackRating === "up" ? "green" : "gray"}
                  className="shadow-none"
                  onClick={() => setFeedbackRating("up")}
                >
                  👍
                </Button>
                <Button
                  size="sm"
                  color={feedbackRating === "down" ? "red" : "gray"}
                  className="shadow-none"
                  onClick={() => setFeedbackRating("down")}
                >
                  👎
                </Button>
              </div>
              <textarea
                className="mt-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-sm text-gray-800 dark:text-gray-100"
                rows={3}
                placeholder="Optional comment"
                value={feedbackComment}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFeedbackComment(e.target.value)}
              />
              <div className="mt-2">
                <Button
                  size="sm"
                  color="gray"
                  className="shadow-none"
                  onClick={submitFeedback}
                  disabled={feedbackLoading || !feedbackRating}
                >
                  {feedbackLoading ? "Sending..." : "Submit feedback"}
                </Button>
              </div>
              {feedbackMessage ? (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {feedbackMessage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
export default Hero;
