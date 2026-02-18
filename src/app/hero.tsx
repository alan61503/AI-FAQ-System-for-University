"use client";

import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Button as MTButton, Input as MTInput } from "@material-tailwind/react";
import Image from "next/image";

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

const QUICK_PROMPTS = [
  "When is the next exam schedule published?",
  "How do I apply for hostel accommodation?",
  "What documents are needed for UG admission?",
  "How can I request official transcripts?",
];

const INTRO_TEXT = "Hi, I'm UniFAQ.";
const TYPEWRITER_SUGGESTIONS = [
  "admissions and deadlines?",
  "exam schedules and rules?",
  "fees and scholarships?",
  "hostel and campus services?",
];

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
  const [introTyped, setIntroTyped] = useState("");
  const [introDone, setIntroDone] = useState(false);
  const [typedQuestionPart, setTypedQuestionPart] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isDeletingSuggestion, setIsDeletingSuggestion] = useState(false);

  const confidencePercent = confidence !== null ? Math.round(confidence * 100) : null;

  useEffect(() => {
    if (introDone) return;

    const timeout = window.setTimeout(() => {
      if (introTyped.length < INTRO_TEXT.length) {
        setIntroTyped(INTRO_TEXT.slice(0, introTyped.length + 1));
        return;
      }
      setIntroDone(true);
    }, 70);

    return () => window.clearTimeout(timeout);
  }, [introDone, introTyped]);

  useEffect(() => {
    if (!introDone) return;

    const currentSuggestion = TYPEWRITER_SUGGESTIONS[suggestionIndex];
    let timeout = 0;

    if (!isDeletingSuggestion && typedQuestionPart === currentSuggestion) {
      timeout = window.setTimeout(() => setIsDeletingSuggestion(true), 1200);
    } else if (isDeletingSuggestion && typedQuestionPart.length === 0) {
      timeout = window.setTimeout(() => {
        setIsDeletingSuggestion(false);
        setSuggestionIndex(
          (index) => (index + 1) % TYPEWRITER_SUGGESTIONS.length
        );
      }, 220);
    } else {
      timeout = window.setTimeout(() => {
        if (isDeletingSuggestion) {
          setTypedQuestionPart(currentSuggestion.slice(0, typedQuestionPart.length - 1));
        } else {
          setTypedQuestionPart(currentSuggestion.slice(0, typedQuestionPart.length + 1));
        }
      }, isDeletingSuggestion ? 40 : 65);
    }

    return () => window.clearTimeout(timeout);
  }, [introDone, isDeletingSuggestion, suggestionIndex, typedQuestionPart]);

  const fillPrompt = (value: string) => {
    setQuestion(value);
    const input = document.getElementById("faq-question") as HTMLInputElement | null;
    input?.focus();
  };

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
    <header id="home" className="section-pad pt-8 md:pt-12">
      <div className="container mx-auto max-w-7xl pb-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 md:p-10 lg:p-12">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl dark:bg-slate-700/40" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-200/70 blur-3xl dark:bg-slate-800/50" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.25fr_0.85fr] lg:min-h-[520px] lg:gap-12">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Smart Student Support
            </p>
            <h1 className="mt-5 min-h-[56px] text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 md:min-h-[72px] md:text-5xl lg:text-6xl">
              <span className="font-mono">{introTyped}</span>
              <span className="ml-1 inline-block w-[10px] animate-pulse font-mono">|</span>
            </h1>
            <p className="mt-3 min-h-[56px] text-lg leading-8 text-gray-600 dark:text-gray-300 md:min-h-[64px]">
              <span className="font-medium">How can I help you with </span>
              <span className="font-mono text-gray-900 dark:text-gray-100">{typedQuestionPart}</span>
              <span className="ml-1 inline-block w-[8px] animate-pulse font-mono">|</span>
            </p>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white/90 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full">
                  <Input
                    id="faq-question"
                    label="Ask your question"
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
                  color="gray"
                  className="shadow-none sm:w-auto"
                  fullWidth
                  onClick={handleAsk}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Ask the AI"}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => fillPrompt(item)}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              No login required. Updated by university offices.
            </p>

            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </div>

          <div className="mx-auto flex w-full max-w-[360px] items-center justify-center rounded-2xl border border-gray-200 bg-white/90 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 md:max-w-[420px] md:p-6">
            <Image
              src="/image/illustrations/undraw_faq_pgxi.svg"
              alt="FAQ assistant illustration"
              width={560}
              height={420}
              className="h-auto w-full max-w-[260px] md:max-w-[320px] lg:max-w-[360px]"
            />
          </div>
        </div>
        </div>

        {answer ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Response
              </h2>
              {confidencePercent !== null ? (
                <div className="w-full max-w-xs">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>Confidence</span>
                    <span>{confidencePercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gray-900 dark:bg-gray-200"
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-700 dark:text-gray-200">
              {answer.replace(/\*\*/g, "").replace(/^\s*[-*]\s+/gm, "• ")}
            </p>

            {citations.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sources</p>
                <ul className="mt-2 space-y-2">
                  {citations.map((item, idx) => (
                    <li
                      key={`${item.label}-${idx}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-700 underline dark:text-blue-300"
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

            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Was this helpful?
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  color={feedbackRating === "up" ? "green" : "gray"}
                  className="shadow-none"
                  onClick={() => setFeedbackRating("up")}
                >
                  👍 Helpful
                </Button>
                <Button
                  size="sm"
                  color={feedbackRating === "down" ? "red" : "gray"}
                  className="shadow-none"
                  onClick={() => setFeedbackRating("down")}
                >
                  👎 Not helpful
                </Button>
              </div>

              <textarea
                className="mt-3 w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Add an optional comment"
                value={feedbackComment}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFeedbackComment(e.target.value)}
              />
              <div className="mt-3">
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
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{feedbackMessage}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
export default Hero;
