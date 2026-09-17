"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { SplitChars } from "@/components/motion/split-chars";
import { useTransition } from "@/components/transition/transition-provider";
import { Avatar } from "@/components/ui/avatar";
import { CoverArt } from "@/components/ui/cover-art";
import { Listbox } from "@/components/ui/listbox";
import { LOCATION_OPTIONS } from "@/lib/listings";

const SEARCH_OPTIONS = [{ value: "semua", label: "Semua lokasi" }, ...LOCATION_OPTIONS];

/**
 * Hero tepat satu layar (100svh): nama + avatar placeholder, satu kalimat netral, dan pencarian per lokasi.
 * Grafis latar tidak di-zoom saat scroll.
 */
export function Hero() {
  const { phase, navigate } = useTransition();
  const shown = phase === "opening" || phase === "idle";
  const [location, setLocation] = useState("semua");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = location === "semua" ? "" : `?lokasi=${encodeURIComponent(location)}`;
    navigate(`/kavling${query}#daftar`);
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="hero on-night relative isolate h-hero min-h-[600px] bg-night text-night-ink"
      data-shown={shown ? "true" : "false"}
    >
      <CoverArt src="/art/hero-night-16x9.svg" priority />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_34_33/0.55)_0%,rgb(11_34_33/0.15)_40%,rgb(11_34_33/0.75)_100%)]"
      />

      <div className="container-x flex h-full flex-col justify-between pt-[104px] pb-6 md:pt-[180px] md:pb-10 xl:pt-[210px] xl:pb-16">
        <div className="grid justify-items-start gap-4 md:gap-5">
          <p className="hero-fade chip bg-night-soft/70 text-night-ink ring-1 ring-night-line backdrop-blur-md" style={{ ["--d" as string]: "0ms" }}>
            Agen kavling di Renon, Denpasar
          </p>
          <SplitChars
            as="h1"
            id="hero-title"
            lines={["Jull Chandra, tanah kavling di Bali"]}
            shown={shown}
            baseDelay={120}
            className="t-display max-w-[11ch] text-night-ink md:max-w-[15ch] xl:max-w-none"
          />
        </div>

        <div className="grid items-end gap-5 md:grid-cols-[1fr_minmax(0,420px)] md:gap-10 xl:grid-cols-[1fr_minmax(0,460px)]">
          <div className="hero-fade flex items-center gap-3 md:hidden" style={{ ["--d" as string]: "500ms" }}>
            <Avatar size="sm" tone="night" />
            <div className="grid leading-tight">
              <span className="font-medium">Jull Chandra</span>
              <span className="text-sm text-night-muted">Avatar placeholder</span>
            </div>
          </div>

          <article
            className="hero-fade hidden w-[238px] rounded-(--radius-card) bg-night-soft/60 p-2.5 ring-1 ring-night-line backdrop-blur-md md:block"
            style={{ ["--d" as string]: "500ms" }}
          >
            <Avatar size="lg" tone="night" />
            <div className="px-1 pt-3 pb-1">
              <p className="t-h5 text-night-ink">Jull Chandra</p>
              <p className="mt-1 text-sm text-night-muted">Foto profil menyusul. Berbasis di Renon, Denpasar.</p>
            </div>
          </article>

          <div className="hero-fade grid gap-4 md:gap-5" style={{ ["--d" as string]: "650ms" }}>
            <p className="t-body text-night-ink">
              Informasi tanah kavling di Nusa Dua, Denpasar, dan Gianyar, disampaikan langsung oleh Jull Chandra.
            </p>
            <form role="search" aria-label="Cari kavling berdasarkan lokasi" onSubmit={onSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
              <Listbox
                id="hero-lokasi"
                label="Lokasi"
                hideLabel
                options={SEARCH_OPTIONS}
                value={location}
                onChange={setLocation}
                tone="night"
                placement="top"
              />
              <button type="submit" className="btn btn-bright min-h-[52px]">
                <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
                Cari kavling
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
