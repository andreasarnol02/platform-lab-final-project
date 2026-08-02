# Sistem Desain Marketplace

Status: Varian A, perdagangan cepat, dipilih untuk etalase produksi.

Dokumen ini merupakan kontrak visual bersama untuk setiap rute pelanggan dan penjual. Dokumen ini mengutamakan struktur marketplace yang familiar, lapisan merek hijau yang tenang, kepadatan informasi tinggi, dan perilaku responsif yang sederhana.

## Arah

- Jadikan tindakan berguna berikutnya terlihat jelas: mencari, menelusuri, menambahkan ke keranjang, atau mengelola toko.
- Gunakan citra produk dan harga sebagai hierarki visual terkuat.
- Pastikan kepercayaan terlihat tanpa membuat antarmuka terasa korporat.
- Gunakan jarak, radius, skala tipografi, dan bahasa status yang sama pada permukaan pelanggan dan penjual.
- Utamakan data nyata. Jangan mengarang rating, stok, janji pengiriman, atau klaim penjual di UI produksi.

## Token Desain

### Warna

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--green` | `#00A86B` | Tindakan utama dan aksen merek |
| `--green-dark` | `#007D5A` | Tautan, keadaan aktif, teks hijau yang aksesibel |
| `--green-light` | `#E3F6ED` | Permukaan lembut dan keadaan terpilih |
| `--ink` | `#172522` | Judul dan teks utama |
| `--ink-soft` | `#50645B` | Teks sekunder |
| `--muted` | `#71817C` | Teks bantuan dan metadata |
| `--line` | `#E5ECE8` | Batas dan pemisah |
| `--bg` | `#F5F9F7` | Latar aplikasi |
| `--danger` | `#D32F2F` | Tindakan destruktif dan kesalahan |

### Bentuk dan Elevasi

- Radius kontrol kecil: `8px` hingga `10px`.
- Radius kartu: `14px` hingga `16px`.
- Radius hero: `20px` hingga `26px`.
- Radius pill: `999px`.
- Bayangan default: `0 12px 28px rgba(23, 37, 34, 0.09)`.
- Elevasi saat hover harus halus: naikkan sebesar `2px` hingga `3px`, jangan pernah memantul.

### Jarak

Gunakan unit dasar 4px: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`.

- Gutter halaman: `20px` pada desktop, `14px` pada mobile.
- Konten kartu: `12px` hingga `16px`.
- Jarak antarseksi: `32px` hingga `56px`.
- Tinggi kontrol formulir: `40px` hingga `46px`.

### Tipografi

- Keluarga utama: tumpukan sans-serif sistem, dengan `Georgia` dicadangkan untuk penekanan editorial singkat pada teks hero.
- Isi: `14px` hingga `16px`, line-height `1.5` hingga `1.65`.
- Nama produk: `12px` hingga `14px`, maksimum dua baris.
- Harga produk: `14px` hingga `18px`, ketebalan `800`.
- Judul halaman: `24px` hingga `32px`.
- Judul hero: fluid, sekitar `42px` hingga `57px` pada desktop dan `42px` pada mobile.
- Label huruf kapital menggunakan `9px` hingga `10px`, ketebalan `800`, dan jarak huruf.

## Komponen

### Header Global

- Pita utilitas hijau di bagian atas untuk satu manfaat singkat.
- Baris utama berisi merek, pencarian, keranjang, dan tindakan akun.
- Navigasi sekunder berisi kategori bernilai tinggi dan jalur masuk penjual.
- Pada mobile, pertahankan merek, keranjang, akun, dan pencarian. Sembunyikan navigasi sekunder.
- Pencarian dikirim ke `/products?search=<term>`.

### Ikonografi

- Gunakan `lucide-react` untuk ikon antarmuka di kedua aplikasi.
- Pertahankan nama ikon tetap semantis pada batas komponen, misalnya `MarketplaceIcon name="bag"` atau `SellerIcon name="orders"`.
- Jangan menambahkan peta path SVG buatan tangan atau emoji sebagai ikon antarmuka.
- Stroke ikon default sekitar `1.9`; gunakan `currentColor` agar warna keadaan dan hover berasal dari CSS.
- Tombol yang hanya berisi ikon memerlukan label yang aksesibel; ikon dekoratif menggunakan `aria-hidden`.

### Tanda Merek

- Wordmark `marketplace` dalam huruf kecil.
- Tanda persegi hijau dengan `m` huruf kecil.
- Jangan gunakan emoji sebagai ikon navigasi atau tanda merek.

### Bidang Pencarian

- Ikon pencarian di sebelah kiri.
- Placeholder menjelaskan pencarian yang berguna, bukan teks pengisi yang generik.
- Ring fokus yang terlihat menggunakan token hijau.
- Pertahankan istilah yang dimasukkan saat berpindah ke katalog.

### Baris Kategori

- Maksimal tujuh kategori pada baris pertama.
- Setiap kategori menggunakan ubin ikon berwarna lembut dan label singkat.
- Desktop menggunakan grid. Mobile menjadi baris yang dapat digulir secara horizontal.
- Tautan kategori dipetakan ke `/products?category=<category>`.

### Kartu Produk

- Gambar ditempatkan pertama, dengan rasio aspek yang stabil.
- Lencana ketersediaan opsional di tepi gambar.
- Kategori, nama produk, harga, penjual, dan metadata stok dalam urutan tersebut.
- Nama produk dibatasi hingga dua baris agar grid tetap sejajar.
- Seluruh kartu merupakan tautan; jangan menambahkan tindakan lain yang bersaing di dalam kartu.

### Hero

- Pisahkan teks dan visual produk pada desktop.
- Susun teks di atas visual pada mobile.
- Satu CTA utama dan satu tautan sekunder yang tenang.
- Sertakan baris bukti kecil hanya jika nilainya berasal dari data produk nyata atau aturan bisnis yang terdokumentasi.

### Baris Kepercayaan

- Maksimal tiga manfaat singkat.
- Gunakan ikon perisai, toko, atau kecepatan.
- Jika memungkinkan, pertahankan teks pendukung di bawah 40 karakter.

### Banner Penjual

- Gunakan permukaan hijau tua untuk memisahkan akuisisi penjual dari konten belanja.
- Pertahankan satu tindakan: `Buka toko gratis`.
- Tautkan ke pendaftaran penjual menggunakan rute terpadu `/seller/register`.

### Panel Samping Penjual

- Gunakan permukaan hijau tua sebagai jangkar ruang kerja penjual.
- Pertahankan tiga tujuan utama agar tetap terlihat: dasbor, produk, dan pesanan masuk.
- Navigasi aktif menggunakan permukaan hijau primer dan ikon garis ringkas.
- Pada mobile, ubah panel samping menjadi pita navigasi horizontal di atas halaman.

### Kartu Statistik Dasbor

- Tampilkan satu ikon, satu nilai utama, dan satu label singkat.
- Gunakan kartu putih dengan ubin ikon hijau lembut.
- Pertahankan lima kartu pada layar lebar, tiga pada tablet, dan dua pada mobile.

### Tabel Data dan Kartu Pesanan

- Tabel digunakan untuk data pengelolaan penjual yang padat dan menggunakan baris header hijau yang tenang.
- Kartu pesanan lebih diutamakan untuk riwayat pelanggan dan tindakan pesanan penjual.
- Kelompokkan tindakan di tepi terluar dan gunakan warna hijau untuk tindakan siklus valid berikutnya.
- Tindakan destruktif menggunakan teks serta warna bahaya, tidak pernah warna saja.

### Permukaan Autentikasi

- Halaman autentikasi pelanggan dan penjual menggunakan latar lembut, radius kartu, perlakuan field, dan ring fokus yang sama.
- Autentikasi penjual menambahkan wordmark penjual, tetapi tidak memperkenalkan sistem warna terpisah.
- Pertahankan tindakan submit utama selebar penuh dan letakkan tautan lintas aplikasi di bawah formulir.

### Lencana Status

Gunakan kosakata status pesanan yang ada secara konsisten:

- `PENDING`: kuning hangat.
- `PAID`: biru.
- `PROCESSED`: hijau kebiruan.
- `SHIPPED`: ungu.
- `COMPLETED`: hijau.
- `CANCELLED`: merah.

Status harus dapat dibaca melalui teks dan tidak pernah bergantung pada warna saja.

## Aturan Responsif

### Desktop, di atas 1050px

- Katalog pelanggan menggunakan empat kolom produk jika ruang memungkinkan.
- Header menggunakan dua baris ditambah pita utilitas.
- Dasbor penjual dapat menggunakan panel samping permanen.

### Tablet, 761px hingga 1050px

- Kurangi gutter halaman dan padding teks hero.
- Ciutkan panel sekunder dasbor penjual sebelum konten utama.
- Pertahankan grid produk pada dua hingga empat kolom untuk lebar tablet dan desktop; ciutkan menjadi satu kolom pada lebar ponsel yang sempit.

### Mobile, 760px dan di bawahnya

- Gunakan bagian halaman satu kolom dan grid produk dua kolom.
- Ubah baris kategori menjadi guliran horizontal.
- Sembunyikan navigasi desktop sekunder, bukan tindakan utama.
- Pertahankan target sentuh setidaknya setinggi `40px`.
- Susun banner penjual dan tindakan formulir secara bertumpuk.
- Jangan pernah mengandalkan hover untuk menampilkan informasi penting.

## Aksesibilitas

- Setiap kontrol yang hanya berisi ikon memerlukan label yang aksesibel.
- Pertahankan keadaan fokus keyboard yang terlihat.
- Pertahankan kontras yang mudah dibaca untuk teks redup dan tautan hijau.
- Gambar memerlukan teks `alt` yang bermakna; gambar dekoratif menggunakan teks alt kosong.
- Keadaan kesalahan dan pemuatan harus tetap tersedia tanpa petunjuk warna.
- Gunakan tautan semantis untuk navigasi dan tombol untuk tindakan.

## Catatan Implementasi

- Token pelanggan dan permukaan rute berada di `web/src/styles/global.css`.
- Ikonografi pelanggan bersama berada di `web/src/components/MarketplaceIcon.jsx`.
- Navigasi kategori pelanggan berada di `web/src/components/CategoryRow.jsx`.
- Aplikasi pelanggan produksi mencakup `HomePage`, `ProductsPage`, `ProductDetailPage`, autentikasi, keranjang, checkout, pesanan, profil, serta keadaan kosong/kesalahan.
- Token penjual dan permukaan rute berada di `web/src/seller/styles/global.css`.
- Pemetaan ikon Lucide bersama untuk penjual berada di `web/src/seller/components/SellerIcon.jsx`.
- Aplikasi penjual mencakup autentikasi, navigasi panel samping, dasbor, produk, formulir produk, pesanan, dan keadaan responsif.
- Pertahankan arsitektur informasi penjual agar berorientasi pada tugas, bukan menyalin hero etalase.
