import {
  Card as CardBase,
  CardBody as CardBodyBase,
} from "@material-tailwind/react";

const Card = CardBase as any;
const CardBody = CardBodyBase as any;


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
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="font-normal text-gray-500 dark:text-gray-300">
            {desc}
          </p>
        </CardBody>
      </Card>
    );
  }

  export default ArticleCard;