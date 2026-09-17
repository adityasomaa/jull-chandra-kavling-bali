import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageHero
      art="/art/page-legal-night-16x9.svg"
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Tidak ditemukan", href: "/404" },
      ]}
      label="Halaman tidak ditemukan"
      title="Halaman ini tidak tersedia"
      description="Tautan mungkin sudah berubah. Lihat daftar kavling atau kembali ke beranda."
      cta={CTA.listings}
    />
  );
}
