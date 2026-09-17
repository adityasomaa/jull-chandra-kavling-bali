import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { TransitionLink } from "@/components/transition/transition-link";

export type ActionTone = "primary" | "bright" | "ghost";

export type ActionProps = {
  href: string;
  label: string;
  tone?: ActionTone;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
};

function Arrow() {
  return (
    <span className="btn-arrow" aria-hidden="true">
      <span>
        <ArrowRight size={16} weight="bold" />
      </span>
      <span>
        <ArrowRight size={16} weight="bold" />
      </span>
    </span>
  );
}

/** Tombol pil dengan panah geser, dipakai untuk semua CTA. */
export function Action({ href, label, tone = "primary", external, icon, className = "" }: ActionProps) {
  const cls = `btn btn-${tone} ${className}`;
  const content = (
    <>
      {icon}
      <span>{label}</span>
      {icon ? null : <Arrow />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={cls}>
      {content}
    </TransitionLink>
  );
}
