"use client";

import { CheckCircle, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Listbox, type Option } from "@/components/ui/listbox";
import { formatDayDate, formatPhoneDisplay, normalizePhone } from "@/lib/format";
import { LOCATION_OPTIONS, getListing } from "@/lib/listings";
import { waUrl } from "@/lib/whatsapp";

const TIME_OPTIONS: Option[] = [
  { value: "pagi", label: "Pagi, 08.00-11.00 WITA" },
  { value: "siang", label: "Siang, 11.00-14.00 WITA" },
  { value: "sore", label: "Sore, 14.00-17.00 WITA" },
];

const MAX_NOTE = 500;
const NAME_RE = /^[\p{L}][\p{L}\p{M} .,'-]{1,59}$/u;

type Fields = { name: string; phone: string; location: string | null; date: string | null; time: string | null; note: string };
type Errors = Partial<Record<keyof Fields, string>>;

/** Tanggal 21 hari ke depan (mulai besok) dalam zona waktu Bali. */
function buildDates(): Option[] {
  const now = new Date();
  const bali = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
  return Array.from({ length: 21 }, (_, i) => {
    const d = new Date(bali.getFullYear(), bali.getMonth(), bali.getDate() + i + 1);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { value: iso, label: formatDayDate(iso) };
  });
}

const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/g, "");

function validate(f: Fields, dates: Option[]): Errors {
  const e: Errors = {};
  const name = clean(f.name).replace(/\s+/g, " ").trim();
  if (!name) e.name = "Isi nama Anda.";
  else if (!NAME_RE.test(name)) e.name = "Nama 2-60 karakter, hanya huruf, spasi, titik, koma, apostrof, atau tanda hubung.";
  if (!f.phone.trim()) e.phone = "Isi nomor WhatsApp Anda.";
  else if (!normalizePhone(f.phone)) e.phone = "Gunakan nomor seluler Indonesia, contoh 0812 3456 7890 atau +62 812 3456 7890.";
  if (!f.location || !LOCATION_OPTIONS.some((o) => o.value === f.location)) e.location = "Pilih lokasi yang ingin disurvei.";
  if (!f.date || !dates.some((o) => o.value === f.date)) e.date = "Pilih tanggal survei.";
  if (!f.time || !TIME_OPTIONS.some((o) => o.value === f.time)) e.time = "Pilih waktu survei.";
  if (clean(f.note).length > MAX_NOTE) e.note = `Catatan maksimal ${MAX_NOTE} karakter.`;
  return e;
}

export function SurveyForm() {
  const params = useSearchParams();
  const ids = useId();
  const [dates, setDates] = useState<Option[]>([]);
  const [fields, setFields] = useState<Fields>(() => {
    const preset = params.get("lokasi");
    return { name: "", phone: "", location: preset && getListing(preset) ? preset : null, date: null, time: null, note: "" };
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Tanggal bergantung pada hari ini, jadi dibuat di browser agar tidak berbeda dengan HTML hasil build.
    const t = setTimeout(() => setDates(buildDates()), 0);
    return () => clearTimeout(t);
  }, []);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    if (submitted) setErrors(validate(next, dates));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (honeypot.current?.value) return; // bot: diam-diam diabaikan
    const errs = validate(fields, dates);
    setErrors(errs);
    const firstKey = (["name", "phone", "location", "date", "time", "note"] as const).find((k) => errs[k]);
    if (firstKey) {
      setSentUrl(null);
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
      });
      return;
    }

    const phone = normalizePhone(fields.phone)!;
    const loc = LOCATION_OPTIONS.find((o) => o.value === fields.location)!;
    const date = dates.find((o) => o.value === fields.date)!;
    const time = TIME_OPTIONS.find((o) => o.value === fields.time)!;
    const note = clean(fields.note).trim();
    const name = clean(fields.name).replace(/\s+/g, " ").trim();

    const message = [
      "Halo Jull Chandra, saya ingin menjadwalkan survei kavling.",
      "",
      `Nama: ${name}`,
      `Nomor WhatsApp: ${formatPhoneDisplay(phone)}`,
      `Lokasi: ${loc.label}`,
      `Tanggal: ${date.label}`,
      `Waktu: ${time.label}`,
      ...(note ? ["", "Catatan:", note] : []),
      "",
      "Dikirim dari formulir survei di situs Jull Chandra.",
    ].join("\n");

    const url = waUrl(message);
    setSentUrl(url);
    // Fitur "noopener" membuat window.open selalu mengembalikan null, jadi opener diputus manual.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  };

  const errorList = (Object.keys(errors) as (keyof Fields)[]).filter((k) => errors[k]);
  const fieldId = (k: keyof Fields) => `${ids}-${k}`;
  const errId = (k: keyof Fields) => `${ids}-${k}-err`;
  const focusField = (k: keyof Fields) => {
    const el = document.getElementById(k === "location" || k === "date" || k === "time" ? `${fieldId(k)}-button` : fieldId(k));
    el?.focus();
  };

  const renderErr = (k: keyof Fields) =>
    errors[k] ? (
      <p id={errId(k)} className="flex items-start gap-1.5 text-sm font-medium text-danger">
        <WarningCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        {errors[k]}
      </p>
    ) : null;

  const LABELS: Record<keyof Fields, string> = {
    name: "Nama",
    phone: "Nomor WhatsApp",
    location: "Lokasi",
    date: "Tanggal",
    time: "Waktu",
    note: "Catatan",
  };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label="Formulir jadwal survei"
      className="relative grid gap-5 rounded-(--radius-card) bg-surface p-5 ring-1 ring-line md:p-8"
    >
      {submitted && errorList.length ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="grid gap-2 rounded-(--radius-field) bg-danger/10 p-4 text-danger outline-none ring-1 ring-danger/40"
        >
          <p className="font-medium">Periksa {errorList.length} isian berikut:</p>
          <ul className="grid list-disc gap-1 pl-5 text-sm">
            {errorList.map((k) => (
              <li key={k}>
                <button type="button" className="text-left underline underline-offset-2" onClick={() => focusField(k)}>
                  {LABELS[k]}: {errors[k]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sentUrl ? (
        <div role="status" className="grid gap-2 rounded-(--radius-field) bg-accent-tint p-4 text-accent-strong">
          <p className="flex items-center gap-2 font-medium">
            <CheckCircle size={20} weight="fill" aria-hidden="true" />
            Pesan sudah disiapkan di WhatsApp.
          </p>
          <p className="text-sm">
            Bila WhatsApp tidak terbuka,{" "}
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
              buka pesan ini secara manual
            </a>
            .
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <label htmlFor={fieldId("name")} className="text-sm font-medium text-ink">
            Nama <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("name")}
            type="text"
            autoComplete="name"
            maxLength={60}
            required
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errId("name") : undefined}
            className="field"
          />
          {renderErr("name")}
        </div>

        <div className="grid content-start gap-2">
          <label htmlFor={fieldId("phone")} className="text-sm font-medium text-ink">
            Nomor WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            required
            placeholder="0812 3456 7890"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={`${fieldId("phone")}-help${errors.phone ? ` ${errId("phone")}` : ""}`}
            className="field num"
          />
          <p id={`${fieldId("phone")}-help`} className="text-sm text-ink-muted">
            Format 08, +62, atau 62 diterima.
          </p>
          {renderErr("phone")}
        </div>
      </div>

      <div className="grid content-start gap-2">
        <Listbox
          id={fieldId("location")}
          label="Lokasi survei"
          required
          placeholder="Pilih lokasi"
          options={LOCATION_OPTIONS}
          value={fields.location}
          onChange={(v) => set("location", v)}
          invalid={!!errors.location}
          describedBy={errors.location ? errId("location") : undefined}
        />
        {renderErr("location")}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <Listbox
            id={fieldId("date")}
            label="Tanggal"
            required
            placeholder={dates.length ? "Pilih tanggal" : "Memuat tanggal"}
            options={dates}
            value={fields.date}
            onChange={(v) => set("date", v)}
            invalid={!!errors.date}
            describedBy={errors.date ? errId("date") : undefined}
          />
          {renderErr("date")}
        </div>
        <div className="grid content-start gap-2">
          <Listbox
            id={fieldId("time")}
            label="Waktu"
            required
            placeholder="Pilih waktu"
            options={TIME_OPTIONS}
            value={fields.time}
            onChange={(v) => set("time", v)}
            invalid={!!errors.time}
            describedBy={errors.time ? errId("time") : undefined}
          />
          {renderErr("time")}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor={fieldId("note")} className="text-sm font-medium text-ink">
          Catatan <span className="font-normal text-ink-muted">(opsional)</span>
        </label>
        <textarea
          id={fieldId("note")}
          rows={4}
          maxLength={MAX_NOTE}
          value={fields.note}
          onChange={(e) => set("note", e.target.value)}
          aria-invalid={errors.note ? true : undefined}
          aria-describedby={`${fieldId("note")}-count${errors.note ? ` ${errId("note")}` : ""}`}
          className="field min-h-28 resize-y"
          placeholder="Misalnya kebutuhan luas atau pertanyaan tentang zona"
        />
        <p id={`${fieldId("note")}-count`} className="num text-right text-sm text-ink-muted">
          {fields.note.length}/{MAX_NOTE}
        </p>
        {renderErr("note")}
      </div>

      {/* Honeypot: disembunyikan dengan clip (bukan posisi negatif) */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`${ids}-website`}>Jangan diisi</label>
        <input ref={honeypot} id={`${ids}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Data tidak disimpan di situs ini. Pesan dikirim langsung lewat WhatsApp.</p>
        <button type="submit" className="btn btn-primary">
          <WhatsappLogo size={20} aria-hidden="true" />
          Kirim lewat WhatsApp
        </button>
      </div>
    </form>
  );
}
