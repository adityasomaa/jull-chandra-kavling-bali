"use client";

import { Cookie, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useLockWhile } from "@/components/providers/ui-lock";
import { TransitionLink } from "@/components/transition/transition-link";
import { OPEN_COOKIE_SETTINGS, setConsent, useConsent } from "@/lib/consent";

type SwitchProps = {
  id: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
  description: string;
};

function Switch({ id, checked, onChange, disabled, label, description }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-line py-4 first:border-t-0">
      <div className="grid gap-1">
        <span id={`${id}-label`} className="font-medium">
          {label}
        </span>
        <span id={`${id}-desc`} className="text-sm text-ink-muted">
          {description}
        </span>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed ${
          checked ? "bg-accent" : "bg-ink-muted"
        } ${disabled ? "opacity-70" : ""}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1 left-1 size-5 rounded-full bg-surface shadow transition-transform duration-300 ease-(--ease-out-expo) ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

const noopSubscribe = () => () => {};

/**
 * Cookie banner + panel pengaturan. Pilihan benar-benar mengubah perilaku:
 * - Preferensi: filter kavling dan isian kalkulator diingat di perangkat ini (dihapus bila ditolak).
 * - Peta: peta OpenStreetMap hanya dimuat bila diizinkan.
 */
export function CookieConsent() {
  const consent = useConsent();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState({ preferences: false, maps: false });
  const bannerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useLockWhile("cookie-settings", settingsOpen);

  const showBanner = hydrated && !consent.decided && !settingsOpen;

  const openSettings = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setDraft({ preferences: consent.preferences, maps: consent.maps });
    setSettingsOpen(true);
  }, [consent.preferences, consent.maps]);

  useEffect(() => {
    window.addEventListener(OPEN_COOKIE_SETTINGS, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, openSettings);
  }, [openSettings]);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    setTimeout(() => {
      const target = returnFocus.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    }, 0);
  }, []);

  // Tinggi banner diteruskan ke tombol WhatsApp agar keduanya tidak saling menutupi di layar kecil.
  useEffect(() => {
    const root = document.documentElement;
    const el = bannerRef.current;
    if (!showBanner || !el) {
      root.style.setProperty("--cookie-offset", "0px");
      return;
    }
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const menuOpen = root.hasAttribute("data-menu-open");
      root.style.setProperty("--cookie-offset", mq.matches && !menuOpen ? `${el.offsetHeight + 12}px` : "0px");
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mo = new MutationObserver(update);
    mo.observe(root, { attributes: true, attributeFilter: ["data-menu-open"] });
    mq.addEventListener("change", update);
    return () => {
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", update);
      root.style.setProperty("--cookie-offset", "0px");
    };
  }, [showBanner]);

  useEffect(() => {
    if (!settingsOpen) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSettings();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a")];
      const idx = items.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      const next = e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : (idx + 1) % items.length;
      items[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [settingsOpen, closeSettings]);

  const save = (next: { preferences: boolean; maps: boolean }) => {
    setConsent(next);
    if (settingsOpen) closeSettings();
  };

  return (
    <>
      {showBanner ? (
        <div className="cookie-layer pointer-events-none fixed inset-x-0 bottom-0 z-(--z-cookie) p-3 md:right-auto md:bottom-6 md:left-6 md:w-[440px] md:p-0">
          <div
            ref={bannerRef}
            role="region"
            aria-label="Persetujuan cookie"
            className="pointer-events-auto rounded-(--radius-card) bg-surface p-4 text-ink shadow-[0_24px_60px_-20px_rgb(12_43_42/0.45)] ring-1 ring-line md:p-5"
          >
            <div className="flex items-start gap-3">
              <Cookie size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-ink-muted">
                Situs ini memakai cookie esensial. Dengan izin Anda, filter dan isian kalkulator diingat, dan peta
                OpenStreetMap dapat dimuat.{" "}
                <TransitionLink href="/kebijakan-privasi" className="font-medium text-accent underline underline-offset-4">
                  Kebijakan privasi
                </TransitionLink>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="btn btn-primary" onClick={() => save({ preferences: true, maps: true })}>
                Terima semua
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => save({ preferences: false, maps: false })}>
                Hanya esensial
              </button>
              <button type="button" className="btn col-span-2 min-h-10 py-1 text-accent underline-offset-4 hover:underline" onClick={openSettings}>
                Atur pilihan
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <div
          className="fixed inset-0 z-(--z-modal) grid place-items-end bg-night/60 p-3 sm:place-items-center"
          onPointerDown={(e) => e.target === e.currentTarget && closeSettings()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[calc(100svh-24px)] w-full max-w-lg overflow-y-auto rounded-(--radius-card) bg-surface p-6 text-ink shadow-2xl"
            data-lenis-prevent=""
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="t-h5">
                Pengaturan cookie
              </h2>
              <button
                type="button"
                onClick={closeSettings}
                aria-label="Tutup pengaturan cookie"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-mist hover:bg-accent-tint"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4">
              <Switch id="ck-essential" checked disabled label="Esensial" description="Menyimpan pilihan cookie ini. Selalu aktif." />
              <Switch
                id="ck-pref"
                checked={draft.preferences}
                onChange={(v) => setDraft((d) => ({ ...d, preferences: v }))}
                label="Preferensi"
                description="Mengingat filter di halaman Kavling dan isian Kalkulator di perangkat ini."
              />
              <Switch
                id="ck-maps"
                checked={draft.maps}
                onChange={(v) => setDraft((d) => ({ ...d, maps: v }))}
                label="Peta pihak ketiga"
                description="Mengizinkan peta OpenStreetMap dimuat saat Anda menekan tombol peta."
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" className="btn btn-primary" onClick={() => save(draft)}>
                Simpan pilihan
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => save({ preferences: true, maps: true })}>
                Terima semua
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
