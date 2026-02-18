"use client";

import { useState, type FormEvent } from "react";
import { Navbar, Footer } from "@/components";
import Image from "next/image";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Thanks! Your message has been noted. Our support team will get back to you.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <main className="section-pad py-10">
        <section className="container mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Contact Support
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
                Need help from a real team member?
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Share your question and we will route it to the right university office.
                For urgent issues, include your department and student details.
              </p>
              <div className="mt-6 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <Image
                  src="/image/illustrations/undraw_instant-support_oav0.svg"
                  alt="Contact support"
                  width={560}
                  height={420}
                  className="h-auto w-full max-w-sm"
                />
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />

              <button
                type="submit"
                className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-gray-100 dark:text-gray-900"
              >
                Send Message
              </button>

              {status ? <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{status}</p> : null}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
