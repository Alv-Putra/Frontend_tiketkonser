import type { Concert } from '@/types';

// Data konser contoh untuk test; service tidak lagi membawa data mock.
export const concertFixtures: Concert[] = [
  {
    id: 'c1',
    name: 'Java Jazz Festival 2026',
    artist: 'Various Artists',
    schedule: '15–17 Mei 2026',
    location: 'JIExpo Kemayoran, Jakarta',
    genre: 'Jazz',
    sold: 2350,
    quota: 3700,
    priceFrom: 'Rp850.000',
    salesOpen: true,
    organizer: 'Java Festival Production',
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner!',
    categories: [
      { id: 'cat1', name: 'VIP', price: 1500000, sold: 150, quota: 200, remaining: 50, status: 'Tersedia' },
      { id: 'cat2', name: 'Festival', price: 850000, sold: 1200, quota: 1500, remaining: 300, status: 'Tersedia' },
      { id: 'cat3', name: 'Tribune A', price: 650000, sold: 600, quota: 1000, remaining: 400, status: 'Tersedia' },
      { id: 'cat4', name: 'Tribune B', price: 450000, sold: 400, quota: 1000, remaining: 600, status: 'Tersedia' }
    ]
  },
  {
    id: 'c2',
    name: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    schedule: '20 Juni 2026',
    location: 'Gelora Bung Karno, Jakarta',
    genre: 'Rock',
    sold: 5000,
    quota: 5000,
    priceFrom: 'Rp1.250.000',
    salesOpen: false,
    organizer: 'PK Entertainment',
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres!',
    categories: [
      { id: 'cat5', name: 'VIP', price: 3500000, sold: 500, quota: 500, remaining: 0, status: 'Habis' },
      { id: 'cat6', name: 'Cat 1', price: 2200000, sold: 1500, quota: 1500, remaining: 0, status: 'Habis' },
      { id: 'cat7', name: 'Festival', price: 1250000, sold: 3000, quota: 3000, remaining: 0, status: 'Habis' }
    ]
  },
  {
    id: 'c3',
    name: 'Dewa 19 Reunion Tour',
    artist: 'Dewa 19',
    schedule: '12 Juli 2026',
    location: 'Stadion Madya, Jakarta',
    genre: 'Rock',
    sold: 1800,
    quota: 3000,
    priceFrom: 'Rp500.000',
    salesOpen: true,
    organizer: 'Redline Kreasindo',
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    description: 'Dewa 19 menggelar reuni akbar bersama seluruh vokalis legendaris di Stadion Madya.',
    categories: [
      { id: 'cat8', name: 'VIP', price: 1500000, sold: 350, quota: 500, remaining: 150, status: 'Tersedia' },
      { id: 'cat9', name: 'Reguler', price: 500000, sold: 1450, quota: 2500, remaining: 1050, status: 'Tersedia' }
    ]
  },
  {
    id: 'c4',
    name: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    schedule: '29 Agustus 2026',
    location: 'Balai Sarbini, Jakarta',
    genre: 'Indie',
    sold: 600,
    quota: 1000,
    priceFrom: 'Rp450.000',
    salesOpen: true,
    organizer: 'Sun Eater',
    image: 'https://hindia.id/archive/hd2.jpg',
    description: 'Hindia membawa tur tunggalnya The Tour 2026 di Balai Sarbini!',
    categories: [
      { id: 'cat10', name: 'General', price: 450000, sold: 600, quota: 1000, remaining: 400, status: 'Tersedia' }
    ]
  },
  {
    id: 'c5',
    name: 'God Bless: Rockin’ the Nation',
    artist: 'God Bless',
    schedule: '6 September 2026',
    location: 'Tennis Indoor Senayan, Jakarta',
    genre: 'Rock',
    sold: 700,
    quota: 1200,
    priceFrom: 'Rp500.000',
    salesOpen: true,
    organizer: 'Rock Nation',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    description: 'God Bless, legenda rock Indonesia, kembali menggelegar lewat konser Rockin’ the Nation!',
    categories: [
      { id: 'cat11', name: 'Tribun', price: 500000, sold: 700, quota: 1200, remaining: 500, status: 'Tersedia' }
    ]
  }
];
