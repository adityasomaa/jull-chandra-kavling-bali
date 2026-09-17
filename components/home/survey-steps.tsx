import { CalendarCheck, ChatCircleText, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { CTA } from "@/lib/site";

const STEPS = [
  {
    word: "Pilih",
    icon: MapTrifold,
    title: "Pilih lokasi yang ingin dilihat",
    text: "Bandingkan listing di halaman Kavling, lalu tentukan lokasi yang paling sesuai.",
  },
  {
    word: "Kirim",
    icon: ChatCircleText,
    title: "Kirim jadwal lewat WhatsApp",
    text: "Isi nama, nomor, lokasi, dan tanggal. Formulir menyusun pesannya untuk Anda.",
  },
  {
    word: "Survei",
    icon: CalendarCheck,
    title: "Konfirmasi lalu cek lokasinya",
    text: "Jadwal dikonfirmasi lewat WhatsApp. Harga, luas, dan status lahan ditanyakan langsung.",
  },
];

/** Cara survei dalam tiga langkah. Komposisi section "How it works" pada referensi. */
export function SurveySteps() {
  return (
    <section aria-labelledby="survei-title" className="section-y bg-paper">
      <div className="container-x">
        <SectionHeader
          align="center"
          titleId="survei-title"
          label="Cara survei"
          title="Tiga langkah menuju survei lokasi"
          description="Survei membantu Anda melihat akses, lingkungan, dan kondisi lahan secara langsung sebelum mengambil keputusan."
          cta={CTA.survey}
          titleClassName="max-w-[14ch] md:max-w-[20ch] xl:max-w-none"
        />
        <ol className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                as="li"
                key={s.word}
                delay={i * 110}
                className="flex min-h-[320px] flex-col justify-between gap-10 rounded-(--radius-card) bg-mist p-4 md:min-h-[400px] md:p-6 xl:min-h-[454px]"
              >
                <div className="flex items-start justify-between gap-4 px-2 pt-2">
                  <p className="t-h3 text-ink" aria-hidden="true">
                    {s.word}
                  </p>
                  <span className="grid size-12 place-items-center rounded-full bg-accent text-on-accent">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                </div>
                <div className="grid gap-3 rounded-2xl bg-surface p-6">
                  <h3 className="t-h5 text-ink">
                    <span className="sr-only">Langkah {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="t-body text-ink-muted">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
