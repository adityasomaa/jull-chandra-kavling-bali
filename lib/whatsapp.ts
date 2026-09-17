import { SITE } from "./site";

/**
 * Bangun URL wa.me. Seluruh teks di-encode dengan encodeURIComponent sehingga
 * baris baru (%0A), "&" (%26), "#" (%23), dan emoji (UTF-8) tidak memotong pesan.
 */
export function waUrl(message: string) {
  const text = message.replace(/\r\n?/g, "\n").normalize("NFC");
  return `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;
}

export const WA_GENERAL = waUrl("Halo Jull Chandra, saya ingin bertanya tentang kavling di Bali.");

export function waListing(title: string) {
  return waUrl(`Halo Jull Chandra, saya ingin bertanya tentang listing: ${title}.`);
}
