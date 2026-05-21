import { NextRequest } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";
import { getLanguage, type LanguageConfig } from "@/lib/languages";

export const runtime = "nodejs";

/** Thrown when a required API key is missing — surfaced as a 500, not a 502. */
class ConfigError extends Error {}

async function transcribeWithDeepgram(
  buffer: Buffer,
  language: LanguageConfig,
): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new ConfigError("DEEPGRAM_API_KEY is not configured");
  }

  const client = new DeepgramClient({ apiKey });
  const response = await client.listen.v1.media.transcribeFile(buffer, {
    model: "nova-3",
    language: language.deepgramCode,
    smart_format: true,
    punctuate: true,
  });

  return "results" in response
    ? (response.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "")
    : "";
}

async function transcribeWithSarvam(
  file: Blob,
  language: LanguageConfig,
): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new ConfigError("SARVAM_API_KEY is not configured");
  }

  // Sarvam's Saarika model transcribes Indian languages Deepgram doesn't
  // support (e.g. Malayalam). language_code is the BCP-47 tag, e.g. "ml-IN".
  const form = new FormData();
  form.append("file", file, "answer.webm");
  form.append("model", "saarika:v2.5");
  form.append("language_code", language.bcp47Code);

  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: { "api-subscription-key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Sarvam STT error ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { transcript?: string };
  return data.transcript ?? "";
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("audio");
  const lang = (formData.get("lang") as string) ?? "en";

  if (!(file instanceof Blob)) {
    return Response.json({ error: "Missing audio file" }, { status: 400 });
  }

  const language = getLanguage(lang) ?? getLanguage("en")!;

  try {
    // Route per language: Sarvam for languages Deepgram can't handle (ml),
    // Deepgram (nova-3) for everything else.
    let transcript: string;
    if (language.sttProvider === "sarvam") {
      transcript = await transcribeWithSarvam(file, language);
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      transcript = await transcribeWithDeepgram(buffer, language);
    }

    if (!transcript.trim()) {
      return Response.json(
        {
          error: "We couldn't hear what you said. Please try recording again.",
        },
        { status: 422 },
      );
    }

    return Response.json({
      transcript,
      detectedLanguage: language.code,
    });
  } catch (err) {
    if (err instanceof ConfigError) {
      return Response.json({ error: err.message }, { status: 500 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Transcription failed", detail: message },
      { status: 502 },
    );
  }
}
