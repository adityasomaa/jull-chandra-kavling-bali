const rupiahFmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const decimalFmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

export const M2_PER_ARE = 100;

export function formatRupiah(value: number) {
  return `Rp ${rupiahFmt.format(Math.round(value))}`;
}

/** Rp 490 juta, Rp 1,2 miliar. Untuk label ringkas. */
export function formatRupiahShort(value: number) {
  if (value >= 1_000_000_000) return `Rp ${decimalFmt.format(value / 1_000_000_000)} miliar`;
  if (value >= 1_000_000) return `Rp ${decimalFmt.format(value / 1_000_000)} juta`;
  return formatRupiah(value);
}

export function formatDecimal(value: number) {
  return decimalFmt.format(value);
}

/** Ambil digit saja dari input rupiah. "Rp 490.000.000" -> 490000000. */
export function parseRupiah(input: string): number | null {
  const digits = input.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return null;
  const n = Number(digits.slice(0, 15));
  return Number.isFinite(n) ? n : null;
}

/** Tampilan ribuan untuk input rupiah, tanpa prefix. */
export function groupThousands(value: number | null) {
  return value === null ? "" : rupiahFmt.format(value);
}

/**
 * Terima desimal dengan koma atau titik: "1,5", "1.5", "1.250,75", "1,250.75".
 * Pemisah terakhir dianggap desimal bila diikuti 1-2 digit atau hanya ada satu jenis pemisah yang muncul sekali.
 */
export function parseDecimal(input: string): number | null {
  const raw = input.trim().replace(/\s/g, "");
  if (!raw) return null;
  if (!/^[0-9.,]+$/.test(raw)) return null;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");
  let normalized: string;

  if (lastComma === -1 && lastDot === -1) {
    normalized = raw;
  } else {
    const sepIndex = Math.max(lastComma, lastDot);
    const sep = raw[sepIndex];
    const other = sep === "," ? "." : ",";
    const count = raw.split(sep).length - 1;
    const tail = raw.slice(sepIndex + 1);
    const isDecimal = raw.includes(other) || (count === 1 && (tail.length !== 3 || raw.startsWith("0")));
    if (isDecimal) {
      if (!tail || /[.,]/.test(tail)) return null;
      const intPart = raw.slice(0, sepIndex).replace(/[.,]/g, "");
      normalized = `${intPart || "0"}.${tail}`;
    } else {
      const groups = raw.split(sep);
      if (!groups[0] || groups.slice(1).some((g) => g.length !== 3)) return null;
      normalized = groups.join("");
    }
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Normalisasi nomor HP Indonesia: 08xx, +628xx, 628xx, "0812-3456 789" -> 628123456789.
 * Mengembalikan null bila bukan nomor seluler yang valid.
 */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  if (!/^\+?[0-9\s\-().]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  if (!digits.startsWith("628")) return null;
  const local = digits.slice(2);
  if (local.length < 9 || local.length > 12) return null;
  return digits;
}

export function formatPhoneDisplay(normalized: string) {
  const local = `0${normalized.slice(2)}`;
  return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" });
const dayFmt = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" });

export function formatDate(iso: string) {
  return dateFmt.format(new Date(`${iso}T00:00:00+08:00`));
}

export function formatDayDate(iso: string) {
  return dayFmt.format(new Date(`${iso}T00:00:00+08:00`));
}
