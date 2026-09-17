"use client";

import { Fragment, type ElementType } from "react";

type Props = {
  as?: ElementType;
  lines: string[];
  shown: boolean;
  className?: string;
  lineClassName?: string;
  baseDelay?: number;
  id?: string;
};

/**
 * Teks yang dipecah per huruf. aria-label dipasang sekali di parent, setiap huruf aria-hidden.
 * Kata dibungkus nowrap supaya pemenggalan hanya terjadi di antara kata.
 */
export function SplitChars({ as: Tag = "h1", lines, shown, className, lineClassName, baseDelay = 0, id }: Props) {
  const label = lines.join(" ");
  let index = 0;
  return (
    <Tag
      id={id}
      className={className}
      aria-label={label}
      data-split-chars=""
      data-shown={shown ? "true" : "false"}
      style={{ ["--base-delay" as string]: `${baseDelay}ms` }}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={lineClassName}>
          {line.split(" ").map((word, wi, arr) => (
            <Fragment key={wi}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((ch) => (
                  <span key={index} className="split-char" style={{ ["--i" as string]: index++ }}>
                    {ch}
                  </span>
                ))}
              </span>
              {wi < arr.length - 1 ? " " : null}
            </Fragment>
          ))}
          {li < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
