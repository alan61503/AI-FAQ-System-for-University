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
}

export function BlogPostCard({
  tag,
  title,
  desc,
  author,
  date,
}: BlogPostCardProps) {
  return (
    <Card
      shadow={false}
      className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl transition-transform hover:-translate-y-0.5"
    >
      <CardBody className="p-6">
        <p className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {tag}
        </p>
        <h3
          className="mb-2 text-xl font-semibold normal-case transition-colors hover:text-gray-900 dark:text-gray-100"
        >
          {title}
        </h3>
        <p className="mb-6 font-normal text-gray-500 dark:text-gray-300">
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