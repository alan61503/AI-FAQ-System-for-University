import React from "react";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";


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
        <Typography variant="small" color="blue" className="mb-2 !font-medium">
          {tag}
        </Typography>
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-2 normal-case transition-colors hover:text-gray-900 dark:text-gray-100"
        >
          {title}
        </Typography>
        <Typography className="mb-6 font-normal !text-gray-500 dark:!text-gray-300">
          {desc}
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="text-xs !text-gray-500 dark:!text-gray-400 font-normal"
        >
          {author.name} · {date}
        </Typography>
      </CardBody>
    </Card>
  );
}


export default BlogPostCard;