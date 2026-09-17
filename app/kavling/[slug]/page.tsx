import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/kavling/listing-card";
import { MapEmbed } from "@/components/kavling/map-embed";
import { Reveal } from "@/components/motion/reveal";
import { Art } from "@/components/ui/art";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate, formatRupiah } from "@/lib/format";
import { LISTINGS, TO_CONFIRM, UNKNOWN, getListing } from "@/lib/listings";
import { breadcrumbJsonLd, listingJsonLd } from "@/lib/structured-data";
import { waListing } from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return {};
  const path = `/kavling/${l.slug}`;
  return {
    title: `${l.title}, Bali`,
    description: `${l.summary} Informasi dari postingan ${formatDate(l.datePosted)}. Jadwalkan survei bersama Jull Chandra.`,
    alternates: { canonical: path },
    openGraph: { url: path, type: "article" },
  };
}

export default async function ListingPage({ params }: Params) {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) notFound();

  const facts = [
    { label: "Lokasi", value: `${l.area}, ${l.district}, ${l.regency}` },
    { label: "Tipe", value: l.type },
    { label: "Zona", value: l.zone ? `Zona ${l.zone.toLowerCase()}` : UNKNOWN },
    { label: "Harga per are", value: l.pricePerAre !== null ? formatRupiah(l.pricePerAre) : UNKNOWN },
    { label: "Luas", value: l.sizeM2 !== null ? `${l.sizeM2} m² atau ${(l.sizeM2 / 100).toLocaleString("id-ID")} are` : UNKNOWN },
    { label: "Akses jalan", value: l.road ?? UNKNOWN },
    { label: "Tempat terdekat", value: l.nearby.length ? l.nearby.join(", ") : UNKNOWN },
    { label: "Pemandangan", value: l.view ?? UNKNOWN },
    { label: "Skema", value: l.lease ?? UNKNOWN },
    { label: "Status sertifikat", value: UNKNOWN },
    { label: "Ketersediaan", value: TO_CONFIRM },
    { label: "Tanggal sumber", value: formatDate(l.datePosted) },
  ];
  const others = LISTINGS.filter((x) => x.slug !== l.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={listingJsonLd(l)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Kavling", path: "/kavling" },
          { name: l.area, path: `/kavling/${l.slug}` },
        ])}
      />

      <PageHero
        art={`/art/loc-${l.slug}-night-16x9.svg`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Kavling", href: "/kavling" },
          { name: l.area, href: `/kavling/${l.slug}` },
        ]}
        label={`${l.type}, ${l.regency}`}
        title={l.title}
        description={l.summary}
        cta={{ href: `/kontak?lokasi=${l.slug}#survei`, label: "Jadwalkan survei" }}
        titleClassName="md:max-w-[20ch] xl:max-w-none"
      />

      <section aria-labelledby="data-title" className="section-y bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="grid gap-10">
            <SectionHeader
              titleId="data-title"
              label="Data listing"
              title="Data yang tercantum"
              description="Data berikut disalin dari postingan sumber. Kolom bertanda Belum dicantumkan perlu ditanyakan langsung."
              cta={{ href: waListing(l.title), label: "Tanya via WhatsApp", external: true }}
              titleClassName="max-w-[14ch] md:max-w-[22ch] lg:max-w-none"
            />
            <Reveal>
              <dl className="grid gap-x-8 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-1 border-t border-line py-4">
                    <dt className="text-sm text-ink-muted">{f.label}</dt>
                    <dd className={`num font-medium ${f.value === UNKNOWN || f.value === TO_CONFIRM ? "text-ink-muted italic" : "text-ink"}`}>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Art
              src={`/art/loc-${l.slug}-day-1x1.svg`}
              alt={`Ilustrasi kontur dan petak kavling untuk ${l.area}`}
              ratio="1/1"
              className="rounded-(--radius-card)"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="peta-title" className="section-y bg-paper">
        <div className="container-x grid gap-10">
          <SectionHeader
            titleId="peta-title"
            label="Peta area"
            title={`Perkiraan area ${l.area}`}
            description="Peta dimuat setelah Anda menekan tombol. Titik menandai area desa atau kelurahan, bukan batas atau lokasi kavling."
            cta={{ href: `/kalkulator?listing=${l.slug}`, label: "Hitung luas" }}
            titleClassName="max-w-[14ch] md:max-w-none"
          />
          <Reveal>
            <MapEmbed listing={l} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="lainnya-title" className="section-y bg-mist">
        <div className="container-x grid gap-10">
          <SectionHeader
            titleId="lainnya-title"
            label="Listing lain"
            title="Lokasi lain yang bisa dibandingkan"
            description="Buka listing lain untuk membandingkan zona, skema, dan data yang sudah tercantum."
            cta={{ href: "/kavling", label: "Lihat kavling" }}
            titleClassName="max-w-[14ch] md:max-w-[22ch] xl:max-w-none"
          />
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {others.map((o, i) => (
              <Reveal as="li" key={o.slug} delay={i * 90} className={`grid ${i === 2 ? "md:hidden xl:grid" : ""}`}>
                <ListingCard l={o} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
