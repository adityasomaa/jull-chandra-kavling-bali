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
| Gambar | Foto Pexels yang di-self-host di `public/photos`, `images.unoptimized = true` |

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run photos       # unduh ulang foto Pexels ke public/photos
python scripts/optimize-photos.py      # kompres ulang foto (progressive JPEG)
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

### Foto

Semua gambar adalah foto dari [Pexels](https://www.pexels.com/license/) (bebas dipakai untuk komersial, atribusi tidak wajib tetapi tetap dicantumkan di bawah). Foto dicari lewat Pexels API (Composio), dipotong CDN Pexels ke 16:9 atau 1:1, lalu di-self-host di `public/photos` supaya tidak bergantung pada CDN pihak ketiga dan tetap lolos CSP `img-src 'self'`. Daftar foto, alt text, dan kredit ada di `lib/photos.ts`.

- **Tiap lokasi punya foto berbeda** yang mewakili karakter kawasannya (pesisir Bali selatan untuk Sawangan, jalan permukiman untuk Sidakarya, desa di antara hutan untuk Klusa Bresela, atap kota untuk Lumintang, lembah dan sawah untuk Pejeng).
- **Semua foto adalah foto ilustrasi kawasan, bukan foto lahan listing.** Keterangan ini tampil di kartu listing, halaman detail, dan lightbox galeri, karena foto lahan asli belum tersedia.
- **Avatar JC tetap placeholder.** Foto stok orang tidak dipakai supaya tidak terbaca sebagai foto Jull Chandra.
- Rasio hanya 16:9 dan 1:1, dikunci di komponen `Art` lewat `aspect-ratio` sehingga ruang tertahan sebelum gambar termuat. Latar penuh (hero, CTA, hero halaman) memakai elemen 16:9 yang diperbesar hingga menutup wadah (`CoverArt`). Bila foto gagal dimuat, `Art` menampilkan panel dengan ikon peta dan keterangan.
- Overlay gelap di atas foto diukur terhadap piksel terang persentil 98 tiap foto: teks `night-ink` minimal 4.73:1. Teks di atas foto selalu memakai `night-ink`, bukan `night-muted`.
- Loader kontur tetap berupa animasi garis (bagian UI transisi, bukan gambar konten).

| Pemakaian | Foto | Fotografer |
| --- | --- | --- |
| hero | [Sawah terasering dan hutan tropis di Bali dari udara](https://www.pexels.com/photo/35428411/) | Tom Fisk |
| cta | [Gunung Agung saat senja dilihat dari udara](https://www.pexels.com/photo/35159215/) | Tom Fisk |
| pageKavling | [Area pematangan lahan yang dibagi menjadi petak-petak di Bali](https://www.pexels.com/photo/36422828/) | Tom Fisk |
| pageKalkulator | [Petak sawah terasering di Bali dari udara](https://www.pexels.com/photo/36810327/) | Tom Fisk |
| pageKontak | [Jalan desa di Bali dengan arca penjaga dan bangunan tradisional](https://www.pexels.com/photo/35094745/) | Relaxing Journeys |
| pageLegal | [Perbukitan hijau dan laut di Bali](https://www.pexels.com/photo/35057004/) | Tom Fisk |
| sawangan-nusa-dua | [Pesisir berpasir dan tebing hijau di Bali selatan](https://www.pexels.com/photo/36548779/) | Tom Fisk |
| sidakarya-denpasar | [Jalan permukiman di Bali dengan gerbang tradisional dan penjor](https://www.pexels.com/photo/35094744/) | Relaxing Journeys |
| klusa-bresela-ubud | [Desa di antara hutan tropis di Gianyar dari udara](https://www.pexels.com/photo/36947695/) | Tom Fisk |
| lumintang-denpasar | [Atap-atap rumah di kawasan kota tropis dari udara](https://www.pexels.com/photo/38248989/) | Miguel Cuenca |
| pejeng-gianyar | [Lembah dengan sawah terasering dan hutan tropis di Bali](https://www.pexels.com/photo/39472100/) | Mahmut Yılmaz |
| road | [Jalan dan bangunan di antara sawah di Bali dari udara](https://www.pexels.com/photo/36699651/) | Tom Fisk |
| villa | [Kawasan hunian villa dengan kolam renang di Bali](https://www.pexels.com/photo/35043038/) | Tom Fisk |
| coast | [Tebing hijau dan laut di pesisir Bali](https://www.pexels.com/photo/34908200/) | Tom Fisk |
| measure | [Meteran kuning dengan skala sentimeter](https://www.pexels.com/photo/3639034/) | Castorly Stock |
| surveyor | [Petugas mengukur lahan dengan alat GPS](https://www.pexels.com/photo/24245275/) | Asad Photo Maldives |
| siteVisit | [Dua orang meninjau lahan terbuka](https://www.pexels.com/photo/8961260/) | Mikael Blomkvist |
| house | [Rumah beratap genteng di tepi sawah Bali](https://www.pexels.com/photo/35930884/) | Evelin Magnus |
| palms | [Sawah terasering dan pohon kelapa di Bali](https://www.pexels.com/photo/36896228/) | Tom Fisk |
| badung | [Pantai dan tebing di Bali selatan](https://www.pexels.com/photo/6015647/) | Alesia Kozik |
| gianyar | [Sawah terasering dan pohon kelapa di Gianyar](https://www.pexels.com/photo/15994341/) | Balazs Simon |
| denpasar | [Jalan di Bali yang dihiasi penjor](https://www.pexels.com/photo/36415760/) | Mick |

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
- **Loader dan transisi halaman ditambahkan** (tidak ada di referensi) dengan bahasa bentuk kontur dan petak.
- **Galeri berisi foto kawasan** (lima lokasi + Badung, Denpasar, Gianyar), bukan foto proyek seperti di referensi.

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
