"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { dur, ease, prefersReducedMotion } from "@/lib/motion";
import type { Dict } from "@/content/types";
import { DoorDefs, DoorFrame, DOOR_W, DOOR_H, FRAME_PAD } from "../ornaments/DoorPair";
import { WaxSealSvg, sealHalfLeft, sealHalfRight } from "../ornaments/WaxSeal";
import { ArchOutline, JasmineSprig } from "../ornaments/Ornaments";

type Props = {
  dict: Dict;
  /** The formal line on the doors ("Mme & M. Ben Salah"); null → generic "À nos invités". */
  addressee: string | null;
  returning: boolean;
  /** Called synchronously inside the tap (user gesture: audio may start here). */
  onOpenStart: () => void;
  /** Called when the doors have fully cleared the screen. */
  onOpened: () => void;
};

const CHIPS = 14;

export default function Doors({ dict, addressee, returning, onOpenStart, onOpened }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const opening = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // A very gentle breathing pulse on the seal
      gsap.to(".seal-breathe", {
        scale: 1.035,
        duration: 2.4,
        ease: ease.soft,
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".seam-light", { opacity: 0.85, duration: 2.4, ease: ease.soft, repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  // Plain handler: the doors unmount once open, so nothing needs reverting.
  const open = () => {
    if (opening.current) return;
    opening.current = true;
    onOpenStart();

    const q = gsap.utils.selector(root);
    gsap.killTweensOf([q(".seal-breathe"), q(".seam-light")]);

    if (prefersReducedMotion()) {
      gsap.to(root.current, { opacity: 0, duration: 0.6, ease: "none", onComplete: onOpened });
      return;
    }

    const tl = gsap.timeline({ onComplete: onOpened });
    tl.to(q(".door-caption, .door-address"), { opacity: 0, y: -6, duration: 0.4, ease: ease.reveal }, 0)
      // the seal cracks
      .to(q(".seal-half-l"), { xPercent: -34, y: 18, rotation: -22, opacity: 0, duration: 1.0, ease: ease.reveal }, 0.05)
      .to(q(".seal-half-r"), { xPercent: 34, y: 22, rotation: 20, opacity: 0, duration: 1.0, ease: ease.reveal }, 0.05)
      .fromTo(
        q(".seal-chip"),
        { opacity: 1, x: 0, y: 0, scale: 1 },
        {
          opacity: 0,
          x: (i) => Math.cos((i / CHIPS) * Math.PI * 2 + 0.4) * gsap.utils.random(36, 70),
          y: (i) => Math.sin((i / CHIPS) * Math.PI * 2 + 0.4) * gsap.utils.random(30, 60) + 26,
          rotation: () => gsap.utils.random(-120, 120),
          scale: 0.4,
          duration: 1.1,
          ease: ease.reveal,
          stagger: 0.01,
        },
        0.05,
      )
      // light gathers behind the seam
      .to(q(".seam-light"), { opacity: 1, scaleX: 3, duration: 0.5, ease: ease.reveal }, 0.1)
      // the doors swing inward on their hinges
      .to(q(".leaf-l"), { rotateY: 104, duration: dur.doors, ease: ease.big }, 0.35)
      .to(q(".leaf-r"), { rotateY: -104, duration: dur.doors, ease: ease.big }, 0.35)
      .to(q(".leaf-shade"), { opacity: 0.55, duration: dur.doors, ease: ease.big }, 0.35)
      .fromTo(q(".door-glow"), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.25, duration: dur.doors, ease: ease.big }, 0.35)
      // warm light floods the screen, then we step through
      .to(q(".door-flood"), { opacity: 1, duration: 0.7, ease: "power2.in" }, 1.15)
      .to(q(".door-stage"), { scale: 1.18, duration: 1.2, ease: "power2.in" }, 0.9)
      .set(q(".door-stage"), { opacity: 0 }, 1.85)
      .to(root.current, { opacity: 0, duration: 0.8, ease: "power2.out" }, 1.85);

    if (returning) tl.timeScale(tl.duration() / dur.doorsReturning);
  };

  const frameW = DOOR_W + FRAME_PAD.x * 2;
  const frameH = DOOR_H + FRAME_PAD.top + FRAME_PAD.bottom;

  return (
    <div
      ref={root}
      className="doors fixed inset-0 z-50 flex flex-col items-center overflow-hidden bg-ivory"
      style={{ touchAction: "none", overscrollBehavior: "none" }}
    >
      <DoorDefs />

      {/* the wall: a faint arcade on wider screens */}
      <div className="door-stage relative flex h-full w-full flex-col items-center justify-center">
        <div className="door-address relative z-10 mb-[clamp(18px,3.2svh,34px)] flex flex-col items-center px-6 text-center">
          <JasmineSprig className="mb-3 h-7 w-auto text-gold" />
          {addressee ? (
            <>
              <p className="caps text-gold-deep">{dict.doors.attention}</p>
              <p
                className="door-name mt-1 font-display text-[clamp(1.7rem,7.4vw,2.6rem)] leading-[1.15] italic text-ink"
                style={{ fontWeight: 400 }}
              >
                {addressee}
              </p>
            </>
          ) : (
            <p
              className="door-name font-display text-[clamp(1.7rem,7.4vw,2.6rem)] leading-[1.15] italic text-ink"
              style={{ fontWeight: 400 }}
            >
              {dict.doors.generic}
            </p>
          )}
        </div>

        <div
          className="doorway-wrap relative mt-[clamp(8px,2svh,24px)]"
          style={{
            perspective: "1100px",
            height: `min(70svh, calc((100vw - 92px) * ${DOOR_H / DOOR_W}))`,
            aspectRatio: `${DOOR_W} / ${DOOR_H}`,
          }}
        >
          {/* the wall: an arcade of white arches receding on each side (wide screens) */}
          {(["l", "r"] as const).map((side) => (
            <div
              key={`arcade-${side}`}
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-0 hidden h-[84%] gap-[2.2vw] md:flex ${
                side === "l" ? "right-[calc(100%+min(10vw,120px))] flex-row-reverse" : "left-[calc(100%+min(10vw,120px))]"
              }`}
            >
              {[0.55, 0.36, 0.2, 0.1].map((o, i) => (
                <ArchOutline key={i} className="h-full w-auto text-gold" style={{ opacity: o }} preserveAspectRatio="xMidYMax meet" />
              ))}
            </div>
          ))}
          <span aria-hidden="true" className="hairline pointer-events-none absolute -bottom-[1px] left-1/2 hidden w-[96vw] -translate-x-1/2 opacity-60 md:block" />

          {/* carved surround */}
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${(-FRAME_PAD.x / DOOR_W) * 100}%`,
              top: `${(-FRAME_PAD.top / DOOR_H) * 100}%`,
              width: `${(frameW / DOOR_W) * 100}%`,
              height: `${(frameH / DOOR_H) * 100}%`,
            }}
          >
            <DoorFrame />
          </div>

          {/* what's behind the doors: warm light */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: "50% 50% 0 0 / 25.86% 25.86% 0 0" }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #E6CF95 0%, #FFFDF7 60%, #F7F1E6 100%)" }} />
            <div
              className="door-glow absolute inset-[-30%] opacity-0"
              style={{ background: "radial-gradient(closest-side, #FFFDF7 0%, rgba(255,253,247,0.9) 35%, rgba(230,207,149,0.6) 70%, transparent 100%)" }}
            />
          </div>

          {/* leaves */}
          {(["l", "r"] as const).map((side) => (
            <div
              key={side}
              className={`leaf leaf-${side} absolute top-0 h-full w-1/2 overflow-hidden`}
              style={{
                [side === "l" ? "left" : "right"]: 0,
                transformOrigin: side === "l" ? "left center" : "right center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                willChange: "transform",
                borderTopLeftRadius: side === "l" ? "100% 25.86%" : 0,
                borderTopRightRadius: side === "r" ? "100% 25.86%" : 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, shown half per leaf */}
              <img
                src="/doors.svg"
                alt=""
                width={DOOR_W * 2}
                height={DOOR_H}
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="absolute top-0 h-full max-w-none select-none"
                style={{ width: "200%", [side === "l" ? "left" : "right"]: 0 }}
              />
              <div className="leaf-shade pointer-events-none absolute inset-0 bg-ink opacity-0" />
            </div>
          ))}

          {/* light leaking through the seam */}
          <div
            className="seam-light pointer-events-none absolute left-1/2 top-[3%] h-[96%] w-[3px] -translate-x-1/2 opacity-40"
            style={{ background: "linear-gradient(180deg, transparent, #FFFDF7 20%, #E6CF95 60%, transparent)", filter: "blur(1.5px)" }}
          />

          {/* the seal, on the seam at lock height */}
          <div className="absolute left-1/2 top-[50%] w-[31%] -translate-x-1/2 -translate-y-1/2">
            <div className="seal-breathe relative aspect-square">
              <div className="seal-half-l absolute inset-0" style={{ clipPath: sealHalfLeft }}>
                <WaxSealSvg idPrefix="sl" />
              </div>
              <div className="seal-half-r absolute inset-0" style={{ clipPath: sealHalfRight }}>
                <WaxSealSvg idPrefix="sr" />
              </div>
              {Array.from({ length: CHIPS }, (_, i) => (
                <span
                  key={i}
                  className="seal-chip pointer-events-none absolute left-1/2 top-1/2 block opacity-0"
                  style={{
                    width: i % 3 === 0 ? 5 : 3,
                    height: i % 3 === 0 ? 4 : 3,
                    borderRadius: "40% 60% 50% 45%",
                    background: i % 4 === 0 ? "#E6CF95" : "#8A2424",
                  }}
                />
              ))}
            </div>
            <p className="door-caption absolute left-1/2 top-full mt-3 w-max -translate-x-1/2 rounded-full px-3 py-0.5 font-body text-[0.95rem] tracking-[0.08em] text-ink" style={{ background: "radial-gradient(closest-side, #EFE6D4 70%, rgba(239,230,212,0))" }}>
              {dict.doors.caption}
            </p>
          </div>

          {/* the whole doorway is the tap target (easy for everyone) */}
          <button
            type="button"
            onClick={open}
            aria-label={dict.doors.open}
            className="doors-open-btn absolute inset-0 z-10 cursor-pointer"
            style={{ borderRadius: "50% 50% 0 0 / 25.86% 25.86% 0 0" }}
          />
        </div>
      </div>

      <div
        className="door-flood pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "radial-gradient(90% 70% at 50% 55%, #FFFDF7 0%, #F7F1E6 70%)" }}
      />
    </div>
  );
}
