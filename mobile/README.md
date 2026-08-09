# Marketplace Mobile App (Store Front)

Aplikasi mobile React Native (Expo SDK 54) terpadu untuk platform e-commerce Store Front. Aplikasi ini melayani dua peran utama (**Pelanggan / Customer** dan **Penjual / Seller**) serta mode **Tamu (Guest)** dengan navigasi dinamis, sinkronisasi data real-time via REST API backend Node.js/Express, serta integrasi monitoring & analytics.

---

## Persyaratan Sistem

- **Node.js**: `v20.0.0` atau lebih baru
- **Package Manager**: `pnpm` / `npm`
- **Expo Go App** (opsional untuk pengujian fisik di Android/iOS) atau **Android Studio Emulator**
- **Backend API**: Node.js/Express REST API yang berjalan dari `../api` atau URL Cloud Render (`https://platform-lab-final-project.onrender.com/api`)

---

## Penyiapan Lokal & Pengembangan

### 1. Instalasi Dependensi

```bash
cd mobile
pnpm install
```

### 2. Memulai Server Pengembangan (Metro Bundler)

```bash
pnpm start
```
*Gunakan aplikasi Expo Go pada perangkat fisik Android/iOS dan pindai QR Code yang muncul di terminal.*

### 3. Menjalankan di Android Emulator

```bash
pnpm android
```

---

## Konfigurasi Lingkungan (`src/services/config.ts`)

| Variabel Config | Bawaan | Kegunaan |
| --- | --- | --- |
| `API_BASE_URL` | `https://platform-lab-final-project.onrender.com/api` | Base URL REST API Backend Node.js/Express (fallback opsional dari `EXPO_PUBLIC_API_URL`) |
| `USE_MOCK_DATA` | `false` | Menentukan apakah aplikasi menggunakan live REST API (`false`) atau data mock lokal (`true`) |
| `ENABLE_ONBOARDING` | `true` | Mengaktifkan/menonaktifkan layar Intro Onboarding untuk pengguna baru |
| `APP_NAME` | `"Store Front"` | Nama resmi aplikasi |

---

## Skrip yang Tersedia (`package.json`)

| Perintah | Tujuan |
| --- | --- |
| `pnpm start` | Jalankan Metro Bundler Expo development server |
| `pnpm android` | Jalankan aplikasi di Android Emulator |
| `pnpm ios` | Jalankan aplikasi di iOS Simulator |
| `pnpm web` | Jalankan pratinjau mode Web Expo |
| `pnpm eas:init` | Inisialisasi keterhubungan proyek ke Expo Cloud (`Project ID: 3720ab80-38a4-4829-b40c-38197b2ab6c3`) |
| `pnpm eas:build:preview` | Build standalone Android APK internal (`eas build --platform android --profile preview`) |
| `pnpm eas:build:production` | Build rilis produksi Android APK (`eas build --platform android --profile production`) |

---

## Layar & Fitur Utama

### Layar Pelanggan & Umum
- **Onboarding (`OnboardingScreen`)**: Pengenalan fitur aplikasi untuk pengguna pertama.
- **Katalog Beranda (`HomeScreen`)**: Pencarian produk real-time, filter kategori, kartu produk, indikator stok, & Pull-to-Refresh.
- **Detail Produk (`ProductDetailScreen`)**: Informasi lengkap produk, nama toko seller, stok real-time, dan tombol tambah ke keranjang.
- **Keranjang Belanja (`CartScreen`)**: Pengelompokan pesanan otomatis per seller (1 Faktur Per Toko), penyesuaian kuantitas, dan simulasi checkout.
- **Riwayat Pesanan (`OrderHistoryScreen`)**: Daftar transaksi pesanan pelanggan lengkap dengan badge status (`PENDING`, `PAID`, `PROCESSED`, `SHIPPED`, `COMPLETED`, `CANCELLED`).
- **Profil & Autentikasi (`ProfileScreen`, `LoginScreen`, `RegisterScreen`)**: Pengelolaan profil customer, login/register, serta penanganan mode Guest.

### Layar Penjual (Seller Dashboard)
- **Katalog Produk Toko (`SellerProductListScreen`)**: Pengelolaan produk toko milik seller, filter status (Aktif/Non-aktif/Stok Habis), toggle status produk, dan hapus produk.
- **Tambah / Edit Produk (`AddEditProductScreen`)**: Form pembuatan dan pembaruan data produk toko.
- **Kotak Masuk Pesanan (`SellerOrderInboxScreen`)**: Pemrosesan status pesanan masuk dari pelanggan secara bertahap (`PROCESSED` -> `SHIPPED`).

---

## Autentikasi, Interceptor, & Keamanan

- **Multi-Role Auth**: Sesi pelanggan disimpan dengan key `mp_customer_token` dan sesi seller disimpan dengan key `mp_seller_token` di AsyncStorage.
- **Authorization Header**: Client HTTP (`src/services/apiClient.ts`) secara otomatis menyisipkan header `Authorization: Bearer <token>` pada setiap permintaan terproteksi.
- **Cold-Start Handling**: Dilengkapi `AbortController` dengan timeout 30 detik untuk menangani *cold-start* server cloud Render.

---

## Monitoring & Crash Analytics (`G-JY9JZ9QVNF`)

Compliance Soal 5: Aplikasi dilengkapi sistem pemantauan dan analisis error terintegrasi:
- **`analyticsService.ts`**: Mengirimkan event navigasi layar (`page_view`) dan event custom ke **Google Analytics 4 Measurement Protocol (`G-JY9JZ9QVNF`)**.
- **`ErrorBoundary.tsx`**: Menangkap unhandled component runtime crashes secara otomatis dan mengirimkan crash log report ke Analytics.

---

## Deployment & EAS Cloud Build

Aplikasi dikonfigurasi untuk deployment ke Expo Cloud dengan metadata:
- **Application Name**: `Store Front`
- **Package ID**: `com.storefront.marketplace.mobile`
- **Expo Project ID**: `3720ab80-38a4-4829-b40c-38197b2ab6c3`

Untuk membuat file build standalone Android APK:
```bash
pnpm eas:build:production
```

---

## Struktur Direktori Proyek

```text
mobile/
├── assets/             Ikon aplikasi (icon.png), adaptive icon, & splash assets
├── app.json            Konfigurasi utama Expo, nama app ("Store Front"), package, & EAS ID
├── eas.json            Konfigurasi profile build EAS CLI (preview & production APK)
├── App.tsx             Root Component dibungkus dengan ErrorBoundary & Analytics Init
├── src/
│   ├── components/     Komposisi UI (AuthPromptModal, CustomAlertModal, ErrorBoundary, dll)
│   ├── navigation/     RootNavigator Stack Navigation & pelacakan navigasi otomatis
│   ├── screens/        Seluruh layar utama aplikasi (Customer, Seller, Auth, & Profile)
│   ├── services/       apiClient (Fetch REST wrapper), auth/cart/order/product services, & analyticsService
│   ├── theme/          Token desain Tokopedia/Storefront (colors, typography, spacing, shadows)
│   ├── types/          TypeScript interfaces & types (Product, Order, Customer, Seller, Cart)
│   └── utils/          Adapter storage lokal & pemanggilan API helper
```
