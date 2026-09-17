import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { SurveyForm } from "@/components/kontak/survey-form";
import { Reveal } from "@/components/motion/reveal";
import { Art } from "@/components/ui/art";
import { Avatar } from "@/components/ui/avatar";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { WA_GENERAL } from "@/lib/whatsapp";
import { PHOTOS, photoSrc } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Kontak dan Jadwal Survei Kavling",
  description:
    "Hubungi Jull Chandra di Renon, Denpasar, lewat WhatsApp 0819-3432-5222 atau Instagram @jull.chandra. Jadwalkan survei tanah kavling di Bali dengan formulir singkat.",
  alternates: { canonical: "/kontak" },
  openGraph: { url: "/kontak" },
};

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, Renon, Denpasar, Bali`)}`;

const CHANNELS = [
  {
    key: "profil",
    title: "Jull Chandra",
    role: "Agen tanah kavling, Renon, Denpasar",
    href: null,
    media: "avatar",
  },
  {
    key: "wa",
    title: `WhatsApp ${SITE.phoneDisplay}`,
    role: `WhatsApp Business atas nama ${SITE.waName}`,
    href: WA_GENERAL,
    media: photoSrc(PHOTOS.house, "1x1"),
  },
  {
    key: "ig",
    title: `Instagram ${SITE.instagramHandle}`,
    role: "Akun Instagram Jull Chandra",
    href: SITE.instagram,
    media: photoSrc(PHOTOS.palms, "1x1"),
  },
];

export default function KontakPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Kontak", path: "/kontak" }])} />
      <PageHero
        art={photoSrc(PHOTOS.pageKontak, "16x9")}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Kontak", href: "/kontak" },
        ]}
        label="Kontak"
        title="Hubungi Jull Chandra di Renon, Denpasar"
        description={`Tanyakan listing atau jadwalkan survei lokasi. Alamat: ${SITE.address.street}, ${SITE.address.locality}.`}
        cta={{ href: "#survei", label: "Isi formulir survei" }}
      />

      <section id="survei" aria-labelledby="form-title" className="section-y scroll-mt-24 bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="grid content-start gap-8 lg:col-span-5">
            <SectionHeader
              titleId="form-title"
              label="Jadwalkan survei"
              title="Formulir survei lokasi"
              description="Pilih lokasi, tanggal, dan waktu. Setelah dikirim, WhatsApp terbuka dengan pesan yang sudah tersusun, dan jadwal dikonfirmasi di sana."
              cta={{ href: WA_GENERAL, label: "Chat WhatsApp", external: true }}
              titleClassName="max-w-[14ch] md:max-w-none"
            />
            <Reveal className="hidden lg:block">
              <Art src={photoSrc(PHOTOS.siteVisit, "16x9")} alt={PHOTOS.siteVisit.alt} ratio="16/9" className="rounded-(--radius-card)" sizes="40vw" />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="h-[640px] rounded-(--radius-card) bg-surface" aria-hidden="true" />}>
              <SurveyForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="kanal-title" className="section-y bg-paper">
        <div className="container-x grid gap-10 md:gap-14">
          <SectionHeader
            align="center"
            titleId="kanal-title"
            label="Kanal kontak"
            title="Tiga cara menghubungi Jull"
            description="WhatsApp adalah jalur tercepat untuk pertanyaan listing. Instagram dan halaman Facebook memuat postingan terbaru."
            cta={{ href: MAPS_URL, label: "Buka alamat di peta", external: true }}
            titleClassName="max-w-[14ch] md:max-w-none"
          />
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {CHANNELS.map((c, i) => {
              const inner = (
                <>
                  {c.media === "avatar" ? (
                    <div className="aspect-square p-6">
                      <Avatar size="lg" />
                    </div>
                  ) : (
                    <Art src={c.media} alt="" ratio="1/1" sizes="(min-width: 1024px) 33vw, 100vw" />
                  )}
                  <div className="absolute inset-x-3 bottom-3 grid gap-1 rounded-2xl bg-surface/95 p-5 ring-1 ring-line">
                    <h3 className="t-h5 break-words text-ink">{c.title}</h3>
                    <p className="text-ink-muted">{c.role}</p>
                  </div>
                </>
              );
              return (
                <Reveal as="li" key={c.key} delay={i * 100} className={i === 2 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-10px)] lg:col-span-1 lg:w-auto" : ""}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block overflow-hidden rounded-(--radius-card) bg-mist ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-28px_rgb(12_43_42/0.45)]"
                    >
                      {inner}
                      <span className="sr-only"> (membuka tab baru)</span>
                    </a>
                  ) : (
                    <div className="relative overflow-hidden rounded-(--radius-card) bg-accent-tint ring-1 ring-line">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
          <Reveal className="grid gap-2 rounded-(--radius-card) bg-mist p-6 text-center md:p-8">
            <p className="t-label text-ink">Alamat</p>
            <p className="t-body text-ink-muted">
              {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}
            </p>
            <p className="text-sm text-ink-muted">
              Halaman Facebook: {SITE.facebookPageName}.{" "}
              <a href={SITE.facebookSearch} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-4">
                Cari di Facebook
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
