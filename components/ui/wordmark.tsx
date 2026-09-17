type Props = { tone?: "light" | "night"; className?: string };

/** Wordmark sementara: monogram JC + nama. Belum ada logo resmi dari klien. */
export function Wordmark({ tone = "light", className = "" }: Props) {
  const night = tone === "night";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`grid size-10 place-items-center rounded-full text-[15px] font-semibold tracking-[-0.04em] md:size-12 md:text-base ${
          night ? "bg-accent-bright text-night" : "bg-accent text-on-accent"
        }`}
      >
        JC
      </span>
      <span className={`text-xl font-medium tracking-[-0.045em] md:text-2xl ${night ? "text-night-ink" : "text-ink"}`}>
        Jull Chandra
      </span>
    </span>
  );
}
