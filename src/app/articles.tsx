"use client";
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
    <section id="how-it-works" className="section-pad mt-6 md:mt-8">
      <div className="container mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
            How the AI FAQ works
          </h2>
          <p className="mt-3 w-full text-lg font-normal text-gray-600 dark:text-gray-300">
            Built for students, backed by verified sources, and designed to reduce
            wait times for campus support.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ARTICLES.map((props, idx) => (
            <ArticleCard key={idx} {...props} step={`0${idx + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Articles;
