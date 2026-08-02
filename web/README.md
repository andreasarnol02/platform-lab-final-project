# Marketplace Web

Aplikasi web React terpadu untuk kedua peran marketplace. Aplikasi ini berjalan di satu server Vite dan memisahkan pengalaman pelanggan dan penjual melalui namespace rute dan sesi JWT khusus peran.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- API bersama yang berjalan dari `../api`

## Penyiapan Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

Aplikasi web berjalan di `http://localhost:5173`.

Dari root repositori, instal runner workspace dan jalankan kedua layanan dengan satu perintah:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm run dev
```

Ini menjalankan Nodemon untuk API dan Vite untuk aplikasi web. Hentikan kedua proses dengan `Ctrl+C`.

Jalankan API secara terpisah:

```bash
cd ../api
npm install
npm run dev
```

## Lingkungan

| Variabel | Bawaan | Kegunaan |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/api` | URL dasar API bersama |
| `VITE_GA_ID` | kosong | ID pengukuran Google Analytics 4 opsional |

Analitik dinonaktifkan saat `VITE_GA_ID` kosong. Vite memaparkan variabel lingkungan saat build; jangan menaruh rahasia di file ini.

## Skrip yang Tersedia

| Perintah | Tujuan |
| --- | --- |
| `npm run dev` | Jalankan server pengembangan Vite terpadu |
| `npm run build` | Buat build produksi |
| `npm run preview` | Pratinjau build produksi secara lokal |
| `npm test` | Jalankan pengujian unit dan integrasi frontend |
| `npm run test:watch` | Jalankan Jest dalam mode watch |
| `npm run test:e2e` | Jalankan pengujian browser Playwright terhadap aplikasi yang dikonfigurasi |

## Rute Pelanggan

- `/` - beranda toko
- `/products` - katalog produk dengan pencarian dan filter kategori
- `/products/:id` - detail produk
- `/cart` - keranjang pelanggan terautentikasi
- `/checkout` - checkout simulasi terautentikasi
- `/orders` - riwayat pesanan terautentikasi
- `/orders/:id` - detail pesanan terautentikasi
- `/profile` - profil pelanggan terautentikasi
- `/login` dan `/register` - autentikasi pelanggan

## Rute Penjual

- `/seller/login` dan `/seller/register` - autentikasi penjual
- `/seller/dashboard` - ringkasan produk, pesanan, stok, dan pendapatan
- `/seller/products` - produk milik penjual yang telah terautentikasi
- `/seller/products/new` - membuat produk
- `/seller/products/:id/edit` - mengedit produk milik sendiri
- `/seller/orders` - pesanan masuk untuk penjual yang telah terautentikasi

## Autentikasi dan Kepemilikan

- Sesi pelanggan menggunakan `mp_customer_session`.
- Sesi penjual menggunakan `mp_seller_session`.
- Browser hanya mengendalikan presentasi; API menegakkan jenis token dan kepemilikan.
- Pelanggan dan penjual dapat menggunakan email yang sama karena keduanya berada dalam namespace akun yang terpisah.
- Penjual hanya menerima pesanan yang dibuat untuk produk milik penjual tersebut.

## Gambar dan Harga Produk

- Gambar produk menggunakan satu string `imageUrl` langsung.
- API memvalidasi URL gambar dan UI menampilkan placeholder saat URL tidak ada atau tidak dapat dimuat.
- Unggah file sengaja ditunda sampai layanan penyimpanan objek seperti S3 atau Cloudinary dipilih.
- Harga penjual dimasukkan dengan pengelompokan titik Indonesia, misalnya `7.777.777.777`, lalu dikirim ke API sebagai nilai numerik `7777777777`.

## Checkout

- Keranjang yang berisi produk dari beberapa penjual membuat satu pesanan per penjual.
- Pelanggan melihat semua faktur khusus penjual dalam riwayat pesanan.
- Checkout bersifat simulasi; tidak ada pembayaran nyata yang diproses.

## Lapisan Pengujian

- Pengujian unit Jest mencakup pemformatan, utilitas, dan komponen terisolasi.
- Jest dan React Testing Library mencakup interaksi frontend serta pemanggilan API pada batas komponen.
- Playwright mencakup navigasi tingkat browser dan perilaku rute yang dilindungi.

Pengujian E2E memulai server Vite secara otomatis dan melakukan mock terhadap respons produk publik, sehingga tidak memerlukan MongoDB atau API. Atur `E2E_BASE_URL` saat menguji URL web yang telah di-deploy.

## Integrasi Berkelanjutan

`.github/workflows/ci.yml` menjalankan pengujian API, pengujian frontend dan build, pengujian browser Playwright, audit dependensi dengan tingkat keparahan tinggi, analisis CodeQL, dan pemindaian verified-secret pada push dan pull request.

## Struktur Proyek

```text
src/
├── api/          Klien Axios dan helper sesi
├── components/   UI pelanggan, ikon, state, dan komponen bersama
├── context/      Autentikasi pelanggan dan state keranjang
├── pages/        Rute pelanggan
├── seller/       UI penjual, halaman, klien API, auth, dan style
├── styles/       Token desain pelanggan dan style responsif
└── utils/        Helper pemformatan dan analitik
```

Kontrak visual bersama didokumentasikan dalam `../docs/design-system.md`.
