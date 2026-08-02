# Marketplace API

API Node.js dan Express bersama untuk alur marketplace pelanggan dan penjual.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB yang berjalan secara lokal atau deployment MongoDB dengan dukungan transaksi

Checkout menggunakan transaksi MongoDB untuk mencadangkan stok, membuat pesanan per penjual, dan mengosongkan keranjang secara atomik. Gunakan replica set atau MongoDB Atlas untuk pengujian checkout; server MongoDB standalone tidak mendukung transaksi.

## Penyiapan Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

API berjalan di `http://localhost:4000` secara default.

Untuk menjalankan API dan aplikasi web secara bersamaan dari root repositori:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm run dev
```

Aplikasi web berjalan di `http://localhost:5173`.

## Lingkungan

| Variabel | Bawaan | Kegunaan |
| --- | --- | --- |
| `PORT` | `4000` | Port API |
| `MONGODB_URI` | kosong | String koneksi MongoDB |
| `JWT_SECRET` | kosong | Rahasia penandatanganan yang panjang dan acak; jangan pernah melakukan commit terhadapnya |
| `JWT_EXPIRES` | `7d` | Masa berlaku JWT |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origin web yang diizinkan, dipisahkan dengan koma |

Buat rahasia lokal dengan:

```bash
openssl rand -hex 32
```

## Cakupan API

- `POST /api/auth/customer/register` dan `/login`
- `POST /api/auth/seller/register` dan `/login`
- `GET /api/auth/me`
- `GET /api/products` dan `GET /api/products/:id`
- Pengelolaan produk penjual di bawah `/api/products` dan `/api/seller/products`
- Rute keranjang pelanggan di bawah `/api/cart`
- Checkout dan riwayat pesanan pelanggan di bawah `/api/orders`
- Kotak masuk pesanan penjual dan pembaruan status di bawah `/api/seller/orders`

Semua respons berupa JSON. Respons yang berhasil menggunakan `{ success, message, data }`; kesalahan validasi, otorisasi, sumber daya yang tidak ditemukan, dan kesalahan server menggunakan format JSON yang aman tanpa stack trace.

## Skrip

| Perintah | Tujuan |
| --- | --- |
| `npm run dev` | Jalankan API dengan Nodemon |
| `npm start` | Jalankan API dalam mode produksi |
| `npm test` | Jalankan pengujian unit dan integrasi API |

## Keamanan dan Kepemilikan

- Namespace JWT pelanggan dan penjual terpisah.
- Rute keranjang dan checkout memerlukan token pelanggan.
- Operasi produk dan pesanan penjual menegakkan kepemilikan di API.
- Penulisan produk memvalidasi nama, harga, stok, kategori, dan URL gambar HTTP(S).
- Kata sandi di-hash dengan bcrypt dan rahasia dibaca dari variabel lingkungan.
