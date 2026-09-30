"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ScrollTrigger as ScrollTriggerT } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextT } from "gsap/SplitText";

/**
 * GSAP core loads with the page (the doors need it). The scroll plugins
 * (ScrollTrigger, SplitText, DrawSVG) load in a separate chunk during idle time,
 * because nothing uses them until the doors are open.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
  // Dev-only hook for the Playwright self-review script (slow-motion captures).
  if (process.env.NODE_ENV !== "production") (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

export const plugins = {} as { ScrollTrigger: typeof ScrollTriggerT; SplitText: typeof SplitTextT };

let loading: Promise<void> | null = null;
export function loadMotionPlugins(): Promise<void> {
  loading ??= Promise.all([import("gsap/ScrollTrigger"), import("gsap/SplitText"), import("gsap/DrawSVGPlugin")]).then(
    ([st, split, draw]) => {
      gsap.registerPlugin(st.ScrollTrigger, split.SplitText, draw.DrawSVGPlugin);
      plugins.ScrollTrigger = st.ScrollTrigger;
      plugins.SplitText = split.SplitText;
    },
  );
  return loading;
}

export { gsap, useGSAP };
