"use client";

import { InstagramLogo, MapPin, WhatsappLogo, FacebookLogo } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/transition-link";
import { CoverArt } from "@/components/ui/cover-art";
import { SectionHeader } from "@/components/ui/section-header";
import { Wordmark } from "@/components/ui/wordmark";
import { openCookieSettings } from "@/lib/consent";
import { CTA, NAV, SITE } from "@/lib/site";
import { WA_GENERAL } from "@/lib/whatsapp";
import { PHOTOS, photoSrc } from "@/lib/photos";

/**
 * CTA penutup + footer (komposisi "CTA & Footer" pada referensi).
 * CTA bertukar target otomatis: di halaman Kontak (tujuan survei) ia mengarah ke daftar kavling.
 */
export function Footer() {
  const pathname = usePathname();
  const onSurveyPage = pathname.startsWith("/kontak");

  const cta = onSurveyPage
    ? {
        label: "Langkah berikutnya",
        title: "Bandingkan dulu lima lokasi kavling",
        description: "Lihat listing di Nusa Dua, Denpasar, Ubud, dan Pejeng sebelum menentukan jadwal survei.",
        action: CTA.listings,
      }
    : {
        label: "Langkah berikutnya",
        title: "Lihat lokasinya langsung bersama Jull",
        description: "Pilih lokasi dan tanggal, lalu kirim permintaan survei lewat WhatsApp. Detail akan dikonfirmasi langsung.",
        action: CTA.survey,
      };

  const year = 2026;

  return (
    <footer className="on-night relative isolate bg-night text-night-ink">
      <CoverArt src={photoSrc(PHOTOS.cta, "16x9")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/72" />

      <div className="container-x pt-20 pb-16 md:pt-24 md:pb-20">
        <SectionHeader
          key={cta.title}
          tone="night"
          align="center"
          label={cta.label}
          title={cta.title}
          description={cta.description}
          cta={cta.action}
          titleClassName="max-w-[16ch] md:max-w-[22ch] xl:max-w-none"
        />
      </div>

      <div className="px-3 pb-[calc(var(--fab-size)+28px+var(--cookie-offset))] md:px-[30px] md:pb-10">
        <div className="mx-auto max-w-[1380px] rounded-(--radius-card) bg-surface px-5 py-10 text-ink md:px-12 md:py-12">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="grid content-start gap-5 lg:col-span-5">
              <Wordmark />
              <p className="t-body max-w-[42ch] text-ink">
                Agen tanah kavling di Bali yang berbasis di Renon, Denpasar.
              </p>
              <p className="flex items-start gap-2 text-ink-muted">
                <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                <span>
                  {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}
                </span>
              </p>
            </div>

            <nav aria-label="Halaman" className="grid content-start gap-4 lg:col-span-2">
              <p className="t-label text-accent">Halaman</p>
              <ul className="grid gap-2.5">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <TransitionLink href={n.href} className="t-body text-ink hover:text-accent">
                      {n.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Informasi" className="grid content-start gap-4 lg:col-span-2">
              <p className="t-label text-accent">Informasi</p>
              <ul className="grid gap-2.5">
                <li>
                  <TransitionLink href="/kebijakan-privasi" className="t-body text-ink hover:text-accent">
                    Kebijakan privasi
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink href="/syarat-ketentuan" className="t-body text-ink hover:text-accent">
                    Syarat dan ketentuan
                  </TransitionLink>
                </li>
                <li>
                  <button type="button" onClick={openCookieSettings} className="t-body text-left text-ink hover:text-accent">
                    Pengaturan cookie
                  </button>
                </li>
              </ul>
            </nav>

            <div className="grid content-start gap-4 lg:col-span-3">
              <p className="t-label text-accent">Kontak</p>
              <ul className="grid gap-2.5">
                <li>
                  <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="t-body inline-flex items-center gap-2 text-ink hover:text-accent">
                    <WhatsappLogo size={20} aria-hidden="true" />
                    WhatsApp {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="t-body inline-flex items-center gap-2 text-ink hover:text-accent">
                    <InstagramLogo size={20} aria-hidden="true" />
                    Instagram {SITE.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={SITE.facebookSearch} target="_blank" rel="noopener noreferrer" className="t-body inline-flex items-start gap-2 text-ink hover:text-accent">
                    <FacebookLogo size={20} aria-hidden="true" className="mt-1 shrink-0" />
                    <span>Cari halaman Facebook Jull Chandra</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
            <p>&copy; {year} Jull Chandra. Seluruh hak dilindungi.</p>
            <p>Harga, luas, dan ketersediaan wajib dikonfirmasi sebelum transaksi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
