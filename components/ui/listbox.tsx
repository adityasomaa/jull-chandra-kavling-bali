"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type Option = { value: string; label: string; hint?: string };

type Props = {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
  className?: string;
  hideLabel?: boolean;
  tone?: "light" | "night";
  id?: string;
  placement?: "bottom" | "top";
};

/**
 * Dropdown kustom dengan pola ARIA listbox (collapsible):
 * Arrow Up/Down, Home/End, type-ahead, Enter/Space untuk memilih, Escape untuk menutup,
 * dan fokus kembali ke tombol pemicu setiap kali listbox ditutup.
 */
export function Listbox({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih",
  name,
  invalid,
  describedBy,
  required,
  className = "",
  hideLabel,
  tone = "light",
  id,
  placement = "bottom",
}: Props) {
  const autoId = useId();
  const baseId = id ?? `lb-${autoId}`;
  const labelId = `${baseId}-label`;
  const buttonId = `${baseId}-button`;
  const listId = `${baseId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const openList = useCallback(
    (index?: number) => {
      setActive(index ?? (selectedIndex >= 0 ? selectedIndex : 0));
      setOpen(true);
    },
    [selectedIndex]
  );

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const choose = useCallback(
    (index: number) => {
      const opt = options[index];
      if (opt) onChange(opt.value);
      close();
    },
    [close, onChange, options]
  );

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus({ preventScroll: true });
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const el = document.getElementById(`${listId}-${active}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  const runTypeahead = (char: string) => {
    const t = typeahead.current;
    clearTimeout(t.timer);
    t.text += char.toLowerCase();
    t.timer = setTimeout(() => (t.text = ""), 600);
    const start = open ? active : Math.max(selectedIndex, 0);
    const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    const sameChar = t.text.split("").every((c) => c === t.text[0]);
    const match =
      ordered.find((o) => o.label.toLowerCase().startsWith(t.text)) ??
      (sameChar ? ordered.find((o) => o.label.toLowerCase().startsWith(t.text[0])) : undefined);
    if (!match) return;
    const idx = options.indexOf(match);
    if (open) setActive(idx);
    else onChange(match.value);
  };

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        e.preventDefault();
        openList(e.key === "ArrowUp" && selectedIndex < 0 ? options.length - 1 : undefined);
        break;
      case "Home":
        e.preventDefault();
        openList(0);
        break;
      case "End":
        e.preventDefault();
        openList(options.length - 1);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) runTypeahead(e.key);
    }
  };

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "PageDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 5));
        break;
      case "PageUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 5));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          runTypeahead(e.key);
        }
    }
  };

  const night = tone === "night";

  return (
    <div ref={wrapRef} className={`relative grid gap-2 ${className}`}>
      <span id={labelId} className={hideLabel ? "sr-only" : `text-sm font-medium ${night ? "text-night-ink" : "text-ink"}`}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="field flex items-center justify-between gap-3 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${buttonId}`}
        aria-describedby={describedBy}
        data-invalid={invalid || undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
      >
        <span className={`truncate ${selected ? "" : "text-ink-muted"}`}>{selected ? selected.label : placeholder}</span>
        <CaretDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-ink-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        hidden={!open}
        onKeyDown={onListKey}
        data-lenis-prevent=""
        className={`absolute right-0 left-0 z-(--z-raised) max-h-72 ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"} overflow-y-auto overscroll-contain rounded-(--radius-field) bg-surface p-1.5 text-ink shadow-[0_18px_40px_-12px_rgb(12_43_42/0.28)] ring-1 ring-line outline-none`}
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          const isActive = i === active;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={isSelected}
              onPointerMove={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[15px] ${
                isActive ? "bg-accent-tint" : ""
              }`}
            >
              <span className="grid">
                <span>{o.label}</span>
                {o.hint ? <span className="text-xs text-ink-muted">{o.hint}</span> : null}
              </span>
              {isSelected ? <Check size={16} weight="bold" aria-hidden="true" className="shrink-0 text-accent" /> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
