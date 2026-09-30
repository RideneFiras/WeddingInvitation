/**
 * Optional protection for /admin: if ADMIN_PASSWORD is set, the generator requires it.
 * The cookie holds an HMAC of a fixed message keyed by the password (never the password itself).
 * Web Crypto only, so it runs in both the proxy and server actions.
 */
export const ADMIN_COOKIE = "os_admin";

export async function adminToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("omar-saousen-admin-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function adminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length > 0 ? p : null;
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
