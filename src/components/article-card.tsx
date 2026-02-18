import {
  Card as CardBase,
  CardBody as CardBodyBase,
} from "@material-tailwind/react";

const Card = CardBase as any;
const CardBody = CardBodyBase as any;


interface ArticleCardProps {
    title: string;
    desc: string;
    illustration?: string;
  }
  
  export function ArticleCard({ title, desc, illustration }: ArticleCardProps) {
    return (
      <Card
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
        shadow={false}
      >
        {illustration ? (
          <div className="flex h-36 items-center justify-center border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
            <img
              src={illustration}
              alt={title}
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}
        <CardBody className="p-6">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="font-normal text-gray-600 dark:text-gray-300">
            {desc}
          </p>
        </CardBody>
      </Card>
    );
  }

  export default ArticleCard;