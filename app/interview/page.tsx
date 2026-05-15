"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";
import MicRecorder from "@/components/MicRecorder";
import ResultCard from "@/components/ResultCard";
import {
  getTranslation,
  pickRandomQuestions,
  type CivicsQuestion,
  type Translation,
} from "@/lib/questions";
import type { LangCode } from "@/lib/languages";
import type {
  EvaluationResponse,
  EvaluationResult,
} from "@/app/api/evaluate/route";

const QUESTIONS_PER_INTERVIEW = 10;
const PASS_THRESHOLD = 6;

export interface InterviewAnswer {
  questionId: number;
  questionEnglish: string;
  questionTranslated: string;
  correctAnswerEnglish: string;
  correctAnswerTranslated: string;
  transcript: string;
  result: EvaluationResult;
  explanation: string;
}

type Phase =
  | "intro"
  | "playing-question"
  | "ready-to-record"
  | "evaluating"
  | "feedback"
  | "error";

function InterviewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") ?? "en") as LangCode;
  const senior65 = searchParams.get("senior65") === "1";

  const questions = useMemo(
    () => pickRandomQuestions(QUESTIONS_PER_INTERVIEW, senior65),
    [senior65],
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const current: CivicsQuestion | undefined = questions[index];
  const translation: Translation | undefined = current
    ? getTranslation(current, lang)
    : undefined;

  const correctCount = answers.filter((a) => a.result === "correct").length;

  const finishInterview = useCallback(
    (finalAnswers: InterviewAnswer[], finalCorrect: number) => {
      try {
        sessionStorage.setItem(
          "citizenly-interview-result",
          JSON.stringify({
            lang,
            senior65,
            totalAsked: finalAnswers.length,
            correctCount: finalCorrect,
            passed: finalCorrect >= PASS_THRESHOLD,
            answers: finalAnswers,
          }),
        );
      } catch {
        // sessionStorage can fail in private mode — proceed anyway
      }
      router.push("/results");
    },
    [lang, senior65, router],
  );

  // Once we hit the pass threshold, or we've gone through all questions, finish.
  useEffect(() => {
    if (correctCount >= PASS_THRESHOLD || index >= QUESTIONS_PER_INTERVIEW) {
      finishInterview(answers, correctCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctCount, index]);

  function beginInterview() {
    setPhase("playing-question");
  }

  function onRecorded(blob: Blob) {
    if (!current || !translation) return;
    setPhase("evaluating");
    void handleEvaluation(blob);
  }

  async function handleEvaluation(blob: Blob) {
    if (!current || !translation) return;
    setErrorMsg(null);
    setEvaluation(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "answer.webm");
      formData.append("lang", lang);

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const transcribeJson = await transcribeRes.json();
      if (!transcribeRes.ok) {
        throw new Error(
          transcribeJson?.error ?? "We couldn't transcribe your answer.",
        );
      }
      const transcript = transcribeJson.transcript as string;

      const evaluateRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionEnglish: current.question,
          acceptedAnswersEnglish: current.answers,
          questionTranslated: translation.question,
          acceptedAnswersTranslated: translation.answers,
          userTranscript: transcript,
          lang,
        }),
      });
      const evaluateJson = await evaluateRes.json();
      if (!evaluateRes.ok) {
        throw new Error(
          evaluateJson?.error ?? "We couldn't evaluate your answer.",
        );
      }

      const evalResp = evaluateJson as EvaluationResponse;
      setEvaluation(evalResp);

      const nextAnswer: InterviewAnswer = {
        questionId: current.id,
        questionEnglish: current.question,
        questionTranslated: translation.question,
        correctAnswerEnglish: current.answers[0],
        correctAnswerTranslated: translation.answers[0],
        transcript,
        result: evalResp.result,
        explanation: evalResp.explanation,
      };
      setAnswers((prev) => [...prev, nextAnswer]);
      setPhase("feedback");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMsg(message);
      setPhase("error");
    }
  }

  function advance() {
    setEvaluation(null);
    setErrorMsg(null);
    setIndex((i) => i + 1);
    setPhase("playing-question");
  }

  function retryCurrent() {
    setErrorMsg(null);
    setEvaluation(null);
    setPhase("ready-to-record");
  }

  if (!current || !translation) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-gray-700">Preparing your interview…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-[#1B2A4A]"
          >
            ← Exit
          </button>
          <div className="font-medium text-[#1B2A4A]">
            Question {Math.min(index + 1, QUESTIONS_PER_INTERVIEW)} of{" "}
            {QUESTIONS_PER_INTERVIEW}
          </div>
          <div className="text-gray-500">
            {correctCount} / {PASS_THRESHOLD} correct
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-[#C41E3A] transition-all"
            style={{
              width: `${(Math.min(index, QUESTIONS_PER_INTERVIEW) / QUESTIONS_PER_INTERVIEW) * 100}%`,
            }}
          />
        </div>

        {phase === "intro" && (
          <div className="mt-10 text-center">
            <h1 className="text-2xl font-bold text-[#1B2A4A]">
              You&apos;re about to begin.
            </h1>
            <p className="mt-3 text-gray-700">
              The officer will ask you up to 10 questions out loud. Tap the
              microphone after each question and speak your answer.
            </p>
            <button
              type="button"
              onClick={beginInterview}
              className="mt-8 rounded-lg bg-[#C41E3A] px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#a3172f]"
            >
              Begin
            </button>
          </div>
        )}

        {phase !== "intro" && (
          <div className="mt-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Question {index + 1}
              </div>
              <p
                key={current.id}
                lang={lang}
                className="mt-2 text-xl font-semibold leading-snug text-[#1B2A4A] sm:text-2xl"
              >
                {translation.question}
              </p>
              {translation.question !== current.question && (
                <p className="mt-2 text-sm italic text-gray-500">
                  {current.question}
                </p>
              )}
              <div className="mt-4">
                <AudioPlayer
                  key={`tts-${current.id}-${index}`}
                  text={translation.question}
                  lang={lang}
                  onPlaybackEnd={() => {
                    if (phase === "playing-question") {
                      setPhase("ready-to-record");
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              {(phase === "ready-to-record" || phase === "playing-question") && (
                <MicRecorder
                  key={`mic-${current.id}-${index}`}
                  onRecorded={onRecorded}
                  disabled={phase === "playing-question"}
                />
              )}

              {phase === "evaluating" && (
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="inline-block h-3 w-3 animate-ping rounded-full bg-[#1B2A4A]" />
                  Evaluating your answer…
                </div>
              )}

              {phase === "feedback" && evaluation && (
                <div className="w-full">
                  <ResultCard
                    result={evaluation.result}
                    explanation={evaluation.explanation}
                    correctAnswer={current.answers[0]}
                    correctAnswerTranslated={translation.answers[0]}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={advance}
                      className="rounded-lg bg-[#1B2A4A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243861]"
                    >
                      Next question →
                    </button>
                  </div>
                </div>
              )}

              {phase === "error" && (
                <div
                  className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 p-5 text-sm text-rose-900"
                  role="alert"
                >
                  <div className="font-semibold">Something went wrong</div>
                  <p className="mt-1">
                    {errorMsg ?? "Please try recording your answer again."}
                  </p>
                  <button
                    type="button"
                    onClick={retryCurrent}
                    className="mt-3 rounded-lg bg-[#C41E3A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a3172f]"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center p-6">
          <p className="text-gray-700">Loading…</p>
        </main>
      }
    >
      <InterviewInner />
    </Suspense>
  );
}
