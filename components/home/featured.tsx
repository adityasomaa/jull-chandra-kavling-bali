import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { FEATURED } from "@/lib/listings";
import { formatDate } from "@/lib/format";

const STATS = [
  { value: "Rp 490 jt", label: "Harga per are" },
  { value: "6 m", label: "Lebar jalan kavling" },
  { value: "Pemukiman", label: "Zona lahan" },
  { value: "17 Agu 2026", label: "Tanggal sumber" },
];

/** Sorotan listing Sawangan. Komposisi section "About" pada referensi: label kiri, headline kanan, baris angka. */
export function Featured() {
  return (
    <section aria-labelledby="sorotan-title" className="section-y bg-mist">
      <div className="container-x">
        <SectionHeader
          layout="split"
          titleId="sorotan-title"
          label="Sorotan listing"
          title="Kavling villa di Sawangan, Nusa Dua"
          description="Kavling di zona pemukiman dengan jalan kavling 6 meter dan drainase, dekat Pantai Sawangan, Pantai Pandawa, dan Gunung Payung."
          cta={{ href: `/kavling/${FEATURED.slug}`, label: "Lihat detail Sawangan" }}
        />

        <dl className="mt-14 grid grid-cols-2 gap-y-10 md:mt-20 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className={`grid content-start gap-1.5 px-0 ${i % 2 === 1 ? "border-l border-line pl-5 md:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-10" : ""
              }`}
            >
              <dt className="order-2 t-body text-ink-muted">{s.label}</dt>
              <dd className="order-1 t-h3 num text-ink">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-10 text-sm text-ink-muted">
          Sumber: postingan halaman Facebook Jull Chandra, {formatDate(FEATURED.datePosted)}. Luas, status sertifikat, dan
          ketersediaan belum dicantumkan dan wajib dikonfirmasi.
        </p>
      </div>
    </section>
  );
}
