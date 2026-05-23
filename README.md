# Citizenly Interview — AI-powered USCIS mock interview

Standalone prototype for an AI-powered mock USCIS citizenship interview, built in
isolation from the main Citizenly app. It will be integrated into the main app
(`citizenly.app`) once the flow is validated.

## What it does

1. User selects their language (English, Spanish, Korean, Vietnamese, Tagalog,
   Russian, Malayalam, Hindi, Gujarati, Norwegian, Hmong) and starts a session.
2. The app picks 10 random questions from the USCIS civics bank (or the 65/20
   short list).
3. Each question is read aloud in the user's language by a **server-side Google
   Translate TTS proxy** (`/api/tts`) — no API key required. This is used for
   every language because the browser Web Speech API is unreliable (most devices
   have no voice for Malayalam/Gujarati/Norwegian and silently fall back to an
   en-US voice). The browser voice is kept only as a last-resort fallback if the
   proxy fails. Hmong is the exception: Google has no Hmong voice, so it's shown
   as text only (`tts: false` in `lib/languages.ts`).
4. The user records their answer with the browser's MediaRecorder API.
5. Audio goes to speech-to-text in the user's language — Deepgram (nova-3)
   for most languages (including Gujarati), Sarvam (Saarika) for Malayalam, and
   Groq Whisper for Hmong (Deepgram supports neither Malayalam nor Hmong).
6. The transcript + accepted answers go to Llama 3.3 70B via Groq
   (`llama-3.3-70b-versatile`) for fuzzy evaluation — correct / partial /
   incorrect.
7. The interview stops at 6 correct, or after 10 questions. Results page shows
   pass/fail and a per-question breakdown.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in:
   - `DEEPGRAM_API_KEY`
   - `GROQ_API_KEY`
   - `SARVAM_API_KEY` (Malayalam speech-to-text)
2. Install dependencies (already done if you scaffolded with the included
   instructions):

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## File map

```
app/
├── page.tsx                    # Language select + start
├── interview/page.tsx          # Main interview UI
├── results/page.tsx            # Pass/fail breakdown
└── api/
    ├── tts/route.ts            # Google Translate TTS proxy → base64 MP3
    ├── transcribe/route.ts     # Deepgram / Sarvam audio → transcript
    └── evaluate/route.ts       # Llama (Groq) transcript → correct/partial/incorrect

lib/
├── languages.ts                # 11-language config (TTS + STT codes)
└── questions.ts                # 20 USCIS questions × 11 languages (starter)

components/
├── AudioPlayer.tsx             # Plays question audio from /api/tts (browser TTS fallback)
├── MicRecorder.tsx             # MediaRecorder + visual recording indicator
└── ResultCard.tsx              # Green/yellow/red feedback
```

## Known limitations

- **Translations**: The 20-question starter set's translations are
  AI-generated. They should be reviewed by native speakers before production use.
- **Question bank**: Only 20 of the 128 USCIS questions are included. Add the
  rest to `lib/questions.ts` following the same structure.
- **No persistence**: Results are kept in `sessionStorage` only. Integration
  with the main Citizenly Supabase backend is a follow-up.
- **TTS endpoint**: `/api/tts` proxies Google Translate's unofficial
  `client=tw-ob` endpoint. It's free and works, but can rate-limit under load.
  If this scales, swap the proxy's backend to Google Cloud TTS / Azure /
  ElevenLabs behind the same `/api/tts` interface — the client won't change.

## Building it step by step

This repo was built in this order (and is the recommended order for review):

1. `lib/languages.ts` + `lib/questions.ts`
2. `app/api/tts/route.ts` + `components/AudioPlayer.tsx` (Google Translate TTS)
3. `components/MicRecorder.tsx` + `app/api/transcribe/route.ts`
4. `app/api/evaluate/route.ts` + `components/ResultCard.tsx`
5. `app/page.tsx`, `app/interview/page.tsx`, `app/results/page.tsx`
