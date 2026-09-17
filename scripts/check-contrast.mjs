// Cek kontras WCAG untuk setiap pasangan token warna. Jalankan ulang setiap kali token diubah.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]])
);

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [teks, latar]
const pairs = [
  ["ink", "paper"], ["ink", "mist"], ["ink", "surface"],
  ["ink-muted", "paper"], ["ink-muted", "mist"], ["ink-muted", "surface"],
  ["accent", "paper"], ["accent", "mist"], ["accent", "surface"],
  ["on-accent", "accent"], ["on-accent", "accent-strong"],
  ["night-ink", "night"], ["night-muted", "night"], ["night-muted", "night-soft"], ["night-ink", "night-soft"],
  ["accent-bright", "night"], ["accent-bright", "night-soft"], ["night", "accent-bright"],
  ["danger", "surface"], ["danger", "paper"], ["danger", "mist"],
  ["ink", "accent-tint"], ["accent-strong", "accent-tint"],
];

let fail = 0;
for (const [fg, bg] of pairs) {
  if (!tokens[fg] || !tokens[bg]) { console.log(`?? token hilang: ${fg} / ${bg}`); fail++; continue; }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= 4.5;
  if (!ok) fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${r.toFixed(2).padStart(5)}:1  ${fg} (${tokens[fg]}) on ${bg} (${tokens[bg]})`);
}
process.exit(fail ? 1 : 0);
