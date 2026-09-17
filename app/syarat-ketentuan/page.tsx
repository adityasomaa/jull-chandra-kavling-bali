import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { ALL_PHOTOS } from "@/lib/photos";

const CREDITS = [...new Set(ALL_PHOTOS.map((p) => p.by))].join(", ");

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan situs Jull Chandra, termasuk ketentuan tentang harga, luas, dan ketersediaan kavling yang wajib dikonfirmasi.",
  alternates: { canonical: "/syarat-ketentuan" },
  openGraph: { url: "/syarat-ketentuan" },
};

const SECTIONS = [
  {
    id: "penerimaan",
    title: "Penerimaan ketentuan",
    body: <p>Dengan mengakses situs ini, Anda dianggap telah membaca dan menyetujui syarat dan ketentuan berikut.</p>,
  },
  {
    id: "informasi-listing",
    title: "Informasi listing",
    body: (
      <>
        <p>
          Informasi listing disusun dari postingan halaman Facebook Jull Chandra dan mencantumkan tanggal sumbernya. Harga,
          luas, zona, dan ketersediaan kavling dapat berubah sewaktu-waktu tanpa pemberitahuan.
        </p>
        <p>
          Seluruh informasi wajib dikonfirmasi langsung kepada Jull Chandra dan diperiksa melalui dokumen resmi sebelum Anda
          mengambil keputusan atau melakukan transaksi.
        </p>
      </>
    ),
  },
  {
    id: "bukan-nasihat",
    title: "Bukan nasihat investasi",
    body: (
      <p>
        Isi situs ini bersifat informasi umum dan bukan nasihat investasi, hukum, pajak, atau keuangan. Pertimbangkan untuk
        berkonsultasi dengan pihak yang berwenang, seperti notaris atau PPAT, sesuai kebutuhan Anda.
      </p>
    ),
  },
  {
    id: "kalkulator-peta",
    title: "Kalkulator dan peta",
    body: (
      <p>
        Hasil kalkulator adalah perkiraan dan belum termasuk pajak atau biaya lain. Titik pada peta menandai area umum, bukan
        batas atau lokasi kavling.
      </p>
    ),
  },
  {
    id: "survei",
    title: "Permintaan survei",
    body: (
      <p>
        Formulir survei membuka WhatsApp dengan pesan yang sudah disusun. Pengiriman formulir tidak otomatis menjadi
        kesepakatan jadwal. Jadwal berlaku setelah dikonfirmasi melalui WhatsApp.
      </p>
    ),
  },
  {
    id: "tanggung-jawab",
    title: "Batasan tanggung jawab",
    body: (
      <p>
        Kami berupaya menjaga informasi tetap akurat, namun tidak menjamin situs selalu bebas dari kesalahan atau selalu
        dapat diakses. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi tanpa konfirmasi.
      </p>
    ),
  },
  {
    id: "hak-cipta",
    title: "Hak cipta dan foto",
    body: (
      <>
        <p>Teks di situs ini tidak boleh disalin untuk keperluan komersial tanpa izin tertulis.</p>
        <p>
          Foto berasal dari Pexels dan dipakai sesuai lisensi Pexels. Foto tersebut adalah foto ilustrasi kawasan, bukan
          foto lahan yang ditawarkan. Fotografer: {CREDITS}.
        </p>
      </>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan ketentuan",
    body: <p>Ketentuan ini dapat diperbarui sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      path="/syarat-ketentuan"
      crumb="Syarat dan ketentuan"
      label="Syarat dan ketentuan"
      title="Syarat dan ketentuan penggunaan situs"
      description="Ketentuan singkat tentang penggunaan informasi listing, kalkulator, peta, dan formulir survei."
      updated="17 September 2026"
      sections={SECTIONS}
    />
  );
}
