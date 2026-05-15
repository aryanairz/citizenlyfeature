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
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && !!window.speechSynthesis,
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onPlaybackEndRef = useRef(onPlaybackEnd);

  useEffect(() => {
    onPlaybackEndRef.current = onPlaybackEnd;
  }, [onPlaybackEnd]);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Your browser doesn't support speech playback.");
      return;
    }
    setError(null);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const language = getLanguage(lang);
    utterance.lang = language?.bcp47Code ?? "en-US";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      onPlaybackEndRef.current?.();
    };
    utterance.onerror = (e) => {
      setIsPlaying(false);
      if (e.error !== "canceled" && e.error !== "interrupted") {
        setError("Speech playback failed. Try replaying the question.");
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, lang]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (autoPlay) {
      // Voices may load asynchronously. If they aren't ready yet, wait once.
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        const handler = () => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handler,
          );
          speak();
        };
        window.speechSynthesis.addEventListener("voiceschanged", handler);
        return () => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handler,
          );
        };
      }
      // Auto-play on mount — `speak()` updates external SpeechSynthesis state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      speak();
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [autoPlay, speak]);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={speak}
        disabled={isPlaying || !isSupported}
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
      {error && (
        <div className="text-sm text-[#C41E3A]" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
