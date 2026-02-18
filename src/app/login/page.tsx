"use client";

import { useState, type FormEvent } from "react";
import { Navbar, Footer } from "@/components";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Demo login is enabled for UI preview. Connect auth backend next.");
  };

  return (
    <>
      <Navbar />
      <main className="section-pad py-10">
        <section className="container mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <Image
                src="/image/illustrations/undraw_questions_52ic.svg"
                alt="Login"
                width={560}
                height={420}
                className="h-auto w-full max-w-sm"
              />
            </div>

            <div>
              <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Account Access
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Login to your account
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Access saved preferences, personalized responses, and support history.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-gray-100 dark:text-gray-900"
                >
                  Login
                </button>
              </form>

              {notice ? <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{notice}</p> : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
