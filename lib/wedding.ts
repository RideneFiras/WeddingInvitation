/**
 * Values derived from site.config.ts that the copy (content/fr.ts, content/ar.ts) and a few
 * components need: the couple's names joined, the date split into parts, a URL-safe slug.
 * Deterministic (no Intl) so server and browser always render identical text.
 */
import { siteConfig } from "@/site.config";

const { latin, arabic } = siteConfig.couple;

export const coupleFr = `${latin.first} & ${latin.second}`;
export const coupleAr = `${arabic.first} و ${arabic.second}`;

/** French elision: "d'Inès", "de Karim". */
export function deFr(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöùûü]/i.test(name) ? `d'${name}` : `de ${name}`;
}
/** "d'Inès & Karim" */
export const ofCoupleFr = `${deFr(latin.first)} & ${latin.second}`;

const [y, m, d] = siteConfig.date.iso.split("-").map(Number);
export const dateParts = {
  day: d,
  /** 0–11 */
  monthIndex: m - 1,
  year: y,
  /** 0 = Sunday. The calendar date is timezone-independent. */
  weekdayIndex: new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay(),
};

/** "ines-karim" — used for file names and calendar ids. */
export const slug = `${latin.first}-${latin.second}`
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "") // strip accents
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
