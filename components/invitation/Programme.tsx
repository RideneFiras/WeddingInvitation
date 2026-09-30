"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { dur, ease } from "@/lib/motion";
import { useScrollMotion } from "@/lib/scroll-motion";
import { useReveal } from "@/lib/reveal";
import type { Dict } from "@/content/types";
import { siteConfig } from "@/site.config";
import { ArchGlyph, Jasmine } from "../ornaments/Ornaments";

export default function Programme({ dict }: { dict: Dict }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const p = dict.programme;

  useScrollMotion(
    root,
    () => {
      const list = root.current?.querySelector(".prog-list");
      if (!list) return;
      // the gold line draws itself with the scroll…
      gsap.fromTo(
        ".prog-line",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 72%", end: "bottom 72%", scrub: 0.6 },
        },
      );
      // …and each item appears as the line reaches it
      gsap.utils.toArray<HTMLElement>(".prog-item").forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 72%", toggleActions: "play none none none" },
        });
        tl.from(item.querySelector(".prog-mark"), { scale: 0.4, opacity: 0, duration: 0.6, ease: ease.reveal })
          .from(item.querySelectorAll(".prog-mark path"), { drawSVG: "0%", duration: dur.reveal, ease: ease.reveal }, 0)
          .from(item.querySelectorAll(".prog-text > *"), { opacity: 0, x: dict.dir === "rtl" ? -16 : 16, duration: dur.reveal, ease: ease.reveal, stagger: 0.08 }, 0.1);
      });
    },
  );

  return (
    <section ref={root} className="relative px-5 py-24 sm:py-32" aria-labelledby="programme-label">
      <div className="mx-auto grid max-w-[60rem] gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        {/* heading column — asymmetric on wide screens */}
        <header className="md:sticky md:top-32 md:self-start">
          <p id="programme-label" data-reveal="fade" className="caps text-gold-deep">
            {p.label}
          </p>
          <h2
            data-reveal="lines"
            className="mt-3 font-display text-[clamp(2.4rem,10vw,3.6rem)] leading-[1.05] font-light italic text-ink"
          >
            {p.title}
          </h2>
          <p data-reveal="fade" className="lining mt-4 font-display text-[1.2rem] text-ink/75">
            {dict.invitation.dateLine}
          </p>
        </header>

        <ol className="prog-list relative ps-12">
          <svg
            className="pointer-events-none absolute start-[15px] top-2 h-[calc(100%-1rem)] w-[2px] overflow-visible text-gold"
            preserveAspectRatio="none"
            viewBox="0 0 2 100"
            aria-hidden="true"
          >
            <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line className="prog-line" x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>

          {siteConfig.programme.map((item, i) => {
            const copy = p.items[item.key];
            const Mark = i % 2 === 0 ? ArchGlyph : Jasmine;
            return (
              <li key={item.key} className="prog-item relative pb-14 last:pb-0">
                <span className="prog-mark absolute -start-12 top-0 flex h-8 w-8 items-center justify-center text-gold">
                  <Mark className="h-7 w-7" />
                </span>
                <div className="prog-text">
                  <p className={item.time ? "lining font-display text-[1.9rem] leading-none text-gold-deep" : "font-display text-[1.05rem] italic leading-8 text-gold-deep"}>
                    {item.time ?? p.timeTbd}
                  </p>
                  <h3 className="mt-2 font-display text-[1.65rem] leading-tight font-medium text-ink">{copy.title}</h3>
                  <p className="mt-1 text-[1rem] text-ink/75">{copy.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
