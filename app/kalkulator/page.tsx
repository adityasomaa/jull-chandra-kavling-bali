import { Equals, Ruler } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { Calculator } from "@/components/kalkulator/calculator";
import { Reveal } from "@/components/motion/reveal";
import { Art } from "@/components/ui/art";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { CTA } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { PHOTOS, photoSrc } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Kalkulator Luas dan Harga Tanah per Are",
  description:
    "Kalkulator tanah kavling Bali: konversi are ke meter persegi dan sebaliknya, lalu hitung perkiraan total harga dari harga per are yang tercantum.",
  alternates: { canonical: "/kalkulator" },
  openGraph: { url: "/kalkulator" },
};

const NOTES = [
  { icon: Ruler, title: "1 are = 100 m²", text: "Konversi dasar yang dipakai kalkulator ini. Contohnya, 2,5 are sama dengan 250 m²." },
  { icon: Equals, title: "Luas × harga per are", text: "Total dihitung dari luas dalam are dikali harga per are. Pajak dan biaya lain belum termasuk." },
];

export default function KalkulatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Kalkulator", path: "/kalkulator" }])} />
      <PageHero
        art={photoSrc(PHOTOS.pageKalkulator, "16x9")}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Kalkulator", href: "/kalkulator" },
        ]}
        label="Kalkulator"
        title="Kalkulator luas dan harga kavling"
        description="Ubah are ke meter persegi dan sebaliknya, lalu lihat perkiraan total dari harga per are yang tercantum di listing."
        cta={{ href: "#kalkulator", label: "Mulai menghitung" }}
      />

      <section id="kalkulator" aria-labelledby="hitung-title" className="section-y scroll-mt-24 bg-mist">
        <div className="container-x grid gap-10">
          <SectionHeader
            titleId="hitung-title"
            label="Hitung"
            title="Konversi luas dan perkiraan harga"
            description="Pilih listing untuk mengisi harga per are secara otomatis. Bila harga per are kosong, hanya konversi luas yang ditampilkan."
            cta={CTA.survey}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
          <Suspense fallback={<div className="h-[560px] rounded-(--radius-card) bg-surface" aria-hidden="true" />}>
            <Calculator />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="satuan-title" className="section-y bg-paper">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="grid gap-10">
            <SectionHeader
              titleId="satuan-title"
              label="Satuan"
              title="Membaca harga per are"
              description="Harga tanah di Bali umumnya disebut per are. Dengan satuan yang sama, beberapa listing lebih mudah dibandingkan."
              cta={CTA.listings}
              titleClassName="max-w-[14ch] md:max-w-[22ch] lg:max-w-none"
            />
            <ul className="grid gap-8 sm:grid-cols-2">
              {NOTES.map((n, i) => {
                const Icon = n.icon;
                return (
                  <Reveal as="li" key={n.title} delay={i * 100} className="grid content-start gap-4">
                    <span className="grid size-14 place-items-center rounded-full bg-accent text-on-accent">
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <h3 className="t-h4 num text-ink">{n.title}</h3>
                    <p className="t-body text-ink-muted">{n.text}</p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
          <Reveal delay={120}>
            <Art
              src={photoSrc(PHOTOS.measure, "1x1")}
              alt={PHOTOS.measure.alt}
              ratio="1/1"
              className="rounded-(--radius-card)"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
