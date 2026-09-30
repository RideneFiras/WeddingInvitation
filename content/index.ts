import fr from "./fr";
import ar from "./ar";
import type { Dict, Lang } from "./types";

export const dictionaries: Record<Lang, Dict> = { fr, ar };
export type { Dict, Lang };

/**
 * Salutations are typed by the admin in the invite's language.
 * When the guest switches language, translate the suggested ones; keep anything custom as-is.
 */
export function translateSalutation(salutation: string, to: Lang): string {
  const from: Lang = to === "fr" ? "ar" : "fr";
  const src = dictionaries[from].salutations;
  const dst = dictionaries[to].salutations;
  const clean = salutation.trim();
  for (const k of ["m", "f", "pl", "fpl"] as const) {
    if (src[k] === clean) return dst[k];
  }
  return clean;
}
