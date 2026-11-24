# AGENTS.md — UKK 2026 Frontend (Tixo)

> Instruksi operasional untuk AI agent yang mengembangkan project ini.
> Version-controlled. Setiap perubahan behavior/arsitektur harus diikuti update dokumen ini.

---

## 1. Project Overview

Frontend web **Tixo** — platform tiket konser UKK 2026. Web melayani landing page publik, dashboard **admin** dan **organizer**, serta halaman customer. Pembelian tiket utama ada di app mobile (repo terpisah).

**Backend:** repo `Dipsii1/Backend_UKK` (Express + Prisma), base path `/api/v1`.
**Design system:** [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — wajib diikuti untuk semua UI.
**Kredit foto:** [`docs/photo-credits.md`](docs/photo-credits.md).

---

## 2. Tech Stack

```
Framework:    Next.js 16 (App Router, Turbopack)
UI:           React 19, Tailwind CSS v4, lucide-react
Language:     TypeScript (strict: false) — tidak ada file .js di src/
State:        Zustand (src/stores)
Animasi:      CSS keyframes, Framer Motion (LazyMotion, komponen m.*), GSAP (lazy via useGsap)
Testing:      Jest + Testing Library (@swc/jest, jsdom)
Package mgr:  npm (package-lock.json)
```

### Keputusan Arsitektur
- **Dashboard:** ringkasan admin, penjualan per konser organizer, dan check-in memakai endpoint backend melalui store khusus dashboard. Data ringkasan yang gagal dimuat menampilkan status gagal atau data terakhir, tanpa fallback demo. Workspace organizer dilindungi role organizer. `AdminDashboardSummary` memuat UI metrik, pesanan terbaru, dan pengajuan admin. `OrganizerEventSales` memuat data penjualan konser terpilih dan memakai `OrganizerSalesSummary` untuk metrik serta rincian per kelas tiket di ringkasan dan laporan penjualan.
- **Alur data:** `Page/Component → Store (Zustand) → Service → lib/api (apiFetch) → Backend`. Komponen tidak memanggil `fetch` langsung.
- **Proxy API:** request ke `/api/*` diteruskan Next.js ke `${BACKEND_API_URL}/api/v1/*` (lihat `next.config.mjs`). Tidak perlu CORS. Default `BACKEND_API_URL=http://localhost:5000` (lihat `.env.example`).
- **Validasi:** frontend hanya cek kolom wajib & kecocokan input (`src/lib/validators.ts`). Aturan format/kekuatan ada di backend; tampilkan error per kolom dengan `fieldErrorsFrom()` dari `src/lib/api.ts`.
- **Auth:** access token & user disimpan di localStorage (`src/lib/storage.ts`), refresh token di cookie httpOnly dari backend. `/admin/*` dilindungi `src/app/admin/layout.tsx` (role admin); login admin dan organizer memakai UI Backstage bersama di `WorkspaceLogin`, dengan form di `WorkspaceLoginForm` serta latar dan kartu akses di `WorkspaceLoginArtwork`. Kedua login workspace mengirim role masing-masing ke backend tanpa cadangan mock. Akses organizer tanpa sesi dan aksi keluar organizer mengarah ke `/organizer/login`.
- **Data mock:** `src/services/mockData.ts` + `storageService.ts` hanya cadangan saat backend kosong/mati (mis. etalase event di landing). Jangan pakai mock untuk autentikasi admin.
- **Next.js 16:** file middleware bernama `src/proxy.ts` (bukan `middleware.ts`). Cek dokumentasi Next 16 sebelum memakai API yang mungkin berubah.

---

## 3. Struktur Project

```
Frontend_tiketkonser/
├── AGENTS.md
├── docs/                    # DESIGN-SYSTEM.md, photo-credits.md, ERD.md, design.md (alur lama)
├── public/images/           # bands/ (foto lineup), events/ (sampul tiket JPEG)
├── jest.config.js, jest.setup.js
└── src/
    ├── app/                 # route App Router (page.tsx, layout.tsx per folder)
    │   ├── page.tsx         # landing page
    │   ├── fonts.ts         # font brand (brandFonts)
    │   ├── globals.css      # token warna & utilitas
    │   ├── admin/           # workspace admin + login/ (CSS module sendiri)
    │   ├── organizer/       # workspace organizer
    │   └── auth/, profile/, my-tickets/, ...
    ├── components/
    │   ├── landing/         # section landing + helper animasi (TextRoll, Reveal, MotionProvider, ...)
    │   ├── workspace/       # layout, sidebar, topbar dashboard
    │   ├── customer/        # layout halaman customer
    │   ├── common/          # ErrorBoundary, ProtectedRoute
    │   └── ui/              # komponen dasar (Button, Input, Badge, ...)
    ├── hooks/               # useRateLimit
    ├── lib/                 # api, storage, validators, formatters, gsap, constants
    ├── services/            # pemanggilan API per domain (+ mock cadangan)
    ├── stores/              # Zustand store
    ├── types/               # tipe domain bersama (index.ts)
    └── proxy.ts             # Next.js proxy (redirect /festivals)
```

### Konvensi
- File komponen/halaman `.tsx`, logika non-UI `.ts`. Nama komponen PascalCase, hook `useXxx`.
- Test di folder `__tests__/` di samping kode (`*.test.ts(x)`).
- Komponen yang dipakai lintas halaman masuk `components/`; helper lintas domain masuk `lib/`.
- Animasi khusus satu halaman → CSS Module di folder halaman itu (contoh `src/components/workspace/login.module.css`).
- Ikuti nama & pola yang sudah ada; bila contoh di dokumen ini berbeda dengan repo, **yang di repo yang menang**.

---

## 4. Setup & Perintah

```bash
npm install
cp .env.example .env.local        # sesuaikan BACKEND_API_URL bila perlu
npm run dev                       # http://localhost:3001
npm run build && npm run start    # produksi lokal
npm test                          # Jest + coverage
npx eslint src                    # lint
npx tsc --noEmit                  # typecheck
```

Backend dijalankan terpisah dari repo `Backend_UKK` (`npm run dev`, port 5000).

---

## 5. UI & Animasi (ringkas)

Detail lengkap di `docs/DESIGN-SYSTEM.md`. Yang paling sering dilanggar:

- Pakai token warna (`bg-ink`, `bg-onyx`, `border-line`, `bg-blaze`, `text-tangerine`, `text-mute`, `bg-paper`), **bukan hex mentah**.
- Teks di atas oranye = `text-ink`.
- Judul `font-display` (Bricolage), isi `font-body` (Spline); bungkus layout dengan `brandFonts`.
- Animasi hanya `transform`/`opacity`. **Dilarang** `blur-*`, `backdrop-blur`, `mix-blend-mode` pada elemen besar/bergerak.
- Loop harus berhenti saat tidak terlihat; selalu ada fallback `prefers-reduced-motion`.
- Framer: impor `m` (bukan `motion`) dan bungkus halaman dengan `MotionProvider`.
- GSAP hanya untuk efek terikat scroll, selalu lewat `useGsap` (`src/lib/gsap.ts`).
- Satu elemen = satu sistem animasi (pisahkan wrapper bila CSS/GSAP/Framer sama-sama butuh `transform`).
- Gambar: JPEG 640×400 ≤ 60 KB, `next/image` dengan `unoptimized`; catat kredit di `docs/photo-credits.md`.
- Teks UI dalam Bahasa Indonesia, singkat dan santai.

### Skills design

Gunakan skill agent populer berikut untuk tugas UI. **`docs/DESIGN-SYSTEM.md` selalu menang**: skill dipakai untuk proses dan kualitas, bukan untuk mengganti palet, font, atau gaya Tixo.

| Skill | Sumber | Kapan dipakai |
|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Sebelum membuat/mendesain ulang halaman atau komponen: arah visual, tipografi, menghindari tampilan template |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Setelah UI jadi: review aksesibilitas & UX (fokus, kontras, label, keyboard) |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) | Saat menulis/mereview komponen React & halaman Next.js: performa, bundle, data fetching |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) | Verifikasi di browser (Playwright): screenshot desktop & 390 px, cek console error |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Referensi pola UX/layout & chart (mis. dashboard). **Jangan** ambil palet/font-nya — pakai token Tixo |

**Pemasangan** (pilih sesuai agent; ikuti README sumbernya):
- CLI `skills` (sama seperti repo backend, tercatat di `skills-lock.json`): `npx skills add anthropics/skills` dan `npx skills add vercel-labs/agent-skills`, lalu pilih skill di atas.
- Claude Code (`ui-ux-pro-max`): `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` lalu `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`.

---

## 6. Testing

- Jest dengan threshold **coverage 100%** (statements, branches, functions, lines) untuk `src/lib`, `src/stores`, `src/services` (kecuali `mockData.ts` dan `lib/gsap.ts`). Kode baru di folder tersebut wajib diberi test.
- Halaman/komponen diuji dengan Testing Library; cari elemen lewat role/label, bukan class CSS.
- `jest.setup.js` menyediakan polyfill `matchMedia` & `IntersectionObserver` (langsung melapor terlihat).
- Mock `fetch` dengan pola `jsonResponse({...})` seperti di `src/services/__tests__/authService.test.ts`.

---

## 7. Constraints & Rules (untuk AI Agent)

### Yang BOLEH
- Edit file di `src/`, `public/`, `docs/`, konfigurasi (`jest.config.js`, `next.config.mjs`, `eslint.config.mjs`).
- Menambah komponen/halaman mengikuti struktur di Section 3 dan design system.
- Update `AGENTS.md` / `docs/DESIGN-SYSTEM.md` bila behavior atau pola berubah.

### Yang TIDAK BOLEH
- Commit secret, `.env.local`, atau credential (hanya `.env.example` yang boleh di-commit).
- Menambah file `.js`/`.jsx` di `src/`.
- Menaruh aturan validasi bisnis di frontend (biarkan backend yang memutuskan).
- Memakai data/akun mock untuk login admin atau melewati pengecekan role.
- Memanggil `fetch` langsung dari komponen (lewat service + `apiFetch`).
- Menambah dependency berat tanpa alasan jelas (cek ukuran bundle; GSAP & Framer sudah tersedia).
- Mengubah repo backend dari sini tanpa diminta.
- Menambah fitur di luar permintaan, atau refactor/rename/reformat kode di luar scope.
- Mencantumkan AI sebagai co-author/penulis (mis. trailer `Co-Authored-By`) di commit atau PR.
- `console.log` sisa debug, dan komentar panjang — komentar cukup satu baris singkat.

### Perubahan Minimal
- Ubah hanya yang diminta. Pertahankan teks/label yang dipakai test kecuali memang diminta berubah.

### Output Format
- Conventional commits berbahasa Indonesia: `feat:`, `fix:`, `refactor:`, `perf:`, `test:`, `docs:`, `chore:`.
- Ringkasan tugas: apa yang diubah, file terdampak, hasil verifikasi.

---

## 8. Workflow per Task

1. Baca file terkait (halaman, komponen, store, service) dan `docs/DESIGN-SYSTEM.md` untuk tugas UI; gunakan skill `frontend-design` sebelum mendesain.
2. Untuk fitur yang memakai API: cek endpoint & format respons di repo backend (`src/modules/<domain>/`).
3. Implementasi dari bawah ke atas: `types` → `service` → `store` → komponen/halaman.
4. Tambah/ubah test; jalankan `npm test`, `npx eslint src`, `npx tsc --noEmit` sampai bersih.
5. Untuk perubahan UI: review dengan `web-design-guidelines`, lalu cek di browser (`webapp-testing`) pada desktop dan lebar 390 px (tanpa scroll horizontal).
6. Commit dengan conventional commit; update dokumen ini bila arsitektur/behavior berubah.
