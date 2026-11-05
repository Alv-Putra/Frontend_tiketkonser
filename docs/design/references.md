# Log Referensi Desain Eksternal

Catatan referensi desain eksternal untuk project ConserId. Aturan pemakaian ada di `design.md` bagian 10.

Lokasi file: `docs/design/references.md`.

## Aturan singkat untuk agent

- Semua entri di tabel **Referensi terpilih** boleh dijadikan acuan implementasi.
- Ambil pola saja (layout, ritme, tipografi, gaya gerak).
- Jangan menyalin kode, aset, teks, logo, atau palet.
- Adaptasikan seluruh pola dengan identitas visual ConserId: putih, hitam, dan merah.
- Jangan menggunakan efek animasi yang mengorbankan performa dan aksesibilitas.

## Sumber galeri

| Sumber | Tautan |
|---|---|
| recent.design | https://recent.design/websites |
| Awwwards | https://www.awwwards.com |
| One Page Love | https://onepagelove.com |
| Land-book | https://land-book.com |
| Lookup.design | https://lookup.design |
| Godly | https://godly.website |
| Codrops | https://tympanus.net/codrops/category/articles/websites-roundups |

## Referensi terpilih

| Tanggal | Section | Sumber | URL | Pola yang diambil | Adaptasi ke ConserId | Tidak diambil | Status |
|---|---|---|---|---|---|---|---|
| 2026-11-06 | 1 | The Concept (Contra) | https://contra.com/p/RFNBWQ3U-the-concept-a-music-event-website | Landing page event, transisi animasi, alur scroll | Hero dan alur menuju pembelian tiket | Aset dan identitas asli | dipilih |
| 2026-11-06 | 1 | Animated Music Event Landing Page | https://contra.com/p/cU3eWR3Q-animated-music-event-landing-page | Transisi animasi dan visual tegas | Motion pada hero dan antar-section | Visual asli | dipilih |
| 2026-11-06 | 2, 5 | Festival Website Redesign | https://contra.com/p/ZUgYsM2g-festival-website-redesign | Hierarki informasi dan alur tiket | Halaman event dan checkout | Layout persis | dipilih |
| 2026-11-06 | 1, 5 | Parvati Gathering | https://contra.com/p/QEUPqFeO-parvati-gathering-multipage-framer-website-design-and-dev | Scroll animation dan struktur halaman tiket | Transisi section dan halaman tiket | Gaya psychedelic | dipilih |
| 2026-11-06 | 1, 2 | Eventbrite Festival Examples | https://www.eventbrite.com/blog/?p=17056 | Struktur website event dan festival | Homepage dan halaman event | Desain persis | dipilih |
| 2026-11-06 | 1, 2 | Ticket Tailor Festival Websites | https://www.tickettailor.com/blog/6-examples-of-festival-websites-that-work-brilliantly | Struktur informasi festival dan konversi | Homepage dan informasi tiket | Layout persis | dipilih |
| 2026-11-06 | 1 | OFFLIMITS Music Festival | https://www.cssdesignawards.com/sites/offlimits/47002/ | Fullscreen visual, motion eksperimental, pengalaman immersive | Hero fullscreen dan animasi pembuka | Aset, logo, dan identitas asli | dipilih |
| 2026-11-06 | 1, 3 | Lowlands Festival | https://lowlands.nl/ | Typography berani, identitas festival, komposisi artistik | Hero dan lineup artist | Identitas dan palet asli | dipilih |
| 2026-11-06 | 1, 3, 4 | Kelvin Music Festival | https://onepagelove.com/kelvin | GSAP, scroll effects, magazine-style layout | Animasi scroll, lineup, dan jadwal | Aset dan desain persis | dipilih |
| 2026-11-06 | 1, 3 | Pohoda Festival 2025 | https://www.pohodafestival.sk/en/news/visual-identity-of-pohoda-2025-a-timeless-design-by-studio-andrej-andrej-inspired-by-music-magazines | Bold typography, editorial layout, fotografi | Branding dan visual promosi | Identitas visual asli | dipilih |
| 2026-11-06 | 1, 3 | Piknik i Parken | https://awards.europeandesign.org/winner/262694 | Collage animation, layered imagery | Visual artist dan promosi event | Aset dan ilustrasi asli | dipilih |
| 2026-11-06 | 1, 2 | Godly | https://godly.website/ | Website modern, interaksi dan motion eksperimental | Referensi interaksi dan layout | Desain persis | dipilih |
| 2026-11-06 | 1, 2, 3 | Awwwards | https://www.awwwards.com/ | Interaksi, animasi, dan kualitas visual | Referensi motion dan pengalaman pengguna | Kode dan aset website | dipilih |
| 2026-11-06 | 1, 5 | One Page Love | https://onepagelove.com/ | Landing page, storytelling, alur konversi | Homepage dan alur pembelian tiket | Layout persis | dipilih |
| 2026-11-06 | 1, 2 | Land-book | https://land-book.com/ | Layout, hierarki visual, komposisi, typography | Layout dan konsistensi UI | Desain persis | dipilih |

## Teknologi animasi

- GSAP: scroll animation, timeline, dan transisi kompleks.
- Framer Motion: animasi komponen dan transisi UI React.
- Lenis: smooth scrolling.
- Three.js: visual 3D dan WebGL jika diperlukan.

Semua library di atas boleh dipakai. Gunakan animasi secara terukur. Prioritaskan performa, aksesibilitas, responsive design, dan pengalaman mobile.

## Ketentuan tambahan

Template berkode berbayar (misalnya NOX dari getly.store) hanya boleh digunakan apabila lisensinya jelas dan user menyetujuinya sesuai `design.md` bagian 10.3 poin 5.

Tema neon tidak digunakan karena tidak sesuai dengan identitas visual ConserId.