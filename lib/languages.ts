export type LangCode =
  | "en"
  | "es"
  | "ko"
  | "vi"
  | "tl"
  | "ru"
  | "ml"
  | "hi"
  | "gu"
  | "no"
  | "hmn";

export interface LanguageConfig {
  code: LangCode;
  englishName: string;
  nativeName: string;
  /** Deepgram language code for speech-to-text. */
  deepgramCode: string;
  /** BCP-47 locale tag used by the browser SpeechSynthesis API to pick a voice. */
  bcp47Code: string;
  /**
   * Speech-to-text provider override. Defaults to Deepgram. Use "sarvam" for
   * Malayalam (the transcribe route sends bcp47Code as Sarvam's language_code)
   * and "whisper" for Hmong (Groq Whisper, auto-detect) — both are languages
   * Deepgram can't transcribe.
   */
  sttProvider?: "deepgram" | "sarvam" | "whisper";
  /**
   * Whether to read the question aloud with the browser's SpeechSynthesis.
   * Defaults to true. Set false for languages with no usable browser voice
   * (e.g. Hmong) — the question is shown as text only and the interview skips
   * straight to recording instead of trying (and failing) to speak.
   */
  tts?: boolean;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "en",
    englishName: "English",
    nativeName: "English",
    deepgramCode: "en",
    bcp47Code: "en-US",
  },
  {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
    deepgramCode: "es",
    bcp47Code: "es-US",
  },
  {
    code: "ko",
    englishName: "Korean",
    nativeName: "한국어",
    deepgramCode: "ko",
    bcp47Code: "ko-KR",
  },
  {
    code: "vi",
    englishName: "Vietnamese",
    nativeName: "Tiếng Việt",
    deepgramCode: "vi",
    bcp47Code: "vi-VN",
  },
  {
    code: "tl",
    englishName: "Tagalog",
    nativeName: "Tagalog",
    deepgramCode: "tl",
    bcp47Code: "fil-PH",
  },
  {
    code: "ru",
    englishName: "Russian",
    nativeName: "Русский",
    deepgramCode: "ru",
    bcp47Code: "ru-RU",
  },
  {
    code: "ml",
    englishName: "Malayalam",
    nativeName: "മലയാളം",
    deepgramCode: "ml",
    bcp47Code: "ml-IN",
    sttProvider: "sarvam",
  },
  {
    code: "hi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
    deepgramCode: "hi",
    bcp47Code: "hi-IN",
  },
  {
    code: "gu",
    englishName: "Gujarati",
    nativeName: "ગુજરાતી",
    // Deepgram nova-3 transcribes Gujarati natively (gu / gu-IN), so this uses
    // the default Deepgram route — no Sarvam/Whisper override needed.
    deepgramCode: "gu",
    bcp47Code: "gu-IN",
  },
  {
    code: "no",
    englishName: "Norwegian",
    nativeName: "Norsk",
    // Deepgram nova-3 transcribes Norwegian natively (no), so this uses the
    // default Deepgram route — no Sarvam/Whisper override needed. bcp47 uses
    // the Bokmål voice tag for browser TTS.
    deepgramCode: "no",
    bcp47Code: "nb-NO",
  },
  {
    code: "hmn",
    englishName: "Hmong",
    nativeName: "Hmoob",
    deepgramCode: "hmn",
    bcp47Code: "hmn",
    sttProvider: "whisper",
    // No reliable browser TTS voice exists for Hmong, so don't attempt it —
    // the question is shown as text only. STT (Whisper) is unaffected.
    tts: false,
  },
];

export const LANG_MAP: Record<LangCode, LanguageConfig> = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang;
    return acc;
  },
  {} as Record<LangCode, LanguageConfig>,
);

export function getLanguage(code: string): LanguageConfig | undefined {
  return LANG_MAP[code as LangCode];
}
