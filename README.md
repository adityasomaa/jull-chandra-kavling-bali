# Jull Chandra, tanah kavling di Bali

Situs personal untuk Jull Chandra, agen tanah kavling yang berbasis di Jl. Tukad Balian No. 168, Renon, Denpasar.
Empat halaman utama (Home, Kavling, Kalkulator, Kontak), lima halaman detail listing, serta halaman kebijakan privasi dan syarat ketentuan.

- Produksi: https://jullchandra-kavling-bali.vercel.app
  (alias `jull-chandra-kavling-bali.vercel.app` sudah dipegang akun Vercel lain, status 409, jadi dipakai nama terdekat yang kosong. Canonical, sitemap, dan robots mengikuti domain ini lewat `SITE_URL` di `lib/site.ts`.)
- Subdomain: https://jull-chandra-kavling-bali.onyxcreative.asia

## Stack

| Bagian | Pilihan |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.3, TypeScript, semua halaman statis |
| Styling | Tailwind CSS 4.3 (`@tailwindcss/postcss`), CSS kustom seluruhnya di dalam `@layer` |
| Gerak | CSS transition + IntersectionObserver untuk reveal, `motion` (`useScroll`) untuk section lokasi yang menempel, Lenis untuk smooth scroll desktop |
| Ikon | `@phosphor-icons/react` |
| Font | Geist Variable, WOFF2 self-host lewat `next/font/local` |
| Gambar | SVG generatif dari `scripts/generate-art.mjs`, `images.unoptimized = true` |

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run art          # membuat ulang semua ilustrasi di public/art
node scripts/check-contrast.mjs        # cek kontras semua pasangan token
node scripts/audit-site.mjs <baseUrl>  # audit (butuh playwright terpasang terpisah)
```

## Keputusan desain

Knob desain: **DESIGN_VARIANCE 3 / MOTION_INTENSITY 3 / VISUAL_DENSITY 3** (default, karena struktur sudah dikunci oleh referensi).

### Warna aksen: jade `#0A6B5B`

Tanah kavling di Bali paling sering dibayangkan lewat dua lanskap: sawah bertingkat dan laut di selatan (Nusa Dua). Hijau kebiruan jade menyatukan keduanya tanpa jatuh ke hijau "pertanian" atau emas "investasi" yang terasa menjual. Warnanya tenang dan dipercaya, cocok dengan nada personal dan tidak hard selling.

- Latar terang memakai netral dingin (`paper #F1F4F1`, `mist #E3E9E4`), bukan krem, supaya aksen tetap bersih.
- Section gelap memakai `night #0B2221`, turunan gelap dari hue yang sama, dengan nada terang `accent-bright #7FD8C1`. Satu aksen, dua nada, bukan dua warna.
- Semua pasangan teks dan latar lolos WCAG AA 4.5:1 (terendah 5.22:1). Jalankan `node scripts/check-contrast.mjs` setiap kali token diubah; script membaca langsung dari `app/globals.css`.

### Font: Geist

Neue Montreal tersedia di komputer, tetapi lisensi Pangram Pangram untuk pemakaian komersial di web tidak bisa dipastikan dari file yang ada. Geist dipilih karena:

- Berlisensi SIL Open Font License 1.1 (salinan lisensi di `app/fonts/Geist-OFL.txt`), jadi aman di-self-host.
- Grotesk yang rapat dan presisi, dekat dengan rasa BDO Grotesk di referensi, dengan angka tabular yang rapi untuk harga, luas, dan tanggal.
- Tersedia sebagai satu file WOFF2 variabel, jadi seluruh ketebalan hanya butuh satu unduhan.

File TTF di `assets/og` hanya dipakai server saat membuat OG image, tidak dikirim ke browser.

### Bahasa visual gambar

Semua gambar adalah SVG deterministik dari `scripts/generate-art.mjs`: garis kontur tanah (marching squares di atas medan ketinggian), petak kavling dengan jalan di tengah, dan cakrawala bukit berlapis. Seed diambil dari nama lokasi, jadi tiap lokasi punya kontur dan susunan petak sendiri, dan hasilnya selalu sama saat dibuat ulang. Tanpa grain atau noise; kedalaman datang dari gradasi dan garis.

Rasio hanya 16:9 dan 1:1, dikunci di komponen `Art` lewat `aspect-ratio` sehingga ruang tertahan sebelum gambar termuat. Latar penuh (hero, CTA) tetap memakai elemen 16:9 yang diperbesar hingga menutup wadah (`CoverArt`), bukan rasio bebas. Bila gambar gagal dimuat, `Art` menampilkan panel dengan ikon peta dan keterangan, bukan ikon rusak.

## Referensi layout: farmio.framer.website

Situs referensi dibuka dan diukur di 1440, 810, dan 390 px (urutan section, skala tipografi 62/52/42/32/24/20, nav pil putih 1320 px dengan radius 56, kartu radius 20, tombol pil dengan panah geser). Tidak ada kode Framer yang disalin; semua dibangun ulang.

### Yang diambil

| Referensi | Di situs ini |
| --- | --- |
| Nav pil putih mengambang, CTA di kanan | `Header`, CTA "Jadwalkan survei" |
| Hero gelap satu layar, tag kecil, H1 dua baris di kiri, kartu kecil kiri bawah, kalimat + tombol kanan bawah | `Hero`: tag lokasi, H1, kartu avatar placeholder kiri bawah, kalimat + pencarian lokasi kanan bawah |
| About: label kiri, headline besar kanan, empat angka dengan garis pemisah | `Featured`: sorotan Sawangan dengan empat fakta dari listing |
| Our solutions: header kiri atas, tiga kartu gelap bertinggi berjenjang rata bawah, pil di atas gambar | `FeaturedDetails`: akses, zona, pantai terdekat Sawangan |
| Our services: section gelap sticky, kartu tengah berganti mengikuti scroll, penghitung 01/05 | `OtherLocations`: empat lokasi lain, penghitung 01/04 |
| How it works: tiga kartu dengan kata besar di atas dan kartu putih di bawah | `SurveySteps`: Pilih, Kirim, Survei |
| Features: teks + dua ikon kiri, gambar besar kanan | Section "Membaca harga per are" (Kalkulator) dan "Data yang tercantum" (detail listing) |
| Gallery: grid foto full-bleed | `LocationGallery` (Kavling) |
| Team: kartu gambar dengan kartu nama putih di bawah | Kanal kontak (Kontak) |
| Testimonials: karusel kartu teks + gambar dengan titik navigasi | `SourceNotes`: catatan sumber tiap listing |
| FAQ: akordeon kiri, gambar kanan | FAQ di halaman Kavling |
| CTA + footer: latar gelap bergambar, header tengah, kartu footer putih | `Footer` |
| Reveal kata dari blur, gerak easing lembut | `SplitWords`, `Reveal` |

### Yang diubah dan alasannya

- **Home hanya berisi hero, sorotan Sawangan, lokasi lain, cara survei, dan CTA** sesuai brief. Komposisi referensi yang tidak dipakai di Home (Features, Gallery, Team, Testimonials, FAQ) dipindah ke halaman Kavling, Kalkulator, dan Kontak dengan bobot visual yang sama, bukan dihapus.
- **Angka About diganti fakta listing** (harga per are, lebar jalan, zona, tanggal sumber), karena brief melarang angka karangan.
- **Testimonials diganti Catatan sumber**, karena situs ini tidak boleh memuat testimoni atau nama orang.
- **Team diganti Kanal kontak** dengan satu avatar placeholder berinisial JC yang jelas bertanda placeholder.
- **Setiap section punya urutan label, headline, deskripsi, CTA** lewat satu komponen `SectionHeader`. Referensi tidak selalu memakai CTA; aturan brief yang menang.
- **Headline desktop diusahakan satu baris** (referensi sering dua baris). Batas diatur per breakpoint: maksimal 3 baris di mobile, 2 di tablet.
- **"[Keep Scrolling]" di section sticky diganti nama kabupaten**, dan mode sticky hanya aktif di desktop dengan tinggi layar minimal 840 px; di bawah itu kartu ditumpuk biasa agar tidak terpotong.
- **Galeri memakai kolom berisi satu tile 16:9 dan satu tile 1:1** supaya tinggi kolom sama tanpa rasio bebas.
- **Warna dan font diganti** (lihat di atas). Hijau-lime Farmio terlalu "agritech" untuk agen tanah.
- **Loader dan transisi halaman ditambahkan** (tidak ada di referensi) dengan bahasa bentuk kontur dan petak yang sama.

## Riset industri

Kerangka tetap mengikuti referensi; situs-situs ini hanya dipakai untuk menentukan informasi yang wajib ada per listing.

- [Fullers Properties](https://fullersproperties.com/bali-land-for-sale/): harga per are dan status freehold/leasehold tampil langsung di kartu listing.
- [Bali Home Immo](https://bali-home-immo.com/realestate-property/for-sale/land): filter berdasarkan zona dan status kepemilikan adalah kebutuhan standar.
- [KLS Bali Estate](https://www.klsbaliestate.com/land-for-sale-bali): listing minimal selalu menyebut lokasi, luas, status, dan zona, bahkan saat harga tidak dicantumkan.
- [Bali Coconut Living](https://balicoconutliving.com/bali-land-sale-leasehold): luas ditampilkan dalam m² dan are sekaligus, serta durasi sewa untuk leasehold.
- [Brighton (Nusa Dua)](https://www.brighton.co.id/dijual/tanah/badung/nusa-dua): tanggal posting dan tombol WhatsApp agen ada di setiap listing.
- [Ray White](https://www.raywhite.co.id/properti/325745/kavling-premium-di-perbukitan-view-laut-ubud-bali): lebar jalan, sertifikat, dan tempat terdekat dicari calon pembeli.

Hasilnya: setiap kartu listing menampilkan harga per are, luas (m² dan are), zona, skema, status sertifikat, ketersediaan, tanggal sumber, tombol detail, dan tombol WhatsApp. Data yang belum ada ditulis "Belum dicantumkan" atau "Tanyakan saat survei", tidak dikarang.

## Data

Semua listing di `lib/listings.ts` berasal dari postingan halaman Facebook Jull Chandra tanggal 17 Agustus 2026. Hanya Sawangan yang punya harga (Rp 490 juta per are) dan hanya Lumintang yang punya luas (197 m²). Luas total, jumlah kavling, status sertifikat, ketersediaan, nama perusahaan, keanggotaan asosiasi, dan jumlah transaksi sengaja dibiarkan kosong. Titik peta memakai titik tengah desa atau kelurahan, bukan titik kavling.

## Fitur

- **Filter kavling**: lokasi, zona, rentang harga per are; tersinkron ke URL; panel bawah di tablet dan mobile.
- **Kalkulator**: are ke m² dan sebaliknya, total dari harga per are (hanya konversi bila harga kosong), input rupiah dengan pemisah ribuan otomatis (angka mentah dipakai untuk hitungan), desimal dengan koma atau titik, hasil diumumkan lewat `aria-live`.
- **Form survei ke WhatsApp**: validasi ketat di browser (tidak ada server), nomor 08/+62/62 dinormalisasi, pesan di-encode dengan `encodeURIComponent` sehingga baris baru, `&`, `#`, dan emoji utuh, honeypot disembunyikan dengan `clip`.
- **Dropdown kustom** dengan pola ARIA listbox: panah, Home/End, PageUp/PageDown, type-ahead, Enter/Space, Escape, fokus kembali ke pemicu.
- **Peta per listing** (OpenStreetMap) yang baru dimuat setelah tombol ditekan dan setelah izin peta diberikan.
- **Cookie consent** yang benar-benar mengatur perilaku: Preferensi menyimpan filter dan kalkulator di `localStorage` (dihapus saat dicabut), Peta pihak ketiga mengizinkan iframe OpenStreetMap.
- **Dua loader**: loader kontur untuk kunjungan pertama dan saat menuju Home, serta tirai dua lapis untuk halaman lain. Urutan: tutup, ganti konten, scroll ke atas, buka. Setiap jeda memakai `setTimeout` yang di-race dengan `requestAnimationFrame`, jadi tidak macet saat tab di background.
- **CTA footer bertukar otomatis**: di halaman Kontak, CTA mengarah ke daftar kavling.
- **SEO**: metadata per halaman, canonical, sitemap, robots, OG image 16:9 dengan wordmark, structured data `RealEstateAgent` dan `RealEstateListing` dengan `datePosted`, breadcrumb.
- **Ikon situs** transparan (`app/icon.svg`, `public/icon-512.png`). Klien belum punya logo yang bisa dipakai, jadi ikon memakai monogram JC.

## Layer dan aturan teknis

- Skala z-index tunggal di `app/globals.css` (`--z-header` sampai `--z-skip`); komponen memakai `z-(--z-...)`, tanpa angka mentah.
- Lenis hanya aktif di desktop dengan pointer presisi, dan berhenti saat menu, panel filter, lightbox, atau modal terbuka.
- IntersectionObserver dipasang pada pembungkus reveal, tidak di dalam wadah `overflow: hidden`; audit mengecek ini.
- Tombol WhatsApp melayang: pembungkus `pointer-events: none`, naik mengikuti tinggi cookie banner, dan footer memberi ruang bawah agar kontrol terakhir tidak tertutup.
- Cookie banner disembunyikan saat menu mobile terbuka.
- Header keamanan: CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

## Verifikasi

`scripts/audit-site.mjs` mengecek semua route (200), halaman 404, gambar rusak, rasio gambar, request gagal, error konsol, overflow horizontal di 375, 768, dan 1440 px, jumlah baris heading per viewport, reveal di dalam wadah `overflow-hidden`, kalimat promosi terlarang, hamburger, cookie banner di atas menu, dan tombol WhatsApp yang menutupi kontrol terakhir.
