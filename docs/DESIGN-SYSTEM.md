# Design System Tixo

Panduan agar semua halaman (admin, organizer, customer) senada dengan **landing page** dan **login admin**. Semua contoh di sini diambil dari kode yang sudah berjalan — buka file rujukannya kalau ragu.

**Contoh hidup:** `/` (landing), `/admin/login`, dan `/organizer/login`. Kedua login memakai form dan dekorasi Backstage bersama di `src/components/workspace/`.

---

## 1. Karakter

- **Nama:** Tixo. **Palet:** Neon Blaze (hitam pekat + oranye menyala), sama dengan app mobile.
- **Gaya:** poster gig / zine — tipografi raksasa, sedikit miring, stiker, sobekan tiket, pita "caution tape". Berani, tapi tetap rapi dan mudah dibaca.
- **Selalu gelap.** Latar utama `ink`; section terang (`paper`) dipakai sesekali sebagai aksen.
- **Ringan dulu, baru meriah.** Animasi boleh banyak, asal murah (lihat §6).

---

## 2. Warna

Token didefinisikan di [`src/app/globals.css`](../src/app/globals.css) (blok `@theme`). **Pakai class token, jangan hex mentah.**

| Token (class) | Hex | Dipakai untuk |
|---|---|---|
| `ink` (`bg-ink`, `text-ink`) | `#09090B` | Latar halaman; teks di atas oranye |
| `onyx` | `#141417` | Kartu, panel, input |
| `line` | `#27272A` | Border, garis pemisah |
| `blaze` | `#FF4D00` | Aksi utama, aksen, highlight |
| `tangerine` | `#FF7A00` | Aksen kedua, hover tombol oranye, label kecil |
| `mute` | `#A1A1AA` | Teks sekunder |
| `paper` | `#FFF4EC` | Section/kartu terang, stiker |
| `white` | `#FFFFFF` | Teks utama |

Warna status (sudah ada, tetap dipakai): `status-success` `#8DE2BD`, `status-warning` `#F1C875`, `status-danger` `#FFA4B8` (+ varian `-bg`). Error form memakai `#EF4444` / latar `#45121A`.

**Aturan penting**
- Teks di atas `bg-blaze` / `bg-tangerine` **selalu `text-ink`**, bukan putih (kontras putih di atas oranye terlalu rendah).
- Oranye itu bumbu: satu–dua elemen oranye per layar (CTA + satu aksen), sisanya hitam/putih/abu.
- Teks tersier yang lebih redup: `#71717A` (sudah dipakai di beberapa tempat).

**Migrasi dari hex lama** (banyak halaman admin/organizer masih memakai hex langsung):

| Hex lama | Ganti dengan |
|---|---|
| `bg-[#09090B]` | `bg-ink` |
| `bg-[#141417]` | `bg-onyx` |
| `border-[#27272A]` | `border-line` |
| `bg-[#FF4D00]` / `text-[#FF4D00]` | `bg-blaze` / `text-blaze` |
| `text-[#FF7A00]` | `text-tangerine` |
| `text-[#A1A1AA]` | `text-mute` |
| `text-[#FFFFFF]` | `text-white` |

---

## 3. Tipografi

| Peran | Font | Class | Bobot |
|---|---|---|---|
| Judul, angka, tombol besar | Bricolage Grotesque | `font-display` | `font-bold` 700, `font-extrabold` 800 |
| Teks isi, form | Spline Sans | `font-body` | 400, `font-semibold` 600 |
| Label kecil, kode tiket | Monospace sistem | `font-mono` | `font-bold` |

**Mengaktifkan font di halaman/layout baru** — font dimuat di [`src/app/fonts.ts`](../src/app/fonts.ts):

```tsx
import { brandFonts } from '@/app/fonts';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${brandFonts} font-body`}>{children}</div>;
}
```

Contoh: [`src/app/admin/login/layout.tsx`](../src/app/admin/login/layout.tsx). Halaman yang belum dibungkus masih memakai PT Sans (font lama).

**Pola judul**

```tsx
<h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
  Lagi <span className="text-blaze">rame</span> di Tixo
</h2>
```

- Judul besar: `uppercase`, `leading-[0.86]`–`[0.9]`, `tracking-tight`, ukuran `clamp(...)` agar responsif.
- Satu kata kunci diberi `text-blaze`, atau gaya outline `text-outline` (lihat §4).
- Label kecil di atas judul: `font-mono text-xs font-bold uppercase tracking-[0.3em] text-tangerine`.

---

## 4. Bentuk & elemen khas

| Elemen | Cara pakai |
|---|---|
| Sudut | Kartu `rounded-3xl` / `rounded-[28px]`, input & tombol form `rounded-2xl`, chip/CTA `rounded-full` |
| Border | `border-2 border-line`; hover `hover:border-tangerine` atau `hover:border-[#3F3F46]` |
| Stiker / label miring | Chip kecil dengan `rotate-2`/`-rotate-6`, mis. pita "ADMIN ONLY" di login admin |
| Teks outline | `text-outline` (warna garis via `[--stroke:#FF7A00]`, default putih) |
| Sobekan tiket | `ticket-notch` (lubang di sisi kiri-kanan) atau perforasi manual (lihat `TicketCard`) |
| Tekstur grain | `grain` + `relative` pada section (sangat halus, statis) |
| Bayangan oranye | `shadow-[0_30px_60px_-24px_rgba(255,77,0,0.6)]` — hanya untuk elemen unggulan |
| Cahaya latar | `radial-gradient(...)` di `style` (lihat Hero / login admin). **Bukan** `blur-*`. |

---

## 5. Komponen siap pakai

Ada di [`src/components/landing/`](../src/components/landing/) — boleh dipakai di halaman lain.

| Komponen | Fungsi |
|---|---|
| `TixoLogo` | Logo Tixo (tautan ke beranda) |
| `TextRoll` | Teks menggulung saat induk `group` di-hover (CSS murni) |
| `RotatingWord` | Kata yang berganti bergiliran |
| `SplitHeading` | Judul yang katanya naik saat terlihat |
| `Reveal`, `Magnetic`, `TiltCard` (`motion.tsx`) | Muncul saat terlihat, tombol magnet, kartu miring 3D |
| `TicketCard` | Kartu tiket berfoto |
| `MotionProvider` | Wajib membungkus halaman yang memakai `m.*` dari Framer (lihat §6) |

**Tombol utama**

```tsx
<button className="group inline-flex items-center justify-center gap-2 rounded-full bg-blaze px-7 py-4 font-display text-lg font-extrabold text-ink transition-[transform,background-color] duration-300 hover:-rotate-2 hover:bg-tangerine">
  <TextRoll>Beli tiket di app</TextRoll>
</button>
```

**Tombol sekunder (outline)**

```tsx
<a className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-4 font-display text-lg font-extrabold text-white transition-[transform,background-color,color] duration-300 hover:rotate-2 hover:bg-white hover:text-ink">
  <TextRoll>Jadi organizer</TextRoll>
</a>
```

**Kartu / panel**

```tsx
<div className="rounded-3xl border-2 border-line bg-onyx p-6 sm:p-8">…</div>
```

**Input form** (dari login admin)

```tsx
<label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">Email</label>
<input
  id="email"
  className="w-full rounded-2xl border-2 border-line bg-ink py-3.5 px-4 text-sm text-white placeholder-[#52525B] outline-none transition-colors hover:border-[#3F3F46] focus:border-blaze/60"
/>
<p className="mt-1.5 text-xs font-semibold text-[#EF4444]">Pesan error per kolom</p>
```

**Alert error**

```tsx
<div role="alert" className="rounded-2xl border border-[#F87171]/40 bg-[#45121A]/80 p-3.5 text-xs text-[#FCA5A5]">…</div>
```

**Chip / filter aktif**

```tsx
<span className="rounded-full bg-blaze px-4 py-2 text-sm font-bold text-ink">Semua</span>
<span className="rounded-full border-2 border-line px-4 py-2 text-sm font-bold text-mute">Rock</span>
```

---

**Dashboard admin & organizer** (tema terang dari token Tixo)

- Shell bersama `WorkspaceLayout`: sidebar `bg-white border-r border-ink/10` (menu aktif `bg-blaze text-ink`) (grup menu berjudul, bisa diringkas) + top bar `h-16 border-b` (cari, notifikasi, profil). Jangan bikin layout dashboard sendiri.
- Halaman di `bg-paper`; kartu = `rounded-2xl border border-ink/10 bg-white p-5`, tanpa bayangan besar. Isian di dalam kartu pakai `bg-paper`. Teks `text-ink`, sekunder `text-ink/60`, tersier `text-ink/45`.
- Warna status di latar terang: `bg-status-*/25 text-ink` (teks status asli terlalu pucat di putih). Aksen teks/link pakai `text-blaze`.
- Simpan komponen khusus peran di `src/components/admin/` atau `src/components/organizer/`. Pakai `DashboardKit.tsx` dari `src/components/workspace/` untuk header, metrik, panel, status, dan akses cepat. Pakai `OrganizerEventPicker` di ringkasan, penjualan, serta check-in. Gunakan `AdminDashboardSummary` untuk isi ringkasan admin dan `OrganizerSalesSummary` untuk metrik serta rincian tiket yang dibagikan antara ringkasan organizer dan laporan penjualan.
- Framer Motion menangani animasi masuk, umpan balik tombol, dan batang per kelas tiket. GSAP menangani panel di bawah viewport saat masuk area gulir workspace. Keduanya mengikuti preferensi gerak pengguna.
- Angka di ringkasan berasal dari backend. Tampilkan keadaan memuat, kosong, atau gagal bila sesuai.

## 6. Animasi — banyak tapi ringan

### Aturan wajib

1. **Hanya animasikan `transform` dan `opacity`.** Jangan animasikan `width`, `height`, `top`, `box-shadow` besar, atau `filter`.
2. **Jangan pakai `blur-*`, `backdrop-blur`, atau `mix-blend-mode`** pada elemen besar / yang bergerak. Ganti dengan gradien.
3. **Animasi terus-menerus harus berhenti saat tidak terlihat** (lihat `Hero.tsx` / `TapeMarquee.tsx` yang memakai `onToggle`).
4. **Hormati "reduce motion":** CSS → tambahkan ke blok `@media (prefers-reduced-motion: reduce)`; Framer → `useReducedMotion()`; GSAP → otomatis lewat `useGsap`.
5. **Satu elemen = satu sistem animasi.** Kalau CSS, GSAP, dan Framer sama-sama butuh `transform`, bungkus dengan elemen terpisah per sistem (contoh: polaroid di `Hero.tsx`).

### Pilih alat (urut dari paling ringan)

| Kebutuhan | Alat | Contoh |
|---|---|---|
| Animasi masuk, loop (berayun, berputar, marquee) | **CSS keyframes** | `.hero-*` di `globals.css`, [`login.module.css`](../src/components/workspace/login.module.css) |
| Hover, tap, layout/filter berpindah, muncul saat terlihat | **Framer Motion `m.*`** di dalam `MotionProvider` | `TicketCard`, filter genre di `EventStubs` |
| Efek yang terikat posisi scroll (parallax, scrub) | **GSAP** lewat `useGsap` | `Manifesto.tsx`, `TapeMarquee.tsx` |

- **Animasi khusus satu halaman → CSS Module** di folder halaman itu (seperti `login.module.css`), agar tidak membebani halaman lain.
- **Framer:** impor `m` (bukan `motion`) dan pastikan halaman dibungkus `MotionProvider`.
- **GSAP:** selalu lewat `useGsap` dari [`src/lib/gsap.ts`](../src/lib/gsap.ts) — GSAP dimuat lazy saat browser senggang dan dibersihkan otomatis.

```tsx
const root = useRef<HTMLElement>(null);
useGsap(({ gsap }) => {
  gsap.from('[data-item]', { y: 40, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
}, root);
```

### Rasa gerak

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (CSS) atau `[0.22, 1, 0.36, 1]` (Framer) — cepat di awal, mendarat lembut.
- **Durasi:** mikro-interaksi 0,2–0,35 dtk; elemen masuk 0,6–1,2 dtk; loop latar 5–40 dtk (pelan).
- **Masuk bertahap:** jeda 0,06–0,1 dtk antar elemen (pakai variabel `--d` seperti di login admin).

### Skills design pendukung

Untuk AI agent / workflow desain, pakai skill populer ini (detail pemasangan di [`AGENTS.md`](../AGENTS.md)):

- **`frontend-design`** (Anthropic) — arah visual & tipografi saat membuat atau mendesain ulang UI.
- **`web-design-guidelines`** (Vercel) — review aksesibilitas & UX setelah UI jadi.
- **`vercel-react-best-practices`** (Vercel) — performa komponen React/Next.js.
- **`webapp-testing`** (Anthropic) — cek tampilan di browser dengan Playwright.
- **`ui-ux-pro-max`** — referensi pola UX & chart; abaikan palet/font bawaannya.

Skill membantu proses; **aturan di dokumen ini tetap yang berlaku** (palet Neon Blaze, Bricolage + Spline, animasi ringan).

---

## 7. Gambar

- Format **JPEG**, ukuran **640×400**, target **≤ 60 KB** (kualitas ~72, progressive). Contoh: `public/images/events/`.
- Tampilkan dengan `next/image` + `unoptimized` agar tetap JPEG asli.
- Foto pihak ketiga wajib dicatat kreditnya di [`docs/photo-credits.md`](photo-credits.md) (lisensi CC BY/BY-SA mewajibkan atribusi).

---

## 8. Gaya bahasa

- Bahasa Indonesia santai dan pendek: "Amankan tiketmu sebelum habis.", "Lagi rame di Tixo".
- Judul boleh nakal/berani; teks isi tetap jelas dan informatif.
- CTA pakai kata kerja: "Beli tiket di app", "Buka dashboard organizer", "Masuk ke Admin Workspace".
- Validasi: frontend hanya cek kolom wajib; pesan aturan (format, panjang) datang dari backend dan ditampilkan per kolom.

---

## 9. Checklist sebelum push

- [ ] Tidak ada hex mentah untuk warna yang sudah punya token (§2).
- [ ] Teks di atas oranye memakai `text-ink`.
- [ ] Judul memakai `font-display`; halaman dibungkus `brandFonts`.
- [ ] Animasi hanya `transform`/`opacity`, tanpa `blur`/`backdrop-blur`.
- [ ] Loop berhenti saat tidak terlihat; ada fallback reduce motion.
- [ ] Sudah direview dengan `web-design-guidelines` (aksesibilitas & UX).
- [ ] Tampilan dicek di lebar 390 px (mobile) tanpa scroll horizontal.
- [ ] `npm test`, `npx eslint src`, dan `npx tsc --noEmit` bersih.

---

## 10. Rujukan cepat

| Apa | File |
|---|---|
| Token warna, utilitas, animasi intro | `src/app/globals.css` |
| Font brand | `src/app/fonts.ts` |
| Komponen & helper animasi | `src/components/landing/` |
| GSAP lazy | `src/lib/gsap.ts` |
| Contoh halaman penuh | `src/app/page.tsx`, `src/app/admin/login/` |
| Data konten landing | `src/components/landing/data.ts` |
