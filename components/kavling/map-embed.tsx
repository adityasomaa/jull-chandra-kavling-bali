"use client";

import { ArrowSquareOut, MapPin, ShieldCheck } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { setConsent, useConsent } from "@/lib/consent";
import type { Listing } from "@/lib/listings";

function osmUrls(l: Listing) {
  const { lat, lon } = l.areaPoint;
  const dLon = 0.02;
  const dLat = 0.013;
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].map((n) => n.toFixed(4)).join(",");
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`,
    link: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`,
  };
}

/**
 * Peta area per listing. Iframe baru dimuat setelah tombol ditekan, dan hanya bila izin
 * "Peta pihak ketiga" sudah diberikan. Titik menandai area desa/kelurahan, bukan kavling.
 */
export function MapEmbed({ listing, className = "" }: { listing: Listing; className?: string }) {
  const consent = useConsent();
  const [requested, setRequested] = useState(false);
  const [asking, setAsking] = useState(false);
  const noteId = useId();
  const urls = osmUrls(listing);
  const loaded = requested && consent.maps;

  const onLoad = () => {
    if (consent.maps) setRequested(true);
    else setAsking(true);
  };

  return (
    <div className={`grid gap-3 ${className}`}>
      <div className="art rounded-[14px] bg-mist" data-ratio="16/9">
        {loaded ? (
          <iframe
            title={`Peta area ${listing.area}, ${listing.district}`}
            src={urls.embed}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_55%,var(--color-accent-tint),var(--color-mist)_70%)] p-4 text-center">
            {asking ? (
              <div className="grid max-w-sm justify-items-center gap-3" role="group" aria-labelledby={`${noteId}-ask`}>
                <ShieldCheck size={26} aria-hidden="true" className="text-accent" />
                <p id={`${noteId}-ask`} className="text-sm text-ink">
                  Peta dimuat dari OpenStreetMap, yang dapat menerima data teknis seperti alamat IP. Izinkan peta pihak ketiga?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setConsent({ preferences: consent.preferences, maps: true });
                      setAsking(false);
                      setRequested(true);
                    }}
                  >
                    Izinkan dan muat
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setAsking(false)}>
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid justify-items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-accent text-on-accent">
                  <MapPin size={24} weight="fill" aria-hidden="true" />
                </span>
                <button type="button" className="btn btn-primary" onClick={onLoad} aria-describedby={noteId}>
                  Muat peta area
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
        <p id={noteId}>Titik menandai area {listing.area}, bukan lokasi kavling yang sebenarnya.</p>
        <a
          href={urls.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline"
        >
          Buka di OpenStreetMap
          <ArrowSquareOut size={14} aria-hidden="true" />
          <span className="sr-only">(membuka tab baru)</span>
        </a>
      </div>
    </div>
  );
}
