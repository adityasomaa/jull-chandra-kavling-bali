"use client";

import { MapPin } from "@phosphor-icons/react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/transition/transition-link";
import { Art } from "@/components/ui/art";
import { CoverArt } from "@/components/ui/cover-art";
import { SectionHeader } from "@/components/ui/section-header";
import { OTHERS, type Listing } from "@/lib/listings";
import { CTA } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

function detailLine(l: Listing) {
  if (l.lease) return l.lease;
  if (l.zone) return `Zona ${l.zone.toLowerCase()}`;
  if (l.sizeM2) return `Luas ${l.sizeM2} m²`;
  if (l.view) return `View ${l.view.toLowerCase()}`;
  return l.type;
}

function LocationCard({ l, compact = false }: { l: Listing; compact?: boolean }) {
  return (
    <TransitionLink
      href={`/kavling/${l.slug}`}
      className="group block rounded-(--radius-card) bg-mist p-3 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] transition-colors hover:bg-surface"
    >
      <Art
        src={`/art/loc-${l.slug}-day-16x9.svg`}
        alt={`Ilustrasi kontur dan petak kavling untuk ${l.area}`}
        ratio="16/9"
        className="rounded-[14px]"
        sizes="(min-width: 1024px) 560px, 100vw"
      />
      <div className={`grid justify-items-center gap-2 px-4 text-center ${compact ? "pt-4 pb-3" : "pt-5 pb-4"}`}>
        <h3 className="t-h4 text-ink group-hover:text-accent">
          {l.area}, {l.district}
        </h3>
        <p className="t-body max-w-[36ch] text-ink-muted">{l.summary}</p>
        <p className="chip mt-1 bg-accent-tint text-accent-strong">{detailLine(l)}</p>
      </div>
    </TransitionLink>
  );
}

/**
 * Lokasi lain. Komposisi section "Our services" pada referensi: section gelap yang menempel (sticky),
 * kartu di tengah berganti mengikuti scroll, dengan penghitung posisi di kanan bawah.
 * Mode sticky hanya di desktop dengan tinggi layar cukup; selain itu kartu ditumpuk biasa.
 */
export function OtherLocations() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(OTHERS.length - 1, Math.max(0, Math.floor(v * OTHERS.length * 0.999)));
    setActive((cur) => (cur === next ? cur : next));
  });

  const header = (titleId: string) => (
    <SectionHeader
      tone="night"
      align="center"
      titleId={titleId}
      label="Lokasi lain"
      title="Empat lokasi lain di Denpasar dan Gianyar"
      description="Sewa lahan, lahan komersial, kavling kota, dan lahan dengan view sawah."
      cta={CTA.listings}
      titleClassName="max-w-[14ch] md:max-w-[20ch] xl:max-w-none"
      className="gap-3"
    />
  );

  return (
    <section aria-label="Lokasi lain" className="on-night relative bg-night text-night-ink">
      {/* Mode sticky: desktop dengan tinggi layar memadai */}
      <div ref={ref} className="sticky-stack" style={{ height: `${OTHERS.length * 100}svh` }}>
        <div className="sticky top-0 isolate flex h-svh flex-col items-center justify-center gap-7 px-[30px] pt-[112px] pb-8">
          <div aria-hidden="true" className="absolute inset-0 -z-20">
            {OTHERS.map((l, i) => (
              <div
                key={l.slug}
                className="absolute inset-0 transition-opacity duration-1000 ease-(--ease-out-expo)"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <CoverArt src={`/art/loc-${l.slug}-night-16x9.svg`} />
              </div>
            ))}
            <div className="absolute inset-0 bg-night/50" />
          </div>

          {header("lokasi-title")}

          <div className="relative grid w-full max-w-[560px] place-items-center">
            {OTHERS.map((l, i) => {
              const state = i === active ? "active" : i < active ? "past" : "future";
              return (
                <div
                  key={l.slug}
                  className="stack-card col-start-1 row-start-1 w-full"
                  data-state={reduce ? (i === active ? "active" : "hidden") : state}
                  aria-hidden={i !== active}
                  inert={i !== active}
                >
                  <LocationCard l={l} compact />
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-28 left-[30px] grid gap-2 xl:left-[60px]" aria-live="polite">
            <p className="t-label num">
              <span className="text-night-ink">{pad(active + 1)}</span>
              <span className="text-night-muted">/{pad(OTHERS.length)}</span>
            </p>
            <p className="flex items-center gap-1.5 text-night-muted">
              <MapPin size={18} aria-hidden="true" />
              {OTHERS[active].regency}
            </p>
          </div>
        </div>
      </div>

      {/* Mode tumpuk: mobile, tablet, dan layar pendek */}
      <div className="sticky-fallback relative isolate section-y">
        <CoverArt src="/art/page-kavling-night-16x9.svg" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/60" />
        <div className="container-x grid gap-10">
          {header("lokasi-title-stack")}
          <ul className="grid gap-5 md:grid-cols-2">
            {OTHERS.map((l, i) => (
              <Reveal as="li" key={l.slug} delay={(i % 2) * 100}>
                <LocationCard l={l} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
