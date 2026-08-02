# Dokumen Persyaratan Produk (PRD)
### Marketplace Daring — Marketplace Dua Sisi "bergaya Tokopedia"

| | |
|---|---|
| **Mata Kuliah** | Pengembangan Platform Khusus |
| **Luaran** | Tugas Kelompok Proyek Lab — Minggu 10 |
| **Dokumen** | Persyaratan Produk (Marketplace web terpadu) |
| **Dokumen Pendamping** | `technical-requirements.md` |
| **Status** | Draf untuk ditinjau |
| **Tanggal** | 2026-08-01 |

---

## 1. Ikhtisar & Visi

Kami membangun **marketplace daring** yang dimodelkan berdasarkan [Tokopedia](https://www.tokopedia.com): sebuah platform tempat **penjual** independen mencantumkan produk dan **pelanggan** menelusuri, menambahkan produk ke keranjang, lalu melakukan checkout. Luaran saat ini adalah satu aplikasi web responsif yang didukung satu REST API; klien mobile native dan deployment publik masih menjadi pekerjaan mendatang.

Marketplace ini memiliki **dua sisi**:

- **Sisi pelanggan** — etalase untuk menemukan dan membeli produk.
- **Sisi penjual** — dasbor pedagang untuk mencantumkan produk dan memenuhi pesanan.

Kedua sisi menggunakan aplikasi web yang sama melalui namespace rute dan sesi akun yang terpisah. Pelanggan dan penjual memiliki **akun terpisah** dengan alur pendaftaran dan login yang terpisah.

> **Batasan panduan:** semua hal dalam dokumen ini harus dapat dibangun dengan keahlian Modul Lab 1–5 (React, Node/Express, MongoDB, React Native/Expo, JWT, deployment cloud). Kami sengaja menjaga set fitur tetap ringkas agar dapat dibangun, di-deploy, dan didemonstrasikan secara end-to-end.

---

## 2. Tujuan & Kriteria Keberhasilan

| # | Tujuan | Sinyal keberhasilan |
|---|------|----------------|
| G1 | Pelanggan dapat berpindah dari halaman awal hingga pesanan dibuat | Tamu → mendaftar → menelusuri → menambahkan ke keranjang → checkout → pesanan terlihat di riwayat |
| G2 | Penjual dapat menyediakan stok di marketplace dan memenuhi permintaan | Penjual → mendaftar → menambahkan produk → produk muncul di etalase → pesanan masuk → status diperbarui |
| G3 | Penambahan ke keranjang dibatasi autentikasi | Pengguna yang telah logout tidak dapat menambahkan produk ke keranjang di **klien mana pun**, dan API menolak percobaan tersebut |
| G4 | Satu backend melayani kedua peran marketplace | Aplikasi web terpadu menggunakan API bersama untuk alur kerja pelanggan dan penjual |
| G5 | Menjaga pengembangan berikutnya tetap siap di-deploy | Build web/API lokal saat ini didokumentasikan; deployment publik dan artefak mobile ditunda |

---

## 3. Persona & Peran

| Persona | Deskripsi | Pekerjaan utama yang perlu diselesaikan |
|---------|-------------|-------------------------|
| **Tamu** | Pengunjung yang belum diautentikasi | Menelusuri produk, melihat detail, mencari — **tidak dapat** menambahkan ke keranjang atau checkout |
| **Pelanggan** | Pembeli terdaftar (akun terpisah) | Menambahkan ke keranjang, checkout, melihat riwayat pesanan, mengelola profil |
| **Penjual** | Pedagang terdaftar (akun terpisah) | Mencantumkan/mengelola produk, melihat dan memenuhi pesanan, melihat dasbor penjualan sederhana |

**Pemisahan akun.** Pelanggan dan penjual adalah jenis akun yang berbeda dengan jalur masuk pendaftaran dan login yang berbeda. Akun pelanggan tidak dapat mengakses fungsi penjual dan sebaliknya (lihat aturan bisnis BR-1). Hal ini mencerminkan pemisahan Tokopedia antara aplikasi pembeli dan dasbor Seller (Toko).

---

## 4. Cakupan

### 4.1 Dalam cakupan
- Etalase pelanggan (web responsif): menelusuri, mencari, keranjang, checkout, riwayat pesanan.
- Dasbor penjual (web responsif): CRUD produk, pengelolaan pesanan, ringkasan penjualan.
- Autentikasi pelanggan/penjual terpisah (mendaftar, login, area terlindungi).
- Penambahan ke keranjang dan checkout yang dibatasi (autentikasi wajib).
- Checkout **simulasi** yang membuat rekaman pesanan (tanpa perpindahan uang nyata).
- Pemantauan/analitik web dasar.

### 4.2 Di luar cakupan (secara eksplisit)
- Integrasi **gateway pembayaran nyata** (Midtrans/Stripe/dll.). Checkout disimulasikan — sistem membuat pesanan dalam status `PENDING`/`PAID` tanpa menagih kartu.
- Layanan **unggah/penyimpanan gambar** produk — gambar produk dirujuk melalui **URL**.
- Aplikasi mobile native (React Native/Expo) ditunda hingga melampaui milestone web saat ini.
- Deployment publik ditunda sampai alur web/API lokal selesai.
- Penilaian, ulasan, chat/pesan, daftar keinginan, promosi/voucher.
- Perhitungan biaya pengiriman dan integrasi kurir (nilai tetap/pengganti dapat ditampilkan).
- Peran admin/superuser dan alat moderasi.
- Dukungan multi-mata uang — semua harga dalam **IDR**.

> Item di luar cakupan dicantumkan agar peninjau dapat melihat bahwa batasan ini merupakan keputusan yang disengaja, bukan kelalaian. Setiap item tersebut merupakan perluasan alami untuk masa mendatang.

---

## 5. Situs Pelanggan — Persyaratan Produk

Platform: **Web** (React + Vite). Klien mobile mendatang dapat menggunakan API yang sama, tetapi bukan bagian dari milestone ini.

### 5.1 Daftar fitur

| ID | Fitur | Web | Autentikasi wajib |
|----|---------|:---:|:-------------:|
| C1 | Beranda (produk unggulan + akses ke katalog) | ✅ | Tidak |
| C2 | Daftar produk dengan pencarian & filter kategori | ✅ | Tidak |
| C3 | Detail produk | ✅ | Tidak |
| C4 | **Tambah ke keranjang (dibatasi)** | ✅ | **Ya** |
| C5 | Tampilan keranjang (perbarui kuantitas, hapus) | ✅ | Ya |
| C6 | Checkout (simulasi) → membuat pesanan | ✅ | Ya |
| C7 | Riwayat pesanan & detail pesanan | ✅ | Ya |
| C8 | Pendaftaran / login pelanggan (JWT) | ✅ | — |
| C9 | Profil (lihat info dasar, keluar) | ✅ | Ya |

### 5.2 Cerita pengguna utama & kriteria penerimaan

**C2 — Menelusuri & mencari produk**
> Sebagai tamu atau pelanggan, saya ingin menelusuri dan mencari produk agar dapat menemukan yang saya inginkan.
- **AC1:** Daftar produk menampilkan gambar, nama, harga (IDR), dan nama penjual/toko.
- **AC2:** Kotak pencarian memfilter berdasarkan nama produk (tidak peka huruf besar-kecil, substring).
- **AC3:** Filter kategori mempersempit daftar.
- **AC4:** Tata letak responsif (mobile → satu kolom, desktop → grid).

**C4 — Tambah ke keranjang (autentikasi dibatasi)** ⭐ *persyaratan inti*
> Sebagai pelanggan, saya ingin menambahkan produk ke keranjang; sebagai tamu, saya harus diminta untuk login terlebih dahulu.
- **AC1:** **Tamu** yang mengetuk "Tambah ke keranjang" diarahkan ke halaman **login** pelanggan (dengan jalur kembali ke produk).
- **AC2:** **Pelanggan** yang sudah login menambahkan item; lencana/jumlah keranjang diperbarui.
- **AC3:** **API menolak** setiap permintaan penambahan ke keranjang tanpa token pelanggan yang valid (`401`) — pembatasan diberlakukan di sisi server, bukan hanya di UI (lihat BR-2).
- **AC4:** Menambahkan item yang sudah ada di keranjang meningkatkan kuantitasnya, bukan menggandakan baris.

**C6 — Checkout (simulasi)**
> Sebagai pelanggan, saya ingin membuat pesanan untuk item-item di keranjang saya.
- **AC1:** Hanya dapat diakses saat sudah diautentikasi **dan** keranjang tidak kosong.
- **AC2:** Pengiriman formulir mengelompokkan keranjang berdasarkan penjual dan membuat **satu pesanan per penjual** (BR-7), masing-masing menyimpan item baris penjual tersebut, kuantitas, harga satuan, dan subtotal; keranjang kemudian dikosongkan.
- **AC3:** Pesanan baru langsung muncul dalam riwayat pesanan pelanggan dengan status `PAID`; pembayaran simulasi mengonfirmasi pesanan selama checkout (lihat BR-3).
- **AC4:** **Stok** produk dikurangi untuk setiap baris pesanan.

**C7 — Riwayat pesanan**
> Sebagai pelanggan, saya ingin melihat pesanan-pesanan sebelumnya beserta statusnya.
- **AC1:** Menampilkan pesanan pelanggan (terbaru terlebih dahulu) dengan id pesanan, tanggal, total, dan status.
- **AC2:** Detail pesanan menampilkan item baris dan status terkini yang ditetapkan oleh penjual.

**C8 — Autentikasi pelanggan**
> Sebagai pelanggan, saya ingin mendaftar dan login dengan aman.
- **AC1:** Pendaftaran memerlukan email + password (+ name); email duplikat ditolak.
- **AC2:** Login mengembalikan JWT; rute/layar pelanggan yang dilindungi tidak dapat diakses tanpanya.
- **AC3:** Di mobile, token disimpan di perangkat dan sesi tetap bertahan setelah aplikasi dimulai ulang.

---

## 6. Situs Penjual — Persyaratan Produk

Platform: **Web** (dasbor penjual React + Vite). Penjual memiliki **akun terpisah** dari pelanggan.

### 6.1 Daftar fitur

| ID | Fitur | Web | Autentikasi wajib |
|----|---------|:---:|:-------------:|
| S1 | Pendaftaran / login penjual (JWT, alur terpisah) | ✅ | — |
| S2 | Manajemen produk — buat | ✅ | Ya (penjual) |
| S3 | Manajemen produk — edit / perbarui stok | ✅ | Ya (penjual) |
| S4 | Manajemen produk — hapus / nonaktifkan | ✅ | Ya (penjual) |
| S5 | Daftar produk saya | ✅ | Ya (penjual) |
| S6 | Kotak masuk pesanan masuk | ✅ | Ya (penjual) |
| S7 | Perbarui status pesanan (pemenuhan) | ✅ | Ya (penjual) |
| S8 | Dasbor penjualan (jumlah & total) | ✅ | Ya (penjual) |

### 6.2 Cerita pengguna utama & kriteria penerimaan

**S2/S3 — Kelola produk**
> Sebagai penjual, saya ingin menambahkan dan mengedit produk saya agar pelanggan dapat membelinya.
- **AC1:** Pembuatan memerlukan name, price, description, category, stock, dan image URL.
- **AC2:** Produk yang baru dibuat **langsung muncul** di etalase pelanggan (C2).
- **AC3:** Penjual hanya dapat mengedit/menghapus produk **miliknya sendiri** (kepemilikan diberlakukan oleh API — BR-4).
- **AC4:** Mengubah stok menjadi `0` menyembunyikan produk dari pembelian (ditampilkan sebagai habis stok).

**S6/S7 — Penuhi pesanan**
> Sebagai penjual, saya ingin melihat pesanan untuk produk saya dan memperbarui statusnya.
- **AC1:** Kotak masuk menampilkan **pesanan milik penjual ini sendiri** (satu pesanan per penjual — BR-7), dengan yang terbaru terlebih dahulu.
- **AC2:** Penjual dapat memajukan status pesanannya mengikuti siklus yang telah ditentukan (BR-3).
- **AC3:** Perubahan status tercermin dalam riwayat pesanan pelanggan (C7).

**S8 — Dasbor penjualan**
> Sebagai penjual, saya ingin melihat ringkasan penjualan dengan cepat.
- **AC1:** Menampilkan jumlah total pesanan dan pendapatan total dari produk penjual.
- **AC2:** Menampilkan jumlah produk yang sedang tercantum dan jumlah produk yang habis stok.

---

## 7. Aturan Bisnis Lintas Fitur

| ID | Aturan |
|----|------|
| **BR-1** | Akun pelanggan dan penjual berada dalam namespace terpisah. Token yang diterbitkan untuk satu jenis tidak boleh memberikan akses ke sumber daya terlindungi milik jenis lainnya. |
| **BR-2** | **Keranjang terbatas:** penambahan ke keranjang, melihat keranjang, dan checkout memerlukan token **pelanggan** yang valid. Pembatasan diberlakukan di lapisan API (`401` jika token tidak ada/tidak valid), sementara UI mengarahkan ke login sebagai kemudahan — tidak pernah menjadi satu-satunya penghalang. |
| **BR-3** | **Siklus pesanan:** `PENDING → PAID → PROCESSED → SHIPPED → COMPLETED`, dengan `CANCELLED` dapat dicapai dari `PENDING`/`PAID`. Pembayaran disimulasikan: checkout langsung mengonfirmasi setiap pesanan per penjual (BR-7) sebagai `PAID`, yang merepresentasikan langkah `PENDING → PAID`. Penjual pemilik memajukan `PAID → PROCESSED → SHIPPED → COMPLETED`. |
| **BR-4** | **Kepemilikan:** penjual hanya boleh membaca/memperbarui/menghapus produk yang dimilikinya dan hanya boleh melihat/memajukan pesanan miliknya sendiri. |
| **BR-5** | **Stok:** checkout mengurangi stok; baris pesanan tidak boleh melebihi stok yang tersedia saat checkout. |
| **BR-6** | **Snapshot harga:** pesanan menyimpan harga satuan saat pembelian, sehingga perubahan harga berikutnya oleh penjual tidak mengubah pesanan historis. |
| **BR-7** | **Satu pesanan per penjual:** saat checkout, keranjang dikelompokkan berdasarkan penjual dan pesanan terpisah dibuat untuk setiap penjual (satu checkout dapat menghasilkan beberapa pesanan). Dengan demikian, setiap pesanan memiliki satu `status` yang dimiliki tepat oleh satu penjual (seperti faktur per toko di Tokopedia). |

---

## 8. Persyaratan Nonfungsional

| Kategori | Persyaratan |
|----------|-------------|
| **Responsivitas** | Tata letak web menggunakan Flexbox/CSS Grid dan beradaptasi dari mobile (~360px) hingga desktop (~1280px+). |
| **Kemudahan penggunaan** | Navigasi konsisten; keadaan kosong/memuat/kesalahan yang jelas; tindakan utama dapat dijangkau dalam ≤ 3 ketukan. |
| **Performa** | Render pertama daftar produk selesai dalam beberapa detik pada koneksi normal; gunakan pagination atau batasi ukuran daftar agar payload tetap wajar. |
| **Keamanan** | Password di-hash; rahasia disimpan dalam variabel lingkungan; rute terlindungi diberlakukan di sisi server; input divalidasi (lihat TRD §9). |
| **Ketersediaan** | Alur web/API lokal dapat dijalankan berdasarkan penyiapan yang didokumentasikan; deployment publik dan artefak mobile ditunda. |
| **Kemudahan pemeliharaan** | Permukaan rute pelanggan dan penjual tetap terpisah dalam satu aplikasi web yang didukung API bersama. |
| **Observabilitas** | Analitik/pemantauan dasar dipasang pada klien web (Google Analytics atau LogRocket). |

---

## 9. Anggapan & Batasan

- Harga dan total dalam **IDR**; tidak ada mesin pajak/diskon.
- Satu produk tepat dimiliki oleh satu penjual; versi ini tidak memiliki varian produk (ukuran/warna).
- Satu keranjang untuk setiap pelanggan; checkout mengelompokkan keranjang berdasarkan penjual dan membuat **satu pesanan per penjual** (BR-7), sehingga satu checkout dapat menghasilkan beberapa pesanan — masing-masing dimiliki dan dipenuhi secara independen oleh penjualnya.
- Alamat pengiriman dicatat sebagai teks bebas saat checkout; tidak ada buku alamat.
- Stack teknologi ditetapkan oleh tugas (lihat `technical-requirements.md` §3).

---

## 10. Persyaratan → Pemetaan Rubrik Penilaian (Soal 1–5)

Marketplace ini dirancang agar setiap komponen yang dinilai dapat dipetakan ke fitur konkret di sini.

| Soal (bobot) | Topik | Dicakup oleh |
|---------------|-------|-----------|
| **Soal 1 (20%)** | Frontend Web React | C1–C6 web pelanggan (beranda, daftar, detail, keranjang, checkout) + React Router + Flexbox/Grid responsif |
| **Soal 2 (20%)** | Backend Node/Express + MongoDB | API bersama: pengelolaan produk & pengguna (pelanggan/penjual), CRUD + validasi (lihat TRD §6) |
| **Soal 3 (20%)** | Mobile React Native | Milestone mobile ditunda; kontrak REST bersama didokumentasikan untuk klien pelanggan dan penjual mendatang |
| **Soal 4 (20%)** | Integrasi Data & Autentikasi | Autentikasi JWT C8/S1, rute terlindungi & terbatas BR-1/BR-2, integrasi API Axios/Fetch |
| **Soal 5 (15%)** | Deployment & Pemantauan | Analitik web diimplementasikan; deployment web/API publik dan pengiriman Expo masih ditunda |

---

## Lampiran A — Glosarium

- **Autentikasi/keranjang terbatas (gated auth / gated cart)** — persyaratan bahwa penambahan ke keranjang (dan semua proses setelahnya) hanya tersedia bagi pelanggan yang telah diautentikasi, dan diberlakukan di API.
- **Checkout simulasi (simulated checkout)** — pembuatan pesanan tanpa gateway pembayaran nyata.
- **Siklus pesanan (order lifecycle)** — urutan status tetap yang dilalui pesanan (BR-3).
- **Beranda** — istilah bahasa Indonesia untuk "Home"; halaman awal etalase.
