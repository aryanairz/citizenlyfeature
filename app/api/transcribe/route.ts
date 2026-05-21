import { NextRequest } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";
import OpenAI from "openai";
import { getLanguage } from "@/lib/languages";

export const runtime = "nodejs";

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

  // Route to the right STT provider for this language.
  // Deepgram doesn't support Hmong, so we use Groq's Whisper for it.
  // Future: when more non-Deepgram languages are added, refactor this
  // into a proper provider router (e.g. lib/stt-providers.ts).
  if (language.code === "hmn") {
    return transcribeWithGroqWhisper(file, language.code);
  }

  return transcribeWithDeepgram(file, language.deepgramCode);
}

async function transcribeWithDeepgram(file: Blob, dgLanguage: string) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "DEEPGRAM_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const client = new DeepgramClient({ apiKey });

  try {
    const response = await client.listen.v1.media.transcribeFile(buffer, {
      model: "nova-3",
      language: dgLanguage,
      smart_format: true,
      punctuate: true,
    });

    const transcript =
      "results" in response
        ? (response.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "")
        : "";

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
      detectedLanguage: dgLanguage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Transcription failed", detail: message },
      { status: 502 },
    );
  }
}

async function transcribeWithGroqWhisper(file: Blob, langCode: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 },
    );
  }

  // Groq is OpenAI-compatible, so we use the OpenAI SDK pointed at Groq's endpoint.
  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  // Convert the Blob to a File-like object that the OpenAI SDK accepts.
  // The SDK needs a File or a stream with a known filename, so we wrap the blob.
  const audioFile = new File([await file.arrayBuffer()], "recording.webm", {
    type: file.type || "audio/webm",
  });

  try {
    // Groq Whisper does not officially support 'hmn' as a language code,
    // but Whisper Large v3 was trained on Hmong audio. Letting Whisper
    // auto-detect the language often works for Hmong input.
    const response = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
    });

    const transcript = response.text ?? "";

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
      detectedLanguage: langCode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Transcription failed", detail: message },
      { status: 502 },
    );
  }
}
