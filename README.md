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
| Bahasa | TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Animasi | Framer Motion |
| Ikon | Lucide React |
| QR Code | qrcode.react |
| Tanggal | date-fns |
| Lint | ESLint |

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

## Catatan Integrasi

- Register hanya mengirim `fullName`, `email`, dan `password`. Role `buyer` dari backend dipetakan menjadi `customer`.
- Setelah register, user wajib verifikasi email sebelum bisa login (tidak auto-login).
- Pembelian tiket membutuhkan login; browsing tidak.
- Refresh token berada di httpOnly cookie backend, tetapi endpoint refresh membutuhkan `refreshToken` pada body sehingga tidak bisa dipakai dari browser. Sesi dibersihkan saat respons 401.

## Dokumentasi

- PRD: `PRD.md`