"use client";

import { CaretDown, WhatsappLogo } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { TransitionLink } from "@/components/transition/transition-link";
import { Art } from "@/components/ui/art";
import { formatDate, formatRupiahShort } from "@/lib/format";
import { TO_CONFIRM, UNKNOWN, type Listing } from "@/lib/listings";
import { waListing } from "@/lib/whatsapp";
import { MapEmbed } from "./map-embed";
import { PHOTO_NOTE, listingPhoto, photoSrc } from "@/lib/photos";

export function listingFacts(l: Listing) {
  return [
    { label: "Harga per are", value: l.pricePerAre !== null ? formatRupiahShort(l.pricePerAre) : UNKNOWN, known: l.pricePerAre !== null },
    { label: "Luas", value: l.sizeM2 !== null ? `${l.sizeM2} m² (${(l.sizeM2 / 100).toLocaleString("id-ID")} are)` : UNKNOWN, known: l.sizeM2 !== null },
    { label: "Zona", value: l.zone ?? UNKNOWN, known: l.zone !== null },
    { label: "Skema", value: l.lease ?? UNKNOWN, known: l.lease !== null },
    { label: "Status sertifikat", value: UNKNOWN, known: false },
    { label: "Ketersediaan", value: TO_CONFIRM, known: false },
  ];
}

export function ListingCard({ l, headingLevel = "h3" }: { l: Listing; headingLevel?: "h2" | "h3" }) {
  const [mapOpen, setMapOpen] = useState(false);
  const mapId = useId();
  const Heading = headingLevel;

  return (
    <article className="flex flex-col rounded-(--radius-card) bg-surface p-3 ring-1 ring-line/70">
      <TransitionLink href={`/kavling/${l.slug}`} className="block rounded-[14px]" tabIndex={-1} aria-hidden="true">
        <Art
          src={photoSrc(listingPhoto(l.slug), "16x9")}
          alt=""
          ratio="16/9"
          className="rounded-[14px]"
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
        />
      </TransitionLink>

      <p className="px-2 pt-2 text-xs text-ink-muted md:px-3">{PHOTO_NOTE}</p>
      <div className="flex flex-1 flex-col gap-4 px-2 pt-4 pb-2 md:px-3">
        <ul className="flex flex-wrap gap-2" aria-label="Kategori">
          <li className="chip bg-accent-tint text-accent-strong">{l.type}</li>
          <li className="chip bg-mist text-ink">{l.regency}</li>
        </ul>
        <Heading className="t-h5 text-ink">
          <TransitionLink href={`/kavling/${l.slug}`} className="hover:text-accent">
            {l.title}
          </TransitionLink>
        </Heading>
        <p className="text-[15px] leading-relaxed text-ink-muted">{l.summary}</p>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-sm">
          {listingFacts(l).map((f) => (
            <div key={f.label} className="grid gap-0.5">
              <dt className="text-ink-muted">{f.label}</dt>
              <dd className={`num font-medium ${f.known ? "text-ink" : "text-ink-muted italic"}`}>{f.value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-xs text-ink-muted">Sumber: postingan Facebook, {formatDate(l.datePosted)}</p>

        <div className="mt-auto grid gap-2 pt-1 sm:grid-cols-2">
          <TransitionLink href={`/kavling/${l.slug}`} className="btn btn-primary">
            Lihat detail
          </TransitionLink>
          <a href={waListing(l.title)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <WhatsappLogo size={18} aria-hidden="true" />
            Tanya
            <span className="sr-only"> tentang {l.area} lewat WhatsApp (membuka tab baru)</span>
          </a>
        </div>

        <button
          type="button"
          aria-expanded={mapOpen}
          aria-controls={mapId}
          onClick={() => setMapOpen((v) => !v)}
          className="flex min-h-11 items-center justify-between rounded-(--radius-field) bg-mist px-4 text-sm font-medium text-ink hover:bg-accent-tint"
        >
          {mapOpen ? "Sembunyikan peta area" : "Tampilkan peta area"}
          <CaretDown size={16} aria-hidden="true" className={`transition-transform ${mapOpen ? "rotate-180" : ""}`} />
        </button>
        <div id={mapId} hidden={!mapOpen}>
          {mapOpen ? <MapEmbed listing={l} /> : null}
        </div>
      </div>
    </article>
  );
}
