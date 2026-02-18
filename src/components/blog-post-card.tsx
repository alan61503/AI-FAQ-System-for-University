import React from "react";
import {
  Card as CardBase,
  CardBody as CardBodyBase,
} from "@material-tailwind/react";

const Card = CardBase as any;
const CardBody = CardBodyBase as any;


interface BlogPostCardProps {
  tag: string;
  title: string;
  desc: string;
  author: { name: string };
  date: string;
  illustration?: string;
}

export function BlogPostCard({
  tag,
  title,
  desc,
  author,
  date,
  illustration,
}: BlogPostCardProps) {
  return (
    <Card
      shadow={false}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {illustration ? (
        <div className="flex h-40 items-center justify-center border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
          <img
            src={illustration}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}
      <CardBody className="p-6">
        <p className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {tag}
        </p>
        <h3
          className="mb-2 text-xl font-semibold normal-case text-gray-900 transition-colors group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-gray-200"
        >
          {title}
        </h3>
        <p className="mb-6 min-h-[72px] font-normal text-gray-600 dark:text-gray-300">
          {desc}
        </p>
        <p
          className="text-xs font-normal text-gray-500 dark:text-gray-400"
        >
          {author.name} · {date}
        </p>
      </CardBody>
    </Card>
  );
}


export default BlogPostCard;