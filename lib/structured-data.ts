import { LISTINGS, type Listing } from "./listings";
import { SITE, SITE_URL } from "./site";

export function agentJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#agent`,
    name: SITE.name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: SITE.phoneE164,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: "Denpasar",
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: ["Badung", "Denpasar", "Gianyar"].map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: [SITE.instagram],
  };
}

export function listingJsonLd(l: Listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${SITE_URL}/kavling/${l.slug}#listing`,
    name: l.title,
    description: l.summary,
    url: `${SITE_URL}/kavling/${l.slug}`,
    datePosted: l.datePosted,
    image: `${SITE_URL}/art/loc-${l.slug}-day-16x9.svg`,
    provider: { "@id": `${SITE_URL}/#agent` },
    contentLocation: {
      "@type": "Place",
      name: `${l.area}, ${l.district}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: l.area,
        addressRegion: `${l.regency}, Bali`,
        addressCountry: "ID",
      },
    },
    ...(l.pricePerAre !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "IDR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: l.pricePerAre,
              priceCurrency: "IDR",
              referenceQuantity: { "@type": "QuantitativeValue", value: 100, unitCode: "MTK", unitText: "are" },
            },
          },
        }
      : {}),
  };
}

export function allListingsJsonLd() {
  return LISTINGS.map(listingJsonLd);
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
