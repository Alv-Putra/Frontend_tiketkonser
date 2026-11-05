# design.md — Website Penjualan Tiket Festival (ConserId)

Panduan desain (visual, layout, animasi). Tema: **Putih, Hitam, Merah**, dengan animasi modern di tiap section.

Aturan pemakaian dokumen:

- Perilaku dan aturan bisnis mengikuti `PRD.md`. Dokumen ini hanya mengatur tampilan.
- Bagian bertanda **`[TBD-PRD]`** menyangkut hal yang belum diputuskan di PRD (bagian 9). **Jangan diimplementasikan** sebelum PRD diperbarui.
- Animasi memakai **Framer Motion dan CSS sebagai default** (sesuai PRD 7.1). Library animasi lain (GSAP, Lenis, Lottie, Three.js, react-countup, dll.) **boleh dipakai** tanpa persetujuan terpisah.
- Nomor "Section" di bagian 6.3 sama dengan nomor langkah alur sistem dan FR di PRD.
- Referensi dari galeri desain eksternal (recent.design dan sejenisnya) boleh dipakai sebagai **inspirasi pola**, dengan aturan di bagian 10. Hasil adaptasi tetap mengikuti palet, font, dan batasan di dokumen ini.

---

## 1. Prinsip Desain

| Prinsip | Penjelasan |
|---|---|
| **Bold & Kontras** | Hitam dan putih sebagai dasar, merah hanya untuk aksen dan aksi utama (CTA). |
| **Editorial** | Tipografi besar, tegas, banyak ruang kosong, terasa seperti poster festival. |
| **Cepat & Jelas** | User dapat menemukan festival dan menekan **Beli Tiket** dalam beberapa klik. |
| **Animasi Bermakna** | Animasi memandu perhatian dan memberi feedback, bukan sekadar hiasan. |
| **Responsif & Aksesibel** | Mobile-first, kontras WCAG AA, mendukung `prefers-reduced-motion`. |

---

## 2. Color System

### 2.1 Palet Utama

| Token | Hex | Penggunaan |
|---|---|---|
| `black` | `#0A0A0A` | Background gelap, teks utama, footer |
| `ink` | `#141414` | Card pada section gelap |
| `gray-900` | `#1F1F1F` | Border pada background gelap |
| `gray-600` | `#6B6B6B` | Teks sekunder |
| `gray-200` | `#E5E5E5` | Border pada background terang |
| `gray-100` | `#F4F4F4` | Background section terang alternatif |
| `white` | `#FFFFFF` | Background utama, teks pada section gelap |
| `brand` | `#E10600` | CTA, highlight, badge, garis aksen |
| `brand-dark` | `#B80500` | Hover/active tombol merah, teks merah kecil di atas putih |
| `brand-soft` | `#FFE5E3` | Background badge/alert ringan |

### 2.2 Status

| Status | Warna | Catatan |
|---|---|---|
| Sukses (Paid, Tiket Valid) | `#0A0A0A` + ikon centang putih | Tetap dalam palet, tanpa hijau |
| Gagal / Tidak Valid | `#E10600` + ikon `×` | Merah penuh |
| Pending / Menunggu | `#6B6B6B` + ikon jam | Abu-abu |

### 2.3 Aturan Penggunaan

- Proporsi: **Putih 60% · Hitam 30% · Merah 10%**.
- Merah hanya untuk: tombol utama, harga/promo, badge, indikator aktif, garis aksen.
- Section selang-seling terang dan gelap agar ritme visual terasa.
- Status tidak boleh dibedakan hanya lewat warna; selalu sertakan ikon dan teks.

### 2.4 Kontras (sudah dihitung, rumus WCAG)

| Kombinasi | Rasio | Aturan |
|---|---|---|
| Putih di atas `brand` `#E10600` | **4,97 : 1** | Lolos AA untuk teks biasa (tombol, badge). |
| `brand` di atas putih `#FFFFFF` | 4,97 : 1 | Lolos AA; untuk teks kecil di atas `gray-100` (4,52 : 1) pakai `brand-dark`. |
| `brand` di atas hitam `#0A0A0A` | **3,99 : 1** | **Hanya untuk teks besar** (judul, angka ≥ 24px tebal) dan ikon. Jangan untuk paragraf atau teks kecil. |
| Putih di atas `brand-dark` `#B80500` | 6,86 : 1 | Aman untuk semua ukuran. |
| `gray-600` di atas putih | 5,33 : 1 | Aman untuk teks sekunder. |
| Putih di atas hitam | 19,8 : 1 | Aman. |

### 2.5 Token Tailwind CSS 4 (`@theme`)

Tailwind 4 memakai konfigurasi di CSS, bukan `tailwind.config.js`. Letakkan di `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-black: #0A0A0A;
  --color-ink: #141414;
  --color-white: #FFFFFF;

  --color-gray-100: #F4F4F4;
  --color-gray-200: #E5E5E5;
  --color-gray-600: #6B6B6B;
  --color-gray-900: #1F1F1F;

  --color-brand: #E10600;
  --color-brand-dark: #B80500;
  --color-brand-soft: #FFE5E3;

  --font-display: var(--font-anton), "Bebas Neue", sans-serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

:root {
  --dur-fast: 200ms;
  --dur-base: 450ms;
  --dur-slow: 800ms;
}

html { scroll-behavior: smooth; }
```

Pemakaian: `bg-brand`, `text-brand-dark`, `font-display`, `rounded-lg`, `ease-out-expo`. Font dimuat dengan `next/font/google` (Anton dan Inter) dan diberi variabel `--font-anton` dan `--font-inter`.

---

## 3. Tipografi

| Peran | Font | Ukuran (desktop / mobile) | Weight |
|---|---|---|---|
| Hero / Display | Anton atau Bebas Neue | 120px / 56px | 400 (uppercase) |
| Heading 1 | Anton | 72px / 40px | 400 |
| Heading 2 | Inter | 40px / 28px | 800 |
| Heading 3 | Inter | 24px / 20px | 700 |
| Body | Inter | 16px / 15px | 400 |
| Caption / Label | Inter | 13px | 600, uppercase, letter-spacing 0.08em |
| Harga / Angka | Anton | 32px | 400 |

Aturan: line-height heading 1.0–1.1, body 1.6; judul besar selalu **uppercase**; satu kata kunci pada judul boleh diberi warna merah (di background hitam hanya untuk teks besar, lihat 2.4).

---

## 4. Layout & Spacing

- Container max-width: **1280px**, padding horizontal 24px (mobile) / 48px (desktop).
- Grid 12 kolom (desktop), 4 kolom (mobile).
- Skala spasi: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- Jarak antar section: **96px** (desktop), **64px** (mobile).
- Border radius: card 24px, tombol pill (`999px`), input 14px.

---

## 5. Komponen UI

### 5.1 Tombol

| Varian | Style | Hover |
|---|---|---|
| **Primary** | BG merah, teks putih, pill | BG `brand-dark`, naik 2px, shadow merah lembut |
| **Secondary** | BG hitam, teks putih | BG putih, teks hitam, border hitam |
| **Outline** | Border 1.5px hitam, transparan | Fill hitam dengan wipe kiri → kanan |
| **Ghost** | Teks saja, underline animasi | Underline tumbuh dari kiri |

Tombol **Beli Tiket** selalu Primary dan memiliki efek *magnetic* (mengikuti kursor ringan, hanya desktop).

### 5.2 Card Festival

- Poster rasio 4:5, sudut 24px.
- Badge tanggal (hitam) di kiri atas, badge kategori (merah) di kanan atas.
- Judul uppercase, lokasi dan harga "mulai dari" dengan angka merah.
- Hover: poster zoom 1.06, overlay gradien hitam naik dari bawah, tombol "Lihat Detail" muncul.

### 5.3 Kartu Tiket (Jenis Tiket)

- BG putih, border abu; terpilih: border merah 2px + centang merah.
- Notch (lubang setengah lingkaran) kiri-kanan dan garis putus-putus sebagai gaya tiket.
- Kuota tersisa < 20% menampilkan badge merah berdenyut "Hampir Habis".

### 5.4 Input & Form

- Tinggi 52px, border abu, radius 14px.
- Fokus: border hitam + ring merah 3px (opacity 20%).
- Label melayang (floating label). Error: border merah + pesan merah dengan animasi *shake* ringan.

### 5.5 Navbar

- Transparan di atas hero; setelah scroll menjadi putih blur (`backdrop-filter: blur(12px)`) dengan border tipis.
- Logo kiri, menu tengah, tombol Login/Daftar kanan. Menu aktif ditandai garis merah di bawahnya.
- Menyembunyikan diri saat scroll turun, muncul saat scroll naik.

---

## 6. Animasi

### 6.1 Alat

| Kebutuhan | Cara |
|---|---|
| Reveal, stagger, layout, shared layout, page enter | **Framer Motion** (`motion`, `AnimatePresence`, `layoutId`) |
| Parallax, progres scroll, timeline tumbuh | Framer Motion `useScroll` + `useTransform` |
| Angka berjalan | Framer Motion `animate` + `useMotionValue` (lihat 7.5) |
| Marquee, pulse, scan line, shimmer, shake | **CSS keyframes** |
| Scroll spy | `IntersectionObserver` |
| Smooth scroll | CSS `scroll-behavior: smooth` |
| Confetti, centang | Framer Motion + SVG |

Library animasi lain (GSAP, Lenis, Lottie, Three.js, react-countup, dll.) boleh dipakai bila Framer Motion/CSS tidak praktis untuk kebutuhannya. Syarat: patuhi bagian 8 (reduced motion, performa, aksesibilitas) dan palet bagian 2. Bila Lenis dipakai, ia menggantikan CSS `scroll-behavior: smooth`.

### 6.2 Motion Tokens

| Token | Nilai | Dipakai untuk |
|---|---|---|
| Durasi cepat | 200ms | Hover, tap feedback |
| Durasi dasar | 450ms | Reveal elemen, modal |
| Durasi lambat | 800ms | Hero, transisi section |
| Easing utama | `cubic-bezier(0.16, 1, 0.3, 1)` | Hampir semua reveal |
| Easing spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge, centang, tombol |
| Stagger | 80ms antar item | List/grid |
| Jarak reveal | 40px (naik dari bawah) | Fade-up |

### 6.3 Animasi Per Section

Nomor Section = nomor langkah alur di PRD. Kolom FR memudahkan agent menyebut acuan.

| Section | Langkah alur | FR | Folder fitur |
|---|---|---|---|
| 1 | Homepage, daftar, cari, filter | FR-1 | `features/home`, `features/festivals` |
| 2 | Detail festival | FR-2 | `features/festivals` |
| 3 | Beli Tiket (cek login) | FR-3 | `features/auth` |
| 4 | Login / Daftar | FR-4, FR-5 | `features/auth` |
| 5 | Pilih tiket dan checkout | FR-6 | `features/checkout` |
| 6 | Pembuatan order | FR-7 | `features/checkout` |
| 7 | Pembayaran | FR-8 | `features/payment` |
| 8 | Pembayaran berhasil | FR-9 | `features/payment` |
| 9 | E-Ticket dan My Tickets | FR-10 | `features/tickets` |
| 10–12 | Check-in dan validasi | FR-11 | `features/checkin` |
| 13 | Organizer | FR-12 | `features/organizer` |
| 14 | Admin | FR-13 | `features/admin` |

#### Section 1 — Homepage, Daftar Festival, Pencarian, Filter (FR-1)

Hero:
- **Judul besar** muncul dengan *text mask reveal*: tiap baris naik dari bawah dengan clip, stagger 100ms.
- Kata kunci merah memiliki garis bawah yang **menggambar dirinya** (SVG `pathLength`).
- **Marquee** teks besar ("TIKET • FESTIVAL • 2026") bergerak horizontal tanpa henti di bawah hero, dua baris berlawanan arah (CSS).
- **Poster** melayang pada layer parallax dengan kecepatan berbeda saat scroll (`useScroll` + `useTransform`).
- Tombol CTA berdenyut halus (*pulse ring* merah) tiap 3 detik.
- Indikator "Scroll": garis merah bergerak turun berulang.

Daftar festival, pencarian, filter:
- Search bar melebar saat fokus.
- Chip filter: indikator aktif berupa pill merah yang **bergeser (`layoutId`)** antar chip.
- Grid card muncul dengan **stagger fade-up** saat masuk viewport.
- Saat filter berubah: card lama keluar (fade + scale 0.96), card baru masuk dengan layout animation tanpa lompatan layout.
- Skeleton abu-abu dengan *shimmer* saat memuat data.
- Hover card: zoom poster, overlay naik, panah merah bergeser kanan.

#### Section 2 — Detail Festival (FR-2)
- **Hero detail**: poster *scale-down* dari 1.15 ke 1 sambil fade-in.
- Judul dan info utama (tanggal, lokasi) muncul stagger dari kiri.
- **Tab navigasi sticky** (Deskripsi / Tiket / Jadwal / FAQ): garis merah bergeser (`layoutId`) mengikuti tab aktif, otomatis aktif sesuai posisi scroll (*scroll spy*).
- **Jadwal acara**: timeline vertikal; garis merah **tumbuh mengikuti scroll**, tiap titik "menyala" saat tercapai.
- **FAQ**: accordion dengan tinggi animatif, ikon `+` berputar menjadi `×`.
- **Harga dan kuota**: angka *count-up*; progress bar kuota terisi dari 0 sampai nilai sebenarnya.
- Bar **Beli Tiket sticky** di bawah (mobile) naik dengan spring setelah user melewati hero.

#### Section 3 — Beli Tiket / Cek Login (FR-3)
- Klik **Beli Tiket**: tombol berubah singkat menjadi spinner saat sistem memeriksa login.
- Sudah login: lanjut ke checkout dengan transisi slide. Belum login: panel Login/Daftar naik (slide-up + backdrop blur), lihat Section 4.

#### Section 4 — Login / Daftar (FR-4, FR-5)
- Perpindahan tab Login ↔ Daftar: konten *crossfade + slide horizontal 24px*.
- Input: floating label, ikon validasi centang masuk dengan spring.
- Error: field *shake* 300ms.
- Tombol submit berubah menjadi spinner merah saat loading, lalu centang saat berhasil.
- Setelah register: layar "Cek email untuk verifikasi" dengan ikon amplop yang masuk dengan spring (tidak auto-login, sesuai PRD).
- Halaman `/verify-email` dan `/reset-password`: status (memverifikasi / berhasil / gagal) bertukar dengan crossfade; berhasil memakai centang tergambar, gagal memakai `×` merah.

#### Section 5 — Pilih Tiket dan Checkout (FR-6)
- Kartu tiket: saat dipilih, border merah menggambar mengelilingi kartu, centang muncul dengan spring.
- **Stepper jumlah** (+/−): angka berganti dengan *slot-machine roll* (`AnimatePresence`, naik/turun).
- **Ringkasan harga**: tiap nominal berubah dengan animasi count; total pembayaran memberi *flash* merah singkat saat berubah.
- Kuota tidak cukup: stepper *shake* dan pesan merah muncul.
- Indikator langkah (Pilih → Bayar → Selesai): garis progres merah terisi per langkah.
- Voucher `[TBD-PRD]`: PRD 9 pertanyaan 6. Animasi baris diskon (slide-down) dan input voucher invalid (shake) baru dibuat setelah diputuskan.

#### Section 6 — Pembuatan Order (FR-7)
- Kartu order muncul dengan *scale-in*, nomor pesanan mengetik karakter demi karakter (*typewriter*).
- Rincian (tiket, jumlah, harga, diskon, biaya layanan, pajak jika ada, total) muncul stagger.
- Countdown batas bayar `[TBD-PRD]`: PRD 9 pertanyaan 3.

#### Section 7 — Pembayaran (FR-8)
- Tampilan menunggu: tiga titik merah *bouncing* + teks "Menunggu konfirmasi pembayaran…".
- Polling status: transisi halus tanpa reload halaman.
- Daftar metode pembayaran `[TBD-PRD]`: PRD 9 pertanyaan 1. Jangan membuat daftar metode sebelum gateway ditentukan.

#### Section 8 — Pembayaran Berhasil (FR-9)
- Lingkaran hitam menggambar diri, lalu **centang putih tergambar** (stroke).
- **Confetti** minimalis merah, hitam, putih (±2 detik, sekali jalan) dari partikel Framer Motion.
- Teks "Pembayaran Berhasil" dengan mask reveal; tombol "Lihat Tiket Saya" masuk dengan spring.
- Pembayaran gagal / kedaluwarsa dan tombol "Coba Lagi" `[TBD-PRD]`: PRD 4.1 dan 9 pertanyaan 3. Status selain Paid belum ada.

#### Section 9 — E-Ticket dan My Tickets (FR-10)
- Tiket **jatuh masuk (drop-in)** dari atas dengan sedikit rotasi lalu menetap.
- Hover (desktop): **3D tilt** mengikuti kursor + kilau putih (`useMotionValue` + `useTransform`).
- Klik tiket: kartu *flip 3D* memperlihatkan kode tiket dan QR Code (`qrcode.react`) di sisi belakang.
- QR Code muncul dengan *reveal*; garis scan merah bergerak satu kali.
- Beberapa tiket: carousel dengan *swipe* dan efek tumpukan kartu.
- Status tiket (Tersedia / Sudah Digunakan / Dibatalkan) memakai badge dengan ikon dan teks; tiket sudah digunakan tampil redup dengan stempel "DIGUNAKAN".
- Tombol unduh tiket `[TBD-PRD]`: PRD 9 pertanyaan 5.

#### Section 10–12 — Check-in dan Validasi, Tampilan Petugas (FR-11)
- Viewfinder scanner: bingkai sudut putih, **garis scan merah** naik turun terus-menerus (CSS).
- **Tiket valid**: layar flash putih, kartu hasil naik dengan spring, centang besar tergambar, getar singkat (`navigator.vibrate`) bila didukung. Menampilkan nama, jenis tiket, waktu check-in.
- **Tiket tidak valid**: layar berkedip merah sekali, ikon `×` dengan shake, alasan penolakan sesuai PRD (tidak ditemukan / sudah digunakan / dibatalkan / tidak sesuai event).
- Hasil otomatis kembali ke mode scan setelah 3 detik dengan progress bar tipis di bawah.
- Akses halaman mengikuti role petugas `[TBD-PRD]` (PRD 9 pertanyaan 2); UI scanner sendiri boleh dibuat.

#### Section 13 — Dashboard Organizer (FR-12)
- Kartu statistik (penjualan, tiket terjual, check-in): angka *count-up*, ikon tren bergeser.
- Grafik: garis/bar tergambar dari kiri ke kanan saat masuk viewport; tooltip halus mengikuti kursor.
- Tabel peserta: baris muncul stagger; hover baris memberi highlight abu + garis merah kiri.
- Form buat festival (multi-step): transisi slide antar langkah, progress bar merah.
- Upload poster: area *drag & drop* berbingkai putus-putus merah yang berdenyut saat file di atas area.

#### Section 14 — Panel Admin (FR-13)
- Daftar event menunggu persetujuan dengan tombol Setujui / Tolak.
- **Setujui**: kartu mengecil dan memudar dengan centang hitam. **Tolak**: kartu bergeser keluar dengan tanda merah.
- Badge status berganti dengan *morph* warna (abu → hitam → merah sesuai status Event di PRD 4.3).
- Modal alasan penolakan `[TBD-PRD]`: PRD 9 pertanyaan 4.

#### Footer
- Teks raksasa nama brand (outline putih di BG hitam) terisi merah dari bawah saat footer terlihat.
- Link: underline tumbuh dari kiri saat hover.
- Tombol "Kembali ke Atas": lingkaran merah dengan panah yang memantul.

### 6.4 Animasi Global

| Elemen | Animasi |
|---|---|
| **Page transition** | Hanya animasi *masuk* lewat `app/template.tsx` (fade + naik 16px, 450ms). Animasi keluar tidak dipakai karena App Router melepas halaman lama sebelum sempat dianimasikan. |
| **Scroll progress** | Garis merah 3px di atas layar, lebar mengikuti `scrollYProgress`. |
| **Smooth scroll** | CSS `scroll-behavior: smooth`. |
| **Custom cursor** (opsional, desktop) | Titik merah kecil yang membesar saat hover tombol/card. |
| **Toast/notifikasi** | Slide dari kanan atas dengan spring, hilang otomatis 4 detik dengan progress bar tipis. |
| **Tap feedback** (mobile) | Scale 0.97 selama 100ms. |

---

## 7. Implementasi Animasi (Contoh Kode)

Penempatan file mengikuti `AGENTS.md` bagian 8.

### 7.1 Variants bersama — `src/lib/motion.ts`

```ts
import type { Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_SPRING },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};
```

### 7.2 Reduced motion global — `src/app/layout.tsx` (potongan)

Satu pembungkus membuat semua animasi Framer Motion menghormati `prefers-reduced-motion`:

```tsx
import { MotionConfig } from "framer-motion";
// MotionConfig adalah client component; bungkus lewat komponen "use client" bila perlu.
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

### 7.3 Section Reveal — `src/components/motion/Reveal.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export function RevealGroup({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children }: { children: React.ReactNode }) {
  return <motion.div variants={fadeUp}>{children}</motion.div>;
}
```

### 7.4 Timeline tumbuh saat scroll — `src/features/festivals/components/Timeline.tsx`

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className="relative pl-8">
      <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
      <motion.div
        style={{ scaleY, originY: 0 }}
        className="absolute left-0 top-0 h-full w-[2px] bg-brand"
      />
      {children}
    </div>
  );
}
```

### 7.5 Angka berjalan — `src/components/motion/CountUp.tsx`

```tsx
"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

type Props = {
  to: number;
  duration?: number;
  format?: (n: number) => string;
};

export function CountUp({
  to,
  duration = 1.2,
  format = (n) => Math.round(n).toLocaleString("id-ID"),
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => format(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
```

### 7.6 Parallax poster — `src/features/home/components/HeroPoster.tsx`

```tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroPoster({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -120]);
  return <motion.div style={{ y }}>{children}</motion.div>;
}
```

### 7.7 Scroll progress — `src/components/layout/ScrollProgress.tsx`

```tsx
"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed left-0 top-0 z-50 h-[3px] w-full bg-brand"
    />
  );
}
```

### 7.8 Page enter — `src/app/template.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### 7.9 Marquee (CSS murni)

Isi track diduplikasi dua kali agar loop mulus.

```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee__track {
  display: inline-flex;
  gap: 4rem;
  animation: marquee 25s linear infinite;
}
.marquee--reverse .marquee__track { animation-direction: reverse; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### 7.10 Tombol Primary dengan pulse ring

```css
.btn-primary {
  position: relative;
  background: var(--color-brand);
  color: var(--color-white);
  border-radius: 999px;
  padding: 16px 32px;
  font-weight: 700;
  transition: transform var(--dur-fast) var(--ease-out-expo),
              background var(--dur-fast) var(--ease-out-expo),
              box-shadow var(--dur-base) var(--ease-out-expo);
}
.btn-primary:hover {
  background: var(--color-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(225, 6, 0, 0.35);
}
.btn-primary:active { transform: scale(0.97); }

.btn-primary::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid var(--color-brand);
  animation: pulse-ring 3s ease-out infinite;
  pointer-events: none;
}
@keyframes pulse-ring {
  0%   { transform: scale(1);    opacity: 0.7; }
  70%  { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1.25); opacity: 0; }
}
```

### 7.11 Garis scan QR

```css
.scanner { position: relative; overflow: hidden; }
.scanner__line {
  position: absolute;
  left: 0; right: 0; height: 3px;
  background: var(--color-brand);
  box-shadow: 0 0 16px 4px rgba(225, 6, 0, 0.6);
  animation: scan 2.2s var(--ease-in-out) infinite alternate;
}
@keyframes scan {
  from { top: 4%; }
  to   { top: 96%; }
}
```

### 7.12 Centang sukses (SVG stroke)

```tsx
<motion.svg viewBox="0 0 52 52" width="96" height="96" aria-hidden="true">
  <motion.circle
    cx="26" cy="26" r="24"
    fill="#0A0A0A"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  />
  <motion.path
    d="M14 27 L23 35 L38 18"
    fill="none"
    stroke="#fff"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
  />
</motion.svg>
```

### 7.13 Shake (error)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.is-error {
  animation: shake 0.3s var(--ease-in-out);
  border-color: var(--color-brand);
}
```

---

## 8. Aksesibilitas & Performa

### 8.1 Reduced Motion (wajib)

Framer Motion: bungkus aplikasi dengan `<MotionConfig reducedMotion="user">` (7.2). CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Saat reduced motion aktif: matikan parallax, marquee, confetti, custom cursor, dan tilt 3D.

Animasi dari library non-Framer Motion wajib dimatikan sendiri saat `prefers-reduced-motion: reduce` (mis. `gsap.matchMedia()`, Lenis tidak diinisialisasi).

### 8.2 Aksesibilitas

- Rasio kontras mengikuti tabel 2.4.
- Fokus keyboard selalu terlihat (outline merah 3px, offset 2px).
- Status tidak hanya dibedakan warna: selalu sertakan ikon dan teks.
- Elemen animasi dekoratif diberi `aria-hidden="true"`.
- Hasil scan petugas diumumkan via `aria-live="assertive"`.

### 8.3 Performa

- Animasikan hanya `transform` dan `opacity` (hindari `width`, `height`, `top`, `left`). Pengecualian: tinggi accordion FAQ, dan `top` pada garis scan (boleh karena area kecil).
- Gunakan `will-change: transform` hanya pada elemen yang sedang dianimasikan.
- Gunakan `viewport={{ once: true }}` agar reveal tidak berulang.
- Gambar poster memakai `next/image`, `loading="lazy"` kecuali hero.
- Target: LCP < 2.5s, CLS < 0.1, animasi 60fps.

---

## 9. Breakpoint

| Nama | Lebar | Catatan |
|---|---|---|
| `sm` | 640px | Mobile besar |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop, mulai tampil custom cursor dan tilt |
| `xl` | 1280px | Desktop |

Mobile: matikan tilt 3D dan custom cursor, kurangi jarak reveal menjadi 24px, gunakan bar **Beli Tiket** sticky di bawah.

---

## 10. Referensi Eksternal (recent.design dan galeri sejenis)

Tujuan: mengambil **pola desain** (layout, ritme section, tipografi, gaya gerak) dari situs contoh, lalu mengadaptasikannya ke tema ConserId. Referensi tidak mengubah PRD, palet, atau batasan teknis.

### 10.1 Sumber yang boleh dipakai

| Sumber | Dipakai untuk |
|---|---|
| [recent.design](https://recent.design) (dulu Godly) | Galeri harian situs web, UI, dan motion; bisa disimpan ke koleksi |
| [Awwwards](https://www.awwwards.com) | Situs berprestasi; pola interaksi dan animasi |
| [One Page Love](https://onepagelove.com) | Landing page satu halaman (Homepage/hero) |
| [Land-book](https://land-book.com) | Landing page dan section |
| [Lookup.design](https://www.lookup.design) | Contoh UI per komponen |
| [Footer.design](https://footer.design) | Contoh footer |
| [SEESAW](https://seesaw.design) | Inspirasi umum |
| [Codrops roundups](https://tympanus.net/codrops/category/articles/websites-roundups) | Kumpulan situs kreatif dan teknik animasinya |
| Galeri lain (Dribbble, Behance, Mobbin, Siteinspire, Lapa Ninja, dsb.) | Boleh, dengan aturan yang sama |

Daftar ini bukan batas keras: situs galeri lain yang menyediakan contoh website boleh dipakai selama mengikuti 10.2 sampai 10.4.

Kata kunci pencarian yang relevan untuk ConserId: `music festival`, `event ticketing`, `concert`, `ticket checkout`, `QR ticket`, `festival landing page`, `brutalist`, `black and red`, `editorial typography`.

### 10.2 Yang boleh dan tidak boleh diambil

| Boleh diambil (pola) | Tidak boleh diambil |
|---|---|
| Susunan layout dan hierarki section | Kode, CSS, atau aset (gambar, ikon, video, font berlisensi) milik situs lain |
| Skala tipografi dan ritme spasi | Teks/copy, nama brand, logo, dan ilustrasi |
| Jenis animasi (mis. text mask reveal, marquee, tilt) | Palet warna asli situs referensi |
| Struktur komponen (mis. kartu tiket, tab sticky) | Fitur yang tidak ada di PRD (mis. peta tempat duduk, chat, marketplace) |

Situs di galeri adalah karya berhak cipta pihak lain, bukan template bebas pakai. Menyalin tampilan persis sama atau kode/aset-nya tidak diperbolehkan.

### 10.3 Aturan adaptasi (wajib)

1. **Palet:** selalu putih, hitam, merah sesuai bagian 2, dengan batas kontras di 2.4. Warna situs referensi tidak dipakai.
2. **Font:** hanya Anton dan Inter (bagian 3), kecuali user menyetujui font lain.
3. **PRD menang:** jika referensi memuat fungsi di luar PRD atau menyentuh `[TBD-PRD]`, bagian itu dilewati.
4. **Aksesibilitas dan performa** (bagian 8) tetap berlaku, termasuk `prefers-reduced-motion`.
5. **Template berkode** (mis. dari marketplace) hanya boleh dipakai jika lisensinya jelas mengizinkan dan user menyetujui. Dependency non-animasi tetap memerlukan persetujuan user (`AGENTS.md` bagian 3); library animasi dikecualikan.

### 10.4 Alur kerja agent

1. **Pemicu:** user menyebut URL/nama galeri, atau meminta referensi untuk Section tertentu (bagian 6.3). Agent tidak mencari referensi atas inisiatif sendiri.
2. **Cari:** buka halaman galeri atau situs yang disebut user (tool `webfetch` atau pencarian). Ambil maksimal **3 sampai 5** kandidat per section.
3. **Tampilkan ke user:** tabel ringkas (nama, URL, apa yang menarik, cocok untuk Section berapa). Tunggu user memilih.
4. **Catat:** tambahkan yang dipilih ke `docs/design/references.md` memakai format di file itu.
5. **Adaptasi:** terjemahkan pola ke komponen ConserId sesuai 10.3, lalu kerjakan dengan TDD dan struktur folder di `AGENTS.md`.
6. **Perubahan `design.md`:** bila pola menjadi standar permanen, usulkan perubahan ke user; jangan mengubah `design.md` diam-diam.

Jika halaman tidak bisa dibuka (butuh login, memblokir akses otomatis, atau konten dimuat lewat JavaScript), **jangan menebak**: minta user menempelkan URL lain, tangkapan layar, atau deskripsi pola yang diinginkan.

## 11. Checklist Implementasi

- [ ] Pasang font Anton + Inter (`next/font`), definisikan token `@theme` (2.5).
- [ ] Komponen dasar di `components/ui/`: Button, Input, Modal, Toast, Badge, Skeleton.
- [ ] Komponen lintas fitur: `components/layout/` (Navbar, Footer, ScrollProgress) dan `components/motion/` (Reveal, CountUp, Marquee).
- [ ] `lib/motion.ts`, `MotionConfig reducedMotion="user"`, dan `app/template.tsx`.
- [ ] Animasi per section sesuai 6.3, **kecuali** yang bertanda `[TBD-PRD]`.
- [ ] Setiap pola yang berasal dari referensi eksternal tercatat di `docs/design/references.md`.
- [ ] Uji `prefers-reduced-motion`, keyboard, dan screen reader.
- [ ] Audit Lighthouse (Performance dan Accessibility ≥ 90).