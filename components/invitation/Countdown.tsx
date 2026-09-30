"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/reveal";
import type { Dict } from "@/content/types";
import { weddingStart } from "@/site.config";

type Parts = { days: number; hours: number; minutes: number; seconds: number };
const UNITS = ["days", "hours", "minutes", "seconds"] as const;

function partsUntil(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** One digit in a window: each new value rolls up into place (keyed remount + CSS). */
function RollingDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.05em] w-[0.56em] overflow-hidden align-top">
      <span key={value} className="digit-roll absolute inset-0 text-center">
        {value}
      </span>
    </span>
  );
}

function label(dict: Dict, unit: (typeof UNITS)[number], n: number) {
  const c = dict.countdown;
  if (n === 1) return c.unitsOne[unit];
  if (c.unitsFew && n >= 3 && n <= 10) return c.unitsFew[unit];
  return c.units[unit];
}

export default function Countdown({ dict }: { dict: Dict }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const target = weddingStart().getTime();
  // Rendered on the client only: server and client clocks would disagree.
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setParts(partsUntil(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const c = dict.countdown;

  return (
    <section ref={root} className="relative px-5 py-20 sm:py-28" aria-labelledby="countdown-label">
      <div className="mx-auto max-w-[40rem]">
        <p id="countdown-label" data-reveal="fade" className="caps text-center text-gold-deep">
          {c.label}
        </p>

        {parts === null ? (
          <p data-reveal="fade" className="mt-8 text-center font-display text-[2rem] italic leading-tight text-ink">
            {c.after}
          </p>
        ) : (
          <div data-reveal="fade" className="mt-8">
            <p className="text-center font-display text-[1.35rem] italic text-ink/80">{c.lead}</p>
            <div className="mt-4 grid grid-cols-4" role="timer" aria-live="off">
              {UNITS.map((u, i) => {
                const n = parts?.[u];
                const digits = n === undefined ? "––" : String(n).padStart(u === "days" && n > 99 ? 3 : 2, "0");
                return (
                  <div
                    key={u}
                    className={`flex flex-col items-center ${i > 0 ? "border-s border-gold/35" : ""}`}
                  >
                    <span
                      className="lining font-display text-[clamp(2.6rem,12vw,4.2rem)] leading-none font-light text-ink"
                      dir="ltr"
                    >
                      {digits.split("").map((d, k) => (
                        <RollingDigit key={`${digits.length}-${k}`} value={d} />
                      ))}
                    </span>
                    <span className="caps mt-3 text-[0.78rem] !tracking-[0.1em] text-gold-deep">
                      {n === undefined ? c.units[u] : label(dict, u, n)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
