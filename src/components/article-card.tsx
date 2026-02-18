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
    step?: string;
  }
  
  export function ArticleCard({ title, desc, illustration, step }: ArticleCardProps) {
    return (
      <Card
        className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-900"
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
          {step ? (
            <p className="mb-3 inline-flex rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Step {step}
            </p>
          ) : null}
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="font-normal leading-7 text-gray-600 dark:text-gray-300">
            {desc}
          </p>
        </CardBody>
      </Card>
    );
  }

  export default ArticleCard;