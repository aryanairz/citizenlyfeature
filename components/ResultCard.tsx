"use client";

import type { EvaluationResult } from "@/app/api/evaluate/route";

interface ResultCardProps {
  result: EvaluationResult;
  explanation: string;
  /** The first canonical accepted English answer, to show users what would have been correct. */
  correctAnswer: string;
  /** Optional translated version of the correct answer in the user's language. */
  correctAnswerTranslated?: string;
}

const STYLES: Record<
  EvaluationResult,
  { label: string; bg: string; border: string; text: string }
> = {
  correct: {
    label: "Correct",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-800",
  },
  partial: {
    label: "Partially correct",
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-900",
  },
  incorrect: {
    label: "Incorrect",
    bg: "bg-rose-50",
    border: "border-rose-300",
    text: "text-rose-900",
  },
};

export default function ResultCard({
  result,
  explanation,
  correctAnswer,
  correctAnswerTranslated,
}: ResultCardProps) {
  const s = STYLES[result];
  return (
    <div
      className={`w-full rounded-xl border-2 ${s.border} ${s.bg} p-5 shadow-sm`}
      role="status"
      aria-live="polite"
    >
      <div className={`text-lg font-semibold ${s.text}`}>{s.label}</div>
      {explanation && (
        <p className="mt-2 text-sm text-gray-800">{explanation}</p>
      )}
      <div className="mt-4 border-t border-black/5 pt-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Correct answer
        </div>
        <div className="mt-1 text-base font-medium text-[#1B2A4A]">
          {correctAnswer}
        </div>
        {correctAnswerTranslated && correctAnswerTranslated !== correctAnswer && (
          <div className="mt-1 text-sm text-gray-700">
            {correctAnswerTranslated}
          </div>
        )}
      </div>
    </div>
  );
}
