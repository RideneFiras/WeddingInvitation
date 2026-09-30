/** Shared motion tokens (brief §5.3). Every animation on the public site pulls from here. */
export const ease = {
  reveal: "power3.out",
  big: "expo.inOut",
  soft: "sine.inOut",
  write: "power2.inOut",
} as const;

export const dur = {
  micro: 0.3,
  reveal: 1.1,
  revealLong: 1.6,
  doors: 1.4,
  doorsReturning: 0.6,
} as const;

export const stagger = {
  chars: 0.03,
  lines: 0.08,
} as const;

/** Scroll reveals fire once when the element's top reaches 80% of the viewport. */
export const revealTrigger = { start: "top 80%", once: true } as const;

export const lenisOptions = { lerp: 0.08 } as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
