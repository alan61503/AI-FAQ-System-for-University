"use client";
import BlogPostCard from "@/components/blog-post-card";
import Image from "next/image";


const POSTS = [
  {
    tag: "Admissions",
    title: "Applications & Deadlines",
    desc: "Answer questions about eligibility, required documents, and important dates with trusted policy references.",
    date: "Updated weekly",
    author: {
      name: "AI Knowledge Base",
    },
  },
  {
    tag: "Academics",
    title: "Courses, Credits & Exams",
    desc: "Clarify course registration, credit requirements, grading, and exam schedules in seconds.",
    date: "Updated daily",
    author: {
      name: "Academic Office",
    },
  },
  {
    tag: "Financial",
    title: "Fees, Scholarships & Aid",
    desc: "Get accurate information on fee structures, payment deadlines, and scholarship criteria.",
    date: "Updated weekly",
    author: {
      name: "Student Finance",
    },
  },
  {
    tag: "Campus Life",
    title: "Hostel, Dining & Facilities",
    desc: "Learn about accommodation rules, meal plans, campus amenities, and safety resources.",
    date: "Updated monthly",
    author: {
      name: "Campus Services",
    },
  },
  {
    tag: "International",
    title: "Visas & Arrival Support",
    desc: "Navigate visa requirements, orientation, and cultural support with step-by-step guidance.",
    date: "Updated biweekly",
    author: {
      name: "Global Office",
    },
  },
  {
    tag: "IT Help",
    title: "Accounts, Wi‑Fi & Portals",
    desc: "Troubleshoot password resets, portal access, and Wi‑Fi connectivity fast.",
    date: "Updated daily",
    author: {
      name: "IT Support",
    },
  },
];

export function Posts() {
  return (
    <section id="categories" className="section-pad mt-6 md:mt-8">
      <div className="container mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-10 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Explore FAQ Categories
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
              Everything students ask, organized for quick answers
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Browse focused knowledge areas, then ask the AI with better context.
              Each category is aligned with university support workflows.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Admissions",
                "Academics",
                "Examinations",
                "Finance",
                "Campus Life",
                "IT Support",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-slate-900">
            <Image
              src="/image/illustrations/undraw_too-many-options_lpt0.svg"
              alt="FAQ categories"
              width={620}
              height={420}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 pb-1 md:grid-cols-2 xl:grid-cols-3">
          {POSTS.map(({ tag, title, desc, date, author }) => (
            <BlogPostCard
              key={title}
              tag={tag}
              title={title}
              desc={desc}
              date={date}
              author={{
                name: author.name,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Posts;
