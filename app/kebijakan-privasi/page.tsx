import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi situs Jull Chandra: data yang diproses, penggunaan cookie, peta pihak ketiga, dan hak pengguna.",
  alternates: { canonical: "/kebijakan-privasi" },
  openGraph: { url: "/kebijakan-privasi" },
};

const SECTIONS = [
  {
    id: "ringkasan",
    title: "Ringkasan",
    body: (
      <p>
        Situs ini dikelola atas nama Jull Chandra, agen tanah kavling yang berbasis di {SITE.address.street},{" "}
        {SITE.address.locality}. Kebijakan ini menjelaskan data apa yang diproses saat Anda memakai situs, dan bagaimana
        pilihan cookie memengaruhi fungsi situs.
      </p>
    ),
  },
  {
    id: "data",
    title: "Data yang kami proses",
    body: (
      <>
        <p>
          Situs ini tidak memiliki akun pengguna dan tidak menyimpan isian formulir di server. Formulir survei hanya
          menyusun pesan di browser Anda, lalu membuka WhatsApp. Data yang Anda tulis, seperti nama, nomor WhatsApp,
          lokasi, tanggal, dan catatan, baru terkirim ketika Anda menekan tombol kirim di aplikasi WhatsApp.
        </p>
        <p>
          Penyedia hosting dapat mencatat data teknis standar, seperti alamat IP, jenis browser, dan waktu akses, untuk
          keperluan keamanan dan operasional situs.
        </p>
      </>
    ),
  },
  {
    id: "cookie",
    title: "Cookie dan penyimpanan lokal",
    body: (
      <>
        <p>Pilihan Anda di panel cookie mengatur perilaku berikut:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            <strong className="font-medium text-ink">Esensial.</strong> Cookie <code>jc_consent</code> menyimpan pilihan
            cookie Anda selama 180 hari. Cookie ini selalu aktif.
          </li>
          <li>
            <strong className="font-medium text-ink">Preferensi.</strong> Bila diizinkan, filter di halaman Kavling dan
            isian Kalkulator disimpan di penyimpanan lokal perangkat Anda. Bila izin dicabut, data tersebut dihapus.
          </li>
          <li>
            <strong className="font-medium text-ink">Peta pihak ketiga.</strong> Bila diizinkan, peta OpenStreetMap dapat
            dimuat setelah Anda menekan tombol peta. Tanpa izin ini, peta tidak dimuat.
          </li>
        </ul>
        <p>Situs ini tidak memakai cookie iklan atau pelacakan analitik.</p>
      </>
    ),
  },
  {
    id: "pihak-ketiga",
    title: "Layanan pihak ketiga",
    body: (
      <p>
        Tautan ke WhatsApp, Instagram, Facebook, Google Maps, dan OpenStreetMap membawa Anda ke layanan milik pihak lain.
        Pemrosesan data di layanan tersebut mengikuti kebijakan privasi masing-masing penyedia.
      </p>
    ),
  },
  {
    id: "hak",
    title: "Hak Anda",
    body: (
      <p>
        Anda dapat mengubah atau mencabut izin cookie kapan saja lewat tautan Pengaturan cookie di bagian bawah halaman.
        Untuk pertanyaan tentang data yang Anda kirim lewat WhatsApp, termasuk permintaan penghapusan, hubungi{" "}
        {SITE.phoneDisplay}.
      </p>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan kebijakan",
    body: <p>Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir tercantum di daftar isi.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/kebijakan-privasi"
      crumb="Kebijakan privasi"
      label="Kebijakan privasi"
      title="Kebijakan privasi situs Jull Chandra"
      description="Penjelasan singkat tentang data yang diproses, cookie, dan layanan pihak ketiga di situs ini."
      updated="17 September 2026"
      sections={SECTIONS}
    />
  );
}
