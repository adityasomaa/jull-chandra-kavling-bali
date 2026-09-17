"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver dipasang pada elemen pembungkus itu sendiri, bukan pada anak di dalam wadah overflow-hidden,
 * supaya rasio interseksi tidak terjebak di 0.
 */
export function useInView<T extends Element>({ once = true, amount = 0.2, margin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, margin]);

  return [ref, inView] as const;
}
