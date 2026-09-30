"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollMotion } from "@/lib/scroll-motion";
import { dur, ease, prefersReducedMotion } from "@/lib/motion";
import type { Dict } from "@/content/types";
import { siteConfig } from "@/site.config";
import { ArchOutline, Divider } from "../ornaments/Ornaments";

type Props = { dict: Dict; revealed: boolean };

const [y, m, d] = siteConfig.date.iso.split("-");

export default function Hero({ dict, revealed }: Props) {
  const root = useRef<HTMLElement>(null);
  const ar = dict.lang === "ar";
  const { latin, arabic } = siteConfig.couple;

  // Hidden state is set before first paint (doors cover the hero until then).
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".hero-fade", { opacity: 0 });
        return;
      }
      // mask "writes" in the reading direction
      gsap.set(".hero-write", {
        clipPath: ar ? "inset(-40% -15% -40% 100%)" : "inset(-40% 100% -40% -15%)",
      });
      gsap.set(".hero-fade", { opacity: 0, y: 18 });
      gsap.set(".hero-amp", { opacity: 0, scale: 0.9 });
    },
    { scope: root, dependencies: [ar] },
  );

  useGSAP(
    () => {
      if (!revealed) return;
      if (prefersReducedMotion()) {
        gsap.to(".hero-fade", { opacity: 1, duration: 0.8, stagger: 0.1 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(".hero-write", {
        clipPath: "inset(-40% -15% -40% -15%)",
        duration: dur.revealLong,
        ease: ease.write,
        stagger: 0.55,
      })
        .to(".hero-amp", { opacity: 1, scale: 1, duration: dur.reveal, ease: ease.reveal }, ">-0.2")
        .to(".hero-fade", { opacity: 1, y: 0, duration: dur.reveal, ease: ease.reveal, stagger: 0.12 }, "<0.1");
    },
    { scope: root, dependencies: [revealed, ar], revertOnUpdate: false },
  );

  // subtle parallax on the arch silhouette
  useScrollMotion(root, () => {
    gsap.to(".hero-arch", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section
      ref={root}
      className="hero relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-16"
    >
      <ArchOutline
        className="hero-arch pointer-events-none absolute left-1/2 top-[8svh] h-[min(86svh,140vw)] max-h-[820px] -translate-x-1/2 text-gold opacity-30"
        preserveAspectRatio="xMidYMin meet"
      />

      <h1 className="relative z-[1] w-full max-w-[34rem]" aria-label={`${latin.first} & ${latin.second}`}>
        {ar ? (
          <span className="flex flex-col items-center" aria-hidden="true">
            <span className="hero-write block px-[6vw] font-ar-names text-[clamp(4.6rem,24vw,9rem)] leading-[1.25]">
              <span className="gold-text gold-sheen">{arabic.first}</span>
            </span>
            <span className="hero-amp -my-[0.25em] block font-ar-names text-[clamp(2.6rem,12vw,4.5rem)] text-gold-deep">و</span>
            <span className="hero-write block px-[6vw] font-ar-names text-[clamp(4.6rem,24vw,9rem)] leading-[1.25]">
              <span className="gold-text gold-sheen">{arabic.second}</span>
            </span>
          </span>
        ) : (
          <span className="flex flex-col" aria-hidden="true">
            <span className="hero-write block self-start ps-[5%] font-names text-[clamp(5rem,25vw,8.5rem)] leading-[1.05] text-ink">
              {latin.first}
            </span>
            <span className="hero-amp -my-[0.18em] block self-center font-display text-[clamp(3rem,15vw,6rem)] leading-none italic font-light">
              <span className="gold-text gold-sheen pe-1">&amp;</span>
            </span>
            <span className="hero-write block self-end pe-[3%] font-names text-[clamp(5rem,25vw,8.5rem)] leading-[1.05] text-ink">
              {latin.second}
            </span>
          </span>
        )}
      </h1>

      {/* second script: Arabic under Latin in FR, Latin under Arabic in AR */}
      <p className="hero-fade relative z-[1] mt-3 text-center" lang={ar ? "fr" : "ar"} dir={ar ? "ltr" : "rtl"}>
        {ar ? (
          <span className="font-names text-[clamp(2.2rem,10vw,3.4rem)] text-ink">
            {latin.first} <span className="font-display text-[0.7em] italic text-gold-deep">&amp;</span> {latin.second}
          </span>
        ) : (
          <span className="gold-text gold-sheen font-ar-names-lite text-[clamp(2rem,9vw,3rem)]">
            {arabic.first} و {arabic.second}
          </span>
        )}
      </p>

      <div className="relative z-[1] mt-9 flex w-full max-w-[20rem] flex-col items-center text-center">
        <Divider className="hero-fade w-full" />
        <p className="hero-fade caps mt-5 text-gold-deep">{dict.hero.weekday}</p>
        <p
          className="hero-fade lining mt-1 font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-none font-light tracking-[0.06em] text-ink"
          dir="ltr"
        >
          {d}
          <span className="mx-[0.28em] text-gold">·</span>
          {m}
          <span className="mx-[0.28em] text-gold">·</span>
          {y}
        </p>
        <p className="hero-fade caps mt-4 text-ink/80">
          {ar ? siteConfig.venue.nameAr : siteConfig.venue.name} <span className="text-gold">·</span> {ar ? siteConfig.venue.cityAr : siteConfig.venue.city}
        </p>
      </div>

      <div className="hero-fade absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 [@media(max-height:760px)]:hidden" aria-hidden="true">
        <span className="caps text-[0.75rem] text-gold-deep">{dict.hero.scroll}</span>
        <span className="scroll-cue block h-10 w-px overflow-hidden bg-gold/25">
          <span className="block h-full w-full origin-top bg-gold" />
        </span>
      </div>
    </section>
  );
}
