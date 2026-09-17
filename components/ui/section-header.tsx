import type { ReactNode } from "react";
import { SplitWords } from "@/components/motion/split-words";
import { Reveal } from "@/components/motion/reveal";
import { Action, type ActionProps } from "./action";

type Props = {
  /** 1. judul section */
  label: string;
  /** 2. headline */
  title: string;
  /** 3. deskripsi singkat */
  description: ReactNode;
  /** 4. CTA */
  cta: ActionProps | ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  /** "split": label di kiri, isi di kanan (komposisi section About pada referensi) */
  layout?: "stack" | "split";
  tone?: "light" | "night";
  titleId?: string;
  className?: string;
  titleClassName?: string;
};

function isActionProps(value: unknown): value is ActionProps {
  return typeof value === "object" && value !== null && "href" in value && "label" in value;
}

/**
 * Satu komponen header untuk semua section, selalu dengan urutan:
 * judul section -> headline -> deskripsi singkat -> CTA.
 */
export function SectionHeader({
  label,
  title,
  description,
  cta,
  as = "h2",
  align = "left",
  layout = "stack",
  tone = "light",
  titleId,
  className = "",
  titleClassName = "",
}: Props) {
  const night = tone === "night";
  const center = align === "center";
  // Di section gelap teks berada di atas foto, jadi semua teks memakai night-ink agar kontras tetap AA.
  const labelCls = `t-label ${night ? "text-night-ink" : "text-ink-muted"}`;
  const titleCls = `${as === "h1" ? "t-display" : "t-h2"} ${night ? "text-night-ink" : "text-ink"} ${titleClassName}`;
  const descCls = `t-body max-w-[60ch] ${night ? "text-night-ink" : "text-ink-muted"} ${center ? "mx-auto" : ""}`;
  const ctaNode = isActionProps(cta) ? <Action tone={night ? "bright" : "primary"} {...cta} /> : cta;

  if (layout === "split") {
    return (
      <div className={`grid gap-4 lg:grid-cols-12 lg:gap-8 ${className}`}>
        <Reveal className="lg:col-span-3">
          <p className={labelCls}>{label}</p>
        </Reveal>
        <div className="grid gap-5 lg:col-span-9 lg:gap-6">
          <SplitWords as={as} id={titleId} text={title} className={titleCls} />
          <Reveal delay={120}>
            <p className={descCls}>{description}</p>
          </Reveal>
          <Reveal delay={200}>{ctaNode}</Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${center ? "justify-items-center text-center" : ""} ${className}`}>
      <Reveal>
        <p className={labelCls}>{label}</p>
      </Reveal>
      <SplitWords as={as} id={titleId} text={title} className={`${titleCls} ${center ? "mx-auto" : ""}`} />
      <Reveal delay={120} className="mt-1">
        <p className={descCls}>{description}</p>
      </Reveal>
      <Reveal delay={200} className="mt-2">
        {ctaNode}
      </Reveal>
    </div>
  );
}
