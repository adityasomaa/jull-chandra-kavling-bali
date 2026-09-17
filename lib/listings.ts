// Data listing hanya berisi fakta dari postingan halaman Facebook Jull Chandra tanggal 17 Agustus 2026.
// Nilai `null` berarti belum dicantumkan di sumber. Jangan diisi dengan perkiraan.

export type Zone = "Pemukiman" | "Komersial";

export type Listing = {
  slug: string;
  title: string;
  area: string;
  district: string;
  regency: string;
  type: string;
  zone: Zone | null;
  pricePerAre: number | null;
  sizeM2: number | null;
  road: string | null;
  nearby: string[];
  view: string | null;
  lease: string | null;
  summary: string;
  facts: string[];
  datePosted: string;
  source: string;
  // Titik tengah area (desa/kelurahan), bukan titik kavling.
  areaPoint: { lat: number; lon: number };
};

export const SOURCE_LABEL = "Postingan halaman Facebook Jull Chandra";
export const SOURCE_DATE = "2026-08-17";

export const LISTINGS: Listing[] = [
  {
    slug: "sawangan-nusa-dua",
    title: "Kavling villa di Sawangan, Nusa Dua",
    area: "Sawangan",
    district: "Nusa Dua",
    regency: "Badung",
    type: "Kavling villa",
    zone: "Pemukiman",
    pricePerAre: 490_000_000,
    sizeM2: null,
    road: "Jalan kavling 6 meter dengan drainase",
    nearby: ["Pantai Sawangan", "Pantai Pandawa", "Gunung Payung"],
    view: null,
    lease: null,
    summary:
      "Kavling villa di zona pemukiman Sawangan, Nusa Dua, dengan jalan kavling selebar 6 meter yang dilengkapi drainase.",
    facts: ["Zona pemukiman", "Jalan kavling 6 meter", "Drainase di jalan kavling"],
    datePosted: SOURCE_DATE,
    source: SOURCE_LABEL,
    areaPoint: { lat: -8.8167, lon: 115.2275 },
  },
  {
    slug: "sidakarya-denpasar",
    title: "Sewa lahan 20 tahun di Sidakarya",
    area: "Sidakarya",
    district: "Denpasar Selatan",
    regency: "Denpasar",
    type: "Sewa lahan",
    zone: null,
    pricePerAre: null,
    sizeM2: null,
    road: null,
    nearby: [],
    view: null,
    lease: "Sewa 20 tahun",
    summary: "Lahan di Sidakarya, Denpasar Selatan, yang ditawarkan dengan skema sewa selama 20 tahun.",
    facts: ["Skema sewa 20 tahun"],
    datePosted: SOURCE_DATE,
    source: SOURCE_LABEL,
    areaPoint: { lat: -8.7098, lon: 115.2352 },
  },
  {
    slug: "klusa-bresela-ubud",
    title: "Lahan zona komersial di Klusa, Bresela",
    area: "Klusa, Bresela",
    district: "dekat Ubud",
    regency: "Gianyar",
    type: "Lahan",
    zone: "Komersial",
    pricePerAre: null,
    sizeM2: null,
    road: null,
    nearby: [],
    view: null,
    lease: null,
    summary: "Lahan berzona komersial di Klusa, Desa Bresela, di kawasan dekat Ubud.",
    facts: ["Zona komersial", "Kawasan dekat Ubud"],
    datePosted: SOURCE_DATE,
    source: SOURCE_LABEL,
    areaPoint: { lat: -8.4352, lon: 115.2405 },
  },
  {
    slug: "lumintang-denpasar",
    title: "Kavling 197 m² di Lumintang, Denpasar",
    area: "Lumintang",
    district: "Denpasar Utara",
    regency: "Denpasar",
    type: "Kavling",
    zone: null,
    pricePerAre: null,
    sizeM2: 197,
    road: null,
    nearby: [],
    view: null,
    lease: null,
    summary: "Kavling seluas 197 m² di kawasan Lumintang, Denpasar.",
    facts: ["Luas 197 m²"],
    datePosted: SOURCE_DATE,
    source: SOURCE_LABEL,
    areaPoint: { lat: -8.6422, lon: 115.2128 },
  },
  {
    slug: "pejeng-gianyar",
    title: "Lahan view lembah dan sawah di Pejeng",
    area: "Pejeng",
    district: "Tampaksiring",
    regency: "Gianyar",
    type: "Lahan",
    zone: null,
    pricePerAre: null,
    sizeM2: null,
    road: null,
    nearby: [],
    view: "Lembah dan sawah",
    lease: null,
    summary: "Lahan di Pejeng, Gianyar, dengan pemandangan ke arah lembah dan sawah.",
    facts: ["View lembah", "View sawah"],
    datePosted: SOURCE_DATE,
    source: SOURCE_LABEL,
    areaPoint: { lat: -8.5138, lon: 115.2948 },
  },
];

export const UNKNOWN = "Belum dicantumkan";
export const TO_CONFIRM = "Tanyakan saat survei";

export const FEATURED = LISTINGS[0];
export const OTHERS = LISTINGS.slice(1);

export function getListing(slug: string) {
  return LISTINGS.find((l) => l.slug === slug);
}

export const LOCATION_OPTIONS = LISTINGS.map((l) => ({
  value: l.slug,
  label: `${l.area}, ${l.district}`,
}));

export const ZONE_OPTIONS = [
  { value: "semua", label: "Semua zona" },
  { value: "Pemukiman", label: "Zona pemukiman" },
  { value: "Komersial", label: "Zona komersial" },
  { value: "belum", label: "Zona belum dicantumkan" },
];

export const PRICE_OPTIONS = [
  { value: "semua", label: "Semua harga" },
  { value: "lte-500", label: "Hingga Rp 500 juta per are" },
  { value: "gt-500", label: "Di atas Rp 500 juta per are" },
  { value: "belum", label: "Harga belum dicantumkan" },
];

export function matchesPrice(l: Listing, range: string) {
  if (range === "semua") return true;
  if (range === "belum") return l.pricePerAre === null;
  if (l.pricePerAre === null) return false;
  return range === "lte-500" ? l.pricePerAre <= 500_000_000 : l.pricePerAre > 500_000_000;
}

export function matchesZone(l: Listing, zone: string) {
  if (zone === "semua") return true;
  if (zone === "belum") return l.zone === null;
  return l.zone === zone;
}
