"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { dur, ease, revealTrigger } from "@/lib/motion";
import { useScrollMotion } from "@/lib/scroll-motion";
import { useReveal } from "@/lib/reveal";
import type { Dict } from "@/content/types";
import { googleCalendarUrl } from "@/lib/calendar";
import { slug } from "@/lib/wedding";
import { JasmineSprig } from "../ornaments/Ornaments";

/** "Réservez la date": .ics download + Google Calendar. (RSVP was removed at the couple's request.) */
export default function Calendar({ dict }: { dict: Dict }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useScrollMotion(
    root,
    () => {
      // A gold line draws the sprig: this section's one moment.
      gsap.from(".cal-sprig path, .cal-sprig circle", {
        drawSVG: "0%",
        duration: dur.revealLong,
        ease: ease.reveal,
        stagger: 0.04,
        scrollTrigger: { trigger: ".cal-sprig", ...revealTrigger },
      });
    },
  );

  const c = dict.calendar;
  return (
    <section ref={root} className="relative px-5 py-24 sm:py-32" aria-labelledby="calendar-label">
      <div className="mx-auto flex max-w-[22rem] flex-col items-center text-center">
        <JasmineSprig className="cal-sprig h-12 w-auto text-gold-light" leaf="var(--sage)" />
        <p id="calendar-label" data-reveal="fade" className="caps mt-6 text-gold-light">
          {c.label}
        </p>
        <p data-reveal="lines" className="mt-3 font-display text-[1.6rem] leading-snug text-jasmine">
          {dict.invitation.dateLine}
        </p>
        <div data-reveal="fade" className="mt-8 flex w-full flex-col gap-3">
          <a className="venue-btn" href={`/api/ics?lang=${dict.lang}`} download={`${slug}.ics`}>
            {c.ics}
          </a>
          <a className="venue-btn" href={googleCalendarUrl(dict)} target="_blank" rel="noopener noreferrer">
            {c.google}
          </a>
        </div>
      </div>
    </section>
  );
}
