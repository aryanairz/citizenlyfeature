import { NextRequest, NextResponse } from "next/server";

// Uses Node APIs (Buffer) and proxies an external endpoint — pin to Node runtime.
export const runtime = "nodejs";

// lang code -> Google Translate `tl` code. Add every language you support.
const LANG_MAP: Record<string, string> = {
  en: "en",
  es: "es",
  hi: "hi",
  vi: "vi",
  tl: "tl",
  ko: "ko",
  ru: "ru",
  gu: "gu",
  ml: "ml",
  no: "no",
  // NOTE: no "hmn" — Google has no Hmong voice (see ReadAloud / AudioPlayer).
};

/** Split into chunks <=190 chars at word boundaries (Google TTS caps length). */
function chunkText(text: string, max = 190): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > max) {
    let cut = remaining.lastIndexOf(" ", max);
    if (cut < 50) cut = max;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export async function POST(req: NextRequest) {
  const { text, lang } = await req.json();
  if (!text || !lang) {
    return NextResponse.json({ error: "Missing text or lang" }, { status: 400 });
  }
  if (lang === "hmn" || !LANG_MAP[lang]) {
    return NextResponse.json(
      { error: "Language not supported" },
      { status: 400 },
    );
  }
  const tl = LANG_MAP[lang];
  const chunks = chunkText(text);
  try {
    const buffers: ArrayBuffer[] = [];
    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        chunk,
      )}&tl=${tl}&client=tw-ob&ttsspeed=0.8`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      });
      if (!response.ok) {
        throw new Error(`Google TTS chunk failed: ${response.status}`);
      }
      buffers.push(await response.arrayBuffer());
    }
    const totalLength = buffers.reduce((s, b) => s + b.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      combined.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }
    const audioContent = Buffer.from(combined).toString("base64");
    return NextResponse.json({ audioContent });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 502 });
  }
}
