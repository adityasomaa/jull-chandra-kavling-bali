// Satu sumber untuk domain dan data kontak. Ganti SITE_URL di sini bila domain final berubah.
export const SITE_URL = "https://jullchandra-kavling-bali.vercel.app";

export const SITE = {
  name: "Jull Chandra",
  title: "Jull Chandra | Tanah Kavling di Bali",
  description:
    "Informasi tanah kavling di Bali dari Jull Chandra, agen yang berbasis di Renon, Denpasar. Lihat listing di Nusa Dua, Denpasar, Ubud, dan Pejeng, lalu jadwalkan survei lewat WhatsApp.",
  locale: "id_ID",
  phoneDisplay: "0819-3432-5222",
  phoneE164: "+6281934325222",
  waNumber: "6281934325222",
  waName: "jull chandra",
  instagram: "https://www.instagram.com/jull.chandra/",
  instagramHandle: "@jull.chandra",
  facebookPageName: "Jual tanah kavling premium Bali (Jull Chandra)",
  facebookSearch: "https://www.facebook.com/search/pages/?q=Jull%20Chandra%20tanah%20kavling%20Bali",
  address: {
    street: "Jl. Tukad Balian No. 168",
    locality: "Renon, Denpasar",
    region: "Bali",
    country: "ID",
  },
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/kavling", label: "Kavling" },
  { href: "/kalkulator", label: "Kalkulator" },
  { href: "/kontak", label: "Kontak" },
] as const;

// Satu label per maksud CTA, dipakai konsisten di seluruh situs.
export const CTA = {
  survey: { href: "/kontak#survei", label: "Jadwalkan survei" },
  listings: { href: "/kavling", label: "Lihat kavling" },
  calculator: { href: "/kalkulator", label: "Hitung luas" },
} as const;
