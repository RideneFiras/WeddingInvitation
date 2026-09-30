import { chromium } from "playwright";
const [,, path, tag, lang] = process.argv;
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p = await c.newPage();
p.on("pageerror", (e) => console.log("E", e.message));
await p.goto("http://localhost:3200" + path, { waitUntil: "networkidle" });
await p.screenshot({ path: `${process.env.OUT ?? "/tmp/claude-1000/shots"}/${tag}-00.png` });
await p.click(".doors-open-btn");
await p.waitForTimeout(4200);
if (lang === "ar") { await p.locator("button.lang-toggle").first().click(); await p.waitForTimeout(800); }
let i = 1;
await p.screenshot({ path: `${process.env.OUT ?? "/tmp/claude-1000/shots"}/${tag}-0${i++}.png` });
for (let k = 0; k < 40; k++) {
  const before = await p.evaluate(() => scrollY);
  for (let j = 0; j < 3; j++) { await p.mouse.wheel(0, 230); await p.waitForTimeout(90); }
  await p.waitForTimeout(1300);
  const after = await p.evaluate(() => scrollY);
  await p.screenshot({ path: `${process.env.OUT ?? "/tmp/claude-1000/shots"}/${tag}-${String(i++).padStart(2, "0")}.png` });
  if (after === before) break;
}
console.log("frames", i);
await b.close();
