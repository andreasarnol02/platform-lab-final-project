# Marketplace Mobile (Expo)

Klien mobile **Expo (React Native)** untuk aplikasi marketplace dua sisi — pelanggan dan penjual dalam **satu aplikasi**. Dibangun dengan plain JSX, tanpa TypeScript, dengan teks antarmuka berbahasa Indonesia.

## Prasyarat

- **Node.js 22.22+** (lihat `engines` di `package.json` root)
- **Expo Go** di perangkat fisik, atau simulator/emulator (iOS/Android)
- **API backend berjalan** — lihat README di root repositori, jalankan dengan `npm run dev` (menjalankan API + web sekaligus, API di port 4000)

## Setup

```bash
npm install
cp .env.example .env   # opsional — hanya jika ingin override URL API
npx expo start
```

Buka aplikasi lewat Expo Go (scan QR code) atau tekan `i` / `a` untuk simulator.

Dari **root repositori**, jalankan aplikasi mobile dengan:

```bash
npm run mobile
```

Perbedaan: `npm run mobile` (dari root) sama dengan `npx expo start` (dari folder `mobile/`) — keduanya menjalankan dev server Expo. Perhatikan bahwa `npm run dev` di root **tidak** menjalankan mobile; ia hanya menjalankan API + web. Jalankan `npm run mobile` secara terpisah, dengan API tetap berjalan di port 4000.

### Catatan Expo Go

Expo Go hanya mendukung **satu versi SDK** pada satu waktu. Untuk SDK 57, gunakan versi Expo Go yang sesuai dengan SDK 57 (versi terbaru dari app store), atau jalankan di iOS simulator / Android emulator / development build.

## Catatan URL API

- **Default (development via Expo):** URL API dideteksi otomatis dari `hostUri` mesin dev dengan port **4000**, mis. `http://192.168.x.x:4000/api`.
- **Override:** setel `EXPO_PUBLIC_API_URL` di file `.env` (lihat `.env.example`).
- **Perangkat fisik:** pastikan perangkat dan mesin dev berada di jaringan yang sama, lalu setel `EXPO_PUBLIC_API_URL` ke IP LAN mesin dev, mis. `http://192.168.1.10:4000/api`.

## Struktur Proyek

```
mobile/
├── App.js                     # Provider + NavigationContainer + RootNavigator
├── app.json                   # Konfigurasi Expo (name, slug, scheme, plugins)
├── index.js                   # Entry Expo (registerRootComponent)
└── src/
    ├── theme/                 # Design tokens (warna, spacing, radius, tipografi)
    ├── components/            # UI bersama: Icon, AppButton, BrandMark, ProductCard,
    │                          #   StatusBadge, Toast (ToastProvider/useToast), Screen,
    │                          #   Panel, SellerHeader, dll.
    ├── api/                   # customerClient / sellerClient / getErrorMessage
    ├── context/               # AuthContext, SellerAuthContext, CartContext
    ├── navigation/
    │   ├── RootNavigator.jsx  # Stack root: MainTabs | Login | Register | Checkout | Seller
    │   ├── CustomerNavigator.jsx  # CustomerTabs — 5 bottom tab pelanggan
    │   └── SellerNavigator.jsx    # Stack penjual (auth-gated) + bottom tab penjual
    └── screens/
        ├── customer/          # Login, Register, Home, Products, ProductDetail,
        │                      #   Cart, Checkout, Orders, OrderDetail, Profile,
        │                      #   NotFound, RequireLogin
        └── seller/            # SellerLogin, SellerRegister, Dashboard,
                               #   SellerProducts, ProductForm, SellerOrders
```

Pembagian rute meniru web: aplikasi pelanggan di `/` (MainTabs/Login/Register/Checkout) dan penjual di `/seller/*` (Seller), dialihkan di dalam aplikasi lewat navigasi.

## Pemetaan Fitur PRD

**Pelanggan (C1–C9):**

| Fitur PRD | Layar |
|---|---|
| C1 Beranda | `HomeScreen` (tab Beranda) |
| C2 Katalog produk | `ProductsScreen` (tab Katalog) |
| C3 Detail produk | `ProductDetailScreen` |
| C4 Keranjang | `CartScreen` (tab Keranjang, dengan badge jumlah) |
| C5 Checkout | `CheckoutScreen` |
| C6 Riwayat pesanan | `OrdersScreen` + `OrderDetailScreen` (tab Pesanan) |
| C7 Login pelanggan | `LoginScreen` |
| C8 Register pelanggan | `RegisterScreen` |
| C9 Profil | `ProfileScreen` (tab Profil) |

**Penjual (S1–S8):**

| Fitur PRD | Layar |
|---|---|
| S1 Login/Register penjual | `SellerLoginScreen`, `SellerRegisterScreen` |
| S2 Dashboard | `DashboardScreen` |
| S3 Produk Saya | `SellerProductsScreen` (tab Produk) |
| S4 Tambah/Edit produk | `ProductFormScreen` |
| S5 Pesanan masuk | `SellerOrdersScreen` (tab Pesanan) |
| S6 Perbarui status pesanan | `SellerOrdersScreen` |
| S7/S8 Manajemen toko & profil | `DashboardScreen` / `SellerProductsScreen` |

## Tech Stack

- **Expo SDK 57** (React Native 0.86, React 19.2)
- **React Navigation 7** — native stack + bottom tabs
- **axios** — HTTP client ke API
- **expo-secure-store** — penyimpanan token aman (plugin sudah terdaftar di `app.json`)
- **lucide-react-native** — ikon

## Testing

```bash
npm test
```

Menjalankan unit test Jest untuk helper di `src/utils` (format & product). CI menjalankan test yang sama dengan `npm test -- --runInBand`.

## Verifikasi

```bash
npx expo export --platform ios
```

Perintah di atas membundel aplikasi secara headless (smoke check CI) — harus lolos tanpa error.

## Catatan

- **Checkout memerlukan MongoDB transaksi** (Atlas atau replica set) di sisi API — transaksi (multi-document) dipakai untuk membuat pesanan dan mengurangi stok secara atomik. Jika API tidak memakai MongoDB dengan dukungan transaksi, checkout akan gagal dengan pesan error dari API.
