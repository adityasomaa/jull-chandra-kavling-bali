"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";
import { NAV } from "@/lib/site";

/**
 * Urutan transisi: halaman menutup -> konten berganti (di balik tirai) -> scroll ke atas -> halaman membuka.
 * Setiap jeda memakai setTimeout yang di-race dengan requestAnimationFrame, sehingga sequence tetap
 * berjalan ketika tab berada di background (rAF berhenti, setTimeout tetap jalan).
 */

export type Phase = "boot" | "idle" | "closing" | "closed" | "opening";
export type Variant = "curtain" | "home";

type TransitionValue = {
  phase: Phase;
  variant: Variant;
  label: string;
  navigate: (href: string) => void;
  finishBoot: () => void;
};

const TransitionContext = createContext<TransitionValue | null>(null);

export const DURATION = {
  curtainClose: 720,
  curtainOpen: 820,
  homeClose: 620,
  homeHold: 700,
  homeOpen: 900,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Satu frame, tapi tidak pernah menggantung: setTimeout menjadi jaring pengaman bila rAF dihentikan browser. */
export const nextFrame = () =>
  Promise.race([
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    wait(60),
  ]);

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function labelFor(path: string) {
  const nav = NAV.find((n) => n.href === path);
  if (nav) return nav.label;
  if (path.startsWith("/kavling/")) return "Detail kavling";
  if (path.startsWith("/kebijakan-privasi")) return "Kebijakan privasi";
  if (path.startsWith("/syarat-ketentuan")) return "Syarat dan ketentuan";
  return "Jull Chandra";
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollToTop, scrollToHash } = useSmoothScroll();
  const [phase, setPhase] = useState<Phase>("boot");
  const [variant, setVariant] = useState<Variant>("home");
  const [label, setLabel] = useState("Jull Chandra");
  const pathRef = useRef(pathname);
  const busy = useRef(false);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const waitForPath = useCallback(async (target: string, timeout = 5000) => {
    const started = Date.now();
    while (pathRef.current !== target && Date.now() - started < timeout) {
      await Promise.race([nextFrame(), wait(40)]);
    }
  }, []);

  const finishBoot = useCallback(() => {
    setPhase((p) => (p === "boot" ? "opening" : p));
    setTimeout(() => setPhase((p) => (p === "opening" ? "idle" : p)), reducedMotion() ? 50 : DURATION.homeOpen);
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      const url = new URL(href, window.location.href);
      const target = url.pathname.replace(/\/$/, "") || "/";
      const current = (pathRef.current || "/").replace(/\/$/, "") || "/";

      if (target === current) {
        if (url.hash) {
          history.replaceState(null, "", url.hash);
          scrollToHash(url.hash);
        } else {
          scrollToTop();
        }
        return;
      }
      if (busy.current) return;
      busy.current = true;

      const reduce = reducedMotion();
      const nextVariant: Variant = target === "/" ? "home" : "curtain";
      const closeMs = reduce ? 80 : nextVariant === "home" ? DURATION.homeClose : DURATION.curtainClose;
      const openMs = reduce ? 80 : nextVariant === "home" ? DURATION.homeOpen : DURATION.curtainOpen;

      try {
        // 1. halaman menutup
        setVariant(nextVariant);
        setLabel(labelFor(target));
        setPhase("closing");
        await wait(closeMs);
        setPhase("closed");

        // 2. konten berganti selagi tirai tertutup
        router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
        await waitForPath(target);
        await nextFrame();
        await nextFrame();
        if (nextVariant === "home" && !reduce) await wait(DURATION.homeHold);

        // 3. scroll ke atas (atau ke anchor tujuan)
        if (!(url.hash && scrollToHash(url.hash))) scrollToTop();
        await nextFrame();

        // 4. halaman membuka
        setPhase("opening");
        await wait(openMs);
      } finally {
        setPhase("idle");
        busy.current = false;
      }
    },
    [router, scrollToHash, scrollToTop, waitForPath]
  );

  // Tombol back/forward browser: tanpa tirai, cukup pastikan posisi di atas.
  useEffect(() => {
    const onPop = () => {
      setTimeout(() => {
        if (!(location.hash && scrollToHash(location.hash))) scrollToTop();
      }, 30);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [scrollToHash, scrollToTop]);

  const value = useMemo(
    () => ({ phase, variant, label, navigate, finishBoot }),
    [phase, variant, label, navigate, finishBoot]
  );
  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition harus dipakai di dalam TransitionProvider");
  return ctx;
}
