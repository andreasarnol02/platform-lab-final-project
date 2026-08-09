# Marketplace

Marketplace full-stack multi-penjual untuk customer dan seller. Proyek ini terdiri dari web client React/Vite, aplikasi mobile React Native/Expo, API Node.js/Express, persistensi MongoDB, checkout simulasi, manajemen produk seller, dan fulfillment pesanan seller.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB dengan dukungan transaksi
- npm

Checkout memakai transaksi MongoDB untuk mencadangkan stok, membuat satu pesanan per seller, dan mengosongkan keranjang — semuanya dalam satu operasi atomic. Untuk testing checkout, gunakan MongoDB Atlas atau replica set lokal; server MongoDB standalone tidak mendukung transaksi.

## Quick Start

Instal dependency di root workspace dan semua aplikasi:

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

Isi `MONGODB_URI` dan `JWT_SECRET` (acak & panjang) di `api/.env`. Generate secret dengan:

```bash
openssl rand -hex 32
```

Jalankan API dan web client sekaligus dari root repo:

```bash
npm run dev
```

Layanan bisa diakses di:

- Web client: `http://localhost:5173` (deployed di `https://marketplacestore.vercel.app/`)
- API: `http://localhost:4000` (deployed di `https://platform-lab-final-project.onrender.com/`)
- API health check: `http://localhost:4000/`

Secara default, API juga mengizinkan origin web lokal `http://127.0.0.1:5173`.

Catatan: `npm run dev` hanya menjalankan API + web. Aplikasi mobile dijalankan terpisah via `npm run mobile` (Expo) dan membutuhkan API aktif di port `4000`.

## Download Aplikasi Mobile

Build Expo (EAS) untuk aplikasi mobile bisa di-download di:

- [Expo build: personal-proj](https://expo.dev/accounts/gildoraths-team/projects/personal-proj/builds/96367953-0390-4787-89e4-9786eb56bc02)

## Perintah

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan API dan web client sekaligus |
| `npm run mobile` | Jalankan aplikasi mobile (Expo) |
| `npm test` | Jalankan test Jest untuk API dan web |
| `npm run build` | Build web untuk produksi |
| `npm --prefix api test` | Jalankan test API saja |
| `npm --prefix web test` | Jalankan test web saja |
| `npm --prefix web run test:e2e` | Jalankan Playwright browser test |
| `npm --prefix web run preview` | Preview build produksi web |

## Area Aplikasi

Rute customer:

- `/` - beranda toko
- `/products` - katalog produk dengan fitur search
- `/products/:id` - detail produk
- `/cart` - keranjang belanja
- `/checkout` - checkout simulasi
- `/orders` - riwayat pesanan
- `/profile` - profil customer

Rute seller:

- `/seller/login` dan `/seller/register` - login/registrasi seller
- `/seller/dashboard` - ringkasan seller
- `/seller/products` - manajemen produk seller
- `/seller/orders` - pesanan masuk dan status fulfillment

API menangani autentikasi, memisahkan role customer/seller, dan memastikan kepemilikan resource. Saat checkout, dibuat satu pesanan per seller dan status pembayaran langsung diset sebagai simulated & confirmed.

## Struktur Proyek

```text
api/                 Express API, models, routes, middleware, dan tests
web/                 Aplikasi React/Vite untuk customer dan seller
mobile/              Aplikasi React Native/Expo untuk customer dan seller
docs/                Dokumentasi produk, teknis, dan desain
.github/workflows/   CI checks
package.json         Root commands untuk dev, test, dan build
```

Dokumentasi lengkap tersedia di:

- [`api/README.md`](api/README.md)
- [`web/README.md`](web/README.md)
- [`mobile/README.md`](mobile/README.md)
- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/technical-requirements.md`](docs/technical-requirements.md)
- [`docs/design-system.md`](docs/design-system.md)

## Verifikasi

CI workflow menjalankan test API, test + build frontend, test + bundle check mobile, Playwright browser test, dependency audit, analisis CodeQL, dan secret scan. Untuk verifikasi lokal, jalankan:

```bash
npm test
npm run build
npm --prefix web run test:e2e
npm --prefix mobile test
```

Jangan commit file `.env` atau credential asli — hanya file `.env.example` yang boleh masuk version control.
