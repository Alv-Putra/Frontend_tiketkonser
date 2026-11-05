# AGENTS.md - Aturan untuk Agent AI (ConserId Frontend)

Aturan ini wajib dipatuhi oleh **semua** agent AI yang bekerja di repo ini: agent utama (`build`, `plan`), subagent (termasuk yang dipanggil lewat Task tool atau `@mention`), dan agent kustom di `.opencode/agent/`. Tidak ada agent yang dikecualikan, termasuk untuk tugas kecil, review, atau pertanyaan.

## 1. Wajib dibaca sebelum mengerjakan apa pun

Tiga dokumen ini adalah konteks wajib untuk setiap tugas:

| Urutan | File | Dipakai untuk |
|---|---|---|
| 1 | `PRD.md` | Apa yang dibangun: peran, alur, FR-1 sampai FR-13, status, aturan bisnis, rute, stack, pertanyaan terbuka |
| 2 | `design.md` (atau folder `docs/design/`) | Tampilan: layout, komponen, warna, tipografi, spacing, perilaku UI, animasi |
| 3 | `README.md` | Cara menjalankan, environment, scripts, integrasi backend |

### 1.1 Cara dokumen dimuat (opencode)

- `opencode.json` di root repo memuat ketiga dokumen ini otomatis ke konteks lewat field `instructions`. Isinya sudah ada di konteks sejak awal sesi, untuk semua agent.
- **Langkah pertama setiap agent:** cek apakah isi ketiga dokumen benar-benar ada di konteks Anda.
  - Jika sudah ada: lanjutkan, jangan dibaca ulang tanpa alasan.
  - Jika belum ada, terpotong, atau Anda tidak yakin: baca penuh dengan tool Read sebelum melakukan hal lain.
- Jika salah satu file tidak ada atau tidak terbaca, **berhenti dan tanya user**. Jangan menebak isinya.
- Nama file bersifat case-sensitive di Linux dan macOS: gunakan persis `PRD.md`, `design.md`, `README.md`.
- Jangan mengandalkan ingatan sesi lama atau asumsi. Jika tugas baru dimulai di tengah sesi dan dokumen mungkin berubah, baca ulang bagian yang relevan.

### 1.2 Aturan untuk subagent dan delegasi

- Subagent wajib mengikuti Bagian 1.1 sendiri, tidak boleh bergantung pada agent yang memanggilnya.
- Agent yang mendelegasikan tugas wajib menyertakan di prompt subagent: (a) ID kebutuhan PRD yang relevan (mis. FR-6), (b) bagian `design.md` yang relevan, dan (c) perintah eksplisit "baca `PRD.md`, `design.md`, dan `README.md` serta patuhi `AGENTS.md`".
- Hasil subagent yang tidak menyebut acuan PRD/design dianggap belum selesai.

### 1.3 Bukti sudah membaca

Awal jawaban pada setiap tugas wajib menyebut:

- ID kebutuhan PRD yang menjadi acuan, mis. `FR-6`, `FR-7`
- Bagian design yang menjadi acuan dengan format `design.md §6.3 Section 5`

Jawaban tanpa dua hal ini berarti dokumen belum dibaca; baca dulu, lalu ulangi. Nomor "Section" di `design.md` bagian 6.3 sama dengan nomor langkah alur di PRD.

## 2. Urutan acuan jika dokumen bertentangan

1. Permintaan eksplisit user pada tugas saat ini
2. `PRD.md` (perilaku dan aturan bisnis)
3. `design.md` (tampilan)
4. `README.md` (operasional)

Jika ada pertentangan antar dokumen, laporkan ke user; jangan memilih sendiri secara diam-diam.

## 3. Cakupan kerja

- Kerjakan hanya yang diminta dan yang tercantum di PRD. Jangan menambah fitur, halaman, atau dependency di luar itu.
- Perubahan seminimal mungkin. Jangan mengubah layout atau gaya yang sudah ada tanpa diminta.
- Jangan menciptakan route, endpoint, field, atau status yang tidak ada di PRD (rute: PRD 5.1) atau backend. Jika belum jelas, tanya.
- Bagian `design.md` bertanda **`[TBD-PRD]`** dan hal di PRD bagian 9 (pertanyaan terbuka) **tidak boleh diimplementasikan**. Tanyakan ke user atau minta PRD diperbarui lebih dulu.
- Animasi hanya memakai Framer Motion dan CSS. Jangan memasang GSAP, Lenis, Lottie, react-countup, atau library animasi lain.
- Output kode: berikan **file lengkap** yang siap dipakai, bukan potongan.

## 4. TDD (wajib)

Semua perilaku baru dan perbaikan bug dikerjakan dengan siklus **Red → Green → Refactor**:

1. **Red:** tulis test yang gagal dulu, berdasarkan FR/aturan bisnis di PRD. Jalankan dan pastikan gagal karena alasan yang benar.
2. **Green:** tulis kode paling sederhana agar test lulus. Jalankan test.
3. **Refactor:** rapikan kode dan test tanpa mengubah perilaku; test tetap hijau.

Aturan TDD:

- Tidak ada kode produksi tanpa test yang gagal lebih dulu.
- Satu siklus = satu perilaku kecil. Jangan menulis banyak test sekaligus sebelum Green.
- Bug: tulis test yang mereproduksi bug dulu, baru perbaiki.
- Nama test memakai bahasa perilaku dan menyebut ID PRD, mis. `FR-3: Beli Tiket mengarahkan Guest ke login`.
- Test memeriksa perilaku yang terlihat user (render, interaksi, hasil), bukan detail implementasi.
- Mock hanya batas luar (API backend, payment gateway). Jangan mock komponen yang sedang diuji.
- Jangan menghapus, melewati (`skip`), atau melemahkan test agar lulus.
- Selesai hanya jika semua test lulus; tampilkan hasil menjalankan test.

Area yang harus punya test (rujuk PRD):

- Guard login pada Beli Tiket (FR-3), alur login/daftar dan verifikasi email (FR-4, FR-5)
- Perhitungan checkout dan cek kuota (FR-6), pembuatan order (FR-7)
- Status order dan tiket (PRD bagian 4), tampilan QR di My Tickets (FR-10)
- Hasil validasi check-in valid dan tidak valid (FR-11)
- Pembatasan akses per peran (Organizer, Admin) (FR-12, FR-13). Akses halaman check-in menunggu keputusan role petugas (PRD 9 pertanyaan 2).

### Framework pengujian

- **Jest tidak digunakan** di proyek ini. Jangan memasang atau memakai Jest. File sisa (`jest.config.js`, `jest.setup.js`) dihapus lewat tugas migrasi (PRD 7.3), bukan dipakai.
- Framework pengujian belum ditentukan (PRD 9 pertanyaan 7). Jika belum terpasang, **tanyakan ke user** framework yang dipilih sebelum menulis test pertama, lalu catat pilihannya di PRD bagian 7 dan script `test` di `README.md`.

## 5. Standar kode

- TypeScript wajib: halaman/komponen `.tsx`, logika/store/util `.ts`. Jangan membuat file `.js` baru. File `.js` yang sudah ada diubah lewat tugas migrasi terpisah (PRD 7.3).
- Stack: Next.js 16 (App Router), React 19 + react-dom, Tailwind CSS 4, Zustand, Framer Motion, Lucide React, qrcode.react, date-fns, uuid.
- Token warna, font, dan easing didefinisikan lewat `@theme` di `src/app/globals.css` (Tailwind 4), bukan `tailwind.config.js` (lihat `design.md` 2.5).
- Request API lewat `/api/*` (proxy ke `BACKEND_API_URL` di `next.config.mjs`). Jangan hardcode URL backend.
- Role backend `buyer` dipetakan menjadi `customer` di FE.
- Jangan simpan atau log token, password, atau data sensitif.
- Lint harus bersih: `npm run lint`.

## 6. Definisi selesai

Tugas dianggap selesai hanya jika:

- [ ] PRD, `design.md`, dan `README.md` sudah dibaca, dan acuannya disebut di awal jawaban
- [ ] Perilaku sesuai FR/aturan bisnis di PRD yang dirujuk
- [ ] Tampilan sesuai `design.md`, tanpa mengimplementasikan bagian `[TBD-PRD]`
- [ ] File ditempatkan sesuai struktur folder (Bagian 8)
- [ ] Test ditulis lebih dulu, semua test lulus
- [ ] `npm run lint` dan `npm run build` berhasil
- [ ] `README.md` dan PRD diperbarui jika perilaku, env, atau scripts berubah
- [ ] Ringkasan akhir: file yang berubah, test yang ditambah, dan pertanyaan terbuka (jika ada)

## 7. Jika ragu

Tanya user satu pertanyaan yang spesifik. Jangan mengarang requirement, jangan menambah asumsi ke dokumen, dan jangan melanjutkan dengan tebakan.

## 8. Struktur folder (per section / fitur)

Struktur dikelompokkan **per fitur**, mengikuti section alur sistem. Folder `app/` hanya berisi routing; logika dan UI ada di `features/`. Daftar rute yang disetujui ada di PRD 5.1; struktur di bawah hanya menunjukkan letak filenya.

```
src/
├── app/                              # ROUTING SAJA (tipis: impor dari features/)
│   ├── layout.tsx
│   ├── template.tsx                  # Animasi masuk halaman
│   ├── globals.css                   # Token @theme Tailwind 4
│   ├── page.tsx                      # /
│   ├── (public)/
│   │   └── festivals/
│   │       ├── page.tsx              # /festivals
│   │       └── [id]/page.tsx         # /festivals/[id]
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (customer)/                   # Wajib login (role customer)
│   │   ├── checkout/[festivalId]/page.tsx
│   │   ├── orders/[orderId]/page.tsx # Order + pembayaran + hasil
│   │   └── my-tickets/page.tsx
│   ├── checkin/page.tsx              # Scanner petugas (role belum ditentukan)
│   ├── organizer/                    # Role organizer
│   │   ├── page.tsx                  # Dashboard
│   │   └── festivals/
│   │       ├── new/page.tsx
│   │       └── [id]/page.tsx
│   └── admin/                        # Role admin
│       └── events/page.tsx
│
├── features/                         # LOGIKA + UI PER SECTION
│   ├── home/                         # Section 1: hero, marquee, festival unggulan
│   ├── festivals/                    # Section 1-2: daftar, search, filter, detail, tiket, jadwal, FAQ
│   ├── auth/                         # Section 3-4: guard Beli Tiket, login, daftar, verifikasi email
│   ├── checkout/                     # Section 5-6: pilih tiket, ringkasan, pembuatan order
│   ├── payment/                      # Section 7-8: status pembayaran, berhasil
│   ├── tickets/                      # Section 9: My Tickets, E-Ticket, QR Code
│   ├── checkin/                      # Section 10-12: scan, valid, tidak valid
│   ├── organizer/                    # Section 13: dashboard, kelola festival, penjualan, peserta
│   └── admin/                        # Section 14: persetujuan event
│
├── components/                       # DIPAKAI LINTAS FITUR
│   ├── layout/                       # Navbar, Footer, ScrollProgress
│   ├── ui/                           # Button, Input, Modal, Toast, Badge, Skeleton
│   └── motion/                       # Reveal, RevealGroup, Marquee, CountUp
│
├── lib/
│   ├── api/                          # API client (fetch ke /api/*), penanganan 401
│   ├── motion.ts                     # Variants Framer Motion bersama
│   ├── format.ts                     # Format rupiah, tanggal (date-fns)
│   └── constants.ts
│
├── store/                            # Zustand store lintas fitur (mis. session)
├── types/                            # Tipe bersama (User, Role, ApiResponse)
└── tests/                            # Setup test dan helper bersama
```

Isi standar tiap folder di `features/<nama>/`:

```
features/<nama>/
├── components/        # Komponen khusus fitur (PascalCase.tsx)
├── hooks/             # Hook khusus fitur (useXxx.ts)
├── services/          # Pemanggilan API fitur ini
├── store/             # Zustand store khusus fitur (jika perlu)
├── types.ts           # Tipe khusus fitur
├── __tests__/         # Test fitur (atau <file>.test.tsx di sebelah file)
└── index.ts           # Satu-satunya pintu masuk dari luar fitur
```

Aturan penempatan:

- `app/` hanya berisi `page.tsx`, `layout.tsx`, `template.tsx`, dan guard route. Jangan menaruh logika, pemanggilan API, atau komponen besar di sini; impor dari `features/`.
- Satu section = satu folder di `features/`. Komponen yang hanya dipakai satu section tidak boleh ditaruh di `components/`.
- Komponen yang dipakai dua fitur atau lebih dipindah ke `components/ui/` atau `components/motion/`.
- Fitur tidak boleh mengimpor isi internal fitur lain. Impor hanya lewat `features/<nama>/index.ts`. Jika dua fitur butuh hal yang sama, pindahkan ke `lib/`, `components/`, atau `types/`.
- Pemanggilan API hanya di `services/` (lewat `lib/api`), tidak langsung di komponen.
- Akses per peran (customer, organizer, admin) dijaga di `layout.tsx` route group masing-masing, bukan di tiap halaman.
- Nama file: komponen `PascalCase.tsx`; hook `useXxx.ts`; util/service `camelCase.ts`; folder `kebab-case`.
- Jangan membuat folder tingkat atas baru di `src/` tanpa persetujuan user.
- Jangan membuat folder `app/api/`; proxy ke backend diatur di `next.config.mjs`.
- Jika sebuah file harus dipindah ke struktur ini, lakukan sebagai tugas terpisah dengan test tetap hijau (Red → Green → Refactor), tidak digabung dengan perubahan perilaku.