# DESIGN.md — Website Penjualan Tiket Festival

Dokumen ini adalah panduan desain (visual, layout, dan animasi) untuk website penjualan tiket festival. Tema: **Putih, Hitam, dan Merah** dengan animasi modern di setiap section.

---

## 1. Prinsip Desain

| Prinsip | Penjelasan |
|---|---|
| **Bold & Kontras** | Hitam dan putih sebagai dasar, merah hanya untuk aksen dan aksi utama (CTA). |
| **Editorial** | Tipografi besar, tegas, banyak ruang kosong, terasa seperti poster festival. |
| **Cepat & Jelas** | User harus bisa menemukan festival dan menekan **Beli Tiket** dalam beberapa klik. |
| **Animasi Bermakna** | Animasi memandu perhatian dan memberi feedback, bukan sekadar hiasan. |
| **Responsif & Aksesibel** | Mobile-first, kontras WCAG AA, mendukung `prefers-reduced-motion`. |

---

## 2. Color System

### 2.1 Palet Utama

| Token | Hex | Penggunaan |
|---|---|---|
| `--black` | `#0A0A0A` | Background gelap, teks utama, footer |
| `--ink` | `#141414` | Card pada section gelap |
| `--gray-900` | `#1F1F1F` | Border pada background gelap |
| `--gray-600` | `#6B6B6B` | Teks sekunder |
| `--gray-200` | `#E5E5E5` | Border pada background terang |
| `--gray-100` | `#F4F4F4` | Background section terang alternatif |
| `--white` | `#FFFFFF` | Background utama, teks pada section gelap |
| `--red` | `#E10600` | CTA, highlight, badge, garis aksen |
| `--red-dark` | `#B80500` | Hover/active tombol merah |
| `--red-soft` | `#FFE5E3` | Background badge/alert ringan |

### 2.2 Status

| Status | Warna | Catatan |
|---|---|---|
| Sukses (Paid, Tiket Valid) | `#0A0A0A` + ikon centang putih | Tetap dalam palet, tanpa hijau |
| Gagal / Tidak Valid | `#E10600` | Merah penuh |
| Pending | `#6B6B6B` | Abu-abu |

### 2.3 Aturan Penggunaan

- Proporsi: **Putih 60% · Hitam 30% · Merah 10%**.
- Merah hanya untuk: tombol utama, harga/promo, badge, indikator aktif, garis aksen.
- Hindari teks merah di atas background hitam untuk paragraf panjang (gunakan untuk judul/angka saja).
- Section selang-seling terang dan gelap agar ritme visual terasa.

### 2.4 CSS Variables

```css
:root {
  --black: #0A0A0A;
  --ink: #141414;
  --gray-900: #1F1F1F;
  --gray-600: #6B6B6B;
  --gray-200: #E5E5E5;
  --gray-100: #F4F4F4;
  --white: #FFFFFF;
  --red: #E10600;
  --red-dark: #B80500;
  --red-soft: #FFE5E3;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-full: 999px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --dur-fast: 200ms;
  --dur-base: 450ms;
  --dur-slow: 800ms;
}
```

### 2.5 Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        black: "#0A0A0A",
        ink: "#141414",
        brand: {
          DEFAULT: "#E10600",
          dark: "#B80500",
          soft: "#FFE5E3",
        },
        gray: {
          100: "#F4F4F4",
          200: "#E5E5E5",
          600: "#6B6B6B",
          900: "#1F1F1F",
        },
      },
      fontFamily: {
        display: ["Anton", "Bebas Neue", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
};
```

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

Aturan: line-height heading 1.0–1.1, body 1.6; judul besar selalu **uppercase**; satu kata kunci pada judul boleh diberi warna merah.

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
| **Primary** | BG merah, teks putih, pill | BG `--red-dark`, naik 2px, shadow merah lembut |
| **Secondary** | BG hitam, teks putih | BG putih, teks hitam, border hitam |
| **Outline** | Border 1.5px hitam, transparan | Fill hitam dengan wipe kiri → kanan |
| **Ghost** | Teks saja, underline animasi | Underline tumbuh dari kiri |

Tombol **Beli Tiket** selalu Primary dan memiliki efek *magnetic* (mengikuti kursor ringan di desktop).

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

### 6.1 Library yang Disarankan

| Kebutuhan | Library |
|---|---|
| Animasi komponen & page transition (React/Next.js) | **Framer Motion** |
| Scroll-driven, timeline, parallax | **GSAP + ScrollTrigger** |
| Smooth scroll | **Lenis** |
| Angka berjalan | **react-countup** (atau custom) |
| Animasi vektor (centang sukses, dll.) | **Lottie** (opsional) |

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

#### Section 1 — Homepage (Hero)
- **Judul besar** muncul dengan *text mask reveal*: tiap baris naik dari bawah dengan clip, stagger 100ms.
- Kata kunci berwarna merah memiliki garis bawah yang **menggambar dirinya** (stroke dash).
- **Marquee** teks besar (nama festival, "TIKET • FESTIVAL • 2026") bergerak horizontal tanpa henti di bawah hero, berlawanan arah pada dua baris.
- **Poster** melayang pada layer parallax dengan kecepatan berbeda saat scroll.
- Tombol CTA berdenyut halus (*pulse ring* merah) tiap 3 detik.
- Indikator "Scroll" berupa garis merah yang bergerak turun berulang.

#### Section 2 — Daftar Festival, Pencarian & Filter
- Search bar melebar (width expand) saat fokus.
- Chip filter: indikator aktif berupa pill merah yang **bergeser (shared layout animation)** antar chip.
- Grid card muncul dengan **stagger fade-up** saat masuk viewport.
- Saat filter berubah: card lama keluar (fade + scale 0.96), card baru masuk dengan layout animation, tanpa lompatan layout.
- Skeleton loader abu-abu dengan *shimmer* saat memuat data.
- Hover card: zoom poster, overlay naik, panah merah bergeser kanan.

#### Section 3 — Detail Festival
- **Hero detail**: poster melakukan *scale-down* dari 1.15 ke 1 sambil fade-in.
- Judul dan info utama (tanggal, lokasi) muncul stagger dari kiri.
- **Tab navigasi sticky** (Deskripsi / Tiket / Jadwal / FAQ): garis merah bergeser mengikuti tab aktif, dan otomatis aktif sesuai posisi scroll (*scroll spy*).
- **Jadwal acara**: timeline vertikal; garis merah **tumbuh mengikuti scroll**, tiap titik "menyala" saat tercapai.
- **FAQ**: accordion dengan tinggi animatif dan ikon `+` berputar menjadi `×`.
- **Harga & kuota**: angka berjalan (*count-up*), progress bar kuota terisi dari 0 sampai nilai sebenarnya.
- Bar **Beli Tiket sticky** di bawah (mobile) naik dengan spring saat user scroll melewati hero.

#### Section 4 — Beli Tiket & Login/Daftar
- Klik **Beli Tiket**: modal/halaman auth masuk dengan *slide-up + backdrop blur*.
- Perpindahan tab Login ↔ Daftar: konten *crossfade + slide horizontal 24px*.
- Input: floating label, ikon validasi centang masuk dengan spring.
- Error: field *shake* kiri-kanan 300ms.
- Tombol submit berubah menjadi spinner (lingkaran merah) saat loading, lalu centang saat berhasil.

#### Section 5 — Pilih Tiket & Checkout
- Kartu tiket: saat dipilih, border merah menggambar mengelilingi kartu, centang muncul dengan spring.
- **Stepper jumlah** (+/−): angka berganti dengan *slot-machine roll* (naik/turun).
- **Ringkasan harga**: tiap nominal berubah dengan animasi count; total pembayaran memberi *flash* merah singkat saat berubah.
- Kode voucher: jika valid, baris diskon masuk dengan *slide-down*, jika tidak valid, input *shake*.
- Indikator langkah (Pilih → Bayar → Selesai): garis progres merah terisi per langkah.

#### Section 6 — Pembuatan Order
- Kartu order muncul dengan *scale-in*, nomor pesanan mengetik karakter demi karakter (*typewriter*).
- **Countdown batas bayar**: digit berganti dengan flip; saat < 5 menit berubah merah dan berdenyut.

#### Section 7 — Pembayaran
- Daftar metode pembayaran: stagger muncul, metode terpilih memiliki radio merah yang membesar.
- Status menunggu: tiga titik merah *bouncing* + teks "Menunggu konfirmasi pembayaran…".
- Polling status: transisi halus tanpa reload halaman.

#### Section 8 — Pembayaran Berhasil
- Lingkaran hitam menggambar diri, lalu **centang putih tergambar** (stroke animation).
- **Confetti** minimalis berwarna merah, hitam, dan putih (±2 detik, sekali jalan).
- Teks "Pembayaran Berhasil" muncul dengan mask reveal; tombol "Lihat Tiket Saya" masuk dengan spring.
- Pembayaran gagal/expired: ikon `×` merah dengan *shake* dan tombol "Coba Lagi".

#### Section 9 — E-Ticket & My Tickets
- Tiket **jatuh masuk (drop-in)** dari atas dengan sedikit rotasi lalu menetap.
- Hover (desktop): efek **3D tilt** mengikuti kursor + kilau (glare) putih.
- Klik tiket: kartu *flip 3D* memperlihatkan QR Code di sisi belakang.
- QR Code muncul dengan *reveal* per baris (scan-line merah bergerak satu kali).
- Beberapa tiket: carousel dengan *swipe* dan efek tumpukan kartu (stack).
- Tombol unduh: ikon panah turun dengan animasi progres.

#### Section 10–12 — Check-in & Validasi (Tampilan Petugas)
- Viewfinder scanner: bingkai sudut putih, **garis scan merah** bergerak naik turun terus-menerus.
- **Tiket valid**: layar flash putih, kartu hasil naik dengan spring, centang besar tergambar, getar singkat (`navigator.vibrate`) bila didukung. Menampilkan nama, jenis tiket, waktu check-in.
- **Tiket tidak valid**: layar berkedip merah sekali, ikon `×` dengan shake, alasan penolakan (sudah digunakan / dibatalkan / tidak ditemukan / tidak sesuai event).
- Hasil otomatis kembali ke mode scan setelah 3 detik dengan progress bar tipis di bawah.

#### Section 13 — Dashboard Organizer
- Kartu statistik (penjualan, tiket terjual, check-in): angka *count-up*, ikon tren bergeser.
- Grafik: garis/bar tergambar dari kiri ke kanan saat masuk viewport; tooltip halus mengikuti kursor.
- Tabel peserta: baris muncul stagger, hover baris memberi highlight abu + garis merah kiri.
- Form buat festival (multi-step): transisi slide antar langkah, progress bar merah.
- Upload poster: area *drag & drop* berbingkai putus-putus merah yang berdenyut saat file di atas area.

#### Section 14 — Panel Admin
- Daftar event menunggu persetujuan: kartu *swipe-able* atau tombol Setujui/Tolak.
- **Setujui**: kartu mengecil dan memudar dengan centang hitam. **Tolak**: kartu bergeser keluar dengan tanda merah, lalu muncul modal alasan penolakan (slide-up).
- Badge status berganti dengan *morph* warna (abu → hitam → merah sesuai status).

#### Footer
- Teks raksasa nama brand (outline putih di BG hitam) terisi merah dari bawah saat footer terlihat.
- Link: underline tumbuh dari kiri saat hover.
- Tombol "Kembali ke Atas" berupa lingkaran merah dengan panah yang memantul.

### 6.4 Animasi Global

| Elemen | Animasi |
|---|---|
| **Page transition** | Panel hitam menutup layar (wipe dari bawah ke atas, 500ms), halaman baru terungkap dengan wipe berikutnya. |
| **Scroll progress** | Garis merah 3px di atas layar yang memanjang sesuai progres scroll. |
| **Smooth scroll** | Lenis dengan `lerp: 0.1`. |
| **Custom cursor** (desktop, opsional) | Titik merah kecil yang membesar saat hover tombol/card. |
| **Toast/notifikasi** | Slide dari kanan atas dengan spring, hilang otomatis 4 detik dengan progress bar tipis. |
| **Tap feedback** (mobile) | Scale 0.97 selama 100ms. |

---

## 7. Implementasi Animasi (Contoh Kode)

### 7.1 Variants Framer Motion (reusable)

```tsx
// lib/motion.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 7.2 Section Reveal

```tsx
// components/Reveal.tsx
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

### 7.3 Garis Timeline Tumbuh Saat Scroll

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
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

### 7.4 Marquee (CSS Murni)

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

### 7.5 Tombol Primary dengan Pulse Ring

```css
.btn-primary {
  position: relative;
  background: var(--red);
  color: var(--white);
  border-radius: var(--radius-full);
  padding: 16px 32px;
  font-weight: 700;
  transition: transform var(--dur-fast) var(--ease-out-expo),
              background var(--dur-fast) var(--ease-out-expo),
              box-shadow var(--dur-base) var(--ease-out-expo);
}
.btn-primary:hover {
  background: var(--red-dark);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(225, 6, 0, 0.35);
}
.btn-primary:active { transform: scale(0.97); }

.btn-primary::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid var(--red);
  animation: pulse-ring 3s ease-out infinite;
}
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1.25); opacity: 0; }
}
```

### 7.6 Garis Scan QR

```css
.scanner { position: relative; overflow: hidden; }
.scanner__line {
  position: absolute;
  left: 0; right: 0; height: 3px;
  background: var(--red);
  box-shadow: 0 0 16px 4px rgba(225, 6, 0, 0.6);
  animation: scan 2.2s var(--ease-in-out) infinite alternate;
}
@keyframes scan {
  from { top: 4%; }
  to   { top: 96%; }
}
```

### 7.7 Centang Sukses (SVG Stroke)

```tsx
<motion.svg viewBox="0 0 52 52" width="96" height="96">
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

### 7.8 Shake (Error)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.is-error { animation: shake 0.3s var(--ease-in-out); border-color: var(--red); }
```

---

## 8. Aksesibilitas & Performa

### 8.1 Reduced Motion (Wajib)

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

Untuk Framer Motion gunakan `useReducedMotion()` dan matikan parallax, marquee, serta custom cursor.

### 8.2 Aksesibilitas

- Rasio kontras minimal **4.5:1** (putih di atas merah `#E10600` = 4.6:1, aman untuk teks tebal/besar).
- Fokus keyboard selalu terlihat (outline merah 3px, offset 2px).
- Status tidak hanya dibedakan warna: selalu sertakan ikon dan teks.
- Elemen animasi dekoratif diberi `aria-hidden="true"`.
- Hasil scan petugas diumumkan via `aria-live="assertive"`.

### 8.3 Performa

- Animasikan hanya `transform` dan `opacity` (hindari `width`, `height`, `top`, `left`).
- Gunakan `will-change: transform` hanya pada elemen yang sedang dianimasikan.
- Gunakan `viewport={{ once: true }}` agar reveal tidak berulang dan memberatkan.
- Gambar poster memakai `next/image` (WebP/AVIF), `loading="lazy"` kecuali hero.
- Lazy-load GSAP/Lottie pada section yang membutuhkan saja.
- Target: LCP < 2.5s, CLS < 0.1, animasi 60fps.

---

## 9. Breakpoint

| Nama | Lebar | Catatan |
|---|---|---|
| `sm` | 640px | Mobile besar |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop, mulai tampil custom cursor & tilt |
| `xl` | 1280px | Desktop |

Mobile: matikan tilt 3D dan custom cursor, kurangi jarak reveal menjadi 24px, dan gunakan bar **Beli Tiket** sticky di bawah.

---

## 10. Alur Sistem (Referensi)

1. **Akses Homepage**: user berstatus Guest, dapat melihat homepage, daftar festival, mencari, dan memfilter festival.
2. **Melihat Detail Festival**: Guest melihat poster, deskripsi, tanggal, lokasi, jadwal, jenis tiket, harga, kuota, organizer, FAQ, dan ketentuan.
3. **Memilih untuk Membeli Tiket**: user menekan **Beli Tiket**, sistem memeriksa status login (pembelian wajib autentikasi).
4. **Login atau Daftar Akun**: user yang belum login diarahkan untuk login atau registrasi, lalu melanjutkan pembelian.
5. **Memilih Tiket dan Checkout**: pilih jenis dan jumlah tiket; sistem memeriksa kuota, menghitung harga, biaya layanan, diskon/voucher, dan total.
6. **Pembuatan Order**: sistem membuat order dengan nomor pesanan (data user, tiket, jumlah, harga, diskon, biaya layanan, pajak, total).
7. **Pembayaran**: user membayar via payment gateway; order belum selesai sebelum pembayaran dikonfirmasi.
8. **Pembayaran Berhasil**: backend memperbarui status pembayaran dan order menjadi *paid*, lalu memproses pembuatan tiket.
9. **Pembuatan E-Ticket**: setiap tiket memiliki kode dan QR Code, dapat dilihat di halaman **My Tickets**.
10. **Check-in di Festival**: petugas memindai QR Code; sistem memeriksa ketersediaan, validitas, kesesuaian event, dan status penggunaan.
11. **Tiket Valid**: check-in diterima, waktu dicatat, status tiket menjadi sudah digunakan, user boleh masuk.
12. **Tiket Tidak Valid**: QR tidak ditemukan, sudah digunakan, dibatalkan, atau tidak memenuhi syarat, maka check-in ditolak.
13. **Pengelolaan oleh Organizer**: organizer membuat dan mengelola festival, jenis tiket, harga, kuota, periode penjualan, serta melihat data penjualan dan peserta.
14. **Persetujuan oleh Admin**: admin menyetujui atau menolak event; event yang disetujui dan dipublikasikan tampil untuk Guest dan Customer.
15. **Ringkasan Alur Utama**:

```
Guest buka Homepage → lihat festival → buka detail → tekan Beli Tiket
→ cek login → (belum login) Login/Daftar → pilih tiket → Checkout
→ buat Order → Pembayaran → pembayaran dikonfirmasi
→ buat E-Ticket + QR Code → datang ke festival
→ QR di-scan petugas → validasi tiket → (valid) Check-in & masuk
```

---

## 11. Checklist Implementasi

- [ ] Pasang font Anton + Inter, definisikan CSS variables dan Tailwind config.
- [ ] Buat komponen dasar: Button, Card Festival, Ticket Card, Input, Navbar, Modal, Toast.
- [ ] Siapkan `lib/motion.ts` dan komponen `Reveal`.
- [ ] Aktifkan Lenis + scroll progress + page transition.
- [ ] Implementasikan animasi per section sesuai bagian 6.3.
- [ ] Tambahkan `prefers-reduced-motion` dan uji keyboard/screen reader.
- [ ] Audit Lighthouse (Performance, Accessibility ≥ 90).