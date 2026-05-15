"use client";

import { useEffect, useRef, useState } from "react";

interface MicRecorderProps {
  /** Called with the recorded audio blob once the user stops recording. */
  onRecorded: (blob: Blob, mimeType: string) => void;
  disabled?: boolean;
}

type RecorderState = "idle" | "requesting" | "recording" | "processing";

export default function MicRecorder({
  onRecorded,
  disabled = false,
}: MicRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  async function start() {
    if (disabled || state !== "idle") return;
    setError(null);
    setElapsed(0);
    setState("requesting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser does not support microphone recording.");
      setState("idle");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Microphone access was blocked. Please enable mic access and try again."
          : "We couldn't access your microphone. Please check your settings.";
      setError(msg);
      setState("idle");
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    const mimeType = pickSupportedMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      if (blob.size === 0) {
        setError("No audio was captured. Please try again and speak clearly.");
        setState("idle");
      } else {
        setState("processing");
        onRecorded(blob, recorder.mimeType || "audio/webm");
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    recorder.start();
    setState("recording");
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
  }

  function stop() {
    if (state !== "recording") return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  }

  /** Reset to idle so the parent can request another recording (e.g., after evaluation). */
  function reset() {
    setState("idle");
    setElapsed(0);
    setError(null);
  }

  const isRecording = state === "recording";
  const isBusy = state === "requesting" || state === "processing";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={isRecording ? stop : start}
        disabled={disabled || isBusy}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-md transition focus:outline-none focus:ring-4 focus:ring-offset-2 ${
          isRecording
            ? "bg-[#C41E3A] focus:ring-[#C41E3A]/40 animate-[pulse_1.2s_ease-in-out_infinite]"
            : "bg-[#1B2A4A] hover:bg-[#243861] focus:ring-[#1B2A4A]/40"
        } disabled:opacity-50`}
        aria-label={isRecording ? "Stop recording" : "Record your answer"}
      >
        {isRecording ? (
          <span className="block h-6 w-6 rounded-sm bg-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-9 w-9 fill-current" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        )}
      </button>

      <div className="h-6 text-sm font-medium text-gray-700" aria-live="polite">
        {state === "requesting" && "Requesting mic access…"}
        {state === "recording" && (
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#C41E3A]" />
            Recording {formatTime(elapsed)} — tap to stop
          </span>
        )}
        {state === "processing" && "Processing your answer…"}
        {state === "idle" && !error && "Tap to record your answer"}
      </div>

      {error && (
        <div
          className="max-w-md text-center text-sm text-[#C41E3A]"
          role="alert"
        >
          {error}{" "}
          <button
            type="button"
            onClick={reset}
            className="underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function pickSupportedMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
