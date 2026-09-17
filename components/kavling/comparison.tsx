import { TransitionLink } from "@/components/transition/transition-link";
import { formatDate, formatRupiahShort } from "@/lib/format";
import { LISTINGS, UNKNOWN } from "@/lib/listings";

const ROWS = LISTINGS.map((l) => ({
  slug: l.slug,
  name: `${l.area}, ${l.district}`,
  type: l.type,
  price: l.pricePerAre !== null ? `${formatRupiahShort(l.pricePerAre)} / are` : UNKNOWN,
  size: l.sizeM2 !== null ? `${l.sizeM2} m²` : UNKNOWN,
  zone: l.zone ?? UNKNOWN,
  highlight: [l.road, l.lease, l.view ? `View ${l.view.toLowerCase()}` : null].filter(Boolean).join(", ") || UNKNOWN,
  date: formatDate(l.datePosted),
}));

const COLS = [
  { key: "type", label: "Tipe" },
  { key: "price", label: "Harga per are" },
  { key: "size", label: "Luas" },
  { key: "zone", label: "Zona" },
  { key: "highlight", label: "Catatan listing" },
  { key: "date", label: "Tanggal sumber" },
] as const;

const muted = (v: string) => (v === UNKNOWN ? "text-ink-muted italic" : "text-ink");

/**
 * Tabel perbandingan. Di layar lebar berupa tabel; di bawah 1024px berubah menjadi kartu bertumpuk
 * supaya tidak ada overflow horizontal.
 */
export function Comparison() {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-(--radius-card) bg-surface ring-1 ring-line lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Perbandingan data lima listing kavling</caption>
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[11%]" />
            <col className="w-[15%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[19%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="bg-night text-night-ink">
              <th scope="col" className="px-5 py-4 font-medium">Lokasi</th>
              {COLS.map((c) => (
                <th key={c.key} scope="col" className="px-4 py-4 font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.slug} className={i % 2 ? "bg-paper" : "bg-surface"}>
                <th scope="row" className="px-5 py-4 align-top font-medium">
                  <TransitionLink href={`/kavling/${r.slug}`} className="text-ink hover:text-accent">
                    {r.name}
                  </TransitionLink>
                </th>
                {COLS.map((c) => (
                  <td key={c.key} className={`num px-4 py-4 align-top text-[15px] break-words ${muted(r[c.key])}`}>
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
        {ROWS.map((r) => (
          <li key={r.slug} className="rounded-(--radius-card) bg-surface p-5 ring-1 ring-line">
            <h3 className="t-h5">
              <TransitionLink href={`/kavling/${r.slug}`} className="text-ink hover:text-accent">
                {r.name}
              </TransitionLink>
            </h3>
            <dl className="mt-4 grid gap-3">
              {COLS.map((c) => (
                <div key={c.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 border-t border-line pt-3 text-sm first:border-t-0 first:pt-0">
                  <dt className="text-ink-muted">{c.label}</dt>
                  <dd className={`num font-medium break-words ${muted(r[c.key])}`}>{r[c.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
