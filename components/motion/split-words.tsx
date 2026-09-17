"use client";

import type { ElementType } from "react";
import { useInView } from "./use-in-view";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  id?: string;
};

/**
 * Heading yang kata-katanya muncul bergantian dari blur, meniru reveal pada referensi.
 * Teks lengkap dibaca sekali lewat aria-label di parent, potongan kata disembunyikan dari pembaca layar.
 */
export function SplitWords({ as: Tag = "h2", text, className, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.4 });
  const words = text.split(" ");
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text} data-split="" data-shown={inView ? "true" : "false"}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" className="split-word" style={{ ["--i" as string]: i }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
