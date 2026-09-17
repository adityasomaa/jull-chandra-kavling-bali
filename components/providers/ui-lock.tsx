"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Layer = "menu" | "modal" | "filter" | "cookie-settings";

type UiLockValue = {
  open: ReadonlySet<Layer>;
  lock: (layer: Layer) => void;
  unlock: (layer: Layer) => void;
  isLocked: boolean;
};

const UiLockContext = createContext<UiLockValue | null>(null);

/**
 * Melacak drawer, panel, dan modal yang sedang terbuka.
 * Dipakai untuk menghentikan Lenis, mengunci scroll body, dan menyembunyikan cookie banner saat menu mobile terbuka.
 */
export function UiLockProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ReadonlySet<Layer>>(new Set());

  const lock = useCallback((layer: Layer) => {
    setOpen((prev) => (prev.has(layer) ? prev : new Set(prev).add(layer)));
  }, []);
  const unlock = useCallback((layer: Layer) => {
    setOpen((prev) => {
      if (!prev.has(layer)) return prev;
      const next = new Set(prev);
      next.delete(layer);
      return next;
    });
  }, []);

  const isLocked = open.size > 0;

  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-scroll-locked", isLocked);
    root.toggleAttribute("data-menu-open", open.has("menu"));
    if (!isLocked) return;
    const scrollbar = window.innerWidth - root.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isLocked, open]);

  const value = useMemo(() => ({ open, lock, unlock, isLocked }), [open, lock, unlock, isLocked]);
  return <UiLockContext.Provider value={value}>{children}</UiLockContext.Provider>;
}

export function useUiLock() {
  const ctx = useContext(UiLockContext);
  if (!ctx) throw new Error("useUiLock harus dipakai di dalam UiLockProvider");
  return ctx;
}

/** Kunci layer selama `active` bernilai true. */
export function useLockWhile(layer: Layer, active: boolean) {
  const { lock, unlock } = useUiLock();
  useEffect(() => {
    if (!active) return;
    lock(layer);
    return () => unlock(layer);
  }, [active, layer, lock, unlock]);
}
