"use client";
import { Typography } from "@material-tailwind/react";
import ArticleCard from "@/components/article-card";

const ARTICLES = [
  {
    title: "Ask in natural language",
    desc: "Type your question like you would ask a staff member. The AI understands context and intent.",
  },
  {
    title: "Verified, source-backed answers",
    desc: "Every response is grounded in official university policies and regularly reviewed content.",
  },
  {
    title: "Escalate to humans when needed",
    desc: "When the AI is unsure, it routes your query to the right department for follow-up.",
  },
];

export function Articles() {
  return (
    <section id="how-it-works" className="section-pad">
      <div className="container mx-auto max-w-6xl py-12">
        <div className="max-w-3xl">
          <Typography variant="h2" color="blue-gray">
            How the AI FAQ works
          </Typography>
          <Typography
            variant="lead"
            className="my-2 w-full font-normal !text-gray-500 dark:!text-gray-300"
          >
            Built for students, backed by verified sources, and designed to reduce
            wait times for campus support.
          </Typography>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ARTICLES.map((props, idx) => (
            <ArticleCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Articles;
