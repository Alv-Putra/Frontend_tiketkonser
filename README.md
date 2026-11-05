# ConserId Frontend

Frontend website penjualan tiket festival, dibangun dengan Next.js dan terhubung ke backend Express + Prisma (`Konser-Be/Backend_UKK`).

## Fitur

- **Guest:** melihat homepage, daftar festival, pencarian, filter, dan detail festival tanpa login.
- **Customer:** login/daftar, checkout, pembayaran lewat payment gateway, dan My Tickets dengan E-Ticket ber-QR Code.
- **Check-in:** petugas scan QR Code; tiket valid dicatat sebagai sudah digunakan.
- **Organizer:** membuat dan mengelola festival, jenis tiket, harga, kuota, periode penjualan, serta melihat penjualan dan peserta.
- **Admin:** menyetujui atau menolak event sebelum dipublikasikan.

## Alur Singkat

Guest membuka Homepage → melihat festival → detail festival → Beli Tiket → (login/daftar jika belum login) → pilih tiket → Checkout → Order → Pembayaran → pembayaran dikonfirmasi → E-Ticket dan QR Code → QR di-scan petugas → check-in jika valid.

## Tech Stack

| Area | Teknologi |
|---|---|
| Framework | Next.js 16, React 19, react-dom |
| Bahasa | TypeScript (migrasi dari JavaScript sedang berjalan, lihat `PRD.md` 7.3) |
| Styling | Tailwind CSS 4 (token lewat `@theme` di `src/app/globals.css`) |
| State | Zustand |
| Animasi | Framer Motion + CSS |
| Ikon | Lucide React |
| QR Code | qrcode.react |
| Tanggal | date-fns |
| ID unik | uuid |
| Lint | ESLint 9 + eslint-config-next |

## Prasyarat

- Node.js dengan versi yang didukung Next.js 16
- npm
- Backend `Konser-Be/Backend_UKK` berjalan di `http://localhost:3000`

## Instalasi

```bash
git clone https://github.com/Alv-Putra/Frontend_tiketkonser.git
cd Frontend_tiketkonser
npm install
```

## Environment

Buat file `.env.local` di root project:

```bash
BACKEND_API_URL=http://localhost:3000
```

Setiap request ke `/api/*` di-proxy oleh `next.config.mjs` ke `BACKEND_API_URL`.

Di sisi backend, set `CLIENT_URL=http://localhost:3001` agar tautan pada email mengarah ke frontend:

- `/verify-email?token=...` untuk verifikasi email
- `/reset-password?token=...` untuk reset kata sandi

## Menjalankan

Frontend berjalan di port **3001** agar tidak bentrok dengan backend (port 3000).

```bash
npm run dev
```

Buka [http://localhost:3001](http://localhost:3001).

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server (port 3001) |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build (port 3001) |
| `npm run lint` | Menjalankan ESLint |

Script `test` belum ada: framework pengujian belum dipilih (`PRD.md` bagian 9). Jest tidak dipakai.

## Struktur Folder

Dikelompokkan per fitur, mengikuti section alur sistem. Aturan lengkap ada di `AGENTS.md` bagian 8.

```
src/
├── app/          # Routing saja (impor dari features/)
├── features/     # Satu folder per section: home, festivals, auth, checkout,
│                 # payment, tickets, checkin, organizer, admin
├── components/   # Lintas fitur: layout/, ui/, motion/
├── lib/          # API client, variants animasi, format
├── store/        # Zustand lintas fitur
├── types/        # Tipe bersama
└── tests/        # Setup dan helper test
```

Untuk membuat kerangka folder: `bash scaffold.sh`.

## Catatan Integrasi

- Register hanya mengirim `fullName`, `email`, dan `password`. Role `buyer` dari backend dipetakan menjadi `customer`.
- Setelah register, user wajib verifikasi email sebelum bisa login (tidak auto-login).
- Pembelian tiket membutuhkan login; browsing tidak.
- Refresh token berada di httpOnly cookie backend, tetapi endpoint refresh membutuhkan `refreshToken` pada body sehingga tidak bisa dipakai dari browser. Sesi dibersihkan saat respons 401.

## Dokumentasi

| File | Isi |
|---|---|
| `PRD.md` | Kebutuhan produk: peran, alur, FR-1 sampai FR-13, status, rute, stack, pertanyaan terbuka |
| `design.md` | Panduan desain: warna putih-hitam-merah, tipografi, komponen, animasi per section |
| `AGENTS.md` | Aturan untuk agent AI (opencode): dokumen wajib dibaca, TDD, standar kode, struktur folder |
| `opencode.json` | Memuat PRD, design, dan README otomatis ke konteks semua agent |