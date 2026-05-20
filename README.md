# Citizenly Interview — AI-powered USCIS mock interview

Standalone prototype for an AI-powered mock USCIS citizenship interview, built in
isolation from the main Citizenly app. It will be integrated into the main app
(`citizenly.app`) once the flow is validated.

## What it does

1. User selects their language (English, Spanish, Korean, Vietnamese, Tagalog,
   Russian, Malayalam, Hindi) and starts a session.
2. The app picks 10 random questions from the USCIS civics bank (or the 65/20
   short list).
3. Each question is spoken aloud in the user's language via the browser's Web
   Speech API (`SpeechSynthesis`) — no server-side TTS or API key required.
4. The user records their answer with the browser's MediaRecorder API.
5. Audio goes to Deepgram for speech-to-text (in the user's language).
6. The transcript + accepted answers go to Llama 3.3 70B via Groq
   (`llama-3.3-70b-versatile`) for fuzzy evaluation — correct / partial /
   incorrect.
7. The interview stops at 6 correct, or after 10 questions. Results page shows
   pass/fail and a per-question breakdown.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in:
   - `DEEPGRAM_API_KEY`
   - `GROQ_API_KEY`
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
    ├── transcribe/route.ts     # Deepgram audio → transcript
    └── evaluate/route.ts       # Llama (Groq) transcript → correct/partial/incorrect

lib/
├── languages.ts                # 8-language config (TTS + STT codes)
└── questions.ts                # 20 USCIS questions × 8 languages (starter)

components/
├── AudioPlayer.tsx             # Speaks the question via Web Speech API, with replay
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

## Building it step by step

This repo was built in this order (and is the recommended order for review):

1. `lib/languages.ts` + `lib/questions.ts`
2. `components/AudioPlayer.tsx` (Web Speech API TTS)
3. `components/MicRecorder.tsx` + `app/api/transcribe/route.ts`
4. `app/api/evaluate/route.ts` + `components/ResultCard.tsx`
5. `app/page.tsx`, `app/interview/page.tsx`, `app/results/page.tsx`
