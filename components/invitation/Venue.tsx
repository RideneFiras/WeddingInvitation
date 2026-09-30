"use client";

import { useRef } from "react";
import { gsap, plugins } from "@/lib/gsap";
import { useScrollMotion } from "@/lib/scroll-motion";
import { useReveal } from "@/lib/reveal";
import type { Dict } from "@/content/types";
import { siteConfig } from "@/site.config";
import { ArchOutline, Chandelier } from "../ornaments/Ornaments";

export default function Venue({ dict }: { dict: Dict }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const v = dict.venue;
  const ar = dict.lang === "ar";

  useScrollMotion(
    root,
    () => {
      const sky = document.querySelector<HTMLElement>("[data-invitation]");
      if (!sky || !root.current) return;
      // Day → night across this section (scrubbed CSS variable; reversible).
      gsap.fromTo(
        sky,
        { "--nightfall": 0 },
        {
          "--nightfall": 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: "top 45%", end: "bottom 60%", scrub: true },
        },
      );
      // The chandelier lights up when it reaches the centre of the screen.
      plugins.ScrollTrigger.create({
        trigger: ".venue-chandelier",
        start: "center 60%",
        onEnter: () => root.current?.querySelector(".venue-chandelier")?.classList.add("is-lit"),
        onLeaveBack: () => root.current?.querySelector(".venue-chandelier")?.classList.remove("is-lit"),
      });
    },
    { reducedToo: true },
  );

  return (
    <section ref={root} id="venue" className="relative px-5 pb-28 pt-24 sm:pb-36" aria-labelledby="venue-title">
      <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
        <Chandelier className="venue-chandelier h-36 w-auto text-gold" />

        <p data-reveal="fade" className="caps dusk-muted mt-8">
          {v.label}
        </p>
        <p data-reveal="fade" className="dusk-ink mt-3 font-display text-[1.35rem] italic">
          {v.intro}
        </p>
        <h2
          id="venue-title"
          data-reveal="lines"
          className="dusk-ink mt-1 font-display text-[clamp(3.4rem,17vw,7.5rem)] leading-[0.95] font-light"
        >
          {ar ? <span className="font-ar-names">{siteConfig.venue.nameAr}</span> : siteConfig.venue.name}
        </h2>
        <p data-reveal="fade" className="caps dusk-ink mt-4 text-[1.05rem]">
          {ar ? siteConfig.venue.areaAr : siteConfig.venue.area}
        </p>
        <p data-reveal="fade" className="dusk-ink mt-2 max-w-[18rem] text-[1rem] opacity-80">
          {ar ? siteConfig.venue.addressAr : siteConfig.venue.address}
        </p>

        {/* the illustrated map card, inside an arch */}
        <div data-reveal="fade" className="relative mt-14 w-full max-w-[20rem]">
          <ArchOutline className="absolute inset-0 h-full w-full text-gold" preserveAspectRatio="none" />
          <div className="relative flex aspect-[2/3] flex-col items-center justify-end px-8 pb-8">
            <MiniMap className="absolute left-[10%] top-[18%] w-[80%] text-gold" label={v.mapTitle} />
            <p className="caps dusk-ink relative text-[0.85rem]">{ar ? siteConfig.venue.areaAr : siteConfig.venue.area}</p>
            <div className="relative mt-5 flex w-full flex-col gap-3">
              <a className="venue-btn" href={siteConfig.venue.googleMaps} target="_blank" rel="noopener noreferrer">
                {v.maps}
              </a>
              <a className="venue-btn" href={siteConfig.venue.waze} target="_blank" rel="noopener noreferrer">
                {v.waze}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A quiet, hand-drawn impression of the neighbourhood: coastline, a few streets, a gold pin. */
function MiniMap({ className, label }: { className?: string; label: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label={label} fill="none" stroke="currentColor" strokeLinecap="round">
      {/* the sea: coastline + a few ripples */}
      <path d="M150 0 C 140 30, 158 52, 146 78 C 136 100, 150 124, 140 170" strokeWidth="1.1" />
      <g strokeWidth="0.8" opacity="0.55">
        <path d="M166 30 q 5 -3 10 0 t 10 0" />
        <path d="M160 70 q 5 -3 10 0 t 10 0" />
        <path d="M168 110 q 5 -3 10 0 t 10 0" />
        <path d="M158 148 q 5 -3 10 0 t 10 0" />
      </g>
      {/* streets */}
      <g strokeWidth="0.8" opacity="0.6">
        <path d="M0 60 C 40 64, 90 58, 142 70" />
        <path d="M20 170 C 40 120, 60 90, 96 62" />
        <path d="M70 0 C 76 40, 80 80, 74 170" />
        <path d="M0 122 C 40 118, 70 124, 120 116" strokeDasharray="2 3" />
      </g>
      {/* the pin */}
      <g transform="translate(88 58)">
        <circle r="13" className="map-pulse" strokeWidth="0.8" opacity="0.5" />
        <path d="M0 6 C -7 -2, -8 -8, -8 -11 A8 8 0 0 1 8 -11 C 8 -8, 7 -2, 0 6 Z" fill="url(#pinGold)" stroke="none" />
        <circle cy="-11" r="2.6" fill="#FFFDF7" stroke="none" />
      </g>
      <defs>
        <linearGradient id="pinGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E6CF95" />
          <stop offset="60%" stopColor="#B8924A" />
          <stop offset="100%" stopColor="#8C6A2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
