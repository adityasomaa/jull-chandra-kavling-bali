// Audit otomatis: node scripts/audit-site.mjs <baseUrl>
// Butuh Playwright (npx playwright install chromium). Tidak dipasang sebagai dependency proyek.
// Mengecek: status 200, gambar rusak, request gagal, error konsol, overflow horizontal (375/768/1440),
// batas baris heading per viewport, reveal di dalam wadah overflow-hidden, dan menu hamburger.
import { chromium } from "playwright";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const ROUTES = [
  "/",
  "/kavling",
  "/kavling/sawangan-nusa-dua",
  "/kavling/sidakarya-denpasar",
  "/kavling/klusa-bresela-ubud",
  "/kavling/lumintang-denpasar",
  "/kavling/pejeng-gianyar",
  "/kalkulator",
  "/kontak",
  "/kebijakan-privasi",
  "/syarat-ketentuan",
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
  "/icon.svg",
  "/manifest.webmanifest",
  "/photos/hero-16x9.jpg",
];
const PAGES = ROUTES.filter((r) => !/\.(xml|txt|svg|webmanifest|jpg)$|opengraph/.test(r));
const VIEWPORTS = [
  { w: 375, h: 812, maxLines: 3 },
  { w: 768, h: 1024, maxLines: 2 },
  { w: 1440, h: 900, maxLines: 1 },
];
const BANNED = [/investasi emas/i, /high roi/i, /termurah/i, /unit terbatas/i, /bintang lima/i, /terbaik/i, /nomor satu/i, /jualtanahkavlingbali/i, /—|–/];

const problems = [];
const warn = [];
const note = (list, msg) => list.push(msg);

const browser = await chromium.launch();

// 1. Status semua route
for (const r of ROUTES) {
  const res = await fetch(base + r, { redirect: "manual" });
  if (res.status !== 200) note(problems, `status ${res.status} ${r}`);
}
const missing = await fetch(base + "/halaman-tidak-ada");
if (missing.status !== 404) note(problems, `404 page returned ${missing.status}`);

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: vp.w < 1024 });
  for (const route of PAGES) {
    const page = await context.newPage();
    const tag = `[${vp.w}] ${route}`;
    page.on("console", (m) => {
      if (m.type() === "error") note(problems, `${tag} console error: ${m.text().slice(0, 200)}`);
    });
    page.on("pageerror", (e) => note(problems, `${tag} page error: ${e.message.slice(0, 200)}`));
    page.on("requestfailed", (req) => {
      const f = req.failure()?.errorText ?? "";
      if (!/ERR_ABORTED/.test(f)) note(problems, `${tag} request failed: ${req.url()} ${f}`);
    });
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("halaman-tidak-ada")) note(problems, `${tag} HTTP ${res.status()} ${res.url()}`);
    });

    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    // Gulir penuh agar semua reveal dan gambar termuat.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += Math.round(vp.h * 0.7)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(900);

    const report = await page.evaluate((maxLines) => {
      const out = { overflow: [], images: [], headings: [], clipped: [], badRatio: [], text: document.body.innerText };
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1) out.overflow.push(`document scrollWidth ${document.documentElement.scrollWidth} > ${vw}`);
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 || r.left < -1) {
          // Abaikan elemen yang sengaja dipotong oleh ancestor overflow (karusel, cover-art).
          let p = el.parentElement;
          let clippedByAncestor = false;
          while (p && p !== document.body) {
            const pcs = getComputedStyle(p);
            if (/(hidden|clip|auto|scroll)/.test(pcs.overflowX)) {
              const pr = p.getBoundingClientRect();
              if (pr.right <= vw + 1 && pr.left >= -1) {
                clippedByAncestor = true;
                break;
              }
            }
            p = p.parentElement;
          }
          if (!clippedByAncestor) out.overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
        }
      }
      for (const img of document.images) {
        if (img.complete && img.naturalWidth === 0) out.images.push(img.currentSrc || img.src);
        const wrap = img.closest(".art");
        const ratio = wrap?.getAttribute("data-ratio");
        if (!ratio) out.badRatio.push(img.currentSrc || img.src);
        else {
          const r = wrap.getBoundingClientRect();
          const expected = ratio === "16/9" ? 16 / 9 : 1;
          if (r.height > 0 && Math.abs(r.width / r.height - expected) > 0.02) out.badRatio.push(`${img.src} ${r.width}x${r.height}`);
        }
      }
      for (const h of document.querySelectorAll("h1, h2")) {
        const cs = getComputedStyle(h);
        if (h.getClientRects().length === 0) continue;
        const r = h.getBoundingClientRect();
        if (r.height === 0) continue;
        const lh = parseFloat(cs.lineHeight);
        const lines = Math.round(r.height / lh);
        out.headings.push({ text: (h.getAttribute("aria-label") || h.textContent).trim().slice(0, 60), lines });
      }
      for (const el of document.querySelectorAll("[data-reveal], [data-split]")) {
        let p = el.parentElement;
        while (p && p !== document.body) {
          const pcs = getComputedStyle(p);
          if (pcs.overflow === "hidden" || pcs.overflowY === "hidden") {
            out.clipped.push(`${el.tagName.toLowerCase()} inside ${p.tagName.toLowerCase()}.${String(p.className).slice(0, 40)}`);
            break;
          }
          p = p.parentElement;
        }
      }
      const unshown = [...document.querySelectorAll("[data-reveal][data-shown='false'], [data-split][data-shown='false']")].filter(
        (e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).display !== "none"
      );
      out.unshown = unshown.length;
      return out;
    }, vp.maxLines);

    report.overflow.forEach((o) => note(problems, `${tag} overflow: ${o}`));
    report.images.forEach((i) => note(problems, `${tag} broken image: ${i}`));
    report.badRatio.forEach((i) => note(problems, `${tag} image ratio not locked: ${i}`));
    report.clipped.forEach((c) => note(problems, `${tag} reveal inside overflow-hidden: ${c}`));
    if (report.unshown) note(warn, `${tag} ${report.unshown} reveal element(s) never shown`);
    for (const h of report.headings) {
      if (h.lines > 3) note(problems, `${tag} heading ${h.lines} lines: ${h.text}`);
      else if (h.lines > vp.maxLines) note(vp.w === 1440 ? warn : problems, `${tag} heading ${h.lines} lines (limit ${vp.maxLines}): ${h.text}`);
    }
    for (const re of BANNED) if (re.test(report.text)) note(problems, `${tag} banned phrase ${re}`);

    // Hamburger di mobile/tablet
    if (vp.w < 1024 && route === "/") {
      const btn = page.getByRole("button", { name: "Buka menu" });
      await btn.click();
      await page.waitForTimeout(500);
      const visible = await page.locator("#mobile-menu").isVisible();
      if (!visible) note(problems, `${tag} hamburger did not open menu`);
      const cookieOverMenu = await page.evaluate(() => {
        const c = document.querySelector(".cookie-layer");
        return c ? getComputedStyle(c).display !== "none" : false;
      });
      if (cookieOverMenu) note(problems, `${tag} cookie banner visible above mobile menu`);
      await page.getByRole("button", { name: "Tutup menu" }).click();
      await page.waitForTimeout(400);
      if (await page.locator("#mobile-menu").isVisible()) note(problems, `${tag} hamburger did not close menu`);
    }

    // Tombol WhatsApp melayang tidak boleh menutupi elemen interaktif terakhir
    if (vp.w < 768) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(500);
      const covered = await page.evaluate(() => {
        const fab = document.querySelector(".fab-layer a")?.getBoundingClientRect();
        if (!fab) return null;
        const items = [...document.querySelectorAll("footer a, footer button")].filter((e) => e.getBoundingClientRect().height > 0);
        const last = items[items.length - 1]?.getBoundingClientRect();
        if (!last) return null;
        const overlap = !(last.right < fab.left || last.left > fab.right || last.bottom < fab.top || last.top > fab.bottom);
        return overlap;
      });
      if (covered) note(problems, `${tag} floating WhatsApp button covers last footer control`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(`\nAudit ${base}`);
console.log(`Problems: ${problems.length}`);
problems.forEach((p) => console.log("  x " + p));
console.log(`Warnings: ${warn.length}`);
warn.forEach((p) => console.log("  ! " + p));
process.exit(problems.length ? 1 : 0);
