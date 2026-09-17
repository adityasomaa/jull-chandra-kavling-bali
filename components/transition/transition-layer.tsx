"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "./transition-provider";

const RINGS = [
  "M200 62c52 2 96 30 104 80 9 54-30 92-86 98-58 7-112-20-118-74-6-56 40-106 100-104z",
  "M200 88c38 1 70 22 76 58 6 40-22 66-62 71-42 5-80-14-85-53-4-40 28-77 71-76z",
  "M201 114c24 0 44 14 48 36 4 26-14 42-39 45-26 3-50-9-53-33-3-25 17-48 44-48z",
  "M202 138c12 0 21 7 23 17 2 12-7 20-19 21-12 1-23-4-25-15-1-12 9-23 21-23z",
];

/**
 * Dua loader:
 * - "home": saat pertama kali membuka situs dan saat menuju Home. Kontur tanah digambar, lalu wordmark muncul.
 * - "curtain": saat pindah ke halaman lain. Tirai dua lapis dengan nama halaman tujuan.
 */
export function TransitionLayer() {
  const { phase, variant, label, finishBoot } = useTransition();
  const started = useRef(0);

  useEffect(() => {
    started.current = performance.now();
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 150 : 1500;
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
    fonts.then(() => {
      const elapsed = performance.now() - started.current;
      setTimeout(() => {
        if (!cancelled) finishBoot();
      }, Math.max(0, minTime - elapsed));
    });
    return () => {
      cancelled = true;
    };
  }, [finishBoot]);

  const curtainActive = variant === "curtain" && phase !== "idle";

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        {phase === "closing" || phase === "closed" || phase === "boot" ? `Memuat ${label}` : ""}
      </div>

      <div
        className="loader-home on-night"
        data-phase={variant === "home" ? phase : "idle"}
        aria-hidden="true"
        inert
      >
        <div className="loader-home__inner">
          <svg viewBox="0 0 400 300" className="loader-home__rings" fill="none">
            {RINGS.map((d, i) => (
              <path key={d} d={d} pathLength={1} style={{ ["--i" as string]: i }} />
            ))}
            <g className="loader-home__plots">
              <rect x="186" y="146" width="12" height="10" rx="2" />
              <rect x="201" y="146" width="12" height="10" rx="2" />
              <rect x="186" y="159" width="12" height="10" rx="2" />
              <rect x="201" y="159" width="12" height="10" rx="2" className="is-hl" />
            </g>
          </svg>
          <p className="loader-home__word">
            {"Jull Chandra".split("").map((c, i) => (
              <span key={i} style={{ ["--i" as string]: i }}>
                {c === " " ? " " : c}
              </span>
            ))}
          </p>
          <p className="loader-home__sub">Tanah kavling di Bali</p>
          <span className="loader-home__bar" />
        </div>
      </div>

      <div className="loader-curtain on-night" data-phase={curtainActive ? phase : "idle"} aria-hidden="true" inert>
        <div className="loader-curtain__lead" />
        <div className="loader-curtain__panel">
          <div className="loader-curtain__content">
            <span className="loader-curtain__plots">
              <i />
              <i />
              <i className="is-hl" />
              <i />
              <i />
            </span>
            <p className="loader-curtain__label">{label}</p>
          </div>
        </div>
      </div>
    </>
  );
}
