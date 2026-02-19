import React from "react";
import {
  Card as CardBase,
  CardBody as CardBodyBase,
} from "@material-tailwind/react";
import Image from "next/image";

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
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-900"
    >
      {illustration ? (
        <div className="flex h-40 items-center justify-center border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
          <Image
            src={illustration}
            alt={title}
            width={640}
            height={360}
            unoptimized
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}
      <CardBody className="p-6">
        <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
          {tag}
        </p>
        <h3
          className="mb-2 text-xl font-semibold normal-case text-gray-900 transition-colors group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-gray-200"
        >
          {title}
        </h3>
        <p className="mb-6 min-h-[84px] font-normal leading-7 text-gray-600 dark:text-gray-300">
          {desc}
        </p>
        <p className="border-t border-gray-200 pt-3 text-xs font-medium text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {author.name} · {date}
        </p>
      </CardBody>
    </Card>
  );
}


export default BlogPostCard;