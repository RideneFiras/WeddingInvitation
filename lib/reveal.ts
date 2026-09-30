"use client";

import type { RefObject } from "react";
import { gsap, plugins } from "./gsap";
import { dur, ease, revealTrigger, stagger } from "./motion";
import { useScrollMotion } from "./scroll-motion";

/**
 * Standard scroll reveals inside a section:
 *  - [data-reveal="lines"]  SplitText lines, masked, sliding up from 100%
 *  - [data-reveal="fade"]   fade + small rise
 * Reduced motion: everything is simply visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useScrollMotion(
    scope,
    () => {
      const root = scope.current;
      if (!root) return;

      root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        plugins.SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: dur.reveal,
              ease: ease.reveal,
              stagger: stagger.lines,
              scrollTrigger: { trigger: el, ...revealTrigger },
            });
          },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: dur.reveal,
          ease: ease.reveal,
          scrollTrigger: { trigger: el, ...revealTrigger },
        });
      });
    },
  );
}
