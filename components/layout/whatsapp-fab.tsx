import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { WA_GENERAL } from "@/lib/whatsapp";

/**
 * Tombol WhatsApp melayang. Pembungkusnya pointer-events: none sehingga tidak menelan klik di sekitarnya,
 * dan posisinya naik mengikuti tinggi cookie banner lewat --cookie-offset.
 */
export function WhatsAppFab() {
  return (
    <div className="fab-layer pointer-events-none fixed right-3 bottom-[calc(12px+var(--cookie-offset)+env(safe-area-inset-bottom))] z-(--z-fab) md:right-6 md:bottom-6">
      <a
        href={WA_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto grid size-(--fab-size) place-items-center rounded-full bg-accent text-on-accent shadow-[0_14px_30px_-10px_rgb(10_107_91/0.55)] transition-transform duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:bg-accent-strong"
        aria-label="Chat WhatsApp dengan Jull Chandra (membuka tab baru)"
      >
        <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
      </a>
    </div>
  );
}
