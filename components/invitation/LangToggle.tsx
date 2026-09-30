"use client";

import type { Dict } from "@/content/types";

type Props = { dict: Dict; onToggle: () => void; compact?: boolean };

/** Shows the *other* language, written in that language. */
export default function LangToggle({ dict, onToggle, compact = false }: Props) {
  const target = dict.lang === "fr" ? "ar" : "fr";
  return (
    <button
      type="button"
      onClick={onToggle}
      lang={target}
      aria-label={dict.ui.languageLabel}
      className={`lang-toggle cursor-pointer ${compact ? "lang-toggle--compact" : "border-b border-gold/60 pb-0.5"} ${
        target === "ar" ? "font-ar-label text-[1.1rem]" : "caps text-[0.9rem]"
      }`}
    >
      {dict.ui.language}
    </button>
  );
}
