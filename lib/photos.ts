// Registry foto Pexels (lisensi Pexels: bebas dipakai, atribusi tidak wajib tapi dicantumkan).
// File di-self-host di public/photos lewat `npm run photos` (scripts/fetch-photos.mjs).
// Semua foto adalah foto ilustrasi kawasan, BUKAN foto lahan listing.

export type Photo = {
  key: string;
  id: number;
  by: string;
  page: string;
  alt: string;
  /** rasio yang dibuat untuk foto ini */
  ratios: ("16x9" | "1x1")[];
  /** lebar file 16:9 */
  wide?: number;
};

export const PHOTOS = {
  hero: { key: "hero", id: 35428411, by: "Tom Fisk", page: "https://www.pexels.com/photo/35428411/", alt: "Sawah terasering dan hutan tropis di Bali dari udara", ratios: ["16x9"], wide: 2400 },
  cta: { key: "cta", id: 35159215, by: "Tom Fisk", page: "https://www.pexels.com/photo/35159215/", alt: "Gunung Agung saat senja dilihat dari udara", ratios: ["16x9"], wide: 2400 },
  pageKavling: { key: "page-kavling", id: 36422828, by: "Tom Fisk", page: "https://www.pexels.com/photo/36422828/", alt: "Area pematangan lahan yang dibagi menjadi petak-petak di Bali", ratios: ["16x9", "1x1"], wide: 2000 },
  pageKalkulator: { key: "page-kalkulator", id: 36810327, by: "Tom Fisk", page: "https://www.pexels.com/photo/36810327/", alt: "Petak sawah terasering di Bali dari udara", ratios: ["16x9"], wide: 2000 },
  pageKontak: { key: "page-kontak", id: 35094745, by: "Relaxing Journeys", page: "https://www.pexels.com/photo/35094745/", alt: "Jalan desa di Bali dengan arca penjaga dan bangunan tradisional", ratios: ["16x9"], wide: 2000 },
  pageLegal: { key: "page-legal", id: 35057004, by: "Tom Fisk", page: "https://www.pexels.com/photo/35057004/", alt: "Perbukitan hijau dan laut di Bali", ratios: ["16x9"], wide: 2000 },

  "sawangan-nusa-dua": { key: "loc-sawangan", id: 36548779, by: "Tom Fisk", page: "https://www.pexels.com/photo/36548779/", alt: "Pesisir berpasir dan tebing hijau di Bali selatan", ratios: ["16x9", "1x1"], wide: 1600 },
  "sidakarya-denpasar": { key: "loc-sidakarya", id: 35094744, by: "Relaxing Journeys", page: "https://www.pexels.com/photo/35094744/", alt: "Jalan permukiman di Bali dengan gerbang tradisional dan penjor", ratios: ["16x9", "1x1"], wide: 1600 },
  "klusa-bresela-ubud": { key: "loc-klusa", id: 36947695, by: "Tom Fisk", page: "https://www.pexels.com/photo/36947695/", alt: "Desa di antara hutan tropis di Gianyar dari udara", ratios: ["16x9", "1x1"], wide: 1600 },
  "lumintang-denpasar": { key: "loc-lumintang", id: 38248989, by: "Miguel Cuenca", page: "https://www.pexels.com/photo/38248989/", alt: "Atap-atap rumah di kawasan kota tropis dari udara", ratios: ["16x9", "1x1"], wide: 1600 },
  "pejeng-gianyar": { key: "loc-pejeng", id: 39472100, by: "Mahmut Yılmaz", page: "https://www.pexels.com/photo/39472100/", alt: "Lembah dengan sawah terasering dan hutan tropis di Bali", ratios: ["16x9", "1x1"], wide: 1600 },

  road: { key: "detail-road", id: 36699651, by: "Tom Fisk", page: "https://www.pexels.com/photo/36699651/", alt: "Jalan dan bangunan di antara sawah di Bali dari udara", ratios: ["16x9"], wide: 1200 },
  villa: { key: "detail-villa", id: 35043038, by: "Tom Fisk", page: "https://www.pexels.com/photo/35043038/", alt: "Kawasan hunian villa dengan kolam renang di Bali", ratios: ["16x9"], wide: 1200 },
  coast: { key: "detail-coast", id: 34908200, by: "Tom Fisk", page: "https://www.pexels.com/photo/34908200/", alt: "Tebing hijau dan laut di pesisir Bali", ratios: ["1x1"] },
  measure: { key: "measure", id: 3639034, by: "Castorly Stock", page: "https://www.pexels.com/photo/3639034/", alt: "Meteran kuning dengan skala sentimeter", ratios: ["1x1"] },
  surveyor: { key: "surveyor", id: 24245275, by: "Asad Photo Maldives", page: "https://www.pexels.com/photo/24245275/", alt: "Petugas mengukur lahan dengan alat GPS", ratios: ["1x1"] },
  siteVisit: { key: "site-visit", id: 8961260, by: "Mikael Blomkvist", page: "https://www.pexels.com/photo/8961260/", alt: "Dua orang meninjau lahan terbuka", ratios: ["16x9"], wide: 1400 },
  house: { key: "house", id: 35930884, by: "Evelin Magnus", page: "https://www.pexels.com/photo/35930884/", alt: "Rumah beratap genteng di tepi sawah Bali", ratios: ["1x1"] },
  palms: { key: "palms", id: 36896228, by: "Tom Fisk", page: "https://www.pexels.com/photo/36896228/", alt: "Sawah terasering dan pohon kelapa di Bali", ratios: ["1x1"] },
  badung: { key: "region-badung", id: 6015647, by: "Alesia Kozik", page: "https://www.pexels.com/photo/6015647/", alt: "Pantai dan tebing di Bali selatan", ratios: ["16x9", "1x1"], wide: 1200 },
  gianyar: { key: "region-gianyar", id: 15994341, by: "Balazs Simon", page: "https://www.pexels.com/photo/15994341/", alt: "Sawah terasering dan pohon kelapa di Gianyar", ratios: ["16x9", "1x1"], wide: 1200 },
  denpasar: { key: "region-denpasar", id: 36415760, by: "Mick", page: "https://www.pexels.com/photo/36415760/", alt: "Jalan di Bali yang dihiasi penjor", ratios: ["16x9", "1x1"], wide: 1200 },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export function photoSrc(p: Photo, ratio: "16x9" | "1x1") {
  return `/photos/${p.key}-${ratio}.jpg`;
}

export function listingPhoto(slug: string): Photo {
  return (PHOTOS as Record<string, Photo>)[slug] ?? PHOTOS.hero;
}

export const PHOTO_NOTE = "Foto ilustrasi kawasan, bukan foto lahan listing.";

export const ALL_PHOTOS: Photo[] = Object.values(PHOTOS);
