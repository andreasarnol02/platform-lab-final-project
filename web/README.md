# Marketplace Web

Satu aplikasi web React untuk kedua role marketplace. Berjalan di satu server Vite, aplikasi ini memisahkan pengalaman customer dan seller lewat namespace rute dan sesi JWT khusus tiap role.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- API bersama yang berjalan dari `../api`

## Setup Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

Web app berjalan di `http://localhost:5173`.

Dari root repo, instal semua dependency lalu jalankan kedua layanan cukup dengan satu perintah:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm run dev
```

Command ini menjalankan Nodemon untuk API dan Vite untuk web app. Stop kedua proses dengan `Ctrl+C`.

Atau jalankan API sendiri:

```bash
cd ../api
npm install
npm run dev
```

## Environment

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/api` | Base URL API bersama |
| `VITE_GA_ID` | kosong | Google Analytics 4 measurement ID (opsional) |

Analitik nonaktif kalau `VITE_GA_ID` kosong. Perlu diingat, Vite meng-expose environment variables saat build — jadi jangan taruh secret di file ini.

## Scripts

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan Vite dev server |
| `npm run build` | Build untuk produksi |
| `npm run preview` | Preview build produksi secara lokal |
| `npm test` | Jalankan unit & integration test frontend |
| `npm run test:watch` | Jalankan Jest dalam watch mode |
| `npm run test:e2e` | Jalankan Playwright browser test |

## Rute Customer

- `/` - beranda toko
- `/products` - katalog produk dengan search & filter kategori
- `/products/:id` - detail produk
- `/cart` - keranjang customer (perlu login)
- `/checkout` - checkout simulasi (perlu login)
- `/orders` - riwayat pesanan (perlu login)
- `/orders/:id` - detail pesanan (perlu login)
- `/profile` - profil customer (perlu login)
- `/login` dan `/register` - login/registrasi customer

## Rute Seller

- `/seller/login` dan `/seller/register` - login/registrasi seller
- `/seller/dashboard` - ringkasan produk, pesanan, stok, dan revenue
- `/seller/products` - produk milik seller (perlu login)
- `/seller/products/new` - buat produk baru
- `/seller/products/:id/edit` - edit produk milik sendiri
- `/seller/orders` - pesanan masuk untuk seller (perlu login)

## Auth & Kepemilikan

- Sesi customer memakai `mp_customer_session`.
- Sesi seller memakai `mp_seller_session`.
- Browser hanya mengatur tampilan; API yang memastikan tipe token dan kepemilikan.
- Customer dan seller boleh pakai email yang sama karena namespace akunnya terpisah.
- Seller hanya menerima pesanan untuk produk miliknya sendiri.

## Gambar & Harga Produk

- Gambar produk berupa satu string `imageUrl`.
- API memvalidasi URL gambar; UI menampilkan placeholder kalau URL kosong atau gagal dimuat.
- Upload file sengaja belum diimplementasikan sampai object storage seperti S3 atau Cloudinary dipilih.
- Harga seller dimasukkan dengan format ribuan Indonesia (misal `7.777.777.777`), lalu dikirim ke API sebagai angka murni `7777777777`.

## Checkout

- Kalau cart berisi produk dari beberapa seller, dibuat satu pesanan per seller.
- Semua invoice per-seller bisa dilihat customer di riwayat pesanan.
- Checkout ini simulasi — tidak ada pembayaran sungguhan yang diproses.

## Testing

- Unit test Jest untuk formatting, utility, dan komponen terisolasi.
- Jest + React Testing Library untuk interaksi frontend dan pemanggilan API di level komponen.
- Playwright untuk navigasi level browser dan perilaku route yang dilindungi.

Test E2E otomatis menjalankan Vite server dan me-mock response produk publik, jadi tidak butuh MongoDB atau API. Set `E2E_BASE_URL` kalau ingin test di URL web yang sudah di-deploy.

## Continuous Integration

`.github/workflows/ci.yml` menjalankan test API, test + build frontend, Playwright browser test, dependency audit severity tinggi, analisis CodeQL, dan verified-secret scan — tiap push dan pull request.

## Struktur Proyek

```text
src/
├── api/          Axios client dan session helper
├── components/   UI customer, icons, state, dan komponen shared
├── context/      Auth customer dan state cart
├── pages/        Halaman customer
├── seller/       UI seller: halaman, API client, auth, dan styles
├── styles/       Design token customer dan responsive styles
└── utils/        Formatting & analytics helper
```

Kontrak visual (design system) didokumentasikan di `../docs/design-system.md`.
