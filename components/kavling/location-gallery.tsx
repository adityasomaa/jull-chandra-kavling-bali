"use client";

import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { useLockWhile } from "@/components/providers/ui-lock";
import { TransitionLink } from "@/components/transition/transition-link";
import { Art } from "@/components/ui/art";
import { LISTINGS } from "@/lib/listings";

type Tile = { slug: string; name: string; ratio: "16/9" | "1/1"; src: string };

const tile = (i: number, ratio: "16/9" | "1/1"): Tile => {
  const l = LISTINGS[i % LISTINGS.length];
  return {
    slug: l.slug,
    name: `${l.area}, ${l.district}`,
    ratio,
    src: `/art/loc-${l.slug}-day-${ratio === "16/9" ? "16x9" : "1x1"}.svg`,
  };
};

// Tiap kolom berisi satu tile 16:9 dan satu tile 1:1 dengan urutan bergantian, sehingga tinggi kolom selalu sama.
const COLUMNS: Tile[][] = [
  [tile(0, "16/9"), tile(1, "1/1")],
  [tile(2, "1/1"), tile(3, "16/9")],
  [tile(4, "16/9"), tile(0, "1/1")],
  [tile(3, "1/1"), tile(2, "16/9")],
];
const FLAT = COLUMNS.flat();

/** Galeri ilustrasi lokasi (komposisi "Gallery" pada referensi) dengan lightbox. */
export function LocationGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useLockWhile("modal", open !== null);

  const close = useCallback(() => {
    setOpen(null);
    setTimeout(() => lastTrigger.current?.focus({ preventScroll: true }), 0);
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + FLAT.length) % FLAT.length)), []);

  useEffect(() => {
    if (open === null) return;
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>("a, button")];
        const idx = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        items[e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : (idx + 1) % items.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const current = open !== null ? FLAT[open] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-1 lg:grid-cols-4">
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="grid content-start gap-1">
            {col.map((t, ti) => {
              const idx = ci * 2 + ti;
              return (
                <Reveal key={`${t.slug}-${t.ratio}-${ci}`} delay={ci * 80}>
                  <button
                    type="button"
                    className="group block w-full cursor-zoom-in overflow-hidden"
                    aria-label={`Perbesar ilustrasi ${t.name}`}
                    onClick={(e) => {
                      lastTrigger.current = e.currentTarget;
                      setOpen(idx);
                    }}
                  >
                    <Art
                      src={t.src}
                      alt=""
                      ratio={t.ratio}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-(--z-modal) grid place-items-center bg-night/90 p-3 md:p-10"
          onPointerDown={(e) => e.target === e.currentTarget && close()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Ilustrasi ${current.name}`}
            className="on-night lightbox grid w-full max-w-[min(1100px,calc((100svh-160px)*16/9))] gap-4 text-night-ink"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="t-h5">{current.name}</p>
              <button
                type="button"
                data-autofocus=""
                onClick={close}
                aria-label="Tutup galeri"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-night-soft ring-1 ring-night-line hover:bg-night-line"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className={current.ratio === "1/1" ? "mx-auto w-full max-w-[min(100%,calc(100svh-200px))]" : ""}>
              <Art key={current.src} src={current.src} alt={`Ilustrasi kontur dan petak kavling untuk ${current.name}`} ratio={current.ratio} className="rounded-[14px]" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Ilustrasi sebelumnya" className="grid size-11 place-items-center rounded-full bg-night-soft ring-1 ring-night-line hover:bg-night-line">
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Ilustrasi berikutnya" className="grid size-11 place-items-center rounded-full bg-night-soft ring-1 ring-night-line hover:bg-night-line">
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <p className="num self-center pl-2 text-sm text-night-muted" aria-live="polite">
                  {(open ?? 0) + 1} dari {FLAT.length}
                </p>
              </div>
              <TransitionLink href={`/kavling/${current.slug}`} onClick={() => setOpen(null)} className="btn btn-bright">
                Lihat listing
              </TransitionLink>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
