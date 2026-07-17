// Screenshot helper: node scripts/shot.mjs <out.png> [--url u] [--w 1440] [--h 900] [--sel "#hero"] [--wait 3500] [--full] [--scroll "#id"] [--light]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const out = args[0];
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const has = (name) => args.includes(`--${name}`);

const w = parseInt(opt("w", "1440"), 10);
const h = parseInt(opt("h", "900"), 10);
const url = opt("url", "http://localhost:3002");
const wait = parseInt(opt("wait", "3500"), 10);
const scroll = opt("scroll", null);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(url, { waitUntil: "networkidle" });
if (has("light")) {
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
}
if (scroll) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView();
  }, scroll);
}
await page.waitForTimeout(wait);
if (has("full")) {
  await page.screenshot({ path: out, fullPage: true });
} else {
  await page.screenshot({ path: out });
}
await browser.close();
console.log("wrote", out);
