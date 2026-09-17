// Generator ilustrasi SVG deterministik. Seed yang sama selalu menghasilkan gambar yang sama.
// Bahasa bentuk: garis kontur tanah, petak kavling, dan cakrawala bukit. Tanpa noise/grain.
// Jalankan: npm run art
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/art/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const THEMES = {
  day: {
    skyTop: "#eef2ef",
    skyBottom: "#e3e9e4",
    ridges: ["#d9e2dc", "#cdd9d2", "#c0cfc7", "#b3c6bc"],
    ground: "#e6ece8",
    contour: "#0a6b5b",
    contourOpacity: 0.34,
    lot: "#0c2b2a",
    lotFill: "#f7f9f8",
    highlight: "#0a6b5b",
    road: "#c3cfca",
    ring: "#0a6b5b",
  },
  night: {
    skyTop: "#0b2221",
    skyBottom: "#10302d",
    ridges: ["#133431", "#163b37", "#19423e", "#1d4a45"],
    ground: "#0e2826",
    contour: "#7fd8c1",
    contourOpacity: 0.26,
    lot: "#a7bfb9",
    lotFill: "#12302e",
    highlight: "#7fd8c1",
    road: "#2a4a47",
    ring: "#7fd8c1",
  },
};

function hashSeed(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return h1 >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

// Marching squares -> segmen, lalu disambung menjadi polyline agar file ringkas.
function contours(field, cols, rows, cellW, cellH, level, offsetY) {
  const segs = [];
  const at = (i, j) => field[j * (cols + 1) + i];
  const lerp = (a, b) => (level - a) / (b - a || 1e-9);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const tl = at(i, j), tr = at(i + 1, j), br = at(i + 1, j + 1), bl = at(i, j + 1);
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cellW, y = j * cellH + offsetY;
      const T = [x + cellW * lerp(tl, tr), y];
      const R = [x + cellW, y + cellH * lerp(tr, br)];
      const B = [x + cellW * lerp(bl, br), y + cellH];
      const L = [x, y + cellH * lerp(tl, bl)];
      const table = {
        1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[T, R]], 5: [[L, T], [B, R]], 6: [[T, B]], 7: [[L, T]],
        8: [[L, T]], 9: [[T, B]], 10: [[T, R], [L, B]], 11: [[T, R]], 12: [[L, R]], 13: [[B, R]], 14: [[L, B]],
      };
      for (const s of table[idx]) segs.push(s);
    }
  }
  // sambungkan segmen
  const key = (p) => `${Math.round(p[0] * 4)},${Math.round(p[1] * 4)}`;
  const byPoint = new Map();
  segs.forEach((s, n) => {
    for (const p of s) {
      const k = key(p);
      if (!byPoint.has(k)) byPoint.set(k, []);
      byPoint.get(k).push(n);
    }
  });
  const used = new Uint8Array(segs.length);
  const lines = [];
  for (let n = 0; n < segs.length; n++) {
    if (used[n]) continue;
    used[n] = 1;
    const line = [segs[n][0], segs[n][1]];
    for (const dir of [1, -1]) {
      for (;;) {
        const end = dir === 1 ? line[line.length - 1] : line[0];
        const next = (byPoint.get(key(end)) || []).find((m) => !used[m]);
        if (next === undefined) break;
        used[next] = 1;
        const [a, b] = segs[next];
        const other = key(a) === key(end) ? b : a;
        if (dir === 1) line.push(other);
        else line.unshift(other);
      }
    }
    lines.push(line);
  }
  return lines
    .filter((l) => l.length > 3)
    .map((l) => `M${l.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}`)
    .join("");
}

function art({ seed, theme: themeName, w, h, plots = true, density = 1 }) {
  const t = THEMES[themeName];
  const rand = mulberry32(hashSeed(seed));
  const rr = (a, b) => a + rand() * (b - a);
  const ri = (a, b) => Math.floor(rr(a, b + 1));

  const square = Math.abs(w - h) < 1;
  const horizonBase = h * (square ? rr(0.26, 0.34) : rr(0.3, 0.38));

  // Cakrawala bukit berlapis
  const ridgeCount = 4;
  const ridges = [];
  for (let k = 0; k < ridgeCount; k++) {
    const base = horizonBase - (ridgeCount - 1 - k) * h * 0.045;
    const waves = Array.from({ length: 3 }, () => ({ a: rr(10, 38) * (1 + k * 0.2), f: rr(0.0018, 0.007), p: rr(0, Math.PI * 2) }));
    const pts = [];
    for (let x = 0; x <= w + 20; x += 20) {
      let y = base;
      for (const wv of waves) y -= wv.a * Math.sin(x * wv.f + wv.p);
      pts.push([x, y]);
    }
    ridges.push(pts);
  }
  const lastRidge = ridges[ridges.length - 1];
  const ridgePath = (pts, bottom) =>
    `M0 ${bottom}L${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}L${w} ${bottom}Z`;

  // Medan ketinggian untuk kontur
  const top = Math.min(...lastRidge.map((p) => p[1])) - 10;
  const fieldH = h - top;
  const cellsX = Math.round((square ? 70 : 96) * density);
  const cellW = w / cellsX;
  const cellsY = Math.ceil(fieldH / cellW);
  const cellH = fieldH / cellsY;
  const bumps = Array.from({ length: ri(3, 5) }, () => ({
    x: rr(0.1, 0.9) * w,
    y: top + rr(0.25, 0.85) * fieldH,
    r: rr(0.12, 0.3) * w,
    a: rr(0.6, 1.2) * (rand() > 0.2 ? 1 : -0.6),
  }));
  const sw = { f1: rr(0.004, 0.009), f2: rr(0.004, 0.01), p1: rr(0, 6), p2: rr(0, 6), a: rr(0.08, 0.2) };
  const field = new Float32Array((cellsX + 1) * (cellsY + 1));
  let min = Infinity, max = -Infinity;
  for (let j = 0; j <= cellsY; j++) {
    for (let i = 0; i <= cellsX; i++) {
      const x = i * cellW, y = top + j * cellH;
      let v = sw.a * Math.sin(x * sw.f1 + sw.p1) * Math.cos(y * sw.f2 + sw.p2);
      for (const b of bumps) {
        const d2 = (x - b.x) ** 2 + (y - b.y) ** 2;
        v += b.a * Math.exp(-d2 / (2 * b.r * b.r));
      }
      field[j * (cellsX + 1) + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const levels = ri(11, 15);
  let contourPaths = "";
  let emphasis = "";
  for (let l = 1; l < levels; l++) {
    const level = min + ((max - min) * l) / levels;
    const d = contours(field, cellsX, cellsY, cellW, cellH, level, top);
    if (!d) continue;
    if (l % 4 === 0) emphasis += d;
    else contourPaths += d;
  }

  // Petak kavling pada puncak tertinggi
  let plotGroup = "";
  if (plots) {
    const peak = bumps.filter((b) => b.a > 0).sort((a, b) => b.a - a.a)[0] || bumps[0];
    const cols = ri(4, 6);
    const rows = ri(2, 3);
    const lotW = (square ? w * 0.072 : w * 0.062) * rr(0.9, 1.12);
    const lotH = lotW * rr(0.8, 1.1);
    const roadGap = lotH * 0.42;
    const gridW = cols * lotW;
    const gridH = rows * lotH + roadGap;
    const reach = gridW * 0.68;
    const cx = Math.min(Math.max(peak.x, reach), w - reach);
    const cy = Math.min(Math.max(peak.y, top + fieldH * 0.4), h - Math.max(fieldH * 0.28, reach * 0.62));
    const roadAfter = rows === 2 ? 1 : ri(1, 2);
    const hl = new Set([`${ri(0, cols - 1)}-${ri(0, rows - 1)}`]);
    if (rand() > 0.5) hl.add(`${ri(0, cols - 1)}-${ri(0, rows - 1)}`);
    const angle = r1(rr(-24, 24));
    let lots = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -gridW / 2 + c * lotW;
        const y = -gridH / 2 + r * lotH + (r >= roadAfter ? roadGap : 0);
        const isHl = hl.has(`${c}-${r}`);
        lots += `<rect x="${r1(x + 3)}" y="${r1(y + 3)}" width="${r1(lotW - 6)}" height="${r1(lotH - 6)}" rx="3" fill="${isHl ? t.highlight : t.lotFill}" fill-opacity="${isHl ? 0.9 : 0.72}" stroke="${t.lot}" stroke-opacity="${isHl ? 0 : 0.45}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
      }
    }
    const roadY = -gridH / 2 + roadAfter * lotH;
    const road = `<rect x="${r1(-gridW / 2 - lotW * 0.6)}" y="${r1(roadY + roadGap * 0.18)}" width="${r1(gridW + lotW * 1.2)}" height="${r1(roadGap * 0.64)}" rx="2" fill="${t.road}" fill-opacity="0.9"/>` +
      `<line x1="${r1(-gridW / 2 - lotW * 0.5)}" y1="${r1(roadY + roadGap / 2)}" x2="${r1(gridW / 2 + lotW * 0.5)}" y2="${r1(roadY + roadGap / 2)}" stroke="${t.lot}" stroke-opacity="0.5" stroke-width="1.2" stroke-dasharray="10 10" vector-effect="non-scaling-stroke"/>`;
    const ring = `<circle r="${r1(gridW * 0.62)}" fill="none" stroke="${t.ring}" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 7" vector-effect="non-scaling-stroke"/>`;
    plotGroup = `<g transform="translate(${r1(cx)} ${r1(cy)}) scale(1 0.62) rotate(${angle})">${ring}${road}${lots}</g>`;
  }

  const id = `a${hashSeed(`${seed}-${themeName}-${w}`).toString(36)}`;
  const ridgeFills = ridges
    .map((pts, k) => `<path d="${ridgePath(pts, r1(horizonBase + h * 0.05))}" fill="${t.ridges[k]}"/>`)
    .join("");
  const ridgeLines = ridges
    .map((pts, k) => `<path d="M${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}" fill="none" stroke="${t.contour}" stroke-opacity="${0.12 + k * 0.06}" stroke-width="1.2"/>`)
    .join("");
  const ground = `M0 ${h}L0 ${r1(lastRidge[0][1])}L${lastRidge.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}L${w} ${h}Z`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.skyTop}"/><stop offset="1" stop-color="${t.skyBottom}"/></linearGradient>
<linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="0.35" stop-color="#fff" stop-opacity="1"/></linearGradient>
<clipPath id="${id}c"><path d="${ground}"/></clipPath>
<mask id="${id}m"><rect x="0" y="${r1(top)}" width="${w}" height="${r1(fieldH)}" fill="url(#${id}f)"/></mask>
</defs>
<rect width="${w}" height="${h}" fill="url(#${id}s)"/>
${ridgeFills}
<path d="${ground}" fill="${t.ground}"/>
<g clip-path="url(#${id}c)" mask="url(#${id}m)" fill="none" stroke="${t.contour}" stroke-linejoin="round" stroke-linecap="round">
<path d="${contourPaths}" stroke-opacity="${t.contourOpacity}" stroke-width="1.1"/>
<path d="${emphasis}" stroke-opacity="${Math.min(t.contourOpacity * 1.9, 0.7)}" stroke-width="1.6"/>
</g>
${ridgeLines}
${plotGroup}
</svg>`;
}

const LOCATIONS = [
  "sawangan-nusa-dua",
  "sidakarya-denpasar",
  "klusa-bresela-ubud",
  "lumintang-denpasar",
  "pejeng-gianyar",
];

const jobs = [];
for (const slug of LOCATIONS) {
  jobs.push({ file: `loc-${slug}-day-16x9.svg`, seed: slug, theme: "day", w: 1600, h: 900 });
  jobs.push({ file: `loc-${slug}-day-1x1.svg`, seed: slug, theme: "day", w: 1200, h: 1200 });
  jobs.push({ file: `loc-${slug}-night-16x9.svg`, seed: slug, theme: "night", w: 1600, h: 900 });
}
jobs.push({ file: "hero-night-16x9.svg", seed: "jull-chandra-bali-hero", theme: "night", w: 1920, h: 1080, density: 1.15 });
jobs.push({ file: "cta-night-16x9.svg", seed: "jadwalkan-survei-kavling", theme: "night", w: 1920, h: 1080, plots: false });
jobs.push({ file: "page-kavling-night-16x9.svg", seed: "halaman-kavling", theme: "night", w: 1600, h: 900 });
jobs.push({ file: "page-kalkulator-night-16x9.svg", seed: "halaman-kalkulator", theme: "night", w: 1600, h: 900 });
jobs.push({ file: "page-kontak-night-16x9.svg", seed: "halaman-kontak-renon", theme: "night", w: 1600, h: 900 });
jobs.push({ file: "page-legal-night-16x9.svg", seed: "halaman-legal", theme: "night", w: 1600, h: 900, plots: false });
jobs.push({ file: "calc-day-1x1.svg", seed: "kalkulator-are-meter", theme: "day", w: 1200, h: 1200 });
jobs.push({ file: "faq-day-1x1.svg", seed: "pertanyaan-kavling", theme: "day", w: 1200, h: 1200 });
jobs.push({ file: "survey-day-16x9.svg", seed: "survei-lokasi-bali", theme: "day", w: 1600, h: 900 });
jobs.push({ file: "kontak-wa-day-1x1.svg", seed: "kontak-whatsapp-jull", theme: "day", w: 1200, h: 1200 });
jobs.push({ file: "renon-day-1x1.svg", seed: "renon-denpasar-kantor", theme: "day", w: 1200, h: 1200, plots: false });

let total = 0;
for (const job of jobs) {
  const svg = art(job);
  writeFileSync(new URL(job.file, OUT), svg);
  total += svg.length;
}
console.log(`${jobs.length} ilustrasi, total ${(total / 1024).toFixed(0)} KB`);
