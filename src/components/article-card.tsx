import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";


interface ArticleCardProps {
    title: string;
    desc: string;
  }
  
  export function ArticleCard({ title, desc }: ArticleCardProps) {
    return (
      <Card
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl transition-transform hover:-translate-y-0.5"
        shadow={false}
      >
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-100">
            {title}
          </Typography>
          <Typography variant="paragraph" className="font-normal !text-gray-500 dark:!text-gray-300">
            {desc}
          </Typography>
        </CardBody>
      </Card>
    );
  }

  export default ArticleCard;