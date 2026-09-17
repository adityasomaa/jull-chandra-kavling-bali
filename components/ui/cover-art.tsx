"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { src: string; priority?: boolean; className?: string };

/**
 * Latar dekoratif penuh. Elemen gambarnya tetap berasio 16:9 dan diperbesar sampai menutupi wadah
 * (lebar = max(lebar wadah, tinggi wadah x 16/9)), lalu dipotong oleh wadah. Tidak ada zoom saat scroll.
 */
export function CoverArt({ src, priority, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <div aria-hidden="true" className={`cover-art absolute inset-0 -z-20 overflow-hidden bg-night ${className}`}>
      {failed ? null : (
        <div className="art cover-art__frame" data-ratio="16/9">
          <Image src={src} alt="" fill sizes="100vw" priority={priority} onError={() => setFailed(true)} />
        </div>
      )}
    </div>
  );
}
