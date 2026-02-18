import { Navbar, Footer } from "@/components";
import Image from "next/image";

const VALUES = [
  {
    title: "Source-backed answers",
    description:
      "Every response is grounded in official university information before any fallback is used.",
  },
  {
    title: "Student-first design",
    description:
      "The experience is built to reduce wait times and help students find answers with minimal effort.",
  },
  {
    title: "Continuous improvement",
    description:
      "Feedback signals are captured so support teams can improve quality over time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="section-pad py-10">
        <section className="container mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                About UniFAQ AI
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
                Built to make university support easier for everyone
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                UniFAQ AI helps students get fast, reliable answers for admissions,
                exams, academics, and campus services through a modern self-service experience.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <Image
                src="/image/illustrations/undraw_my-answer_au1h.svg"
                alt="About UniFAQ AI"
                width={640}
                height={480}
                className="h-auto w-full max-w-md"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-3">
          {VALUES.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{item.description}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
