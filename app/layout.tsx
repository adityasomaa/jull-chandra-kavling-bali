import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/json-ld";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { SiteProviders } from "@/components/providers/site-providers";
import { SITE, SITE_URL } from "@/lib/site";
import { agentJsonLd } from "@/lib/structured-data";
import "./globals.css";

// Geist (SIL Open Font License 1.1), di-self-host sebagai WOFF2 variabel.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: "%s | Jull Chandra" },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  keywords: ["tanah kavling Bali", "jual tanah kavling Bali", "kavling Nusa Dua", "kavling Denpasar", "tanah dekat Ubud", "harga tanah per are", "agen tanah Bali"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b2221",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={geist.variable} suppressHydrationWarning>
      <head>
        <script
          // Menandai JS aktif sebelum paint, supaya status awal animasi reveal hanya berlaku bila JS jalan.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js-ready')" }}
        />
        <noscript>
          <style>{".loader-home,.loader-curtain{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#konten"
          className="fixed top-3 left-3 z-(--z-skip) -translate-y-[200%] rounded-full bg-ink px-5 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Langsung ke konten
        </a>
        <JsonLd data={agentJsonLd()} />
        <SiteProviders>
          <Header />
          <main id="konten" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppFab />
          <CookieConsent />
        </SiteProviders>
      </body>
    </html>
  );
}
