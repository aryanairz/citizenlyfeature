"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { InterviewAnswer } from "@/app/interview/page";

interface StoredResult {
  lang: string;
  senior65: boolean;
  totalAsked: number;
  correctCount: number;
  passed: boolean;
  answers: InterviewAnswer[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let parsed: StoredResult | null = null;
    try {
      const raw = sessionStorage.getItem("citizenly-interview-result");
      if (raw) parsed = JSON.parse(raw) as StoredResult;
    } catch {
      // ignore
    }
    // One-shot read of sessionStorage after mount — necessary for SSR safety.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(parsed);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-gray-700">Loading your results…</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <p className="text-gray-700">No interview results found.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-[#C41E3A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a3172f]"
        >
          Start a new interview
        </button>
      </main>
    );
  }

  const { passed, correctCount, totalAsked, answers } = result;
  const partialCount = answers.filter((a) => a.result === "partial").length;
  const incorrectCount = answers.filter((a) => a.result === "incorrect").length;

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div
          className={`rounded-2xl border-2 p-6 shadow-sm ${
            passed
              ? "border-emerald-300 bg-emerald-50"
              : "border-rose-300 bg-rose-50"
          }`}
        >
          <div
            className={`text-sm font-semibold uppercase tracking-widest ${
              passed ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {passed ? "Passed" : "Did not pass"}
          </div>
          <h1
            className={`mt-1 text-3xl font-bold ${
              passed ? "text-emerald-900" : "text-rose-900"
            }`}
          >
            You got {correctCount} of {totalAsked} correct
          </h1>
          <p
            className={`mt-2 text-sm ${
              passed ? "text-emerald-900" : "text-rose-900"
            }`}
          >
            {passed
              ? "Great work — that meets the USCIS passing standard of 6 correct."
              : "You need 6 correct to pass. Review the questions below and try again."}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <Stat label="Correct" value={correctCount} tone="emerald" />
            <Stat label="Partial" value={partialCount} tone="amber" />
            <Stat label="Incorrect" value={incorrectCount} tone="rose" />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">
            Question breakdown
          </h2>
          <ul className="mt-3 space-y-3">
            {answers.map((a, i) => (
              <li
                key={`${a.questionId}-${i}`}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-[#1B2A4A]">
                    {i + 1}. {a.questionEnglish}
                  </div>
                  <Pill result={a.result} />
                </div>
                <div className="mt-2 text-xs text-gray-500">You said:</div>
                <div className="text-sm italic text-gray-800">
                  &ldquo;{a.transcript || "(no transcript)"}&rdquo;
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Correct answer:
                </div>
                <div className="text-sm font-medium text-[#1B2A4A]">
                  {a.correctAnswerEnglish}
                </div>
                {a.explanation && (
                  <p className="mt-2 text-xs text-gray-600">{a.explanation}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem("citizenly-interview-result");
              } catch {
                // ignore
              }
              router.push("/");
            }}
            className="flex-1 rounded-lg bg-[#C41E3A] px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#a3172f]"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-[#1B2A4A] hover:border-[#1B2A4A]"
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose";
}) {
  const tones: Record<typeof tone, string> = {
    emerald: "border-emerald-200 bg-white text-emerald-700",
    amber: "border-amber-200 bg-white text-amber-700",
    rose: "border-rose-200 bg-white text-rose-700",
  };
  return (
    <div className={`rounded-lg border px-3 py-2 ${tones[tone]}`}>
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function Pill({ result }: { result: InterviewAnswer["result"] }) {
  const styles = {
    correct: "bg-emerald-100 text-emerald-800",
    partial: "bg-amber-100 text-amber-800",
    incorrect: "bg-rose-100 text-rose-800",
  } as const;
  const labels = {
    correct: "Correct",
    partial: "Partial",
    incorrect: "Incorrect",
  } as const;
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[result]}`}
    >
      {labels[result]}
    </span>
  );
}
