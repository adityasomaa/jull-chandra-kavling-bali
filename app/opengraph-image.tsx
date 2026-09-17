import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Rasio 16:9 sesuai aturan gambar situs.
export const alt = "Jull Chandra, tanah kavling di Bali";
export const size = { width: 1200, height: 675 };
export const contentType = "image/png";

const geistMedium = await readFile(join(process.cwd(), "assets/og/Geist-Medium.ttf"));

const RINGS = [
  { w: 980, h: 620, o: 0.1 },
  { w: 780, h: 480, o: 0.14 },
  { w: 580, h: 350, o: 0.2 },
  { w: 380, h: 225, o: 0.28 },
  { w: 190, h: 110, o: 0.4 },
];

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #0b2221 0%, #10302d 100%)",
          color: "#eaf2ef",
          fontFamily: "Geist",
        }}
      >
        {RINGS.map((r) => (
          <div
            key={r.w}
            style={{
              position: "absolute",
              left: 860 - r.w / 2,
              top: 400 - r.h / 2,
              width: r.w,
              height: r.h,
              borderRadius: "50%",
              border: `2px solid rgba(127, 216, 193, ${r.o})`,
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 800, top: 380, display: "flex", gap: 6 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 22,
                borderRadius: 4,
                background: i === 2 ? "#7fd8c1" : "transparent",
                border: i === 2 ? "none" : "2px solid rgba(167, 191, 185, 0.7)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                background: "#7fd8c1",
                color: "#0b2221",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                letterSpacing: -1.5,
              }}
            >
              JC
            </div>
            <div style={{ fontSize: 44, letterSpacing: -2 }}>Jull Chandra</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 88, letterSpacing: -4, lineHeight: 1.05, maxWidth: 760 }}>Tanah kavling di Bali</div>
            <div style={{ fontSize: 30, color: "#a7bfb9" }}>Renon, Denpasar</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geistMedium, style: "normal", weight: 500 }],
    }
  );
}
