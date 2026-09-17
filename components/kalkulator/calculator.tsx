"use client";

import { ArrowCounterClockwise, ArrowsLeftRight } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Listbox } from "@/components/ui/listbox";
import { loadPref, savePref, useConsent } from "@/lib/consent";
import {
  M2_PER_ARE,
  formatDecimal,
  formatRupiah,
  formatRupiahShort,
  groupThousands,
  parseDecimal,
  parseRupiah,
} from "@/lib/format";
import { LISTINGS, getListing } from "@/lib/listings";

type Unit = "are" | "m2";
type Saved = { listing: string; unit: Unit; area: string; price: number | null };

const NONE = "tanpa-listing";
const LISTING_OPTIONS = [
  { value: NONE, label: "Tanpa listing", hint: "Isi harga per are sendiri" },
  ...LISTINGS.map((l) => ({
    value: l.slug,
    label: `${l.area}, ${l.district}`,
    hint: l.pricePerAre !== null ? `${formatRupiahShort(l.pricePerAre)} per are` : "Harga per are belum dicantumkan",
  })),
];
const MAX_AREA = { are: 1_000_000, m2: 100_000_000 };

function initialFor(slug: string | null): Saved {
  const l = slug ? getListing(slug) : undefined;
  if (!l) return { listing: NONE, unit: "are", area: "1", price: null };
  if (l.sizeM2 !== null) return { listing: l.slug, unit: "m2", area: String(l.sizeM2), price: l.pricePerAre };
  return { listing: l.slug, unit: "are", area: "1", price: l.pricePerAre };
}

export function Calculator() {
  const params = useSearchParams();
  const consent = useConsent();
  const [state, setState] = useState<Saved>(() => {
    const slug = params.get("listing");
    // Hanya dirender di browser (Suspense + useSearchParams), jadi penyimpanan lokal aman dibaca di sini.
    if (!slug && typeof window !== "undefined") {
      const saved = loadPref<Saved>("jc_calculator");
      if (saved && (saved.listing === NONE || getListing(saved.listing)) && (saved.unit === "are" || saved.unit === "m2")) {
        const price = typeof saved.price === "number" && saved.price >= 0 ? saved.price : null;
        return { listing: saved.listing, unit: saved.unit, area: String(saved.area ?? "").slice(0, 20), price };
      }
    }
    return initialFor(slug);
  });
  const [priceText, setPriceText] = useState(() => groupThousands(state.price));
  const priceRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const ids = useId();

  const listing = state.listing === NONE ? undefined : getListing(state.listing);
  const listingHasNoPrice = !!listing && listing.pricePerAre === null && state.price === null;

  useEffect(() => {
    savePref("jc_calculator", state);
  }, [state, consent.preferences]);

  // Pertahankan posisi kursor setelah format ribuan.
  useLayoutEffect(() => {
    const el = priceRef.current;
    if (!el || caret.current === null || document.activeElement !== el) return;
    let digits = caret.current;
    let pos = 0;
    while (pos < priceText.length && digits > 0) {
      if (/\d/.test(priceText[pos])) digits--;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caret.current = null;
  }, [priceText]);

  const selectListing = (slug: string) => {
    const next = initialFor(slug === NONE ? null : slug);
    // Pertahankan luas yang sudah diketik bila listing tidak membawa luas sendiri.
    const l = getListing(slug);
    const keepArea = !(l && l.sizeM2 !== null);
    const merged = keepArea ? { ...next, unit: state.unit, area: state.area } : next;
    if (slug === NONE) merged.price = state.price;
    setState(merged);
    setPriceText(groupThousands(merged.price));
  };

  const onPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const before = raw.slice(0, e.target.selectionStart ?? raw.length).replace(/\D/g, "").length;
    const value = parseRupiah(raw);
    caret.current = before;
    setPriceText(groupThousands(value));
    setState((s) => ({ ...s, price: value }));
  };

  const switchUnit = (unit: Unit) => {
    if (unit === state.unit) return;
    const current = parseDecimal(state.area);
    let area = state.area;
    if (current !== null) {
      const converted = unit === "m2" ? current * M2_PER_ARE : current / M2_PER_ARE;
      area = String(Math.round(converted * 10000) / 10000).replace(".", ",");
    }
    setState((s) => ({ ...s, unit, area }));
  };

  const onUnitKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const next: Unit = state.unit === "are" ? "m2" : "are";
      switchUnit(next);
      requestAnimationFrame(() => document.getElementById(`${ids}-unit-${next}`)?.focus());
    }
  };

  const areaValue = parseDecimal(state.area);
  const areaError =
    state.area.trim() === ""
      ? "Isi luas lahan."
      : areaValue === null
        ? "Gunakan angka, misalnya 2,5 atau 2.5."
        : areaValue <= 0
          ? "Luas harus lebih dari 0."
          : areaValue > MAX_AREA[state.unit]
            ? "Angka terlalu besar untuk dihitung."
            : null;

  const result = useMemo(() => {
    if (areaError || areaValue === null) return null;
    const are = state.unit === "are" ? areaValue : areaValue / M2_PER_ARE;
    const m2 = state.unit === "m2" ? areaValue : areaValue * M2_PER_ARE;
    const total = state.price !== null && state.price > 0 ? are * state.price : null;
    return { are, m2, total };
  }, [areaError, areaValue, state.unit, state.price]);

  const announcement = result
    ? `${formatDecimal(result.are)} are sama dengan ${formatDecimal(result.m2)} meter persegi.` +
      (result.total !== null ? ` Perkiraan total ${formatRupiah(result.total)}.` : " Total harga tidak ditampilkan karena harga per are kosong.")
    : "";

  // Pengumuman aria-live ditunda sebentar agar pembaca layar tidak dibanjiri tiap ketikan.
  const [spoken, setSpoken] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSpoken(announcement), 700);
    return () => clearTimeout(t);
  }, [announcement]);

  const reset = () => {
    setState({ listing: NONE, unit: "are", area: "1", price: null });
    setPriceText("");
  };

  const unitLabel = state.unit === "are" ? "are" : "m²";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
      <form
        className="grid content-start gap-6 rounded-(--radius-card) bg-surface p-5 ring-1 ring-line md:p-8"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Kalkulator luas dan harga"
        noValidate
      >
        <Listbox
          id={`${ids}-listing`}
          label="Listing"
          options={LISTING_OPTIONS}
          value={state.listing}
          onChange={selectListing}
          describedBy={listingHasNoPrice ? `${ids}-noprice` : undefined}
        />
        {listingHasNoPrice ? (
          <p id={`${ids}-noprice`} className="-mt-3 rounded-(--radius-field) bg-accent-tint px-4 py-3 text-sm text-accent-strong">
            Harga per are untuk listing ini belum dicantumkan, jadi hanya konversi luas yang ditampilkan.
          </p>
        ) : null}

        <div className="grid gap-2">
          <span id={`${ids}-unit-label`} className="text-sm font-medium text-ink">
            Satuan luas
          </span>
          <div
            role="radiogroup"
            aria-labelledby={`${ids}-unit-label`}
            onKeyDown={onUnitKey}
            className="grid grid-cols-2 rounded-full bg-mist p-1"
          >
            {(["are", "m2"] as Unit[]).map((u) => {
              const checked = state.unit === u;
              return (
                <button
                  key={u}
                  id={`${ids}-unit-${u}`}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onClick={() => switchUnit(u)}
                  className={`min-h-11 rounded-full text-[15px] font-medium transition-colors ${
                    checked ? "bg-accent text-on-accent" : "text-ink hover:bg-surface"
                  }`}
                >
                  {u === "are" ? "Are" : "Meter persegi (m²)"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${ids}-area`} className="text-sm font-medium text-ink">
            Luas lahan
          </label>
          <div className="relative">
            <input
              id={`${ids}-area`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={20}
              value={state.area}
              onChange={(e) => setState((s) => ({ ...s, area: e.target.value.replace(/[^\d.,\s]/g, "") }))}
              aria-invalid={areaError ? true : undefined}
              aria-describedby={`${ids}-area-help ${areaError ? `${ids}-area-err` : ""}`}
              className="field num pr-16"
            />
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted">
              {unitLabel}
            </span>
          </div>
          <p id={`${ids}-area-help`} className="text-sm text-ink-muted">
            Desimal boleh memakai koma atau titik.
          </p>
          {areaError ? (
            <p id={`${ids}-area-err`} className="text-sm font-medium text-danger">
              {areaError}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${ids}-price`} className="text-sm font-medium text-ink">
            Harga per are
          </label>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted">
              Rp
            </span>
            <input
              ref={priceRef}
              id={`${ids}-price`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={22}
              placeholder="Kosongkan bila belum ada"
              value={priceText}
              onChange={onPrice}
              aria-describedby={`${ids}-price-help`}
              className="field num pl-11"
            />
          </div>
          <p id={`${ids}-price-help`} className="text-sm text-ink-muted">
            {listing && listing.pricePerAre !== null && state.price === listing.pricePerAre
              ? `Terisi dari listing ${listing.area}. Anda bisa mengubahnya.`
              : "Pemisah ribuan ditambahkan otomatis."}
          </p>
        </div>

        <button type="button" onClick={reset} className="btn btn-ghost justify-self-start">
          <ArrowCounterClockwise size={18} aria-hidden="true" />
          Atur ulang
        </button>
      </form>

      <div className="on-night grid content-between gap-8 rounded-(--radius-card) bg-night p-6 text-night-ink md:p-8">
        <div className="grid gap-6">
          <p className="t-label text-night-muted">Hasil</p>
          {result ? (
            <>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="text-sm text-night-muted">Luas dalam are</p>
                  <p className="t-h3 num break-words">{formatDecimal(result.are)} are</p>
                </div>
                <div className="flex items-center gap-3 text-night-muted" aria-hidden="true">
                  <span className="h-px flex-1 bg-night-line" />
                  <ArrowsLeftRight size={18} />
                  <span className="h-px flex-1 bg-night-line" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm text-night-muted">Luas dalam meter persegi</p>
                  <p className="t-h3 num break-words">{formatDecimal(result.m2)} m²</p>
                </div>
              </div>
              {result.total !== null ? (
                <div className="grid gap-2 rounded-2xl bg-night-soft p-5 ring-1 ring-night-line">
                  <p className="text-sm text-night-muted">Perkiraan total harga</p>
                  <p className="t-h4 num break-words text-accent-bright">{formatRupiah(result.total)}</p>
                  <p className="num text-sm text-night-muted">
                    {formatDecimal(result.are)} are × {formatRupiah(state.price ?? 0)} per are
                  </p>
                </div>
              ) : (
                <p className="rounded-2xl bg-night-soft p-5 text-sm text-night-muted ring-1 ring-night-line">
                  Total harga tidak ditampilkan karena harga per are kosong.
                </p>
              )}
            </>
          ) : (
            <p className="text-night-muted">Isi luas lahan yang valid untuk melihat hasil.</p>
          )}
        </div>
        <p className="text-sm text-night-muted">
          1 are = 100 m². Hasil hanya perkiraan, belum termasuk pajak dan biaya lain, dan wajib dikonfirmasi.
        </p>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {spoken}
        </div>
      </div>
    </div>
  );
}
