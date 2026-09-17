"use client";

import { ArrowCounterClockwise, Faders, X } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLockWhile } from "@/components/providers/ui-lock";
import { Listbox } from "@/components/ui/listbox";
import { loadPref, savePref, useConsent } from "@/lib/consent";
import {
  LISTINGS,
  LOCATION_OPTIONS,
  PRICE_OPTIONS,
  ZONE_OPTIONS,
  matchesPrice,
  matchesZone,
} from "@/lib/listings";
import { ListingCard } from "./listing-card";

type Filters = { lokasi: string; zona: string; harga: string };
const DEFAULTS: Filters = { lokasi: "semua", zona: "semua", harga: "semua" };
const LOC_OPTIONS = [{ value: "semua", label: "Semua lokasi" }, ...LOCATION_OPTIONS];

function sanitize(f: Partial<Filters>): Filters {
  const pick = (v: string | undefined, opts: { value: string }[], d: string) =>
    v && opts.some((o) => o.value === v) ? v : d;
  return {
    lokasi: pick(f.lokasi, LOC_OPTIONS, "semua"),
    zona: pick(f.zona, ZONE_OPTIONS, "semua"),
    harga: pick(f.harga, PRICE_OPTIONS, "semua"),
  };
}

function FilterFields({ filters, set, idPrefix }: { filters: Filters; set: (k: keyof Filters, v: string) => void; idPrefix: string }) {
  return (
    <>
      <Listbox id={`${idPrefix}-lokasi`} label="Lokasi" options={LOC_OPTIONS} value={filters.lokasi} onChange={(v) => set("lokasi", v)} />
      <Listbox id={`${idPrefix}-zona`} label="Zona" options={ZONE_OPTIONS} value={filters.zona} onChange={(v) => set("zona", v)} />
      <Listbox id={`${idPrefix}-harga`} label="Harga per are" options={PRICE_OPTIONS} value={filters.harga} onChange={(v) => set("harga", v)} />
    </>
  );
}

/** Daftar kavling dengan filter lokasi, zona, dan rentang harga per are. */
export function ListingExplorer() {
  const params = useSearchParams();
  const consent = useConsent();
  const [filters, setFilters] = useState<Filters>(() => {
    const fromUrl = { lokasi: params.get("lokasi") ?? undefined, zona: params.get("zona") ?? undefined, harga: params.get("harga") ?? undefined };
    // Komponen ini hanya dirender di browser (di dalam Suspense karena useSearchParams), jadi aman membaca penyimpanan lokal.
    if (!fromUrl.lokasi && !fromUrl.zona && !fromUrl.harga && typeof window !== "undefined") {
      const saved = loadPref<Filters>("jc_filters");
      if (saved) return sanitize(saved);
    }
    return sanitize(fromUrl);
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLockWhile("filter", panelOpen);

  // Sinkron ke URL (tanpa navigasi) dan simpan bila diizinkan.
  useEffect(() => {
    const url = new URL(window.location.href);
    (Object.keys(filters) as (keyof Filters)[]).forEach((k) => {
      if (filters[k] === DEFAULTS[k]) url.searchParams.delete(k);
      else url.searchParams.set(k, filters[k]);
    });
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    savePref("jc_filters", filters);
  }, [filters, consent.preferences]);

  const set = useCallback((k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v })), []);
  const reset = () => setFilters(DEFAULTS);

  const results = useMemo(
    () =>
      LISTINGS.filter(
        (l) => (filters.lokasi === "semua" || l.slug === filters.lokasi) && matchesZone(l, filters.zona) && matchesPrice(l, filters.harga)
      ),
    [filters]
  );
  const activeCount = (Object.keys(filters) as (keyof Filters)[]).filter((k) => filters[k] !== DEFAULTS[k]).length;

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!panelOpen) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) closePanel();
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setPanelOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [panelOpen, closePanel]);

  return (
    <div className="grid gap-8">
      {/* Filter desktop */}
      <div role="group" aria-label="Filter kavling" className="hidden items-end gap-4 rounded-(--radius-card) bg-mist p-4 lg:grid lg:grid-cols-[1fr_1fr_1fr_auto]">
        <FilterFields filters={filters} set={set} idPrefix="f" />
        <button type="button" onClick={reset} disabled={activeCount === 0} className="btn btn-ghost min-h-[52px] bg-surface disabled:opacity-50">
          <ArrowCounterClockwise size={18} aria-hidden="true" />
          Atur ulang
        </button>
      </div>

      {/* Filter mobile/tablet */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          className="btn btn-ghost bg-surface"
          aria-expanded={panelOpen}
          aria-controls="panel-filter"
          onClick={() => setPanelOpen(true)}
        >
          <Faders size={18} aria-hidden="true" />
          Filter{activeCount ? ` (${activeCount})` : ""}
        </button>
        {activeCount ? (
          <button type="button" onClick={reset} className="text-sm font-medium text-accent underline underline-offset-4">
            Atur ulang
          </button>
        ) : null}
      </div>

      <p className="text-ink-muted" role="status" aria-live="polite">
        Menampilkan <strong className="font-medium text-ink">{results.length}</strong> dari {LISTINGS.length} listing
      </p>

      {results.length ? (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((l) => (
            <li key={l.slug} className="grid">
              <ListingCard l={l} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid justify-items-center gap-4 rounded-(--radius-card) bg-mist px-6 py-14 text-center">
          <p className="t-h5 text-ink">Belum ada listing yang cocok</p>
          <p className="max-w-[46ch] text-ink-muted">
            Kombinasi filter ini tidak menemukan listing. Coba atur ulang filter, atau tanyakan lokasi lain lewat WhatsApp.
          </p>
          <button type="button" onClick={reset} className="btn btn-primary">
            Atur ulang filter
          </button>
        </div>
      )}

      {panelOpen ? (
        <div className="fixed inset-0 z-(--z-filter) grid items-end bg-night/60 lg:hidden" onPointerDown={(e) => e.target === e.currentTarget && closePanel()}>
          <div
            id="panel-filter"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-filter-title"
            data-lenis-prevent=""
            className="filter-sheet grid max-h-[88svh] gap-5 overflow-y-auto rounded-t-[24px] bg-paper px-4 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] md:px-8"
          >
            <div className="flex items-center justify-between">
              <h2 id="panel-filter-title" className="t-h5">
                Filter kavling
              </h2>
              <button type="button" onClick={closePanel} className="grid size-11 place-items-center rounded-full bg-mist" aria-label="Tutup filter">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FilterFields filters={filters} set={set} idPrefix="fm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={reset} className="btn btn-ghost">
                Atur ulang
              </button>
              <button type="button" onClick={closePanel} className="btn btn-primary">
                Tampilkan {results.length}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
