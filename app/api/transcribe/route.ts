import { NextRequest } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";
import { getLanguage } from "@/lib/languages";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "DEEPGRAM_API_KEY is not configured" },
      { status: 500 },
    );
  }

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
  const dgLanguage = language.deepgramCode;

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
