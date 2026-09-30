"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { dur, ease, revealTrigger } from "@/lib/motion";
import { useScrollMotion } from "@/lib/scroll-motion";
import { useReveal } from "@/lib/reveal";
import type { Dict, Lang } from "@/content/types";
import { siteConfig } from "@/site.config";
import { ArchOutline } from "../ornaments/Ornaments";

type Props = { dict: Dict; lang: Lang; controls: ReactNode };

export default function Closing({ dict, lang, controls }: Props) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const { first, second } = siteConfig.couple.monogram;

  useScrollMotion(
    root,
    () => {
      gsap.from(".closing-arch path", {
        drawSVG: "50% 50%",
        duration: 2.2,
        ease: ease.big,
        scrollTrigger: { trigger: ".closing-arch", ...revealTrigger },
      });
      gsap.from(".closing-mono", {
        opacity: 0,
        scale: 0.94,
        duration: dur.revealLong,
        ease: ease.reveal,
        delay: 0.5,
        scrollTrigger: { trigger: ".closing-arch", ...revealTrigger },
      });
    },
  );

  return (
    <footer ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-10 pt-24 text-center">
      <p data-reveal="lines" className="max-w-[20rem] font-display text-[clamp(2rem,8.6vw,3rem)] leading-[1.15] font-light italic text-jasmine">
        {dict.closing.line}
      </p>

      <div className="relative mt-14 h-[13rem] w-[8.7rem]">
        <ArchOutline className="closing-arch absolute inset-0 h-full w-full text-gold-light" />
        <p className="closing-mono absolute inset-x-0 top-[38%] font-display text-[3.2rem] leading-none italic" aria-label={`${first} & ${second}`}>
          <span className="gold-text gold-sheen">
            {first}
            <span className="mx-1 text-[0.6em]">&amp;</span>
            {second}
          </span>
        </p>
      </div>

      {lang === "ar" ? (
        <p className="mt-8 font-ar-names text-[1.9rem] text-gold-light">{dict.closing.signature}</p>
      ) : (
        <p className="mt-8 font-names text-[2.1rem] text-gold-light">
          {siteConfig.couple.latin.first} <span className="font-display text-[0.7em] italic">&amp;</span> {siteConfig.couple.latin.second}
        </p>
      )}

      <div className="mt-auto flex items-center gap-6 pt-16 text-[0.95rem] text-gold-light/80">{controls}</div>
    </footer>
  );
}
