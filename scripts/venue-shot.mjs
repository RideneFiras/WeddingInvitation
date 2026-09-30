import { chromium } from "playwright";
const b = await chromium.launch();
const w = +(process.env.W ?? 390), h = +(process.env.H ?? 844);
const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const p = await c.newPage();
p.on("pageerror", (e) => console.log("E", e.message));
await p.goto("http://localhost:3100" + (process.env.P ?? "/i/MUNoZXJzH0thcmltHkFtaXJhH01tZSAmIE0uIEJlbiBTYWxhaB9mcg"), { waitUntil: "networkidle" });
await p.click("button[aria-label]");
await p.waitForTimeout(3500);
const top = await p.evaluate(() => document.querySelector("#venue").getBoundingClientRect().top + scrollY);
const hgt = await p.evaluate(() => document.querySelector("#venue").offsetHeight);
console.log("venue", top, hgt, "doc", await p.evaluate(() => document.documentElement.scrollHeight));
const steps = (process.env.STEPS ?? "-0.6,-0.3,0,0.25,0.5,0.75,1").split(",").map(Number);
for (const [i, f] of steps.entries()) {
  await p.evaluate((y) => window.scrollTo(0, y), top + f * hgt - h * 0.3);
  await p.waitForTimeout(1500);
  const nf = await p.evaluate(() => document.querySelector("[data-invitation]").style.getPropertyValue("--nightfall"));
  console.log(i, f, "nightfall", nf);
  await p.screenshot({ path: `/tmp/claude-1000/shots/venue-${w}-${i}.png` });
}
await b.close();
