"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransition } from "./transition-provider";

type Props = ComponentProps<typeof Link> & { href: string };

/** Link internal yang menjalankan urutan transisi halaman. Klik dengan modifier tetap perilaku bawaan. */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = useTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;
    if (!href.startsWith("/")) return;
    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
