"use client";

import { useSyncExternalStore } from "react";

/**
 * Persetujuan cookie yang benar-benar mengendalikan perilaku situs:
 * - preferences: menyimpan filter kavling dan isian kalkulator di perangkat ini
 * - maps: mengizinkan peta OpenStreetMap (pihak ketiga) dimuat saat diklik
 * Pilihan disimpan di cookie pihak pertama `jc_consent` selama 180 hari.
 */
export type Consent = {
  decided: boolean;
  preferences: boolean;
  maps: boolean;
};

const COOKIE = "jc_consent";
const MAX_AGE = 60 * 60 * 24 * 180;
export const PREF_KEYS = ["jc_filters", "jc_calculator"] as const;

const DEFAULT: Consent = { decided: false, preferences: false, maps: false };
const listeners = new Set<() => void>();
let cache: Consent | null = null;

function read(): Consent {
  if (typeof document === "undefined") return DEFAULT;
  if (cache) return cache;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return (cache = DEFAULT);
  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(COOKIE.length + 1)));
    cache = {
      decided: true,
      preferences: parsed.p === 1,
      maps: parsed.m === 1,
    };
  } catch {
    cache = DEFAULT;
  }
  return cache;
}

export function setConsent(next: { preferences: boolean; maps: boolean }) {
  const value = encodeURIComponent(JSON.stringify({ p: next.preferences ? 1 : 0, m: next.maps ? 1 : 0, v: 1 }));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  if (!next.preferences) {
    for (const key of PREF_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* penyimpanan tidak tersedia */
      }
    }
  }
  cache = { decided: true, ...next };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useConsent() {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}

export function loadPref<T>(key: (typeof PREF_KEYS)[number]): T | null {
  if (!read().preferences) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function savePref(key: (typeof PREF_KEYS)[number], value: unknown) {
  if (!read().preferences) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

// Event sederhana untuk membuka panel pengaturan cookie dari mana saja (mis. footer).
export const OPEN_COOKIE_SETTINGS = "jc:open-cookie-settings";
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS));
}
