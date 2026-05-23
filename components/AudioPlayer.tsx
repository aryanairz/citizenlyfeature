"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLanguage } from "@/lib/languages";

interface AudioPlayerProps {
  text: string;
  lang: string;
  autoPlay?: boolean;
  onPlaybackEnd?: () => void;
}

// Norwegian is tagged inconsistently across platforms (no / nb / nn), so treat
// those base tags as interchangeable when matching a voice.
const NORWEGIAN_BASES = new Set(["no", "nb", "nn"]);

function normalizeLang(code: string): string {
  return code.toLowerCase().replace(/_/g, "-");
}

/**
 * Find the best installed voice for a BCP-47 code.
 *
 * This matters because SpeechSynthesis treats `utterance.lang` as a hint: if no
 * matching `utterance.voice` is set, most browsers fall back to the default
 * (usually English) voice and read foreign text with an English accent. So we
 * resolve a real voice here, or return null so the caller can show text only
 * instead of speaking it badly.
 */
function pickVoice(
  voices: SpeechSynthesisVoice[],
  bcp47: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const target = normalizeLang(bcp47);
  const targetBase = target.split("-")[0];

  // Exact locale, e.g. "nb-no" === "nb-no".
  const exact = voices.find((v) => normalizeLang(v.lang) === target);
  if (exact) return exact;

  // Same base language, e.g. target "nb-no" matches a plain "nb" voice.
  const sameBase = voices.find(
    (v) => normalizeLang(v.lang).split("-")[0] === targetBase,
  );
  if (sameBase) return sameBase;

  // Norwegian no/nb/nn equivalence.
  if (NORWEGIAN_BASES.has(targetBase)) {
    const norwegian = voices.find((v) =>
      NORWEGIAN_BASES.has(normalizeLang(v.lang).split("-")[0]),
    );
    if (norwegian) return norwegian;
  }

  return null;
}

export default function AudioPlayer({
  text,
  lang,
  autoPlay = true,
  onPlaybackEnd,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noVoice, setNoVoice] = useState(false);

  const language = getLanguage(lang);
  const bcp47 = language?.bcp47Code ?? "en-US";

  const [browserSupportsTts] = useState(
    () => typeof window !== "undefined" && !!window.speechSynthesis,
  );
  // Some languages opt out of TTS entirely (e.g. Hmong has no usable voice).
  const ttsDisabledForLang = language?.tts === false;
  const ttsEnabled = browserSupportsTts && !ttsDisabledForLang;

  const onPlaybackEndRef = useRef(onPlaybackEnd);
  useEffect(() => {
    onPlaybackEndRef.current = onPlaybackEnd;
  }, [onPlaybackEnd]);

  const speak = useCallback(() => {
    if (!ttsEnabled) return;
    setError(null);

    const voice = pickVoice(window.speechSynthesis.getVoices(), bcp47);
    if (!voice) {
      // No installed voice for this language — don't read it in the wrong
      // (English) voice. Show text only and let the interview continue.
      setNoVoice(true);
      onPlaybackEndRef.current?.();
      return;
    }
    setNoVoice(false);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Assigning the voice (not just .lang) is what forces the correct accent.
    utterance.voice = voice;
    utterance.lang = voice.lang;
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

    window.speechSynthesis.speak(utterance);
  }, [text, bcp47, ttsEnabled]);

  useEffect(() => {
    if (!autoPlay) return;

    // No TTS for this language/browser — advance straight to recording so the
    // mic is never stuck disabled.
    if (!ttsEnabled) {
      onPlaybackEndRef.current?.();
      return;
    }

    const synth = window.speechSynthesis;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      if (timer) clearTimeout(timer);
    };

    // Chrome loads its Google voices from the network and only reveals them on
    // a (sometimes delayed, sometimes repeated) `voiceschanged` event — so a
    // matching voice can appear after the first getVoices() call. Re-check on
    // each event until we find one.
    function onVoicesChanged() {
      if (cancelled) return;
      if (pickVoice(synth.getVoices(), bcp47)) {
        cleanup();
        speak();
      }
    }

    if (pickVoice(synth.getVoices(), bcp47)) {
      // A voice is already available — play immediately. `speak()` updates
      // external SpeechSynthesis state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      speak();
    } else {
      synth.addEventListener("voiceschanged", onVoicesChanged);
      // If no matching voice ever loads, fall back to text only rather than
      // reading it in the wrong (English) voice or hanging.
      timer = setTimeout(() => {
        if (cancelled) return;
        cleanup();
        setNoVoice(true);
        onPlaybackEndRef.current?.();
      }, 3000);
    }

    return () => {
      cancelled = true;
      cleanup();
      synth.cancel();
    };
  }, [autoPlay, ttsEnabled, bcp47, speak]);

  // Text-only fallback: language opts out, browser unsupported, or this device
  // simply has no installed voice for the language.
  if (!ttsEnabled || noVoice) {
    const message = ttsDisabledForLang
      ? "Audio narration isn't available for this language — please read the question above."
      : !browserSupportsTts
        ? "Your browser doesn't support audio playback — please read the question above."
        : "No voice for this language is installed on your device, so the question is shown as text only.";
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
        <span>{message}</span>
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
