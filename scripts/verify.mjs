// End-to-end checks for the definition of done. Usage: BASE_URL=http://localhost:3200 node scripts/verify.mjs
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3200";
const code = (salutation, n1, n2, env, lang) =>
  Buffer.from("1" + [salutation, [n1, n2].filter(Boolean).join("\u001e"), env, lang].join("\u001f"), "utf8").toString("base64url");
const FR = code("Chers", "Karim", "Amira", "Mme & M. Ben Salah", "fr");
const AR = code("أعزّائي", "كريم", "أميرة", "السيد والسيدة بن صالح", "ar");
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// 1. Server-rendered name (no JS): doors + card
{
  const html = await (await fetch(`${base}/i/${FR}`)).text();
  check("SSR: envelope line on the doors", html.includes("Mme &amp; M. Ben Salah"));
  check("SSR: guest names in the invitation card", html.includes("Karim &amp; Amira"));
  check("SSR: og:image points to personalized /api/og/<code>", html.includes(`/api/og/${FR}`));
  check("SSR: og:description personalized", /og:description" content="Pour Mme &amp; M. Ben Salah"/.test(html));
  const ar = await (await fetch(`${base}/i/${AR}`)).text();
  check("SSR (ar): Arabic envelope line + rtl", ar.includes("السيد والسيدة بن صالح") && ar.includes('dir="rtl"'));
  const bad = await (await fetch(`${base}/i/not-a-real-code`)).text();
  check("Invalid code: generic doors + contact note", bad.includes("À nos invités") && bad.includes("contacter la famille"));
  const root = await (await fetch(`${base}/`)).text();
  check("Root has generic OG image", root.includes("/api/og/_"));
}

// 2. OG images
for (const [label, c] of [["fr", FR], ["ar", AR], ["generic", "_"]]) {
  const r = await fetch(`${base}/api/og/${c}`);
  const buf = Buffer.from(await r.arrayBuffer());
  check(`OG image ${label}: 200 PNG 1200x630`, r.status === 200 && buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630);
}

// 3. .ics
{
  const r = await fetch(`${base}/api/ics`);
  const t = await r.text();
  check(".ics: calendar file with 19:00Z start (20:00 Tunis)", r.headers.get("content-type")?.includes("text/calendar") && t.includes("DTSTART:20261029T190000Z"));
}

const browser = await chromium.launch();
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

// 4. Hash redirect
{
  const ctx = await browser.newContext(mobile);
  const p = await ctx.newPage();
  await p.goto(`${base}/#${FR}`);
  await p.waitForURL(`**/i/${FR}`, { timeout: 8000 }).catch(() => {});
  check("/#<code> redirects to /i/<code>", p.url().endsWith(`/i/${FR}`), p.url());
  await ctx.close();
}

// 5. Doors: scroll locked, tap opens, audio starts, scroll unlocks
{
  const ctx = await browser.newContext(mobile);
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`${base}/i/${FR}`, { waitUntil: "networkidle" });
  await p.mouse.wheel(0, 1500);
  await p.touchscreen.tap(195, 700).catch(() => {});
  await p.waitForTimeout(100);
  // the tap above opened the doors; verify lock state before it using a fresh page
  const p2 = await ctx.newPage();
  await p2.goto(`${base}/i/${FR}`, { waitUntil: "networkidle" });
  await p2.mouse.wheel(0, 1500);
  await p2.evaluate(() => window.scrollTo(0, 1500));
  await p2.waitForTimeout(400);
  check("Scroll is locked while doors are closed", (await p2.evaluate(() => window.scrollY)) === 0);
  await p2.click('button[aria-label="Ouvrir l\'invitation"]');
  await p2.waitForTimeout(4500);
  check("Doors are gone after tap", (await p2.locator(".doors").count()) === 0);
  const audio = await p2.evaluate(() => {
    const a = document.querySelector("audio");
    return a ? { paused: a.paused, volume: a.volume } : null;
  });
  check("Audio starts after the tap and fades in", !!audio && !audio.paused && audio.volume > 0.3, JSON.stringify(audio));
  check("Music toggle visible", (await p2.locator(".music-toggle").count()) > 0);
  await p2.mouse.wheel(0, 1200);
  await p2.waitForTimeout(1200);
  check("Scroll unlocks after opening", (await p2.evaluate(() => window.scrollY)) > 300);
  // day → night reaches full night at the end (scroll like a user: Lenis drives the wheel)
  for (let i = 0, last = -1; i < 40; i++) {
    await p2.mouse.wheel(0, 900);
    await p2.waitForTimeout(250);
    const y = await p2.evaluate(() => window.scrollY);
    if (y === last) break;
    last = y;
  }
  await p2.waitForTimeout(1500);
  const nf = await p2.evaluate(() => parseFloat(document.querySelector("[data-invitation]").style.getPropertyValue("--nightfall")));
  check("Day→night reaches night at the closing", nf > 0.99, `--nightfall=${nf}`);
  check("Gallery hidden while photos is empty", (await p2.locator(".arch-photo").count()) === 0);
  for (const sel of ["#invitation-label", "#countdown-label", "#programme-label", "#venue", "#calendar-label", "footer"]) {
    check(`Section present: ${sel}`, (await p2.locator(sel).count()) === 1);
  }
  // language toggle → Arabic, RTL
  await p2.locator("button.lang-toggle").first().click();
  await p2.waitForTimeout(800);
  const dir = await p2.evaluate(() => [document.documentElement.dir, document.querySelector("[data-invitation]").getAttribute("dir")]);
  check("Language toggle switches to Arabic RTL", dir[0] === "rtl" && dir[1] === "rtl");
  const card = (await p2.locator(".invitation-card").innerText()).replace(/\s+/g, " ");
  check("Arabic salutation translated for FR-typed invite", card.includes("أعزّائي Karim و Amira"), card.slice(0, 40));
  check("No runtime errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 6. Reduced motion: doors fade, no particles, no split text
{
  const ctx = await browser.newContext({ ...mobile, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${base}/i/${FR}`, { waitUntil: "networkidle" });
  await p.click('button[aria-label="Ouvrir l\'invitation"]');
  await p.waitForTimeout(1500);
  check("Reduced motion: doors cleared by a fade", (await p.locator(".doors").count()) === 0);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1500);
  check("Reduced motion: no particles", (await p.locator("canvas, .gold-dust-fallback").count()) === 0);
  check("Reduced motion: text not split", (await p.locator(".split-line").count()) === 0);
  const nf = await p.evaluate(() => parseFloat(document.querySelector("[data-invitation]").style.getPropertyValue("--nightfall")));
  check("Reduced motion: day→night still applies (colour only)", nf > 0.99);
  await ctx.close();
}

// 7. Returning visitor: short doors
{
  const ctx = await browser.newContext(mobile);
  const p = await ctx.newPage();
  await p.goto(`${base}/i/${FR}`, { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.setItem("os-doors-opened", "1"));
  await p.reload({ waitUntil: "networkidle" });
  await p.click('button[aria-label="Ouvrir l\'invitation"]');
  await p.waitForTimeout(1100);
  check("Returning visitor: doors open in ~0.6s", (await p.locator(".doors").count()) === 0);
  await ctx.close();
}

// 8. Admin generator
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage();
  const res = await p.goto(`${base}/admin`);
  if (p.url().includes("/admin/login")) {
    check("Admin requires login when ADMIN_PASSWORD is set", true);
    await p.fill("#password", "wrong");
    await p.click("button");
    await p.waitForURL("**/admin/login?e=1");
    check("Admin rejects a wrong password", p.url().includes("e=1"));
    await p.fill("#password", process.env.ADMIN_PASSWORD ?? "");
    await p.click("button");
    await p.waitForURL(`${base}/admin`);
  }
  check("Admin page loads", res.ok() && p.url() === `${base}/admin`);
  await p.getByLabel("Prénom / nom 1").fill("Leïla");
  await p.getByLabel("Ligne sur les portes").fill("Mlle Leïla Trabelsi");
  await p.getByRole("button", { name: "Chère", exact: true }).click();
  const link = (await p.getByTestId("generated-link").textContent()).trim();
  check("Admin: link generated", /\/i\/[A-Za-z0-9_-]+$/.test(link), link);
  await p.getByRole("button", { name: "Copier le lien" }).click();
  check("Admin: copy puts the link on the clipboard", (await p.evaluate(() => navigator.clipboard.readText())) === link);
  const wa = await p.getByRole("link", { name: "Envoyer sur WhatsApp" }).getAttribute("href");
  check("Admin: WhatsApp share link with message + link", wa.startsWith("https://wa.me/?text=") && decodeURIComponent(wa).includes(link) && decodeURIComponent(wa).startsWith("https://wa.me/?text=Chère Leïla"));
  await p.getByRole("button", { name: "Ajouter à ma liste" }).click();
  check("Admin: saved to the list", (await p.locator("li", { hasText: "Chère Leïla" }).count()) === 1);
  const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: "Exporter en CSV" }).click()]);
  const csv = await (await import("node:fs/promises")).readFile(await dl.path(), "utf8");
  check("Admin: CSV export contains the invite", csv.includes("Leïla") && csv.includes(link));
  // the generated link really opens a personalized invitation
  const html = await (await fetch(link.replace(/^https?:\/\/[^/]+/, base))).text();
  check("Admin link renders the guest (SSR)", html.includes("Mlle Leïla Trabelsi") && html.includes("Chère"));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
