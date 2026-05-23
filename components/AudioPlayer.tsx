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

  const language = getLanguage(lang);
  // TTS is unavailable when the browser has no SpeechSynthesis, OR when the
  // language opts out (e.g. Hmong has no usable browser voice — see
  // `tts: false` in lib/languages.ts).
  const [browserSupportsTts] = useState(
    () => typeof window !== "undefined" && !!window.speechSynthesis,
  );
  const ttsDisabledForLang = language?.tts === false;
  const ttsEnabled = browserSupportsTts && !ttsDisabledForLang;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onPlaybackEndRef = useRef(onPlaybackEnd);

  useEffect(() => {
    onPlaybackEndRef.current = onPlaybackEnd;
  }, [onPlaybackEnd]);

  const speak = useCallback(() => {
    if (!ttsEnabled) return;
    setError(null);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
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
        setError("Couldn't play audio — please read the question above.");
        // Don't trap the user if the voice fails: let recording proceed.
        onPlaybackEndRef.current?.();
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, language, ttsEnabled]);

  useEffect(() => {
    if (!autoPlay) return;

    // When TTS isn't available (unsupported browser, or disabled for this
    // language like Hmong), don't block the flow — advance straight to
    // recording so the mic isn't stuck disabled.
    if (!ttsEnabled) {
      onPlaybackEndRef.current?.();
      return;
    }

    // Voices may load asynchronously. If they aren't ready yet, wait once.
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      const handler = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        speak();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
      };
    }

    // Auto-play on mount — `speak()` updates external SpeechSynthesis state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    speak();

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [autoPlay, ttsEnabled, speak]);

  // No audio for this language/browser: show the question as text only.
  if (!ttsEnabled) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05A4.5 4.5 0 0016.5 12z" />
          <path d="M19 12a7 7 0 01-1.8 4.7l1.2 1.2A8.7 8.7 0 0020.5 12 8.7 8.7 0 0018.4 6.1l-1.2 1.2A7 7 0 0119 12z" />
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
          {ttsDisabledForLang
            ? "Audio narration isn't available for this language — please read the question above."
            : "Your browser doesn't support audio playback — please read the question above."}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={speak}
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
      {error && (
        <div className="text-sm text-[#C41E3A]" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
