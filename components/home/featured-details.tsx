import { Reveal } from "@/components/motion/reveal";
import { Art } from "@/components/ui/art";
import { SectionHeader } from "@/components/ui/section-header";
import { CTA } from "@/lib/site";
import { PHOTOS, photoSrc } from "@/lib/photos";

type Card = {
  title: string;
  text: string;
  tags: string[];
  src: string;
  ratio: "16/9" | "1/1";
  alt: string;
  className: string;
};

const CARDS: Card[] = [
  {
    title: "Jalan kavling 6 meter",
    text: "Jalan di dalam area kavling selebar 6 meter dan dilengkapi drainase.",
    tags: ["Akses", "Drainase"],
    src: photoSrc(PHOTOS.road, "16x9"),
    ratio: "16/9",
    alt: PHOTOS.road.alt,
    className: "lg:col-start-1 lg:row-start-2 lg:self-end",
  },
  {
    title: "Zona pemukiman",
    text: "Menurut informasi listing, lahan berada di zona pemukiman dan ditawarkan sebagai kavling villa.",
    tags: ["Zonasi", "Kavling villa"],
    src: photoSrc(PHOTOS.villa, "16x9"),
    ratio: "16/9",
    alt: PHOTOS.villa.alt,
    className: "lg:col-start-2 lg:row-start-2 lg:self-end lg:min-h-[480px]",
  },
  {
    title: "Pantai dan bukit terdekat",
    text: "Listing menyebut Pantai Sawangan, Pantai Pandawa, dan Gunung Payung. Jarak tepatnya dikonfirmasi saat survei.",
    tags: ["Pantai Sawangan", "Pandawa", "Gunung Payung"],
    src: photoSrc(PHOTOS.coast, "1x1"),
    ratio: "1/1",
    alt: PHOTOS.coast.alt,
    className: "lg:col-start-3 lg:row-span-2 lg:row-start-1",
  },
];

/**
 * Detail Sawangan. Komposisi section "Our solutions" pada referensi:
 * header di kiri atas, tiga kartu dengan tinggi berjenjang yang rata bawah.
 */
export function FeaturedDetails() {
  return (
    <section aria-labelledby="detail-title" className="section-y bg-paper">
      <div className="container-x grid gap-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
        <SectionHeader
          className="mb-6 lg:col-span-2 lg:mb-0"
          titleId="detail-title"
          label="Detail Sawangan"
          title="Akses, zona, dan pantai terdekat"
          description="Tiga hal yang disebut di listing Sawangan. Harga per are yang tercantum bisa langsung dihitung di kalkulator."
          cta={{ ...CTA.calculator, href: "/kalkulator?listing=sawangan-nusa-dua" }}
          titleClassName="max-w-[14ch] md:max-w-[20ch] xl:max-w-none"
        />

        {CARDS.map((card, i) => (
          <Reveal
            key={card.title}
            as="article"
            delay={i * 110}
            className={`on-night flex flex-col justify-between gap-6 rounded-(--radius-card) bg-night-soft p-3 text-night-ink ${card.className}`}
          >
            <div className="grid gap-3 px-3 pt-3">
              <h3 className="t-h4">{card.title}</h3>
              <p className="t-body text-night-muted">{card.text}</p>
            </div>
            <div className="relative">
              <Art
                src={card.src}
                alt={card.alt}
                ratio={card.ratio}
                tone="night"
                className="rounded-[14px]"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <ul className="absolute right-3 bottom-3 left-3 flex flex-wrap gap-2" aria-label="Kata kunci">
                {card.tags.map((t) => (
                  <li key={t} className="chip bg-surface text-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
