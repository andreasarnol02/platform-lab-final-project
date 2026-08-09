# Marketplace API

API Node.js/Express bersama yang melayani flow marketplace untuk customer dan seller.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB lokal atau deployment MongoDB dengan dukungan transaksi

Checkout memakai transaksi MongoDB untuk mencadangkan stok, membuat satu pesanan per seller, dan mengosongkan keranjang — semuanya dalam satu operasi atomic. Untuk testing checkout, gunakan replica set atau MongoDB Atlas; server MongoDB standalone tidak mendukung transaksi.

## Setup Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

API berjalan di `http://localhost:4000` secara default.

Untuk menjalankan API dan web app sekaligus dari root repo:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm run dev
```

Web app berjalan di `http://localhost:5173`.

## Environment

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `PORT` | `4000` | Port API |
| `MONGODB_URI` | kosong | Connection string MongoDB |
| `JWT_SECRET` | kosong | Secret signing JWT — acak & panjang, jangan commit |
| `JWT_EXPIRES` | `7d` | Masa berlaku token JWT |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origin web yang diizinkan, pisah dengan koma |

Generate secret lokal dengan:

```bash
openssl rand -hex 32
```

## Endpoint API

- `POST /api/auth/customer/register` dan `/login`
- `POST /api/auth/seller/register` dan `/login`
- `GET /api/auth/me`
- `GET /api/products` dan `GET /api/products/:id`
- Manajemen produk seller di bawah `/api/products` dan `/api/seller/products`
- Rute cart customer di bawah `/api/cart`
- Checkout dan riwayat pesanan customer di bawah `/api/orders`
- Inbox pesanan seller dan update status di bawah `/api/seller/orders`

Semua response berformat JSON. Response sukses berbentuk `{ success, message, data }`; untuk error validasi, otorisasi, resource tidak ditemukan, dan server error, format JSON yang dipakai aman tanpa stack trace.

## Scripts

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan API dengan Nodemon |
| `npm start` | Jalankan API dalam mode produksi |
| `npm test` | Jalankan unit & integration test API |

## Keamanan & Kepemilikan

- Namespace JWT customer dan seller terpisah.
- Rute cart dan checkout butuh token customer.
- Operasi produk & pesanan seller dipastikan milik seller tersebut di level API.
- Penulisan produk divalidasi: nama, harga, stok, kategori, dan URL gambar HTTP(S).
- Password di-hash dengan bcrypt, dan secret dibaca dari environment variables.
