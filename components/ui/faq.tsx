"use client";

import { Plus } from "@phosphor-icons/react";
import { useId, useState } from "react";

export type FaqItem = { q: string; a: string };

/** Akordeon FAQ (komposisi "Faqs" pada referensi). Item pertama terbuka. */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <div className="grid gap-2">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`rounded-(--radius-field) ring-1 ring-line transition-colors ${isOpen ? "bg-mist" : "bg-surface"}`}>
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-8 md:py-6"
              >
                <span className="t-label text-ink">{it.q}</span>
                <Plus
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 text-accent transition-transform duration-500 ease-(--ease-out-expo) ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
            <div
              id={`${base}-p${i}`}
              role="region"
              aria-labelledby={`${base}-b${i}`}
              className="faq-panel"
              data-open={isOpen ? "true" : "false"}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="mx-5 border-t border-line pt-4 pb-6 text-ink-muted md:mx-8">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
