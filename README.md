# Marketplace

Marketplace full-stack multi-penjual untuk pelanggan dan penjual. Proyek ini mencakup klien web React/Vite, API Node.js/Express, persistensi MongoDB, checkout simulasi, pengelolaan produk penjual, dan pemenuhan pesanan penjual.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB dengan dukungan transaksi
- npm

Checkout menggunakan transaksi MongoDB untuk mencadangkan stok, membuat satu pesanan per penjual, dan mengosongkan keranjang secara atomik. Gunakan MongoDB Atlas atau replica set lokal untuk pengujian checkout; server MongoDB standalone tidak mendukung transaksi.

## Mulai Cepat

Instal runner workspace root dan dependensi kedua aplikasi:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm --prefix mobile install
```

Buat file environment lokal:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Atur `MONGODB_URI` dan `JWT_SECRET` yang panjang serta acak di `api/.env`. Buat rahasia dengan:

```bash
openssl rand -hex 32
```

Jalankan API dan klien web secara bersamaan dari root repositori:

```bash
npm run dev
```

> Catatan: `npm run dev` hanya menjalankan API + web. Aplikasi mobile dijalankan terpisah dengan `npm run mobile` (Expo) dan membutuhkan API di port 4000.

Layanan tersedia di:

- Klien web: `http://localhost:5173`
- API: `http://localhost:4000`
- Pemeriksaan kesehatan API: `http://localhost:4000/`

API juga secara default mengizinkan origin web lokal `http://127.0.0.1:5173`.

## Perintah

| Perintah | Tujuan |
| --- | --- |
| `npm run dev` | Jalankan API dan klien web secara bersamaan |
| `npm run mobile` | Jalankan aplikasi mobile (Expo) |
| `npm test` | Jalankan pengujian Jest API dan web |
| `npm run build` | Buat build produksi web |
| `npm --prefix api test` | Jalankan hanya pengujian API |
| `npm --prefix web test` | Jalankan hanya pengujian web |
| `npm --prefix web run test:e2e` | Jalankan pengujian browser Playwright |
| `npm --prefix web run preview` | Pratinjau build produksi web |

## Area Aplikasi

Rute pelanggan meliputi:

- `/` - beranda toko
- `/products` - katalog produk yang dapat dicari
- `/products/:id` - detail produk
- `/cart` - keranjang belanja
- `/checkout` - checkout simulasi
- `/orders` - riwayat pesanan
- `/profile` - profil pelanggan

Rute penjual meliputi:

- `/seller/login` dan `/seller/register` - autentikasi penjual
- `/seller/dashboard` - ringkasan penjual
- `/seller/products` - pengelolaan produk milik penjual
- `/seller/orders` - pesanan masuk dan status pemenuhan

API menegakkan autentikasi, pemisahan peran pelanggan/penjual, dan kepemilikan sumber daya. Checkout membuat satu pesanan per penjual dan langsung menandai pembayaran sebagai simulasi dan terkonfirmasi.

## Struktur Proyek

```text
api/                 Express API, model, rute, middleware, dan pengujian
web/                 Aplikasi React/Vite untuk pelanggan dan penjual
mobile/              Aplikasi React Native/Expo (pelanggan + penjual)
docs/                Dokumentasi produk, teknis, dan desain
.github/workflows/   Pemeriksaan CI
package.json         Perintah pengembangan, pengujian, dan build root
```

Dokumentasi layanan selengkapnya tersedia di:

- [`api/README.md`](api/README.md)
- [`web/README.md`](web/README.md)
- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/technical-requirements.md`](docs/technical-requirements.md)
- [`docs/design-system.md`](docs/design-system.md)

## Verifikasi

Alur kerja CI menjalankan pengujian API, pengujian frontend dan build, pengujian browser Playwright, audit dependensi, analisis CodeQL, serta pemindaian rahasia. Verifikasi lokal dapat dijalankan dengan:

```bash
npm test
npm run build
npm --prefix web run test:e2e
```

Jangan pernah melakukan commit terhadap file `.env` atau kredensial nyata. Hanya file `.env.example` yang boleh berada dalam kontrol versi.
