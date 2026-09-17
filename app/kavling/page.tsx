import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { Comparison } from "@/components/kavling/comparison";
import { ListingExplorer } from "@/components/kavling/listing-explorer";
import { LocationGallery } from "@/components/kavling/location-gallery";
import { SourceNotes } from "@/components/kavling/source-notes";
import { Reveal } from "@/components/motion/reveal";
import { Art } from "@/components/ui/art";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { CTA } from "@/lib/site";
import { allListingsJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { WA_GENERAL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Daftar Tanah Kavling di Bali",
  description:
    "Daftar tanah kavling di Bali dari Jull Chandra: Sawangan Nusa Dua, Sidakarya, Lumintang, Klusa Bresela dekat Ubud, dan Pejeng. Saring berdasarkan lokasi, zona, dan harga per are.",
  alternates: { canonical: "/kavling" },
  openGraph: { url: "/kavling" },
};

const FAQ: FaqItem[] = [
  {
    q: "Apakah harga yang tercantum sudah final?",
    a: "Harga mengikuti informasi pada postingan sumber. Harga, luas, dan ketersediaan dapat berubah, jadi selalu konfirmasi langsung sebelum mengambil keputusan.",
  },
  {
    q: "Mengapa beberapa listing belum mencantumkan harga atau luas?",
    a: "Postingan sumber belum menyebutkan data tersebut. Kolom yang kosong ditandai \"Belum dicantumkan\" dan dapat ditanyakan lewat WhatsApp.",
  },
  {
    q: "Bagaimana dengan status sertifikat lahan?",
    a: "Status sertifikat tiap lokasi belum dicantumkan di situs ini. Tanyakan dan periksa dokumennya secara langsung sebelum bertransaksi.",
  },
  {
    q: "Apa arti titik pada peta?",
    a: "Titik menandai perkiraan area desa atau kelurahan, bukan lokasi kavling yang sebenarnya. Lokasi persis disampaikan saat survei.",
  },
  {
    q: "Apa maksud sewa lahan 20 tahun di Sidakarya?",
    a: "Listing Sidakarya ditawarkan dengan skema sewa selama 20 tahun. Ketentuan lengkapnya, termasuk harga dan cara pembayaran, perlu dikonfirmasi.",
  },
  {
    q: "Bagaimana cara menjadwalkan survei?",
    a: "Isi formulir di halaman Kontak. Formulir akan membuka WhatsApp dengan pesan berisi nama, lokasi, dan tanggal pilihan Anda.",
  },
];

export default function KavlingPage() {
  return (
    <>
      <JsonLd data={allListingsJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Kavling", path: "/kavling" }])} />

      <PageHero
        art="/art/page-kavling-night-16x9.svg"
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Kavling", href: "/kavling" },
        ]}
        label="Daftar kavling"
        title="Tanah kavling di Nusa Dua, Denpasar, dan Gianyar"
        description="Lima listing tanah kavling di Bali yang dibagikan Jull Chandra. Setiap listing mencantumkan tanggal sumber, dan data yang belum tersedia ditandai dengan jelas."
        cta={{ href: "#daftar", label: "Lihat daftar" }}
      />

      <section id="daftar" aria-labelledby="daftar-title" className="section-y scroll-mt-24 bg-paper">
        <div className="container-x grid gap-10">
          <SectionHeader
            titleId="daftar-title"
            label="Listing"
            title="Saring berdasarkan lokasi, zona, dan harga"
            description="Rentang harga dihitung dari harga per are yang tercantum. Listing tanpa harga tetap bisa ditampilkan lewat pilihan Harga belum dicantumkan."
            cta={CTA.survey}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
          <Suspense fallback={<div className="h-96 rounded-(--radius-card) bg-mist" aria-hidden="true" />}>
            <ListingExplorer />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="banding-title" className="section-y bg-mist">
        <div className="container-x grid gap-10">
          <SectionHeader
            titleId="banding-title"
            label="Perbandingan"
            title="Data kelima listing dalam satu tabel"
            description="Bandingkan tipe, harga per are, luas, dan zona. Semua data wajib dikonfirmasi ulang sebelum transaksi."
            cta={CTA.calculator}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
          <Reveal>
            <Comparison />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="galeri-title" className="bg-paper pt-[72px] md:pt-24 xl:pt-[120px]">
        <div className="container-x mb-10 md:mb-14">
          <SectionHeader
            align="center"
            titleId="galeri-title"
            label="Ilustrasi lokasi"
            title="Lima lokasi dalam garis kontur"
            description="Ilustrasi dibuat dari nama tiap lokasi sebagai penanda visual sementara. Gambar ini bukan foto atau peta lahan."
            cta={{ href: "#daftar", label: "Buka peta per listing" }}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
        </div>
        <LocationGallery />
      </section>

      <section aria-labelledby="sumber-title" className="section-y bg-mist">
        <div className="container-x mb-10 md:mb-14">
          <SectionHeader
            align="center"
            titleId="sumber-title"
            label="Catatan sumber"
            title="Dari postingan 17 Agustus 2026"
            description="Setiap listing di situs ini merujuk pada postingan halaman Facebook Jull Chandra. Informasi baru ditambahkan setelah dikonfirmasi."
            cta={{ href: WA_GENERAL, label: "Tanya via WhatsApp", external: true }}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
        </div>
        <SourceNotes />
      </section>

      <section aria-labelledby="faq-title" className="section-y bg-surface">
        <div className="container-x grid gap-10 md:gap-14">
          <SectionHeader
            align="center"
            titleId="faq-title"
            label="Pertanyaan umum"
            title="Hal yang sering ditanyakan"
            description="Jawaban singkat seputar data listing, peta, dan survei."
            cta={CTA.survey}
          />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <Faq items={FAQ} />
            <Reveal className="hidden lg:block">
              <Art src="/art/faq-day-1x1.svg" alt="Ilustrasi kontur tanah dan petak kavling" ratio="1/1" className="rounded-(--radius-card)" sizes="50vw" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
