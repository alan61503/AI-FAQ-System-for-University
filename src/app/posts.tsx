"use client";
import { Typography } from "@material-tailwind/react";
import BlogPostCard from "@/components/blog-post-card";


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
    <section id="categories" className="section-pad">
      <div className="container mx-auto max-w-6xl text-center pt-12 pb-6">
        <Typography variant="h6" className="mb-2">
          Explore FAQ Categories
        </Typography>
        <Typography variant="h1" className="mb-2">
          Everything students ask—organized for speed
        </Typography>
        <Typography
          variant="lead"
          color="gray"
          className="mx-auto max-w-3xl mb-10 text-gray-500 dark:text-gray-300"
        >
          Browse curated knowledge areas or ask the AI directly. Each category
          is kept up to date by university offices.
        </Typography>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-6 pb-12 lg:grid-cols-3">
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
    </section>
  );
}

export default Posts;
