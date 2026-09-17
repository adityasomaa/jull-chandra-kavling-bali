"use client";

import { ArrowUpRight, InstagramLogo, List, WhatsappLogo, X } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLockWhile } from "@/components/providers/ui-lock";
import { TransitionLink } from "@/components/transition/transition-link";
import { Action } from "@/components/ui/action";
import { Wordmark } from "@/components/ui/wordmark";
import { CTA, NAV, SITE } from "@/lib/site";
import { WA_GENERAL } from "@/lib/whatsapp";

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  // Menu terikat ke rute saat dibuka, jadi otomatis tertutup ketika rute berganti.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = useCallback((v: boolean) => setOpenPath(v ? pathname : null), [pathname]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLockWhile("menu", open);

  const close = useCallback(
    (restoreFocus = true) => {
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
    },
    [setOpen]
  );

  // Tutup menu saat layar melebar ke desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setOpen]);

  // Escape + focus trap sederhana di dalam panel.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>("a, button")];
      const idx = items.indexOf(document.activeElement as HTMLElement);
      const nextIdx = e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : idx === items.length - 1 ? 0 : idx + 1;
      e.preventDefault();
      items[nextIdx]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-(--z-header) px-3 pt-3 md:px-[30px] md:pt-8">
        <div className="pointer-events-auto mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 rounded-(--radius-nav) bg-surface/95 py-2 pr-2 pl-3 shadow-[0_10px_30px_-18px_rgb(12_43_42/0.35)] ring-1 ring-line/60 backdrop-blur-md md:h-16 md:pl-2">
          <TransitionLink href="/" className="flex items-center gap-2 rounded-full pr-2" aria-label="Jull Chandra, ke beranda">
            <Wordmark />
          </TransitionLink>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={`group relative py-2 text-lg tracking-[-0.02em] transition-colors ${
                        current ? "text-accent" : "text-ink hover:text-accent"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-out-expo) ${
                          current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Action {...CTA.survey} className="hidden sm:inline-flex" />
            <button
              ref={toggleRef}
              type="button"
              className="grid size-11 place-items-center rounded-full bg-mist text-ink transition-colors hover:bg-accent-tint lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Buka menu"
              onClick={() => setOpen(true)}
            >
              <List size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="mobile-menu on-night fixed inset-0 z-(--z-menu) overflow-y-auto bg-night px-3 pt-3 pb-10 text-night-ink md:px-[30px] md:pt-8 lg:hidden"
        data-lenis-prevent=""
      >
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-(--radius-nav) bg-night-soft py-2 pr-2 pl-3 ring-1 ring-night-line md:h-16 md:pl-2">
          <Wordmark tone="night" />
          <button
            ref={closeRef}
            type="button"
            className="grid size-11 place-items-center rounded-full bg-night text-night-ink ring-1 ring-night-line transition-colors hover:bg-night-line"
            aria-label="Tutup menu"
            onClick={() => close()}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Navigasi mobile" className="mx-auto mt-10 max-w-xl px-1">
          <ul className="grid gap-1">
            {NAV.map((item, i) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="menu-item" style={{ ["--i" as string]: i }}>
                  <TransitionLink
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => close(false)}
                    className={`flex items-center justify-between border-b border-night-line py-4 text-[2.25rem] leading-tight font-medium tracking-[-0.045em] ${
                      current ? "text-accent-bright" : "text-night-ink"
                    }`}
                  >
                    {item.label}
                    <ArrowUpRight size={24} aria-hidden="true" className="text-night-muted" />
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
          <div className="menu-item mt-8 grid gap-3" style={{ ["--i" as string]: 4 }}>
            <Action {...CTA.survey} tone="bright" className="w-full" />
            <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn w-full text-night-ink ring-1 ring-night-line">
              <WhatsappLogo size={20} aria-hidden="true" />
              Chat WhatsApp {SITE.phoneDisplay}
            </a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn w-full text-night-ink ring-1 ring-night-line">
              <InstagramLogo size={20} aria-hidden="true" />
              Instagram {SITE.instagramHandle}
            </a>
            <p className="mt-4 text-sm text-night-muted">
              {SITE.address.street}, {SITE.address.locality}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
