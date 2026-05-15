"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LANGUAGES, type LangCode } from "@/lib/languages";

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode>("en");
  const [senior65, setSenior65] = useState(false);

  function startInterview() {
    const params = new URLSearchParams({
      lang,
      senior65: senior65 ? "1" : "0",
    });
    router.push(`/interview?${params.toString()}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-6 w-6 rounded-sm"
            style={{ background: "#C41E3A" }}
            aria-hidden
          />
          <span className="text-sm font-semibold uppercase tracking-widest text-[#C41E3A]">
            Citizenly
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-[#1B2A4A] sm:text-4xl">
          Mock citizenship interview
        </h1>
        <p className="mt-3 text-base text-gray-700">
          A USCIS officer will ask you up to 10 civics questions. Answer out
          loud — just like the real interview. You pass when you get 6 correct.
        </p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="lang"
            className="block text-sm font-semibold text-[#1B2A4A]"
          >
            Interview language
          </label>
          <select
            id="lang"
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base focus:border-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/30"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.englishName})
              </option>
            ))}
          </select>

          <div className="mt-5 flex items-start gap-3">
            <input
              id="senior65"
              type="checkbox"
              checked={senior65}
              onChange={(e) => setSenior65(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C41E3A] focus:ring-[#C41E3A]"
            />
            <label htmlFor="senior65" className="text-sm text-gray-800">
              <span className="font-medium text-[#1B2A4A]">
                I qualify for the 65/20 exemption.
              </span>{" "}
              <span className="text-gray-600">
                (Age 65+ and 20+ years as a lawful permanent resident — uses the
                shorter civics question set.)
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={startInterview}
            className="mt-6 w-full rounded-lg bg-[#C41E3A] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#a3172f] focus:outline-none focus:ring-4 focus:ring-[#C41E3A]/30"
          >
            Start interview
          </button>
        </section>

        <ul className="mt-6 space-y-2 text-sm text-gray-600">
          <li>• Make sure your microphone is on and the room is quiet.</li>
          <li>• Listen to each question, then speak your answer aloud.</li>
          <li>• You can replay the question or re-record your answer.</li>
        </ul>
      </div>
    </main>
  );
}
