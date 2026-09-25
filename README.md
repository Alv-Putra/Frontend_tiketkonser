# ConserId Frontend

Frontend Next.js untuk platform tiket festival, terhubung ke backend Express + Prisma
(`Konser-Be/Backend_UKK`).

## Menjalankan

Backend berjalan di `http://localhost:3000` (port default). Frontend berjalan di port **3001**
untuk menghindari konflik:

```bash
npm run dev
```

Buka [http://localhost:3001](http://localhost:3001).

Setiap request ke `/api/*` di-proxy oleh `next.config.mjs` ke backend melalui environment:

```bash
# .env.local
BACKEND_API_URL=http://localhost:3000
```

Server backend mengirim email verifikasi/reset dengan `CLIENT_URL` (mis.
`http://localhost:3001`) sebagai link yang diarahkan ke halaman FE:
- `/verify-email?token=...` — konfirmasi verifikasi email
- `/reset-password?token=...` — reset kata sandi

## Catatan Integrasi

- Register hanya mengirim `fullName`, `email`, dan `password`; role `buyer` dari backend
  dipetakan menjadi `customer`.
- Setelah register, user wajib verifikasi email sebelum bisa login (tidak auto-login).
- Refresh token berada di httpOnly cookie backend namun endpoint refresh membutuhkan
  `refreshToken` pada body sehingga tidak bisa dipakai dari browser; sesi dibersihkan saat 401.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
