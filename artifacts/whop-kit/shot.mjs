import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(dir, "render.html");
const out = path.join(dir, "export");

const clips = [
  ["cover-monthly", "cover-168-yueka.png"],
  ["cover-halfyear", "cover-688-bannian.png"],
  ["cover-yearly", "cover-888-nianka.png"],
  ["cover-lifetime", "cover-999-zhongshen.png"],
  ["thumb-monthly", "thumb-168.png"],
  ["thumb-halfyear", "thumb-688.png"],
  ["thumb-yearly", "thumb-888.png"],
  ["thumb-lifetime", "thumb-999.png"],
  ["table-offer", "tableau-offres.png"],
  ["table-week", "tableau-quotidien.png"],
];

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: 1800, height: 2400 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${html}`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const fs = await import("node:fs");
fs.mkdirSync(out, { recursive: true });

for (const [id, name] of clips) {
  const el = page.locator(`#${id}`);
  await el.screenshot({ path: path.join(out, name), type: "png" });
  console.log("ok", name);
}

await browser.close();
