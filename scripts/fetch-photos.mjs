// Unduh foto Pexels yang terdaftar di lib/photos.ts ke public/photos (self-host).
// Crop dilakukan oleh CDN Pexels (fit=crop) ke rasio 16:9 atau 1:1 saja.
// Jalankan: npm run photos
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("../lib/photos.ts", import.meta.url), "utf8");
const entries = [...src.matchAll(/key: "([^"]+)", id: (\d+),[^}]*ratios: \[([^\]]+)\](?:, wide: (\d+))?/g)].map((m) => ({
  key: m[1],
  id: m[2],
  ratios: m[3].match(/"(16x9|1x1)"/g).map((r) => r.replaceAll('"', "")),
  wide: Number(m[4] || 1600),
}));

const out = new URL("../public/photos/", import.meta.url);
mkdirSync(out, { recursive: true });

let total = 0;
for (const e of entries) {
  for (const ratio of e.ratios) {
    const [w, h] = ratio === "16x9" ? [e.wide, Math.round((e.wide * 9) / 16)] : [1000, 1000];
    const url = `https://images.pexels.com/photos/${e.id}/pexels-photo-${e.id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}&q=72`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${e.key} ${ratio}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(new URL(`${e.key}-${ratio}.jpg`, out), buf);
    total += buf.length;
    console.log(`${e.key}-${ratio}.jpg ${w}x${h} ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
console.log(`${entries.length} foto, total ${(total / 1024 / 1024).toFixed(1)} MB`);
