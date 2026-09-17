"use client";

import { MapTrifold } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  ratio: "16/9" | "1/1";
  className?: string;
  priority?: boolean;
  sizes?: string;
  tone?: "day" | "night";
};

/**
 * Wadah gambar dengan rasio terkunci (hanya 16:9 atau 1:1). Ruang ditahan sebelum gambar termuat,
 * dan bila gagal dimuat, fallback rapi menggantikan ikon rusak.
 */
export function Art({ src, alt, ratio, className = "", priority, sizes = "100vw", tone = "day" }: Props) {
  const [failed, setFailed] = useState(false);
  const night = tone === "night";
  return (
    <div
      className={`art ${night ? "bg-night-soft" : "bg-mist"} ${className}`}
      data-ratio={ratio}
    >
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 grid place-items-center ${night ? "text-night-muted" : "text-ink-muted"}`}
        >
          <div className="grid justify-items-center gap-2 px-4 text-center">
            <MapTrifold size={28} weight="light" aria-hidden="true" />
            <span className="text-sm">Ilustrasi belum dapat ditampilkan</span>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
