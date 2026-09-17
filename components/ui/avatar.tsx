type Props = {
  size?: "sm" | "md" | "lg";
  tone?: "light" | "night";
  caption?: boolean;
  className?: string;
};

const SIZES = {
  sm: "size-12 text-base",
  md: "size-16 text-xl",
  lg: "w-full rounded-[14px] text-6xl",
};

/** Avatar placeholder berinisial JC. Garis putus-putus dan keterangan menandai bahwa foto asli belum tersedia. */
export function Avatar({ size = "md", tone = "light", caption = false, className = "" }: Props) {
  const night = tone === "night";
  return (
    <figure className={`grid gap-2 ${size === "lg" ? "" : "justify-items-center"} ${className}`}>
      <div
        role="img"
        aria-label="Avatar placeholder Jull Chandra, foto profil belum tersedia"
        className={`relative grid aspect-square place-items-center border border-dashed ${size === "lg" ? "" : "rounded-full"} font-medium tracking-[-0.04em] ${SIZES[size]} ${
          night
            ? "border-night-muted bg-night-soft text-night-ink"
            : "border-ink-muted bg-accent-tint text-accent-strong"
        }`}
      >
        <span aria-hidden="true">JC</span>
      </div>
      {caption ? (
        <figcaption className={`text-xs ${night ? "text-night-muted" : "text-ink-muted"}`}>Placeholder foto</figcaption>
      ) : null}
    </figure>
  );
}
