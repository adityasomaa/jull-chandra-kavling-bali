import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { PageHero } from "./page-hero";
import { PHOTOS, photoSrc } from "@/lib/photos";

type Section = { id: string; title: string; body: ReactNode };

type Props = {
  path: string;
  crumb: string;
  label: string;
  title: string;
  description: string;
  updated: string;
  sections: Section[];
};

/** Kerangka halaman hukum: hero + daftar isi + isi dengan ritme baca 65ch. */
export function LegalPage({ path, crumb, label, title, description, updated, sections }: Props) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: crumb, path }])} />
      <PageHero
        art={photoSrc(PHOTOS.pageLegal, "16x9")}
        crumbs={[
          { name: "Home", href: "/" },
          { name: crumb, href: path },
        ]}
        label={label}
        title={title}
        description={description}
        cta={{ href: "#isi", label: "Baca isi" }}
      />
      <section id="isi" aria-label={title} className="section-y scroll-mt-24 bg-paper">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="Daftar isi" className="lg:col-span-4">
            <div className="grid gap-3 rounded-(--radius-card) bg-mist p-6 lg:sticky lg:top-32">
              <p className="t-label text-ink">Daftar isi</p>
              <ol className="grid list-decimal gap-2 pl-5 text-ink-muted marker:text-ink-muted">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-accent">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-sm text-ink-muted">Terakhir diperbarui {updated}.</p>
            </div>
          </nav>
          <div className="legal grid max-w-[68ch] gap-10 lg:col-span-8">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="grid scroll-mt-28 gap-3">
                <h2 className="t-h5 text-ink">{s.title}</h2>
                <div className="t-body grid gap-3 text-ink-muted">{s.body}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
