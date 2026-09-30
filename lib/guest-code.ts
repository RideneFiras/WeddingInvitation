/**
 * Stateless guest codes: the invitation details are encoded in the link itself (no database).
 *
 *   code = base64url( "1" + salutation ␟ name1 ␞ name2 ␟ envelopeLine ␟ lang )
 *
 * Works identically on the server (Node / edge) and in the browser.
 */
import type { Lang } from "@/content/types";

export type Guest = {
  salutation: string;
  names: string[]; // 1 or 2
  envelopeLine: string; // may be empty: doors then show the names
  lang: Lang;
};

const VERSION = "1";
const FIELD = "\u001f";
const NAME = "\u001e";
const MAX_FIELD = 80;
const MAX_CODE = 600;

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

const clean = (s: string) =>
  s.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_FIELD);

export function encodeGuest(g: Guest): string {
  const names = g.names.map(clean).filter(Boolean).slice(0, 2);
  const payload =
    VERSION +
    [clean(g.salutation), names.join(NAME), clean(g.envelopeLine), g.lang].join(FIELD);
  return toBase64Url(new TextEncoder().encode(payload));
}

export function decodeGuest(code: string | null | undefined): Guest | null {
  if (!code || code.length > MAX_CODE || !/^[A-Za-z0-9_-]+$/.test(code)) return null;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(fromBase64Url(code));
    if (!text.startsWith(VERSION)) return null;
    const [salutation, namesRaw, envelopeLine, lang] = text.slice(1).split(FIELD);
    if (lang !== "fr" && lang !== "ar") return null;
    const names = (namesRaw ?? "").split(NAME).map(clean).filter(Boolean).slice(0, 2);
    if (names.length === 0) return null;
    return { salutation: clean(salutation ?? ""), names, envelopeLine: clean(envelopeLine ?? ""), lang };
  } catch {
    return null;
  }
}
