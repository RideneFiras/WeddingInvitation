// Self-review screenshots (brief §13). Usage:
//   node scripts/shoot.mjs <path> <outPrefix> [--open] [--mid] [--scroll=0,0.25,...] [--reduced] [--lang=ar]
import { chromium } from "playwright";

const [, , path = "/", prefix = "shot", ...flags] = process.argv;
const base = process.env.BASE_URL ?? "http://localhost:3100";
const has = (f) => flags.includes(f);
const scrollArg = flags.find((f) => f.startsWith("--scroll="));
const scrolls = scrollArg ? scrollArg.slice(9).split(",").map(Number) : [];
const outDir = process.env.OUT ?? "/tmp/claude-1000/shots";
const sizes = (process.env.SIZES ?? "390x844,1440x900").split(",");

const browser = await chromium.launch();
for (const size of sizes) {
  const [width, height] = size.split("x").map(Number);
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: width < 800 ? 2 : 1,
    reducedMotion: has("--reduced") ? "reduce" : "no-preference",
    hasTouch: width < 800,
    isMobile: width < 800,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  page.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text()));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const tag = `${prefix}-${width}`;
  await page.screenshot({ path: `${outDir}/${tag}-0doors.png` });
  if (has("--open") || has("--mid") || scrolls.length) {
    const slow = has("--mid") ? 0.15 : 1;
    await page.evaluate((k) => void window.gsap?.globalTimeline.timeScale(k), slow);
    await page.click('button[aria-label]', { position: undefined });
    if (has("--mid")) {
      let prev = 0;
      for (const t of [350, 800, 1300, 1900]) {
        await page.waitForTimeout((t - prev) / 0.15);
        prev = t;
        await page.screenshot({ path: `${outDir}/${tag}-1mid${t}.png` });
      }
    }
    await page.evaluate(() => void window.gsap?.globalTimeline.timeScale(1));
    await page.waitForTimeout(4200);
    if (has("--lang=ar")) {
      await page.click("button.lang-toggle");
      await page.waitForTimeout(800);
    }
    await page.screenshot({ path: `${outDir}/${tag}-2hero.png` });
    for (const s of scrolls) {
      await page.evaluate((f) => {
        const y = f <= 1 ? f * (document.documentElement.scrollHeight - innerHeight) : f;
        window.scrollTo(0, y);
      }, s);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `${outDir}/${tag}-3s${s}.png` });
    }
  }
  await ctx.close();
}
await browser.close();
console.log("done");
