"use client";

import { useEffect, useState } from "react";

type TopicCount = {
  term: string;
  count: number;
};

type RecentFeedback = {
  question: string;
  rating: "up" | "down";
  comment: string;
  createdAt: string;
};

type FeedbackSummary = {
  totalFeedback: number;
  upVotes: number;
  downVotes: number;
  upRate: number;
  downRate: number;
  withComment: number;
  averageConfidence: number | null;
  topNegativeTopics: TopicCount[];
  recentFeedback: RecentFeedback[];
};

const initialSummary: FeedbackSummary = {
  totalFeedback: 0,
  upVotes: 0,
  downVotes: 0,
  upRate: 0,
  downRate: 0,
  withComment: 0,
  averageConfidence: null,
  topNegativeTopics: [],
  recentFeedback: [],
};

export default function AdminPage() {
  const [summary, setSummary] = useState<FeedbackSummary>(initialSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/feedback/summary", { cache: "no-store" });
        const data = (await res.json()) as FeedbackSummary & { error?: string };
        if (!res.ok) {
          setError(data?.error || "Failed to load analytics.");
          return;
        }
        setSummary(data);
      } catch {
        setError("Network error while loading analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const metrics = [
    { label: "Total Feedback", value: summary.totalFeedback },
    { label: "Helpful (👍)", value: summary.upVotes },
    { label: "Not Helpful (👎)", value: summary.downVotes },
    { label: "With Comment", value: summary.withComment },
    { label: "Helpful Rate", value: `${Math.round(summary.upRate * 100)}%` },
    {
      label: "Avg Confidence",
      value:
        summary.averageConfidence === null
          ? "N/A"
          : `${Math.round(summary.averageConfidence * 100)}%`,
    },
  ];

  return (
    <main className="section-pad">
      <div className="container mx-auto max-w-6xl py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Feedback Analytics
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Review user ratings and identify weak answer areas.
            </p>
          </div>
          <a
            href="/api/feedback/export"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900"
          >
            Download CSV
          </a>
        </div>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-200">Loading analytics...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Top Negative Topics
                </h2>
                {summary.topNegativeTopics.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">
                    No negative feedback topics yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {summary.topNegativeTopics.map((topic) => (
                      <li key={topic.term} className="flex items-center justify-between">
                        <p className="text-gray-800 dark:text-gray-200">
                          {topic.term}
                        </p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                          {topic.count}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Feedback
                </h2>
                {summary.recentFeedback.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">
                    No feedback records yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {summary.recentFeedback.map((item, idx) => (
                      <li key={`${item.createdAt}-${idx}`} className="border-b border-gray-200 dark:border-gray-800 pb-3 last:border-b-0">
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          {item.rating === "up" ? "👍" : "👎"} {item.question}
                        </p>
                        {item.comment ? (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {item.comment}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
