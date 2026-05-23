"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLanguage } from "@/lib/languages";

interface AudioPlayerProps {
  text: string;
  lang: string;
  autoPlay?: boolean;
  onPlaybackEnd?: () => void;
}

export default function AudioPlayer({
  text,
  lang,
  autoPlay = true,
  onPlaybackEnd,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const language = getLanguage(lang);
  // Hmong has no usable voice anywhere (no Google TTS, no browser voice), so it
  // is shown as text only — see `tts: false` in lib/languages.ts.
  const ttsDisabled = language?.tts === false;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onPlaybackEndRef = useRef(onPlaybackEnd);
  useEffect(() => {
    onPlaybackEndRef.current = onPlaybackEnd;
  }, [onPlaybackEnd]);

  const finish = useCallback(() => {
    setIsPlaying(false);
    onPlaybackEndRef.current?.();
  }, []);

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Last-resort fallback: browser Web Speech, only where a voice exists. Better
  // than silence if the proxy ever fails. (Reads in the default voice if the
  // device lacks the language — the proxy is what we rely on for correctness.)
  const fallbackSpeak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      finish();
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language?.bcp47Code ?? "en-US";
      utterance.rate = 0.85;
      utterance.onend = () => finish();
      utterance.onerror = () => finish();
      window.speechSynthesis.speak(utterance);
    } catch {
      finish();
    }
  }, [text, language, finish]);

  const speak = useCallback(async () => {
    if (ttsDisabled) {
      finish();
      return;
    }
    setIsPlaying(true);
    stopCurrent();

    try {
      // Server-side Google Translate proxy: consistent, correct-language audio
      // on every device regardless of installed voices.
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      if (!res.ok) throw new Error("tts api failed");
      const { audioContent } = await res.json();

      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current = audio;
      audio.onended = () => finish();
      audio.onerror = () => fallbackSpeak();
      await audio.play();
    } catch {
      fallbackSpeak();
    }
  }, [text, lang, ttsDisabled, finish, fallbackSpeak, stopCurrent]);

  useEffect(() => {
    if (!autoPlay) return;

    // No audio for this language (Hmong) — advance straight to recording so the
    // mic is never stuck disabled.
    if (ttsDisabled) {
      onPlaybackEndRef.current?.();
      return;
    }

    // Auto-play on mount. `speak()` updates state and external audio.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void speak();

    return () => {
      stopCurrent();
    };
  }, [autoPlay, ttsDisabled, speak, stopCurrent]);

  // Hmong: show the question as text only.
  if (ttsDisabled) {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-500">
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 shrink-0 fill-current"
          aria-hidden
        >
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <line
            x1="3"
            y1="3"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span>
          Audio narration isn&apos;t available for this language — please read
          the question above.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => void speak()}
        disabled={isPlaying}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-white shadow-sm transition hover:bg-[#243861] disabled:opacity-50"
        aria-label="Replay question"
      >
        {isPlaying ? (
          <span className="block h-3 w-3 animate-pulse rounded-full bg-white" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 fill-current"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="text-sm text-gray-600">
        {isPlaying ? "Playing question…" : "Tap to replay"}
      </div>
    </div>
  );
}
