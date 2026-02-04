"use client";

import { useState } from "react";
import { Button, Typography, Input } from "@material-tailwind/react";


function Hero() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    setError("");
    setAnswer("");
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
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
      } else {
        setAnswer(data?.answer || "");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header id="home" className="mt-6 section-pad">
      <div className="container mx-auto max-w-5xl pt-12 pb-10">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-12 shadow-sm">
          <div className="text-center">
        <Typography
          color="blue-gray"
              className="mx-auto w-full text-[32px] lg:text-[52px] font-bold leading-[42px] lg:leading-[62px] tracking-tight text-gray-900 dark:text-gray-100"
        >
          AI-Powered FAQ for University Students
        </Typography>
        <Typography
          variant="lead"
              className="mx-auto mt-5 mb-8 w-full !text-gray-600 dark:!text-gray-300"
        >
          Get verified answers for admissions, academics, fees, and campus
          services—fast and reliable.
        </Typography>
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-3 md:flex-row">
          <div className="w-full md:w-[26rem]">
            {/* @ts-ignore */}
            <Input
              id="faq-question"
              label="Ask a question (e.g., exam schedule)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
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
        <Typography variant="small" className="mt-4 font-normal text-gray-700 dark:text-gray-300">
          No login required. Updated by university offices.
        </Typography>
        {error ? (
          <Typography variant="small" className="mt-4 font-normal text-red-600">
            {error}
          </Typography>
        ) : null}
        {answer ? (
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 p-5 text-left">
            <Typography variant="small" className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              Answer
            </Typography>
            <Typography
              className="!text-gray-700 dark:!text-gray-200 whitespace-pre-line"
              variant="paragraph"
            >
              {answer
                .replace(/\*\*/g, "")
                .replace(/^\s*[-*]\s+/gm, "• ")}
            </Typography>
          </div>
        ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
export default Hero;
