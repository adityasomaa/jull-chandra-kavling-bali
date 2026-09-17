import type { MetadataRoute } from "next";
import { LISTINGS } from "@/lib/listings";
import { SITE_URL } from "@/lib/site";

const UPDATED = new Date("2026-09-17T00:00:00+08:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/kavling", priority: 0.9 },
    { path: "/kalkulator", priority: 0.7 },
    { path: "/kontak", priority: 0.8 },
    { path: "/kebijakan-privasi", priority: 0.3 },
    { path: "/syarat-ketentuan", priority: 0.3 },
  ];
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...LISTINGS.map((l) => ({
      url: `${SITE_URL}/kavling/${l.slug}`,
      lastModified: new Date(`${l.datePosted}T00:00:00+08:00`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
