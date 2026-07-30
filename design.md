# ConcertHub Design System

**Project:** ConcertHub
**Version:** 1.0

---

# Overview

ConcertHub adalah platform digital untuk menemukan informasi konser musik yang sedang berlangsung maupun yang akan datang.

Website berfungsi sebagai media informasi dan promosi, sedangkan seluruh proses pembelian tiket dilakukan melalui aplikasi mobile.

Website **tidak memiliki fitur Login maupun Register untuk pengguna umum**.

Ketika pengguna ingin membeli tiket, website akan mengarahkan pengguna untuk mengunduh aplikasi mobile agar dapat melakukan pembelian tiket, pembayaran, serta melihat e-ticket.

Selain Landing Page, website juga memiliki **Dashboard Admin** yang digunakan untuk mengelola seluruh data melalui sistem CRUD.

---

# Target Users

* Penggemar musik
* Pengunjung konser
* Festival Hunter
* Anak muda
* Event Organizer

---

# Design Philosophy

Website harus memberikan kesan:

* Premium
* Modern
* Elegant
* Dynamic
* Exclusive
* Clean
* Interactive

Inspirasi desain berasal dari website seperti:

* Ticketmaster
* Tomorrowland
* Coachella
* We The Fest

Website harus terlihat seperti produk startup modern, bukan template landing page biasa.

---

# Brand Identity

ConcertHub memiliki identitas visual yang terinspirasi dari suasana konser malam hari.

Nuansa yang ingin ditampilkan:

* Lampu panggung
* Neon Light
* Luxury
* Night Life
* Energetic
* Modern Technology

Pengguna harus langsung merasakan atmosfer konser ketika membuka website.

---

# Color System

Website menggunakan Dark Mode sebagai identitas utama.

## Primary Background

`#09090B`

Digunakan sebagai background utama.

---

## Secondary Background

`#18181B`

Digunakan pada section, sidebar, modal, dan card.

---

## Surface

`#27272A`

Digunakan pada hover state dan active state.

---

## Primary Accent (Red)

`#EF4444`

Digunakan untuk:

* CTA utama
* Badge Featured
* Highlight
* Status Sold Out
* Important Action

---

## Secondary Accent (Blue)

`#2563EB`

Digunakan untuk:

* Filter aktif
* Link
* Secondary Button
* Informasi
* Active Navigation

---

## Gradient

Gunakan gradient hanya pada elemen penting.

Contoh:

`#2563EB → #EF4444`

Gradient digunakan untuk:

* Hero
* CTA
* Banner
* Glow
* Decorative Elements

Jangan gunakan gradient pada seluruh website.

---

## Text

Primary

`#FFFFFF`

Secondary

`#A1A1AA`

Muted

`#71717A`

Border

`rgba(255,255,255,0.08)`

Success

`#22C55E`

Warning

`#F59E0B`

Error

`#EF4444`

---

# Color Usage Rules

* Hitam mendominasi sekitar **75%** tampilan.
* Merah sekitar **15%**.
* Biru sekitar **10%**.
* Merah dan biru hanya sebagai aksen.
* Hindari penggunaan warna selain tiga warna utama.
* Gunakan glow merah atau biru secara tipis agar menyerupai pencahayaan panggung konser.

---

# Typography

Font Family

**Inter**

Heading

Bold

Modern

Clean

Ukuran yang disarankan:

Hero

72–96px

Section Title

40–56px

Subtitle

20–24px

Body

16–18px

Caption

14px

Gunakan line-height yang lega.

---

# Layout

Container maksimal:

1280px

Padding:

Desktop

80px

Tablet

40px

Mobile

20px

Section memiliki jarak vertikal minimal:

96px

Gunakan whitespace yang luas.

Jangan memenuhi halaman dengan terlalu banyak elemen.

---

# Border Radius

Small

12px

Medium

18px

Large

24px

Full

999px

---

# Shadow

Gunakan shadow lembut.

Tambahkan glow tipis berwarna merah atau biru pada elemen penting.

Jangan menggunakan shadow hitam yang terlalu pekat.

---

# Navbar

Navbar harus:

* Sticky
* Transparan ketika berada di Hero
* Memiliki efek blur ketika discroll

Menu:

* Home
* Concert
* Artists
* FAQ
* Download App

Button Download App harus selalu terlihat.

---

# Landing Page Structure

1. Hero
2. Search & Filter
3. Featured Concert
4. Upcoming Concert
5. Popular Artists
6. Categories
7. Mobile App Preview
8. FAQ
9. Sponsor
10. Footer

---

# Hero Section

Hero merupakan fokus utama website.

Menggunakan gambar atau video konser berkualitas tinggi.

Hero harus fullscreen.

Isi Hero:

* Headline besar
* Deskripsi singkat
* Button Explore Concert
* Button Download App

Tambahkan overlay gelap agar teks mudah dibaca.

---

# Event Discovery

Website harus memudahkan pengguna menemukan konser dengan cepat.

Search dan Filter menjadi fitur utama setelah Hero.

Perubahan hasil filter harus terjadi secara realtime tanpa reload halaman.

---

# Search

Search dapat mencari berdasarkan:

* Nama konser
* Nama artis
* Nama venue

Search harus responsif.

---

# Filter

Filter yang tersedia:

* Kota / Daerah
* Genre Musik
* Tanggal Konser
* Rentang Harga
* Status Tiket

Contoh daerah:

* Jakarta
* Bandung
* Surabaya
* Yogyakarta
* Semarang
* Bali
* Medan
* Makassar

Filter dapat digunakan secara bersamaan.

Contoh:

Jakarta + Pop + Harga < Rp500.000

---

# Sorting

Sediakan fitur sorting.

Pilihan:

* Terbaru
* Terdekat
* Harga Termurah
* Harga Termahal
* Paling Populer

Sorting tidak boleh menghapus filter yang dipilih.

---

# Empty State

Jika tidak ada hasil pencarian:

Tampilkan ilustrasi.

Pesan:

> Tidak ada konser yang sesuai dengan pencarian.

Tampilkan tombol:

Reset Filter

---

# Featured Concert

Menampilkan konser populer.

Grid modern.

Poster besar.

Hover interaktif.

---

# Concert Card

Setiap card berisi:

* Poster
* Nama Event
* Nama Artis
* Tanggal
* Venue
* Harga Mulai
* Badge Status
* Button View Detail

Tidak ada tombol Checkout.

Hover:

* Card sedikit naik
* Poster zoom
* Shadow bertambah

---

# Event Detail

Halaman detail harus menampilkan:

* Banner
* Poster
* Deskripsi
* Line Up
* Venue
* Maps
* Jadwal
* Harga Tiket
* FAQ

CTA utama:

Download App

---

# Mobile App CTA

Semua tombol "Buy Ticket" harus diarahkan ke section ini.

Isi:

* Mockup aplikasi
* QR Code
* Google Play
* App Store

Keuntungan aplikasi:

* Beli tiket
* QR Check-in
* E-Ticket
* Riwayat Pembelian
* Notifikasi Event

---

# Footer

Footer berisi:

* Logo
* Navigation
* Social Media
* Copyright

---

# Components

Semua komponen wajib konsisten.

Button

* Rounded
* Smooth Transition
* Hover Effect

Card

* Rounded besar
* Padding lega
* Hover Lift

Input

* Rounded
* Focus Ring
* Error State

Badge

* Rounded penuh
* Warna sesuai status

Modal

* Blur Background
* Rounded

---

# Animation

Gunakan Framer Motion.

Durasi:

0.4–0.7 detik

Gunakan:

* Fade
* Slide
* Scale
* Blur Reveal

Hover:

* Scale 1.02
* Card Lift
* Glow
* Image Zoom

Animasi harus halus dan tidak berlebihan.

---

# Icons

Gunakan:

Lucide React

Ukuran icon harus konsisten.

---

# Responsive

Desktop First.

Pastikan:

* Tidak ada horizontal scrolling.
* Grid berubah menjadi single column di mobile.
* Semua komponen tetap nyaman digunakan pada berbagai ukuran layar.

---

# UX Rules

* Selalu tampilkan CTA yang jelas.
* Berikan feedback pada setiap hover.
* Gunakan Skeleton Loading.
* Gunakan Smooth Scrolling.
* Gunakan Toast Notification bila diperlukan.
* Hindari popup yang mengganggu.
* Pastikan pengalaman pengguna sederhana dan cepat.

---

# Admin Dashboard

Dashboard memiliki tema yang sama dengan Landing Page.

Menggunakan Dark Mode.

Sidebar modern.

Halaman Dashboard terdiri dari:

* Dashboard
* Concert
* Artists
* Venue
* Categories
* Tickets
* Banner
* FAQ
* Sponsor
* Settings

Semua halaman CRUD wajib memiliki:

* Search
* Filter
* Pagination
* Create
* Edit
* Delete
* Detail Preview
* Confirmation Dialog
* Toast Notification
* Loading Skeleton
* Empty State

---

# Things To Avoid

* Jangan menggunakan komponen Tailwind bawaan tanpa modifikasi.
* Jangan membuat Landing Page terasa seperti template.
* Jangan menggunakan warna yang terlalu ramai.
* Jangan menggunakan animasi berlebihan.
* Jangan memenuhi halaman dengan teks.
* Jangan menggunakan lebih dari satu jenis font.
* Jangan membuat tombol tanpa hover effect.
* Jangan mencampur berbagai style icon.
* Jangan membuat Dashboard terlihat seperti admin template generik.

---

# Final Goal

Landing Page harus mampu memberikan pengalaman visual yang premium, modern, dan elegan sehingga pengguna merasa antusias untuk menjelajahi konser dan mengunduh aplikasi mobile.

Dashboard Admin harus memiliki antarmuka yang profesional, cepat, konsisten, dan nyaman digunakan untuk mengelola seluruh data konser.

Setiap komponen, halaman, dan interaksi wajib mengikuti panduan dalam dokumen ini agar seluruh website memiliki identitas visual yang konsisten dan berkualitas tinggi.
