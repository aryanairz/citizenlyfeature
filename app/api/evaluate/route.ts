import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getLanguage } from "@/lib/languages";

export const runtime = "nodejs";

const MODEL = "llama-3.3-70b-versatile";

interface EvaluateBody {
  questionEnglish: string;
  acceptedAnswersEnglish: string[];
  questionTranslated?: string;
  acceptedAnswersTranslated?: string[];
  userTranscript: string;
  lang: string;
}

export type EvaluationResult = "correct" | "partial" | "incorrect";

export interface EvaluationResponse {
  result: EvaluationResult;
  explanation: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: EvaluateBody;
  try {
    body = (await request.json()) as EvaluateBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body.questionEnglish ||
    !Array.isArray(body.acceptedAnswersEnglish) ||
    !body.userTranscript
  ) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const language = getLanguage(body.lang) ?? getLanguage("en")!;
  const prompt = buildPrompt(body, language.englishName);

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const parsed = extractJson(text);
    if (!parsed) {
      return Response.json(
        { error: "Could not parse evaluation. Please try again.", raw: text },
        { status: 502 },
      );
    }

    if (
      parsed.result !== "correct" &&
      parsed.result !== "partial" &&
      parsed.result !== "incorrect"
    ) {
      return Response.json(
        { error: "Unexpected evaluation result", raw: text },
        { status: 502 },
      );
    }

    return Response.json({
      result: parsed.result,
      explanation: parsed.explanation ?? "",
    } satisfies EvaluationResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isTimeout = /timeout|ECONNRESET|ETIMEDOUT/i.test(message);
    return Response.json(
      {
        error: isTimeout
          ? "Evaluation timed out. Please try again."
          : "Evaluation failed.",
        detail: message,
      },
      { status: 504 },
    );
  }
}

function buildPrompt(body: EvaluateBody, languageName: string): string {
  const acceptedEn = body.acceptedAnswersEnglish.map((a) => `- ${a}`).join("\n");
  const translatedBlock =
    body.questionTranslated && body.acceptedAnswersTranslated?.length
      ? `\nQuestion (${languageName}): ${body.questionTranslated}\nAccepted answers (${languageName}):\n${body.acceptedAnswersTranslated
          .map((a) => `- ${a}`)
          .join("\n")}\n`
      : "";

  return `You are evaluating a USCIS citizenship-test answer. A USCIS officer's standard is generous: the applicant passes if their meaning matches an accepted answer, even with imperfect grammar, partial phrasing, or speaking in their native language. Do not penalize accents, transcription artifacts, or paraphrasing.

USCIS civics question (English): ${body.questionEnglish}
Accepted answers (English) — any one is correct:
${acceptedEn}
${translatedBlock}
The applicant answered in ${languageName}. Their spoken answer, transcribed by Deepgram, was:
"${body.userTranscript}"

Decide:
- "correct" if the meaning clearly matches one accepted answer.
- "partial" if the applicant is on the right track but the answer is incomplete or ambiguous (a USCIS officer might ask them to clarify).
- "incorrect" if the answer does not match any accepted answer or is unrelated.

Respond with a single JSON object and nothing else:
{"result":"correct"|"partial"|"incorrect","explanation":"one sentence in English explaining why"}`;
}

function extractJson(
  text: string,
): { result?: string; explanation?: string } | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
