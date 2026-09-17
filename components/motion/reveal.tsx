"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "./use-in-view";

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** Konten muncul dari bawah dengan blur halus saat masuk viewport. Terlihat penuh tanpa JS. */
export function Reveal({ as: Tag = "div", delay = 0, className, children, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      data-shown={inView ? "true" : "false"}
      className={className}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
