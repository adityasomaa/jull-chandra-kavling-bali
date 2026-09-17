"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Art } from "@/components/ui/art";
import { formatDate } from "@/lib/format";
import { LISTINGS } from "@/lib/listings";
import { listingPhoto, photoSrc } from "@/lib/photos";

/**
 * Catatan sumber: pengganti section testimoni pada referensi (situs ini tidak memuat testimoni).
 * Karusel scroll-snap berisi ringkasan tiap postingan sumber, lengkap dengan tanggal.
 */
export function SourceNotes() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = [...track.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setIndex(items.indexOf(entry.target as HTMLElement));
        }
      },
      { root: track, threshold: 0.6 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const track = trackRef.current;
    const target = track?.children[Math.max(0, Math.min(LISTINGS.length - 1, i))] as HTMLElement | undefined;
    if (!track || !target) return;
    const left = target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <div className="grid gap-8">
      <ul
        ref={trackRef}
        className="source-track scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 md:gap-6 md:px-[30px]"
        aria-label="Catatan sumber per listing"
      >
        {LISTINGS.map((l, i) => (
          <li
            key={l.slug}
            className="grid w-[86%] max-w-[760px] shrink-0 snap-center gap-5 rounded-(--radius-card) bg-surface p-5 ring-1 ring-line md:w-[70%] md:grid-cols-[1fr_minmax(0,220px)] md:p-6 lg:w-[58%]"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${LISTINGS.length}`}
          >
            <div className="flex flex-col justify-between gap-6">
              <blockquote className="t-h5 text-ink">
                <p>{l.summary}</p>
              </blockquote>
              <div className="grid gap-0.5">
                <p className="font-medium text-ink">{l.source}</p>
                <p className="num text-sm text-ink-muted">Diposting {formatDate(l.datePosted)}</p>
              </div>
            </div>
            <Art
              src={photoSrc(listingPhoto(l.slug), "1x1")}
              alt={`${listingPhoto(l.slug).alt} (foto ilustrasi)`}
              ratio="1/1"
              className="w-full max-w-[220px] rounded-[14px] md:max-w-none"
              sizes="220px"
            />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Catatan sebelumnya"
          className="grid size-11 place-items-center rounded-full bg-surface ring-1 ring-line hover:bg-accent-tint disabled:opacity-40"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1 rounded-full bg-mist px-2 py-1">
          {LISTINGS.map((l, i) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Tampilkan catatan ${l.area}`}
              aria-current={i === index ? "true" : undefined}
              className="grid size-7 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-500 ${i === index ? "w-5 bg-accent" : "w-2 bg-ink-muted"}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === LISTINGS.length - 1}
          aria-label="Catatan berikutnya"
          className="grid size-11 place-items-center rounded-full bg-surface ring-1 ring-line hover:bg-accent-tint disabled:opacity-40"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
