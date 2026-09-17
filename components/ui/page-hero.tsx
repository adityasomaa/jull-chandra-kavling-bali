import type { ReactNode } from "react";
import { TransitionLink } from "@/components/transition/transition-link";
import type { ActionProps } from "./action";
import { CoverArt } from "./cover-art";
import { SectionHeader } from "./section-header";

type Props = {
  label: string;
  title: string;
  description: ReactNode;
  cta: ActionProps | ReactNode;
  art: string;
  crumbs: { name: string; href: string }[];
  titleClassName?: string;
};

/** Hero halaman dalam: panel gelap dengan ilustrasi kontur, memakai SectionHeader sebagai h1. */
export function PageHero({ label, title, description, cta, art, crumbs, titleClassName }: Props) {
  return (
    <section className="on-night relative isolate bg-night text-night-ink">
      <CoverArt src={art} priority />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_34_33/0.94)_0%,rgb(11_34_33/0.72)_55%,rgb(11_34_33/0.4)_100%)]"
      />
      <div className="container-x grid gap-6 pt-[112px] pb-16 md:pt-[180px] md:pb-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-night-muted">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i < crumbs.length - 1 ? (
                  <>
                    <TransitionLink href={c.href} className="underline-offset-4 hover:text-night-ink hover:underline">
                      {c.name}
                    </TransitionLink>
                    <span aria-hidden="true">/</span>
                  </>
                ) : (
                  <span aria-current="page" className="text-night-ink">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <SectionHeader
          as="h1"
          tone="night"
          label={label}
          title={title}
          description={description}
          cta={cta}
          titleClassName={titleClassName ?? "md:max-w-[18ch] xl:max-w-none"}
        />
      </div>
    </section>
  );
}
