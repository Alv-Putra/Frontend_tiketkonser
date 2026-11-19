ALUR SISTEM WEBSITE PENJUALAN TIKET FESTIVAL

1. Akses Homepage
User dapat membuka website tanpa harus melakukan login atau membuat akun terlebih dahulu. Pada tahap ini user berstatus sebagai Guest. Guest dapat melihat homepage, daftar festival, mencari festival, menggunakan filter, dan melihat detail festival seperti poster, deskripsi, tanggal, lokasi, jadwal, harga tiket, dan informasi lainnya.
2. Melihat Detail Festival
Guest memilih salah satu festival untuk melihat informasi lengkap. User dapat melihat jenis tiket yang tersedia, harga, kuota, jadwal acara, lokasi, informasi organizer, FAQ, dan ketentuan festival. Pada tahap ini user masih belum diwajibkan memiliki akun.
3. Memilih untuk Membeli Tiket
Jika user tertarik membeli tiket, user menekan tombol Beli Tiket. Sistem kemudian memeriksa apakah user sudah login. Pembelian tiket merupakan fitur yang membutuhkan autentikasi.
4. Login atau Daftar Akun
Jika user belum login, sistem meminta user untuk login atau melakukan pendaftaran terlebih dahulu. User yang belum memiliki akun dapat melakukan registrasi dengan mengisi data yang diperlukan. Setelah berhasil login atau registrasi, user dapat melanjutkan proses pembelian tiket.
5. Memilih Tiket dan Checkout
User yang sudah login memilih jenis tiket dan jumlah tiket yang ingin dibeli. Sistem memeriksa ketersediaan kuota tiket, menghitung harga tiket, biaya layanan, diskon atau voucher jika tersedia, kemudian menampilkan total pembayaran kepada user.
6. Pembuatan Order
Setelah user melakukan checkout, sistem membuat order dengan nomor pesanan. Order menyimpan informasi user, tiket yang dipilih, jumlah tiket, harga, diskon, biaya layanan, pajak jika digunakan, dan total pembayaran.
7. Pembayaran
User melakukan pembayaran menggunakan metode pembayaran yang tersedia melalui payment gateway. Sistem menunggu konfirmasi pembayaran dari payment gateway. Order belum dianggap selesai sebelum pembayaran dikonfirmasi berhasil.
8. Pembayaran Berhasil
Setelah payment gateway mengonfirmasi bahwa pembayaran berhasil, backend memperbarui status pembayaran dan order menjadi berhasil atau paid. Sistem kemudian melanjutkan proses pembuatan tiket.
9. Pembuatan E-Ticket
Sistem membuat tiket digital untuk setiap tiket yang berhasil dibeli. Setiap tiket memiliki kode tiket dan QR Code yang digunakan untuk proses validasi ketika user datang ke festival. User dapat melihat tiket melalui halaman My Tickets.
10. Check-in di Festival
Pada hari festival, user menunjukkan QR Code tiket kepada petugas. Petugas melakukan scan QR Code. Sistem memeriksa apakah tiket tersedia, valid, sesuai dengan event, dan belum pernah digunakan.
11. Tiket Valid
Jika tiket valid dan belum digunakan, sistem menerima proses check-in dan mencatat waktu check-in. Status tiket kemudian berubah menjadi sudah digunakan. User diperbolehkan masuk ke area festival.
12. Tiket Tidak Valid
Jika QR Code tidak ditemukan, tiket sudah digunakan, tiket dibatalkan, atau status tiket tidak memenuhi syarat, sistem menolak proses check-in dan user tidak diperbolehkan menggunakan tiket tersebut untuk masuk.
13. Pengelolaan oleh Organizer# DESIGN.md — ConserId (Frontend)

> **Produk:** ConserId — *Experience Live Music*
> **Cakupan:** Frontend saja (Web Publik/Customer, Dashboard Organizer & Admin, Scanner Petugas, Aplikasi Mobile)
> **Acuan visual & struktur:** https://frontend-tiketkonser.vercel.app/
> **Selaras dengan:** `erd.md` (alur 15 tahap penjualan tiket festival)

---

## Daftar Isi

1. [Acuan & Hasil Pengamatan Situs](#1-acuan--hasil-pengamatan-situs)
2. [Prinsip Desain](#2-prinsip-desain)
3. [Design Tokens](#3-design-tokens)
4. [Peta Situs & Rute](#4-peta-situs--rute)
5. [Komponen UI](#5-komponen-ui)
6. [Web Publik (Guest & Customer)](#6-web-publik-guest--customer)
7. [Dashboard Organizer](#7-dashboard-organizer)
8. [Dashboard Admin](#8-dashboard-admin)
9. [Scanner Petugas (Check-in)](#9-scanner-petugas-check-in)
10. [Aplikasi Mobile](#10-aplikasi-mobile)
11. [Validasi & Pesan Error](#11-validasi--pesan-error)
12. [State UI: Loading, Empty, Error](#12-state-ui-loading-empty-error)
13. [Integrasi API dari Frontend](#13-integrasi-api-dari-frontend)
14. [Struktur Folder](#14-struktur-folder)
15. [Responsif & Aksesibilitas](#15-responsif--aksesibilitas)
16. [Inovasi (Poin Tambahan)](#16-inovasi-poin-tambahan)
17. [Checklist](#17-checklist)

---

## 1. Acuan & Hasil Pengamatan Situs

### 1.1 Apa yang berhasil dibaca dari situs acuan
Saya hanya bisa membaca **struktur dan teks** halaman (bukan tampilan visual), jadi bagian ini akurat untuk **susunan konten & alur**, sedangkan **warna, font, dan spasi di §3 adalah usulan** yang mengikuti kesan "konser gelap & berani". Jika Anda kirim screenshot, token di §3 bisa dicocokkan persis.

| Halaman acuan | Elemen yang ditemukan |
|---|---|
| **Beranda `/`** | Navbar (Home · Concert · Artists · FAQ + tombol *Download App*), **Hero** (tanggal "15 Agustus 2026", nama artis "Guns N Roses", venue, tombol *Beli Tiket*), **marquee teks berulang** "WHAT'S HAPPENING IN ASIA?", judul seksi + tombol *Find Events*, **UPCOMING SHOWS** (dengan empty state + *Hapus filter*), **WHAT WE'RE WATCHING?** (cuplikan video artis), **LAST CALL FOR TICKETS**, **FIRST TO KNOW** (CTA presale → Register), **Newsletter**, Footer 4 kolom + ikon sosial + tautan Spotify |
| **`/festivals`** | Navbar (Beranda · Festival · Masuk · Daftar), judul "Daftar Festival", **sort** (Terbaru · Terdekat · Harga Termurah · Harga Termahal · Paling Populer), tombol **Filter**, empty state "Tidak ada festival" + *Reset Filter*, footer (Navigasi · Dukungan · Kontak) |
| **`/auth/login`** | Tautan *Kembali ke Beranda*, judul "Masuk", Email, Password, *Lupa kata sandi?*, tombol Masuk, tautan Daftar, *Kirim ulang* email verifikasi |
| **`/auth/register`** | Nama Lengkap, Email, Password, Konfirmasi Password, catatan **wajib verifikasi email sebelum bisa masuk**, tombol Daftar |
| **Rute lain** | `/my-tickets`, `/auth/forgot-password`, `/verify-email` |

### 1.2 Hal yang dipertahankan dari acuan
- Tema **gelap, sinematik, teks kapital besar** untuk judul seksi.
- **Marquee** berjalan sebagai pemisah visual.
- Hero satu festival unggulan dengan **CTA tunggal "Beli Tiket"**.
- Halaman auth **minimalis & terpusat**, dengan tautan kembali ke beranda.
- **Verifikasi email** sebelum login.
- Sort + filter di daftar festival, **empty state yang ramah** dengan tombol reset.

### 1.3 Temuan yang sebaiknya diperbaiki (agar lebih baik dari acuan)
| # | Temuan | Perbaikan di dokumen ini |
|---|---|---|
| 1 | Bahasa **campur** Inggris–Indonesia (Home/Concert/Artists vs Beranda/Festival) | Satu bahasa: **Bahasa Indonesia** untuk UI; boleh mempertahankan 2–3 judul gaya kampanye berbahasa Inggris (lihat §6.2) |
| 2 | Menu navbar beranda berbeda dengan navbar halaman lain | **Satu navbar konsisten** di seluruh halaman |
| 3 | Menu *Artists* dan *FAQ* ada di navbar, tetapi tidak ada seksi/halaman yang jelas | Tambahkan seksi **Artis** dan **FAQ** di beranda (anchor), atau hapus dari menu |
| 4 | Beranda menampilkan **"Tidak ada acara yang cocok"** saat pertama dibuka | Beranda memakai **skeleton** saat memuat dan **data awal (seed)**; empty state hanya muncul bila benar-benar kosong |
| 5 | Tombol *Download App* tanpa tujuan jelas | Arahkan ke modal QR / tautan store; sembunyikan bila app belum rilis |
| 6 | Tautan footer `#` (Help Center, Kebijakan, dll.) | Buat halaman statis sederhana atau hapus |
| 7 | Teks marquee berulang 16× di DOM | Cukup 2 salinan + animasi CSS (lebih ringan, ramah *screen reader*) |
| 8 | Dua formulir newsletter di satu halaman | Satu formulir saja (di seksi *First To Know* atau footer) |

---

## 2. Prinsip Desain

1. **Konser dulu.** Poster, artis, dan tanggal adalah bintang; UI hanya panggungnya.
2. **Satu CTA dominan per layar.** "Beli Tiket" selalu paling mencolok.
3. **Guest tidak dihalangi.** Menjelajah bebas; login baru diminta saat menekan *Beli Tiket* — lalu **kembali ke festival yang sama** (alur tahap 3–4).
4. **Cepat terbaca.** Harga, tanggal, sisa kuota selalu terlihat tanpa klik tambahan.
5. **Cegah salah.** Validasi inline, tombol nonaktif saat tidak valid, konfirmasi aksi berbahaya.
6. **Konsisten & satu bahasa.** Semua komponen dari token yang sama di web & mobile.
7. **Percaya.** Status pembayaran, hitung mundur, dan tiket tampil jelas agar pembeli tidak ragu.

---

## 3. Design Tokens

> ⚠️ Nilai warna & font di bawah adalah **usulan** (tidak terbaca dari acuan). Ganti nilai di `tokens.css` bila ingin disamakan persis dengan situs.

### 3.1 Warna

**Brand**
| Token | Hex | Penggunaan |
|---|---|---|
| `--primary-500` | `#8B5CF6` | Link, ikon aktif |
| `--primary-600` | `#7C3AED` | **CTA utama**, tab aktif |
| `--primary-700` | `#6D28D9` | Hover/pressed |
| `--accent-500` | `#EC4899` | Aksen: badge "Last Call", highlight |
| `--gradient-hero` | `linear-gradient(135deg,#7C3AED,#EC4899)` | Hero, banner CTA |

**Netral Gelap (web publik & mobile)**
| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-base` | `#0B0B14` | Latar halaman |
| `--bg-surface` | `#14141F` | Kartu, navbar |
| `--bg-elevated` | `#1E1E2D` | Input, dropdown |
| `--border` | `#2A2A3D` | Garis |
| `--text` | `#F4F4F8` | Teks utama |
| `--text-muted` | `#A0A0B8` | Teks sekunder |

**Netral Terang (dashboard Organizer/Admin)**
| Token | Hex |
|---|---|
| `--bg-page` | `#F6F6FB` |
| `--bg-card` | `#FFFFFF` |
| `--border-light` | `#E4E4EF` |
| `--text-primary` | `#1A1A2E` |
| `--text-secondary` | `#5B5B75` |

**Semantik**
| Token | Solid | Latar lembut | Dipakai untuk |
|---|---|---|---|
| `--success` | `#16A34A` | `#DCFCE7` | Paid, Active, Valid |
| `--warning` | `#D97706` | `#FEF3C7` | Pending, Hampir Habis |
| `--danger` | `#DC2626` | `#FEE2E2` | Ditolak, Habis, Tidak valid |
| `--info` | `#2563EB` | `#DBEAFE` | Informasi |

### 3.2 Tipografi
- **Judul tampilan (display):** *Anton* / *Bebas Neue* / *Plus Jakarta Sans 800*, **UPPERCASE**, letter-spacing +0.02em — untuk gaya "WHAT'S HAPPENING IN ASIA?".
- **UI & isi:** *Plus Jakarta Sans* (cadangan *Inter*, `system-ui`).

| Token | Ukuran / LH | Weight | Pakai untuk |
|---|---|---|---|
| `display-xl` | 72 / 76 (mobile 44 / 48) | 800 | Nama artis di hero |
| `display-lg` | 48 / 52 (mobile 32 / 36) | 800 | Judul seksi (UPPERCASE) |
| `h1` | 32 / 40 | 700 | Judul halaman |
| `h2` | 24 / 32 | 700 | Sub-seksi |
| `h3` | 18 / 26 | 600 | Judul kartu |
| `body-lg` | 16 / 26 | 400 | Deskripsi |
| `body` | 14 / 22 | 400 | Teks standar |
| `caption` | 12 / 18 | 500 | Metadata |
| `overline` | 11 / 16 | 700, UPPERCASE, +0.1em | Label kecil ("FIRST TO KNOW") |

Angka uang & kuota: `font-variant-numeric: tabular-nums`.

### 3.3 Spasi, Radius, Bayangan, Motion
| Spasi (skala 4px) | | Radius | | Motion | |
|---|---|---|---|---|---|
| `space-1` | 4 | `sm` | 6 | `fast` | 120ms |
| `space-2` | 8 | `md` | 10 | `base` | 200ms |
| `space-3` | 12 | `lg` | 16 | `slow` | 320ms |
| `space-4` | 16 | `xl` | 24 | `ease` | `cubic-bezier(.2,.8,.2,1)` |
| `space-6` | 24 | `full` | 999 | | |
| `space-8` | 32 | | | | |
| `space-12` | 48 | | | | |
| `space-16` | 64 | | | | |
| `space-24` | 96 (jarak antar seksi beranda) | | | | |

Bayangan: `sm 0 1px 2px`, `md 0 4px 12px`, `lg 0 12px 32px`, `glow 0 0 24px rgba(124,58,237,.45)` (CTA hero). Hormati `prefers-reduced-motion`.

### 3.4 Layout Web Publik
- Lebar konten maks **1200px**, padding samping 24px (mobile 16px).
- Grid kartu festival: **4 kolom** ≥1200 · **3** ≥900 · **2** ≥600 · **1** <600.
- Breakpoint: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

### 3.5 Ikon
Satu set ikon garis (Lucide), 16/20/24px, stroke 1.75–2px.

---

## 4. Peta Situs & Rute

```
PUBLIK (Guest)
/                         Beranda
/festivals                Daftar festival (sort, filter, cari)
/festivals/:slug          Detail festival
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password/:token
/verify-email             Info & kirim ulang verifikasi

CUSTOMER (wajib login)
/festivals/:slug/checkout Pilih tiket & ringkasan
/orders/:orderNumber      Detail pesanan + pembayaran + countdown
/my-tickets               Daftar e-ticket
/my-tickets/:ticketCode   Detail e-ticket + QR
/profile                  Profil & ubah password
/orders                   Riwayat pesanan

ORGANIZER
/organizer/dashboard
/organizer/festivals                 + /create, /:id/edit
/organizer/festivals/:id/tickets     Jenis tiket & kuota
/organizer/festivals/:id/schedules   Jadwal
/organizer/festivals/:id/faqs
/organizer/festivals/:id/orders      Penjualan
/organizer/festivals/:id/attendees   Peserta & check-in
/organizer/vouchers
/organizer/profile

ADMIN
/admin/dashboard
/admin/festivals                     Review (pending_review)
/admin/festivals/:id                 Detail review → setujui/tolak
/admin/users
/admin/categories
/admin/orders

PETUGAS
/staff/scan                          Pilih festival → scanner
```

**Guard rute:**
| Kondisi | Perilaku |
|---|---|
| Belum login membuka rute customer | Redirect ke `/auth/login?redirect=<url asal>` |
| Role tidak sesuai (mis. customer ke `/admin`) | Halaman **403** |
| Token kedaluwarsa (401) | Logout paksa + toast "Sesi berakhir" |
| Sudah login membuka `/auth/login` | Redirect ke beranda / dashboard sesuai role |

---

## 5. Komponen UI

### 5.1 Button
| Varian | Gaya | Pakai |
|---|---|---|
| **Primary** | Latar `primary-600`, teks putih, radius `full` (web publik) | *Beli Tiket*, *Masuk*, *Daftar* |
| **Secondary** | Border `primary-600`, transparan | *Find Events*, *Filter* |
| **Ghost** | Tanpa border | *Hapus filter*, *Batal* |
| **Danger** | Latar `danger` | Hapus, Tolak, Tutup penjualan |
| **Icon** | 40×40 | Aksi baris tabel |

Ukuran: `sm 32` · `md 40` · `lg 48` (CTA hero & mobile). State: hover · pressed · focus ring 2px · disabled (45%) · loading (spinner + teks "Memproses…").

### 5.2 Form
Label di atas input; tinggi 44px (web) / 48px (mobile); radius `md`; state default/focus/error/disabled; toggle mata pada password; helper text 12px. Komponen: Text, Email, Password, Number stepper, Textarea, Select, DateTime, File dropzone, Search.

### 5.3 Navbar (Publik)
```
┌──────────────────────────────────────────────────────────────────┐
│ ConserId   Beranda  Festival  Artis  FAQ      [Masuk] [Daftar]   │
└──────────────────────────────────────────────────────────────────┘
 (login) →   ... Festival  Artis  FAQ    Tiket Saya   (👤 Dimas ▾)
```
- Sticky, latar `bg-base` transparan → solid + blur setelah scroll 8px.
- Item aktif: garis bawah 2px `primary-600`.
- Guest: tombol **Masuk** (ghost) + **Daftar** (primary). Login: **Tiket Saya** + menu avatar (Profil, Pesanan, Keluar).
- Mobile (<768): hamburger → drawer penuh layar.
- Tombol *Download App* ditaruh di footer / drawer (bukan navbar utama) agar tidak bersaing dengan CTA.

### 5.4 Festival Card
```
┌────────────────────┐
│  [ POSTER 4:5 ]    │  ← badge pojok: "Last Call" / "Sold Out" / "Presale"
│  gradien bawah     │
├────────────────────┤
│ 15 AGU 2026 · JKT  │  overline
│ Guns N Roses       │  h3
│ Gelora Bung Karno  │  muted
│ Mulai Rp 750.000   │  tebal      [ Beli Tiket → ]
└────────────────────┘
```
Hover: poster zoom 1.04, kartu naik 4px, bayangan `lg`. *Sold Out*: poster grayscale + tombol nonaktif.

### 5.5 Badge
| Konteks | Teks → warna |
|---|---|
| Festival | `Presale` info · `Last Call` accent · `Sold Out` danger · `Selesai` netral |
| Order | `Menunggu Pembayaran` warning · `Lunas` success · `Kedaluwarsa` netral · `Dibatalkan` netral · `Refund` info |
| Tiket | `Aktif` success · `Sudah Digunakan` netral · `Dibatalkan` danger |
| Review | `Draft` netral · `Menunggu Review` warning · `Disetujui` success · `Ditolak` danger · `Terbit` success |
| Kuota | `Tersedia` · `Hampir Habis` (≤10%) · `Habis` |

Pill, titik indikator di kiri, **warna + teks + ikon** (bukan warna saja).

### 5.6 Komponen Khusus
| Komponen | Deskripsi |
|---|---|
| **Marquee** | Teks kapital besar berjalan horizontal, 2 salinan, `animation: linear infinite 30s`, jeda saat hover, berhenti bila reduced-motion |
| **Quantity Stepper** | `−` `n` `+`; `+` nonaktif bila = sisa kuota **atau** = batas per order |
| **Quota Bar** | terjual/kuota; hijau → kuning ≥80% → merah ≥95% |
| **Countdown** | `MM:SS` batas bayar; merah <5 menit |
| **Ticket Stub** | Tiket berlekuk (notch) dengan QR |
| **Order Summary** | Subtotal, diskon, biaya layanan, pajak, **Total** |
| **Voucher Input** | Input + tombol *Terapkan*, hasil sukses/gagal inline |
| **Video Card** | Thumbnail + tombol play, modal pemutar |
| **Status Stepper** | Dibuat → Menunggu Bayar → Dibayar → Tiket Terbit |
| **Toast / Dialog / Modal / Skeleton / Empty State** | Lihat §12 |

---

## 6. Web Publik (Guest & Customer)

### 6.1 Footer (di semua halaman publik)
4 kolom: **ConserId** (deskripsi singkat + tautan Spotify), **Tentang** (Tentang Kami, Syarat & Ketentuan, Kebijakan Privasi, Kebijakan Refund, Kebijakan Cookie), **Tautan Cepat** (Semua Konser, Festival, Pengalaman VIP, Tiket Saya, Masuk/Daftar), **Kontak** (email, telepon, kota). Baris bawah: ikon sosial + © 2026 ConserId. Seluruh tautan harus mengarah ke halaman nyata (lihat temuan #6).

### 6.2 Beranda `/` (alur tahap 1)

Urutan seksi dari atas:

| # | Seksi | Isi & perilaku |
|---|---|---|
| 1 | **Navbar** | §5.3 |
| 2 | **Hero** | Latar poster/foto artis penuh layar (tinggi 90vh), gradien gelap dari bawah. Overline **tanggal** ("15 AGUSTUS 2026"), `display-xl` **nama artis/festival**, venue + kota, tombol **Beli Tiket** (primary lg + glow) dan **Lihat Detail** (ghost). Hero = festival `featured` dari API; bila lebih dari satu → carousel auto-geser 6 detik dengan indikator titik |
| 3 | **Marquee** | "WHAT'S HAPPENING IN ASIA?" berjalan, separator ✦ |
| 4 | **Upcoming Shows** | Judul `display-lg` + subjudul. Toolbar: **kolom cari** (nama artis/venue/kota, debounce 400ms) + chip kategori + tombol **Find Events** → ke `/festivals` dengan query. Grid 4 kartu pertama (maks 8) + tombol *Lihat Semua*. Empty state: ilustrasi + "Tidak ada acara yang cocok" + saran + **Hapus filter** |
| 5 | **Artis** | Baris foto bulat artis (scroll horizontal), klik → daftar festival artis tersebut. *(Mendukung menu "Artis")* |
| 6 | **What We're Watching?** | Cuplikan penampilan: 1 video besar + 3 thumbnail; klik memutar di modal. Sumber: tautan YouTube embed dari data festival |
| 7 | **Last Call for Tickets** | Kartu festival dengan `Hampir Habis` (kuota ≤10%) atau penjualan berakhir <7 hari. Tiap kartu menampilkan **Quota Bar** & "Tersisa N tiket". Disembunyikan bila kosong |
| 8 | **First To Know** | Banner gradien: overline *FIRST TO KNOW*, judul "Dapatkan akses awal ke tiket konser favoritmu!", deskripsi presale, tombol **Daftar Sekarang** → `/auth/register`. Sembunyikan bila user sudah login |
| 9 | **FAQ** | Accordion 5–8 pertanyaan umum (cara beli, metode bayar, refund, e-ticket, syarat masuk) |
| 10 | **Newsletter** | Input email + *Berlangganan*, validasi + toast sukses |
| 11 | **Footer** | §6.1 |

### 6.3 Daftar Festival `/festivals`

```
Daftar Festival
Temukan festival dan konser favoritmu

[ 🔍 Cari artis, festival, venue, kota… ]   [Urutkan: Terbaru ▾]  [⚙ Filter]
Chip aktif: [Jakarta ✕] [Musik ✕]                       Hapus semua

┌────┐ ┌────┐ ┌────┐ ┌────┐
│card│ │card│ │card│ │card│
└────┘ └────┘ └────┘ └────┘
              [ Muat Lebih Banyak ]
```
- **Urutkan:** Terbaru · Terdekat · Harga Termurah · Harga Termahal · Paling Populer (default Terbaru).
- **Filter** (panel samping di desktop, *bottom sheet* di mobile): Kategori (multi), Kota (multi), Rentang tanggal, Rentang harga (slider), Hanya yang masih tersedia (toggle).
- Semua filter & sort tersimpan di **query string** (`?q=&sort=&city=&cat=`) → bisa dibagikan & tombol *Back* berfungsi.
- Pagination: tombol **Muat Lebih Banyak** (12 per halaman) atau infinite scroll.
- Jumlah hasil: "24 festival ditemukan".
- Empty state: ikon + **"Tidak ada festival"** + "Tidak ada konser yang sesuai dengan pencarian." + tombol **Reset Filter**.

### 6.4 Detail Festival `/festivals/:slug` (alur tahap 2–3)

```
┌──────────────────────────────────────────────────────────────┐
│ BANNER / POSTER HERO (gradien)                               │
│ Kategori · Badge status                                      │
│ Guns N Roses                                  ┌────────────┐ │
│ 📅 Sab, 15 Agu 2026 · 19.00 WIB               │ Mulai dari │ │
│ 📍 Gelora Bung Karno, Jakarta                 │ Rp 750.000 │ │
│                                               │[Beli Tiket]│ │ ← kartu sticky (desktop)
├─────────────────────────────────────────────  └────────────┘ │
│ [Tentang] [Tiket] [Jadwal] [Lokasi] [FAQ]   ← tab/anchor     │
│                                                              │
│ TENTANG       deskripsi (Baca selengkapnya)                  │
│ TIKET         daftar jenis tiket (lihat bawah)               │
│ JADWAL        timeline rundown per jam/panggung              │
│ LOKASI        alamat + peta (link Google Maps)               │
│ ORGANIZER     logo, nama, deskripsi, kontak                  │
│ FAQ           accordion                                      │
│ KETENTUAN     syarat & ketentuan festival (accordion)        │
└──────────────────────────────────────────────────────────────┘
```

**Daftar jenis tiket:**
```
┌───────────────────────────────────────────────────────────┐
│ ▍VIP                                       Rp 2.500.000    │
│   Area depan panggung + merchandise        Sisa 13 ▓▓▓▓▓░  │
│   Penjualan s/d 10 Agu 2026                  [ Pilih ]     │
├───────────────────────────────────────────────────────────┤
│ ▍Regular                                   Rp   750.000    │
│ ▍Early Bird  (HABIS)                       Rp   500.000    │
└───────────────────────────────────────────────────────────┘
```
- Tiket di luar periode jual → "Penjualan dibuka 1 Jul 2026" / "Penjualan berakhir".
- **Beli Tiket (Guest)** → modal ringan *"Masuk dulu untuk membeli tiket"* + tombol **Masuk** / **Daftar** → setelah berhasil **kembali ke halaman ini** (parameter `redirect`).
- **Beli Tiket (login)** → `/festivals/:slug/checkout`.
- Mobile: bar sticky bawah "Mulai dari Rp … [Beli Tiket]".
- Festival `finished/cancelled`: tombol diganti badge, tiket nonaktif.

### 6.5 Login `/auth/login`
Kartu tengah (maks 420px) di atas latar gelap bergradien tipis.

```
← Kembali ke Beranda
        ConserId
   Masuk
   Silakan masuk untuk melanjutkan pembelian tiket

   Email *     [____________________]
   Password *  [____________________ 👁]    Lupa kata sandi?
   [            Masuk             ]

   Belum punya akun? Daftar sekarang
   Belum menerima email verifikasi? Kirim ulang
```
| Kasus | Perilaku |
|---|---|
| Kredensial salah | Banner merah "Email atau password salah." |
| Email belum diverifikasi | Banner kuning "Email belum diverifikasi." + tombol **Kirim ulang** (cooldown 60 dtk) |
| Akun nonaktif | "Akun Anda dinonaktifkan. Hubungi dukungan." |
| Sukses | Ke `redirect` bila ada; jika tidak: customer → `/`, organizer → `/organizer/dashboard`, admin → `/admin/dashboard`, staff → `/staff/scan` |

### 6.6 Daftar `/auth/register`
Field: **Nama Lengkap*** · **Email*** · **Password*** (indikator kekuatan) · **Konfirmasi Password***. Kotak info biru: *"Setelah mendaftar, Anda perlu memverifikasi email melalui link yang dikirim ke inbox sebelum bisa masuk."*
Sukses → halaman **Cek Email Anda** (ikon amplop, alamat email, tombol *Kirim ulang*, tautan *Ke halaman Masuk*).
*(Opsional, untuk organizer: tautan "Daftar sebagai Organizer" di bawah form.)*

### 6.7 Verifikasi Email & Lupa Password
- `/verify-email`: tiga kondisi — **Berhasil** (centang + tombol Masuk), **Token kedaluwarsa** (+ Kirim ulang), **Menunggu** (instruksi).
- `/auth/forgot-password`: input email → pesan netral *"Jika email terdaftar, link reset telah dikirim."* (jangan bocorkan apakah email ada).
- `/auth/reset-password/:token`: password baru + konfirmasi.

### 6.8 Checkout `/festivals/:slug/checkout` (alur tahap 5–6)

Dua kolom (desktop): kiri **pilih tiket**, kanan **ringkasan** (sticky).

```
┌──────────────────────────────────────┬───────────────────────────┐
│ 1 Pilih Tiket                        │ RINGKASAN PESANAN         │
│  VIP        Rp2.500.000  [−] 2 [+]   │ [mini poster] Guns N Roses│
│  Regular    Rp  750.000  [−] 0 [+]   │ 15 Agu 2026 · GBK         │
│  (maks 5 tiket per order)            │ ───────────────────────── │
│ 2 Data Pemegang Tiket (opsional)     │ VIP × 2        5.000.000  │
│  Tiket 1: Nama [___________]         │ Subtotal       5.000.000  │
│  Tiket 2: Nama [___________]         │ Voucher HEMAT10  −500.000 │
│ 3 Voucher                            │ Biaya layanan     50.000  │
│  [ KODE____ ] [Terapkan]             │ Pajak                  0  │
│                                      │ TOTAL          4.550.000  │
│                                      │ [   Buat Pesanan   ]      │
└──────────────────────────────────────┴───────────────────────────┘
```
- Total diperbarui **real-time** (animasi angka halus).
- Hitungan akhir tetap dari server; tampilkan loading singkat saat *Terapkan* voucher.
- Klik **Buat Pesanan** → loading → bila sukses ke `/orders/:orderNumber`.
- Error **409 kuota tidak cukup**: dialog *"Kuota VIP tersisa 1. Ubah jumlah tiket Anda."* dan stepper otomatis menyesuaikan.
- Mobile: ringkasan menjadi bar sticky bawah (total + tombol) yang bisa dibuka (*bottom sheet*) untuk melihat rincian.

### 6.9 Pembayaran `/orders/:orderNumber` (alur tahap 7–8)

```
 Pesanan ORD-20261011-000123          [Menunggu Pembayaran]
 Selesaikan pembayaran dalam   ⏱ 29:41

 Total  Rp 4.550.000
 [   Bayar Sekarang   ]   → buka payment gateway (popup/redirect)

 Rincian tiket · Status Stepper · Info bantuan
```
- Setelah kembali dari gateway: halaman melakukan **polling status** tiap 3 detik (maks 2 menit) sampai `paid` → tampil animasi sukses + tombol **Lihat Tiket Saya**. Jika polling habis: pesan *"Pembayaran sedang diproses, kami akan mengabari Anda"*.
- Countdown habis → status `Kedaluwarsa`, tombol **Pesan Ulang**.
- Tombol **Batalkan Pesanan** (dialog konfirmasi) selama masih `pending`.

### 6.10 My Tickets `/my-tickets` (alur tahap 9)
- Tab: **Akan Datang** · **Sudah Digunakan / Selesai** · **Dibatalkan**.
- Kartu **Ticket Stub** (poster mini, nama festival, tanggal, jenis tiket, kode tiket, badge status) + tombol **Lihat QR**.
- Detail `/my-tickets/:ticketCode`: tiket besar bergaya fisik dengan **QR berlatar putih**, kode tiket, nama pemegang, jenis tiket, venue & jam; tombol **Unduh PDF/Gambar**, **Tambah ke Kalender**; QR otomatis diperbarui bila status berubah; bila `used` → cap "SUDAH DIGUNAKAN" + waktu check-in.
- Empty state: *"Belum ada tiket"* + tombol **Jelajahi Festival**.

### 6.11 Riwayat Pesanan & Profil
- `/orders`: tabel/kartu — nomor pesanan, festival, total, tanggal, badge status, aksi *Detail* / *Bayar*.
- `/profile`: edit nama & telepon, ubah password, status verifikasi email.

---

## 7. Dashboard Organizer

**Layout:** sidebar kiri (260px, gelap) + topbar + konten terang (`--bg-page`).
Menu: Dashboard · Festival Saya · Voucher · Profil Organizer · Keluar.

### 7.1 Dashboard
- Stat card: **Tiket Terjual** · **Pendapatan** (order paid) · **Festival Aktif** · **Check-in hari ini**.
- Grafik penjualan 7/30 hari (garis) + donut per jenis tiket.
- Tabel "Festival Saya" ringkas dengan Quota Bar.

### 7.2 Festival Saya `/organizer/festivals`
Tabel: Poster · Judul · Tanggal · Status (badge review) · Terjual/Kuota · Aksi (Edit, Kelola Tiket, Penjualan, Peserta). Filter status; tombol **+ Buat Festival**.

### 7.3 Form Festival (stepper 4 langkah)
| Langkah | Isi |
|---|---|
| 1. Informasi | Judul*, kategori*, deskripsi*, poster* (≤2MB), banner, tautan video cuplikan |
| 2. Waktu & Lokasi | Mulai*/selesai*, venue*, alamat*, kota*, koordinat (opsional), batas tiket per order |
| 3. Tiket | Repeater **jenis tiket**: nama*, deskripsi/benefit, harga*, kuota*, maks per order, **periode penjualan** mulai/akhir*, aktif. Total kuota otomatis |
| 4. Detail Tambahan | Jadwal/rundown (repeater), FAQ (repeater), syarat & ketentuan |

Aksi: **Simpan Draft** · **Ajukan Review** (status → `pending_review`, kunci edit utama). Pratinjau kartu & halaman detail di panel kanan. Bila `rejected`: banner merah di atas form berisi **catatan Admin** + tombol *Revisi & Ajukan Ulang*.
Aturan: kuota tidak boleh kurang dari tiket terjual; tombol **Tutup Penjualan** (switch `is_active`) dengan dialog konfirmasi.

### 7.4 Penjualan & Peserta
- **Penjualan:** tabel order (nomor, pembeli, rincian, total, status, tanggal) + filter + **Ekspor CSV**.
- **Peserta:** tabel tiket (kode, pemegang, jenis, status, waktu check-in) + pencarian + statistik check-in (progress "420 / 1.000 masuk").
- **Voucher:** CRUD (kode, tipe %/nominal, nilai, maks diskon, min belanja, batas pakai, periode, festival).

---

## 8. Dashboard Admin (alur tahap 14)

Menu: Dashboard · Review Festival · Pengguna · Kategori · Pesanan · Keluar.

- **Dashboard:** stat (Pengguna, Organizer, Festival terbit, Pendapatan platform), antrean **Menunggu Review** (badge angka di menu), grafik penjualan.
- **Review Festival:** tab *Menunggu Review* · *Disetujui* · *Ditolak* · *Semua*. Halaman detail menampilkan **pratinjau persis seperti tampilan publik** + daftar periksa (poster layak, tanggal valid, tiket & harga wajar, deskripsi lengkap). Tombol **Setujui & Terbitkan** (dialog) dan **Tolak** (modal, **catatan wajib**). Riwayat keputusan ditampilkan di bawah.
- **Pengguna:** tabel + ubah role, aktifkan/nonaktifkan; buat akun **Petugas**.
- **Kategori:** CRUD sederhana (modal).
- **Pesanan:** pantauan seluruh order + filter status/festival.

---

## 9. Scanner Petugas (Check-in) (alur tahap 10–12)

Dioptimalkan untuk **ponsel**, satu tangan, kondisi gelap/ramai.

```
 Festival: Guns N Roses ▾
 ┌───────────────────────────┐
 │      [ KAMERA SCAN ]      │
 │        ┌───────┐          │
 │        │ frame │          │
 │        └───────┘          │
 └───────────────────────────┘
  Input manual kode: [_____] [Cek]
  Check-in hari ini: 420 / 1.000
```
**Hasil scan — layar penuh berwarna** + getar/bunyi:

| Hasil | Tampilan | Pesan |
|---|---|---|
| `valid` | **Hijau besar** ✔ | "TIKET VALID — Silakan masuk" + jenis tiket, nama, waktu |
| `already_used` | **Merah** ✖ | "SUDAH DIGUNAKAN pada 14:02 oleh Petugas A" |
| `not_found` | Merah | "QR tidak dikenali" |
| `wrong_event` | Oranye | "Tiket untuk festival lain" |
| `cancelled` / `invalid_status` | Merah | "Tiket dibatalkan / tidak valid" |

Hasil otomatis kembali ke kamera setelah 2 detik (atau ketuk untuk lanjut). Daftar **riwayat scan terakhir** di bawah. Mode *offline-aware*: tampilkan peringatan bila koneksi putus (check-in tetap harus online agar tidak ganda).

---

## 10. Aplikasi Mobile

Tombol **Download App** di situs mengarah ke aplikasi pelanggan. Cakupan minimal: mengikuti alur §6 dengan penyesuaian mobile.

| Elemen | Spesifikasi |
|---|---|
| Tema | Gelap, token §3.1 |
| Navigasi | Bottom tab 4: **Beranda · Cari · Tiket Saya · Profil** |
| Layar | Splash → Login/Daftar → Beranda → Detail Festival → *Bottom sheet* Pilih Tiket → Ringkasan → Pembayaran (WebView gateway) → Status → Tiket Saya → QR |
| Area sentuh | ≥ 44×44dp, margin 16dp, acuan 360×800dp |
| QR | Satu QR per tiket, swipe antar tiket, **kecerahan layar naik otomatis** |
| Gestur | Pull-to-refresh, swipe-back, tombol back menutup *bottom sheet* dulu |
| Offline | Cache tiket terakhir (QR tetap tampil), banner "Tidak ada koneksi" |
| Notifikasi | Pembayaran berhasil, tiket terbit, pengingat H-1 |

---

## 11. Validasi & Pesan Error

Prinsip: validasi saat **blur** dan **submit**, pesan di bawah field (merah, 12px, ikon), fokus ke error pertama, 422 dipetakan per field. Backend tetap sumber kebenaran.

| Form | Field | Aturan | Pesan |
|---|---|---|---|
| Login | Email | wajib, format | "Format email tidak valid" |
| Login | Password | wajib | "Password wajib diisi" |
| Daftar | Nama | 3–100 | "Nama minimal 3 karakter" |
| Daftar | Password | ≥ 8, huruf+angka | "Minimal 8 karakter dengan huruf dan angka" |
| Daftar | Konfirmasi | sama | "Konfirmasi password tidak cocok" |
| Checkout | Jumlah | 1–batas, ≤ sisa kuota | "Maksimal 5 tiket per pesanan" / "Sisa kuota tinggal 13" |
| Checkout | Voucher | kode valid | "Kode voucher tidak berlaku" / "Minimal belanja Rp …" |
| Festival | Judul | 3–150 | "Judul minimal 3 karakter" |
| Festival | Tanggal | `selesai > mulai`, tidak lampau | "Tanggal selesai harus setelah tanggal mulai" |
| Festival | Poster | JPG/PNG ≤ 2 MB | "Poster harus JPG/PNG maksimal 2 MB" |
| Tiket | Harga | angka ≥ 0 | "Harga harus berupa angka" |
| Tiket | Kuota | bulat ≥ 1 (≥ terjual) | "Kuota tidak boleh kurang dari tiket terjual (87)" |
| Tiket | Periode | akhir > awal, ≤ tanggal festival | "Periode penjualan tidak valid" |
| Review | Catatan tolak | wajib | "Catatan penolakan wajib diisi" |
| Newsletter | Email | format | "Masukkan email yang valid" |

**HTTP → UI**
| Kode | Perilaku |
|---|---|
| 401 | Logout paksa → login (simpan `redirect`) |
| 403 | Halaman "Akses ditolak" |
| 404 | Halaman "Tidak ditemukan" + tombol beranda |
| 409 | Dialog informatif (kuota habis, order kedaluwarsa) |
| 422 | Error per field |
| 429 | "Terlalu banyak percobaan, coba lagi nanti" |
| 5xx / timeout | Toast + tombol **Coba Lagi** |

---

## 12. State UI: Loading, Empty, Error

Setiap tampilan data wajib punya 4 state.

| State | Web | Mobile |
|---|---|---|
| **Loading** | Skeleton kartu/tabel (bentuk sama dengan konten) | Skeleton + shimmer |
| **Empty** | Ilustrasi + judul + saran + tombol aksi | Sama |
| **Error** | Banner/kartu + **Coba Lagi** | Layar penuh + **Coba Lagi** |
| **Success** | Data | Data |

| Lokasi | Teks empty state |
|---|---|
| Upcoming Shows | "Tidak ada acara yang cocok. Coba kata kunci lain — misalnya nama artis, venue, atau kota." + **Hapus filter** |
| `/festivals` | "Tidak ada festival" + "Tidak ada konser yang sesuai dengan pencarian." + **Reset Filter** |
| My Tickets | "Belum ada tiket. Yuk cari festival seru!" + **Jelajahi Festival** |
| Organizer – Festival | "Belum ada festival. Buat festival pertamamu." + **+ Buat Festival** |
| Admin – Review | "Tidak ada festival yang menunggu review 🎉" |

**Toast:** pojok kanan-atas (web) / atas (mobile), 4 detik, varian sukses/error/info/peringatan. **Dialog konfirmasi** untuk hapus, tutup penjualan, batalkan pesanan, tolak festival, keluar.

---

## 13. Integrasi API dari Frontend

- **Base URL** dari env (`VITE_API_URL` / `NEXT_PUBLIC_API_URL`), tidak di-hardcode.
- Header `Authorization: Bearer <token>`; interceptor global untuk 401.
- Respons: `{ success, message, data, meta }`; error validasi: `{ success:false, errors:{ field:[...] } }`.
- Pisahkan **service layer** (`api/`) dari komponen; matikan tombol submit saat request berjalan (cegah pesanan ganda).

| Area | Endpoint (usulan) | Dipakai di |
|---|---|---|
| Auth | `POST /auth/register` · `/login` · `/logout` · `/forgot-password` · `/reset-password` · `GET /auth/verify-email` · `POST /auth/resend-verification` · `GET /auth/me` | §6.5–6.7 |
| Publik | `GET /festivals` (q, sort, city, category, price, page) · `GET /festivals/featured` · `GET /festivals/last-call` · `GET /festivals/{slug}` · `GET /categories` · `GET /artists` · `POST /newsletter` | §6.2–6.4 |
| Checkout | `POST /vouchers/validate` · `POST /orders` · `GET /orders` · `GET /orders/{no}` · `POST /orders/{no}/pay` · `POST /orders/{no}/cancel` | §6.8–6.9 |
| Tiket | `GET /my-tickets` · `GET /my-tickets/{code}` | §6.10 |
| Organizer | `CRUD /organizer/festivals` · `POST /organizer/festivals/{id}/submit` · `CRUD …/ticket-types` · `…/schedules` · `…/faqs` · `GET …/orders` · `GET …/attendees` · `CRUD /organizer/vouchers` · `GET /organizer/dashboard` | §7 |
| Admin | `GET /admin/festivals?status=pending_review` · `POST /admin/festivals/{id}/approve` · `/reject` · `CRUD /admin/users` · `CRUD /admin/categories` · `GET /admin/dashboard` | §8 |
| Petugas | `GET /staff/festivals` · `POST /staff/checkin` (`qr_token`, `festival_id`) | §9 |

**Helper format:** `formatRupiah(2500000)` → `Rp 2.500.000` · `formatTanggal(d)` → `Sab, 15 Agu 2026 · 19.00 WIB` (locale `id-ID`). **Pembayaran:** frontend tidak pernah menyimpulkan "lunas" sendiri — selalu tunggu status dari server (polling/webhook).

---

## 14. Struktur Folder

```
frontend/
├── public/                      # logo, favicon, ilustrasi empty state
├── src/
│   ├── api/                     # client (interceptor), auth, festivals, orders, tickets, organizer, admin, staff
│   ├── components/
│   │   ├── ui/                  # Button, Input, Badge, Modal, Toast, Skeleton, EmptyState, Accordion
│   │   ├── layout/              # Navbar, Footer, DashboardSidebar, Topbar
│   │   └── features/            # FestivalCard, Hero, Marquee, TicketTypeList, QuantityStepper,
│   │                            # OrderSummary, TicketStub, QrView, Countdown, QuotaBar, Scanner
│   ├── pages/
│   │   ├── public/              # Home, Festivals, FestivalDetail
│   │   ├── auth/                # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── customer/            # Checkout, OrderDetail, Orders, MyTickets, TicketDetail, Profile
│   │   ├── organizer/           # Dashboard, Festivals, FestivalForm, Sales, Attendees, Vouchers
│   │   ├── admin/               # Dashboard, Reviews, Users, Categories, Orders
│   │   └── staff/               # Scan
│   ├── router/                  # rute + guard (auth, role)
│   ├── store/                   # auth, checkout
│   ├── styles/                  # tokens.css, global.css
│   └── utils/                   # format, validators, debounce
└── .env.example
```
Token desain ditulis **sekali** di `tokens.css`; komponen tidak boleh memakai warna/ukuran manual.

---

## 15. Responsif & Aksesibilitas

| Lebar | Web Publik | Dashboard |
|---|---|---|
| ≥ 1024 | Grid 3–4 kolom, kartu tiket sticky di detail | Sidebar penuh |
| 768–1023 | Grid 2–3 kolom | Sidebar ikon (collapsed) |
| < 768 | Hamburger, grid 1–2 kolom, bar sticky bawah, filter jadi *bottom sheet*, tabel → kartu | Sidebar → drawer, form satu kolom |

Uji pada **360, 768, 1280px**. Hero: tinggi 90vh desktop / 70vh mobile, tipografi `display-xl` mengecil ke 44px.

**Aksesibilitas (WCAG 2.1 AA):** kontras teks ≥ 4.5:1 (cek teks abu pada latar gelap) · status tidak hanya warna · fokus keyboard terlihat & urutan logis · modal menjebak fokus & tutup dengan `Esc` · `alt` pada gambar, `aria-label` pada tombol ikon · label terhubung ke input, error via `aria-live` · marquee & animasi berhenti pada *reduced motion* · QR punya teks alternatif berupa kode tiket · area sentuh ≥ 44px.

**Performa:** gambar poster `webp` + `loading="lazy"` + ukuran responsif (`srcset`), hero memakai `priority`; font `display=swap`; skeleton mencegah *layout shift*; bundel dipecah per role (organizer/admin tidak dimuat oleh pembeli).

---

## 16. Inovasi (Poin Tambahan)

| # | Ide | Sisi | Usaha |
|---|---|---|---|
| 1 | **Indikator urgensi** ("Tersisa 5 tiket!") dari ambang kuota | Publik | Rendah |
| 2 | **Countdown pembayaran** + kedaluwarsa otomatis | Publik | Rendah |
| 3 | **Ticket Stub + QR** dengan unduh PDF & tambah ke kalender | Publik | Sedang |
| 4 | **Mode terang/gelap** | Semua | Rendah |
| 5 | **Waiting room / presale terjadwal** (hitung mundur ke pembukaan) | Publik | Sedang |
| 6 | **Wishlist/ikuti artis** + notifikasi presale | Publik | Sedang |
| 7 | **Grafik penjualan interaktif** & ekspor CSV | Organizer | Sedang |
| 8 | **Scanner dengan getar/bunyi & layar berwarna** | Petugas | Sedang |
| 9 | **Pencarian cerdas** (saran saat mengetik, riwayat) | Publik | Rendah |
| 10 | **Skeleton + transisi halus** di semua daftar | Semua | Rendah |
| 11 | **Pratinjau halaman publik** saat organizer mengisi form | Organizer | Sedang |
| 12 | **Beli untuk teman** (isi nama pemegang tiket per tiket) | Publik | Rendah |

Paket aman: **#1, #2, #3, #8, #10**.

---

## 17. Checklist

**Sesuai alur 15 tahap**
- [ ] Guest dapat melihat beranda, daftar, filter, dan detail tanpa login (1–2)
- [ ] *Beli Tiket* memeriksa login dan kembali ke festival setelah masuk (3–4)
- [ ] Checkout memvalidasi kuota, menghitung diskon/biaya/total (5)
- [ ] Order dengan nomor pesanan + countdown bayar (6)
- [ ] Pembayaran via gateway, status ditentukan server (7–8)
- [ ] E-Ticket & QR muncul di My Tickets (9)
- [ ] Scanner: valid / tidak valid dengan alasan jelas (10–12)
- [ ] Organizer mengelola festival, tiket, kuota, periode jual, penjualan, peserta (13)
- [ ] Admin setujui/tolak (catatan wajib); hanya `published` tampil ke publik (14)

**Kualitas**
- [ ] Satu bahasa UI & navbar konsisten (temuan #1–2)
- [ ] Tidak ada tautan `#` yang mati (temuan #6)
- [ ] Semua halaman punya state loading, empty, error
- [ ] Semua form tervalidasi + pesan jelas
- [ ] Data dari API/database (tanpa dummy permanen) dan ada data awal agar beranda tidak kosong
- [ ] Diuji di 360 / 768 / 1280px, tanpa error console
- [ ] README: cara menjalankan, `.env.example`, screenshot; kode di GitHub

---

*Warna, font, dan angka batas (5 tiket, 30 menit, 2 MB, biaya layanan) adalah usulan; sesuaikan dengan situs acuan dan keputusan tim/backend.*
Organizer yang telah login dapat membuat dan mengelola festival, menentukan jenis tiket, harga, kuota, periode penjualan, informasi event, serta melihat data penjualan dan peserta untuk festival yang dikelolanya.
14. Persetujuan oleh Admin
Event yang dibuat oleh Organizer dapat diperiksa oleh Admin. Admin dapat menyetujui atau menolak event. Event yang telah disetujui dan dipublikasikan dapat ditampilkan kepada Guest dan Customer.
15. Ringkasan Alur Utama
Guest membuka Homepage → melihat festival → membuka detail festival → menekan Beli Tiket → sistem mengecek login → jika belum login, user Login/Daftar → memilih tiket → Checkout → membuat Order → melakukan Pembayaran → pembayaran dikonfirmasi berhasil → sistem membuat E-Ticket dan QR Code → user datang ke festival → QR Code di-scan petugas → sistem memvalidasi tiket → jika valid, user Check-in dan diperbolehkan masuk.
