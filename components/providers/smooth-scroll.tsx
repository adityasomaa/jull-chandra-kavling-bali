"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useUiLock } from "./ui-lock";

type ScrollApi = {
  scrollToTop: () => void;
  scrollToHash: (hash: string) => boolean;
};

const ScrollContext = createContext<ScrollApi | null>(null);

// Lenis hanya untuk desktop dengan pointer presisi. Tablet, mobile, dan reduced motion memakai scroll native.
const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine) and (hover: hover)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { isLocked } = useUiLock();

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    let frame = 0;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), autoRaf: false });
      lenisRef.current = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const sync = () => (desktop.matches && !reduced.matches ? start() : stop());

    sync();
    desktop.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      stop();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isLocked) lenis.stop();
    else lenis.start();
  }, [isLocked]);

  const scrollToTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const scrollToHash = useCallback((hash: string) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const el = id ? document.getElementById(id) : null;
    if (!el) return false;
    const offset = -110;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, immediate: true, force: true });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "instant" });
    }
    return true;
  }, []);

  return <ScrollContext.Provider value={{ scrollToTop, scrollToHash }}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll harus dipakai di dalam SmoothScrollProvider");
  return ctx;
}
