"use client";

import { createContext, useContext, type RefObject } from "react";
import { useGSAP } from "./gsap";
import { prefersReducedMotion } from "./motion";

/** True once the doors are open. Scroll animations are only built after that. */
export const MotionReadyContext = createContext(false);

function idle(cb: () => void): number {
  if (typeof window.requestIdleCallback === "function") return window.requestIdleCallback(cb, { timeout: 600 });
  return window.setTimeout(cb, 16);
}
function cancelIdle(id: number) {
  if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
  else window.clearTimeout(id);
}

/**
 * Builds a section's scroll animations after the doors open, in an idle callback,
 * so ScrollTrigger / SplitText measurements never compete with first load or the door animation.
 * Everything created inside `setup` is reverted on unmount (gsap context).
 */
export function useScrollMotion(
  scope: RefObject<HTMLElement | null>,
  setup: () => void,
  { reducedToo = false }: { reducedToo?: boolean } = {},
) {
  const ready = useContext(MotionReadyContext);
  useGSAP(
    (_ctx, contextSafe) => {
      if (!ready || (!reducedToo && prefersReducedMotion())) return;
      const run = contextSafe!(setup);
      const id = idle(run);
      return () => cancelIdle(id);
    },
    { scope, dependencies: [ready] },
  );
}
