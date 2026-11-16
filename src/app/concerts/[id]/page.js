'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Share2,
  Users,
  Music,
  CreditCard
} from 'lucide-react';
import StatusBadge from '@/components/workspace/StatusBadge';
import { mockFestivals } from '@/services/mockData';

const ALL_CONCERTS = [
  {
    id: 'c1',
    slug: 'java-jazz-festival-2026',
    title: 'Java Jazz Festival 2026',
    artist: 'Guns N Roses',
    lineup: ['Guns N Roses', 'Musisi Jazz Nasional', 'Musisi Jazz Internasional'],
    genre: 'Jazz & Rock',
    date: '15–17 Mei 2026',
    venue: 'JIExpo Kemayoran',
    city: 'Jakarta',
    priceStart: 'Rp350.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner! Festival musik terbesar di Asia Tenggara ini akan memanjakan penonton dengan penampilan legendaris dan ratusan musisi papan atas.',
    schedule: [
      { time: '14.00 WIB', title: 'Open Gate & Food Carnival' },
      { time: '16.30 WIB', title: 'Jazz Lounge International Showcase' },
      { time: '19.30 WIB', title: 'National All-Star Big Band' },
      { time: '21.00 WIB', title: 'Main Stage: Guns N Roses Live Performance' }
    ],
    ticketTypes: [
      { id: 't1', name: 'Festival Standing (3 Days)', price: 350000, formattedPrice: 'Rp350.000', quota: 'Tersedia', benefits: ['Akses area festival 3 hari', 'Akses seluruh panggung outdoor', 'Area bazaar makanan & merchandise'] },
      { id: 't2', name: 'Tribune Seated', price: 650000, formattedPrice: 'Rp650.000', quota: 'Tersedia', benefits: ['Tempat duduk bernomor', 'Pemandangan panggung utama jelas', 'Jalur masuk khusus tribune'] },
      { id: 't3', name: 'VIP Priority Lounge', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Tinggal 50 tiket', benefits: ['Akses VIP lounge eksklusif', 'Gratis welcome drink & snack', 'Area tepat di depan panggung utama', 'Toilet khusus VIP'] }
    ]
  },
  {
    id: 'c2',
    slug: 'coldplay-music-of-the-spheres',
    title: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    lineup: ['Coldplay', 'Special Guest Star'],
    genre: 'Rock / Pop',
    date: '20 Juni 2026',
    venue: 'Gelora Bung Karno',
    city: 'Jakarta',
    priceStart: 'Rp850.000',
    status: 'HABIS TERJUAL',
    available: false,
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres! Pertunjukan penuh visual spektakuler, gelang xylobands bercahaya, lagu-lagu ikonik, dan pengalaman konser yang tak terlupakan di Gelora Bung Karno.',
    schedule: [
      { time: '15.00 WIB', title: 'Open Gate Stadium GBK' },
      { time: '18.30 WIB', title: 'Opening Act Guest Star' },
      { time: '20.00 WIB', title: 'Coldplay: Music of the Spheres Show' }
    ],
    ticketTypes: [
      { id: 't4', name: 'CAT 2 Standing', price: 850000, formattedPrice: 'Rp850.000', quota: 'Habis', benefits: ['Akses standing lapangan', 'Gelang Xyloband interaktif'] },
      { id: 't5', name: 'CAT 1 Tribune', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Habis', benefits: ['Tempat duduk bernomor', 'View langsung tengah panggung'] },
      { id: 't6', name: 'Ultimate VIP Experience', price: 2500000, formattedPrice: 'Rp2.500.000', quota: 'Habis', benefits: ['Early entry', 'Official merchandise kit', 'Akses lounge VIP'] }
    ]
  },
  {
    id: 'c3',
    slug: 'festival-musik-indonesia-2026',
    title: 'Festival Musik Indonesia 2026',
    artist: 'Backstreet Boys',
    lineup: ['Backstreet Boys', 'Penampil Lokal Populer', 'DJ International Set'],
    genre: 'Pop',
    date: '3–5 Juli 2026',
    venue: 'Lapangan Rampal',
    city: 'Malang',
    priceStart: 'Rp200.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    description: 'Festival Musik Indonesia 2026 menghadirkan Backstreet Boys sebagai bintang utama! Tiga hari penuh musik, panggung megah, dan penampil yang tak boleh dilewatkan di Lapangan Rampal.',
    schedule: [
      { time: '13.00 WIB', title: 'Pintu Gerbang Dibuka' },
      { time: '15.30 WIB', title: 'Penampil Band Indie Nusantara' },
      { time: '19.00 WIB', title: 'Backstreet Boys 90s Reunion Tour' },
      { time: '21.30 WIB', title: 'After Party DJ Performance' }
    ],
    ticketTypes: [
      { id: 't7', name: 'Early Bird Festival', price: 200000, formattedPrice: 'Rp200.000', quota: 'Tersedia', benefits: ['Akses 1 hari festival', 'Area umum & food bazaar'] },
      { id: 't8', name: '3-Day Pass Reguler', price: 350000, formattedPrice: 'Rp350.000', quota: 'Tersedia', benefits: ['Akses 3 hari berturut-turut', 'Bebas keluar masuk (wristband)'] },
      { id: 't9', name: 'VIP Front Row', price: 750000, formattedPrice: 'Rp750.000', quota: 'Tersedia', benefits: ['Area berdiri paling depan', 'Fast track entrance', 'Lanyard eksklusif'] }
    ]
  },
  {
    id: 'c4',
    slug: 'michael-learns-to-rock-reunion-tour',
    title: 'Michael Learns To Rock Reunion Tour',
    artist: 'Michael Learns To Rock',
    lineup: ['Michael Learns To Rock', 'Opening Guest Singer'],
    genre: 'Pop',
    date: '12 Agustus 2026',
    venue: 'Stadion Utama GBK',
    city: 'Jakarta',
    priceStart: 'Rp500.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/d/q/q/97fa78ed-62e1-4f35-ab15-ccd9ee3d2545.jpg?format=webp&width=1080&quality=75',
    description: "Legenda musik pop Michael Learns To Rock kembali tampil dalam Reunion Tour! Saksikan lagu-lagu hits era 90-an seperti That's Why You Go Away dan Paint My Love secara live.",
    schedule: [
      { time: '17.00 WIB', title: 'Pintu Masuk Dibuka' },
      { time: '19.00 WIB', title: 'Penampilan Pembuka' },
      { time: '20.00 WIB', title: 'MLTR Live in Concert' }
    ],
    ticketTypes: [
      { id: 't10', name: 'CAT 2 Tribune', price: 500000, formattedPrice: 'Rp500.000', quota: 'Tersedia', benefits: ['Tempat duduk bernomor', 'Buku program konser'] },
      { id: 't11', name: 'CAT 1 VIP Seating', price: 900000, formattedPrice: 'Rp900.000', quota: 'Tersedia', benefits: ['Tempat duduk baris tengah', 'Poster bertanda tangan'] },
      { id: 't12', name: 'VVIP Royal Box', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Tersedia', benefits: ['Kursi royal paling nyaman', 'Meet & Greet session', 'Official merchandise'] }
    ]
  },
  {
    id: 'c5',
    slug: 'hindia-the-tour-2026',
    title: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    lineup: ['Hindia', 'Blue Valley Radio Live'],
    genre: 'Indie',
    date: '28 Agustus 2026',
    venue: 'Balai Sarbini',
    city: 'Jakarta',
    priceStart: 'Rp400.000',
    status: 'TINGGAL 400',
    available: true,
    image: 'https://hindia.id/archive/hd2.jpg',
    description: 'Hindia membawa tur tunggalnya The Tour 2026! Malam penuh musik, lirik mendalam, dan energi khas Hindia yang menghipnotis penonton di Balai Sarbini.',
    schedule: [
      { time: '18.00 WIB', title: 'Open Gate & Merchandise Booth' },
      { time: '19.30 WIB', title: 'Hindia: The Tour 2026 Live Set' }
    ],
    ticketTypes: [
      { id: 't13', name: 'Festival Standing', price: 400000, formattedPrice: 'Rp400.000', quota: 'Tinggal 300 tiket', benefits: ['Area standing lantai utama', 'Akses merchandise khusus'] },
      { id: 't14', name: 'VIP Balcony Seated', price: 750000, formattedPrice: 'Rp750.000', quota: 'Tinggal 100 tiket', benefits: ['Tempat duduk balkon tengah', 'Poster fisik eksklusif tour'] }
    ]
  },
  {
    id: 'c6',
    slug: 'god-bless-rockin-the-nation',
    title: "God Bless: Rockin' the Nation",
    artist: 'God Bless',
    lineup: ['God Bless', 'Ahmad Albar', 'Ian Antono', 'Special Rockers'],
    genre: 'Rock',
    date: '5 September 2026',
    venue: 'Lapangan Gasibu',
    city: 'Bandung',
    priceStart: 'Rp150.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    description: "God Bless, legenda rock Indonesia, kembali menggelegar lewat konser Rockin' the Nation! Persembahan spesial untuk para penggemar setia rock n roll Tanah Air.",
    schedule: [
      { time: '16.00 WIB', title: 'Open Gate Lapangan Gasibu' },
      { time: '18.30 WIB', title: 'Tribute Rock Indonesia' },
      { time: '20.00 WIB', title: 'God Bless 50 Tahun Berkarya' }
    ],
    ticketTypes: [
      { id: 't15', name: 'Festival Area Gasibu', price: 150000, formattedPrice: 'Rp150.000', quota: 'Tersedia', benefits: ['Akses seluruh area lapangan', 'Akses stan kuliner'] },
      { id: 't16', name: 'VIP Tribune Panggung', price: 350000, formattedPrice: 'Rp350.000', quota: 'Tersedia', benefits: ['Tempat duduk tribun bertingkat', 'Kaos merchandise konser'] }
    ]
  },
  {
    id: 'hero-gnr',
    slug: 'guns-n-roses-java-jazz',
    title: 'Guns N Roses: Java Jazz Festival 2026',
    artist: 'Guns N Roses',
    lineup: ['Guns N Roses', 'Various International Artists'],
    genre: 'Jazz & Rock',
    date: '15–17 Mei 2026',
    venue: 'JIExpo Kemayoran',
    city: 'Jakarta',
    priceStart: 'Rp350.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner! Festival musik terbesar di Asia Tenggara ini akan memanjakan penonton dengan penampilan legendaris.',
    schedule: [
      { time: '14.00 WIB', title: 'Gates Open' },
      { time: '20.30 WIB', title: 'Guns N Roses On Stage' }
    ],
    ticketTypes: [
      { id: 'th1', name: 'Reguler Festival', price: 350000, formattedPrice: 'Rp350.000', quota: 'Tersedia', benefits: ['Akses area festival', 'Akses seluruh stage outdoor'] },
      { id: 'th2', name: 'VIP Gold Lounge', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Tersedia', benefits: ['Lounge khusus', 'Area depan panggung'] }
    ]
  },
  {
    id: 'hero-westlife',
    slug: 'westlife-with-love-tour',
    title: 'Westlife: With Love Tour',
    artist: 'Westlife',
    lineup: ['Westlife', 'Shane Filan', 'Mark Feehily', 'Kian Egan', 'Nicky Byrne'],
    genre: 'Pop',
    date: '22 September 2026',
    venue: 'Stadion Utama GBK',
    city: 'Jakarta',
    priceStart: 'Rp650.000',
    status: 'TERSEDIA',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/x/t/a/f868fd4b-afa3-4943-ac01-0f1900d6c2f3.jpg',
    description: 'Westlife kembali menyapa penggemar di Indonesia dengan lagu-lagu romantis sepanjang masa dalam kemegahan Stadion Utama GBK.',
    schedule: [
      { time: '16.00 WIB', title: 'Pintu Dibuka' },
      { time: '19.30 WIB', title: 'Westlife With Love Tour Live' }
    ],
    ticketTypes: [
      { id: 'th3', name: 'Tribune Silver', price: 650000, formattedPrice: 'Rp650.000', quota: 'Tersedia', benefits: ['Tempat duduk bernomor'] },
      { id: 'th4', name: 'Diamond VIP', price: 1750000, formattedPrice: 'Rp1.750.000', quota: 'Tersedia', benefits: ['Baris terdepan', 'Merchandise resmi'] }
    ]
  },
  {
    id: 'hero-oasis',
    slug: 'oasis-live-26-tour',
    title: "Oasis Live '26 Tour",
    artist: 'Oasis',
    lineup: ['Oasis', 'Liam Gallagher', 'Noel Gallagher'],
    genre: 'Rock',
    date: '10 Oktober 2026',
    venue: 'Istora Senayan',
    city: 'Jakarta',
    priceStart: 'Rp1.200.000',
    status: 'TINGGAL 250',
    available: true,
    image: 'https://dynamicmedia.livenationinternational.com/l/w/v/19637ec1-9fb2-454b-a744-28c7d1bf3d91.jpg?format=webp&width=1080&quality=75',
    description: 'Setelah 15 tahun penantian, Liam & Noel Gallagher kembali ke panggung dalam tur reuni dunia yang paling dinanti abad ini di Istora Senayan.',
    schedule: [
      { time: '17.00 WIB', title: 'Open Gate Istora' },
      { time: '20.00 WIB', title: "Oasis Live '26 Reunion" }
    ],
    ticketTypes: [
      { id: 'th5', name: 'Standing Festival', price: 1200000, formattedPrice: 'Rp1.200.000', quota: 'Tinggal 250 tiket', benefits: ['Area standing utama', 'Official lanyard tour'] },
      { id: 'th6', name: 'VIP Seating', price: 2500000, formattedPrice: 'Rp2.500.000', quota: 'Tinggal 50 tiket', benefits: ['Kursi bernomor terbaik', 'Akses lounge VIP'] }
    ]
  },
  {
    id: 'hero-taylor',
    slug: 'taylor-swift-the-eras-tour',
    title: 'Taylor Swift: The Eras Tour',
    artist: 'Taylor Swift',
    lineup: ['Taylor Swift', 'Special Opening Guest'],
    genre: 'Pop',
    date: '5 November 2026',
    venue: 'Stadion Madya',
    city: 'Jakarta',
    priceStart: 'Rp1.500.000',
    status: 'HABIS TERJUAL',
    available: false,
    image: 'https://dynamicmedia.livenationinternational.com/Media/b/m/i/5ca47483-ed3a-4916-88e6-8e9bc688a42a.jpg?format=webp&width=1080&quality=75',
    description: 'Perjalanan spektakuler melintasi seluruh era musik Taylor Swift dengan tata panggung raksasa, visual memukau, dan atmosfer tak terlupakan.',
    schedule: [
      { time: '15.00 WIB', title: 'Pintu Masuk Dibuka' },
      { time: '19.00 WIB', title: 'The Eras Tour Performance (3+ Jam)' }
    ],
    ticketTypes: [
      { id: 'th7', name: 'CAT 1 Festival', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Habis', benefits: ['Standing area', 'Gelang LED'] },
      { id: 'th8', name: 'VIP Floor Experience', price: 3500000, formattedPrice: 'Rp3.500.000', quota: 'Habis', benefits: ['VIP Package box', 'Early gate entrance'] }
    ]
  },
  {
    id: 'hero-coldplay',
    slug: 'coldplay-music-of-the-spheres-hero',
    title: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    lineup: ['Coldplay', 'Special Guest Star'],
    genre: 'Rock / Pop',
    date: '20 Juni 2026',
    venue: 'Gelora Bung Karno',
    city: 'Jakarta',
    priceStart: 'Rp850.000',
    status: 'HABIS TERJUAL',
    available: false,
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres! Pertunjukan penuh visual spektakuler, lagu-lagu ikonik, dan pengalaman konser yang tak terlupakan di Gelora Bung Karno.',
    schedule: [
      { time: '15.00 WIB', title: 'Open Gate' },
      { time: '20.00 WIB', title: 'Coldplay On Stage' }
    ],
    ticketTypes: [
      { id: 'th9', name: 'CAT 2', price: 850000, formattedPrice: 'Rp850.000', quota: 'Habis', benefits: ['Standing field'] },
      { id: 'th10', name: 'CAT 1 VIP', price: 1500000, formattedPrice: 'Rp1.500.000', quota: 'Habis', benefits: ['Tribune seats'] }
    ]
  }
];

export default function ConcertDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  // Match by id or slug
  const concert =
    ALL_CONCERTS.find(
      (c) => c.id === id || c.slug === id || c.id.toLowerCase() === id.toLowerCase()
    ) ||
    // Try matching mockFestivals
    mockFestivals.find((f) => f.id === id || f.slug === id) ||
    // Default fallback to first concert
    ALL_CONCERTS[0];

  const [activeTab, setActiveTab] = useState('tickets');
  const [quantities, setQuantities] = useState({});
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('ORD-8821');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const updateQuantity = (typeId, delta) => {
    const current = quantities[typeId] || 0;
    const next = Math.max(0, Math.min(5, current + delta));
    setQuantities((prev) => ({ ...prev, [typeId]: next }));
  };

  const totalTickets = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  const subtotal = concert.ticketTypes.reduce((acc, t) => {
    const qty = quantities[t.id] || 0;
    return acc + t.price * qty;
  }, 0);

  const handleProceedCheckout = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Silakan isi nama dan alamat email pemesan.');
      return;
    }
    setOrderId('ORD-' + String(Date.now()).slice(-4));
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-[#F4F5FA] font-sans selection:bg-[#7953E8] selection:text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1B1E2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/#jelajahi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors py-2 px-3 rounded-lg hover:bg-[#151824]"
          >
            <ArrowLeft className="w-4 h-4 text-[#A78BFA]" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2A2240] text-[#A78BFA] flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4" />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-[#F4F5FA]">Conser</span>
              <span className="text-lg font-bold text-[#A78BFA]">Id</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-[#151824] border border-[#1B1E2C] text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA]"
            >
              Monitoring Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Authentic Poster */}
      <section className="relative overflow-hidden bg-[#10121C] border-b border-[#1B1E2C]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${concert.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-[#0B0D14]/80 to-[#10121C]/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Poster Thumbnail */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#151824] border border-[#1B1E2C] shadow-2xl group">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${concert.image}')` }}
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={concert.status} />
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0B0D14]/80 backdrop-blur-sm border border-[#1B1E2C] text-[#F4F5FA]">
                  {concert.genre}
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2240] border border-[#362A54] text-[#A78BFA] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL TICKETING CONCERT</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5FA] tracking-tight leading-tight">
                {concert.title}
              </h1>

              <div className="text-base sm:text-lg text-[#A78BFA] font-semibold">
                {concert.artist}
              </div>

              <p className="text-sm text-[#A7AEC3] leading-relaxed max-w-2xl">
                {concert.description}
              </p>

              {/* Date & Location Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
                <div className="p-3 rounded-xl bg-[#151824] border border-[#1B1E2C] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2A2240] text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7F89A0]">Tanggal & Jadwal</div>
                    <div className="text-xs font-bold text-[#F4F5FA]">{concert.date}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#151824] border border-[#1B1E2C] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7F89A0]">Lokasi & Tempat</div>
                    <div className="text-xs font-bold text-[#F4F5FA]">{concert.venue}, {concert.city}</div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#7F89A0]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8DE2BD]" />
                  100% Tiket Resmi
                </span>
                <span>•</span>
                <span>Konfirmasi Instan</span>
                <span>•</span>
                <span>E-Ticket QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Order Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tab Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#151824] border border-[#1B1E2C] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('tickets')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'tickets'
                    ? 'bg-[#7953E8] text-white shadow-md'
                    : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                }`}
              >
                Pilihan Kategori Tiket
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-[#7953E8] text-white shadow-md'
                    : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                }`}
              >
                Lineup & Rundown
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-[#7953E8] text-white shadow-md'
                    : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                }`}
              >
                Ketentuan & FAQ
              </button>
            </div>

            {/* Tab 1: Kategori Tiket */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#F4F5FA]">Daftar Kategori Tiket</h2>
                    <p className="text-xs text-[#7F89A0]">Pilih jumlah tiket yang ingin Anda pesan (Maksimal 5 tiket)</p>
                  </div>
                  <span className="text-xs font-semibold text-[#8DE2BD] bg-[#193029] px-2.5 py-1 rounded-full border border-[#8DE2BD]/30">
                    Garansi Harga Resmi
                  </span>
                </div>

                <div className="space-y-3">
                  {concert.ticketTypes.map((ticket) => {
                    const qty = quantities[ticket.id] || 0;
                    const isTicketSoldOut = ticket.quota === 'Habis' || !concert.available;

                    return (
                      <div
                        key={ticket.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          qty > 0
                            ? 'bg-[#1E1933] border-[#7953E8]'
                            : 'bg-[#151824] border-[#1B1E2C] hover:border-[#2A2E40]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#F4F5FA]">{ticket.name}</h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isTicketSoldOut
                                    ? 'bg-[#36202C] text-[#FFA4B8]'
                                    : 'bg-[#193029] text-[#8DE2BD]'
                                }`}
                              >
                                {ticket.quota}
                              </span>
                            </div>
                            <div className="text-lg font-black text-[#A78BFA]">
                              {ticket.formattedPrice}
                            </div>
                            <div className="space-y-1 pt-1">
                              {ticket.benefits.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-[#A7AEC3]">
                                  <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Stepper Quantity */}
                          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                            {isTicketSoldOut ? (
                              <span className="text-xs font-bold text-[#FFA4B8] px-3 py-2 rounded-lg bg-[#36202C]">
                                Habis Terjual
                              </span>
                            ) : (
                              <div className="flex items-center gap-2 bg-[#10121C] border border-[#1B1E2C] p-1 rounded-xl">
                                <button
                                  onClick={() => updateQuantity(ticket.id, -1)}
                                  disabled={qty === 0}
                                  type="button"
                                  className="w-8 h-8 rounded-lg bg-[#151824] text-[#F4F5FA] hover:bg-[#2A2240] hover:text-[#A78BFA] flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-sm text-[#F4F5FA]">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => updateQuantity(ticket.id, 1)}
                                  disabled={totalTickets >= 5}
                                  type="button"
                                  className="w-8 h-8 rounded-lg bg-[#151824] text-[#F4F5FA] hover:bg-[#7953E8] hover:text-white flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Lineup & Rundown */}
            {activeTab === 'schedule' && (
              <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#F4F5FA] mb-3 flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#A78BFA]" />
                    <span>Daftar Bintang Tamu & Lineup</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concert.lineup.map((art, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#10121C] border border-[#1B1E2C] text-xs font-semibold text-[#F4F5FA]"
                      >
                        {art}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1B1E2C]">
                  <h3 className="text-base font-bold text-[#F4F5FA] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A78BFA]" />
                    <span>Rundown Jadwal Acara</span>
                  </h3>
                  <div className="space-y-3">
                    {concert.schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#10121C] border border-[#1B1E2C] flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-[#A78BFA]">{item.time}</span>
                        <span className="text-xs font-medium text-[#F4F5FA]">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Ketentuan & FAQ */}
            {activeTab === 'rules' && (
              <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-6 text-xs text-[#A7AEC3]">
                <div>
                  <h3 className="text-base font-bold text-[#F4F5FA] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8DE2BD]" />
                    <span>Ketentuan Masuk & Kebijakan Acara</span>
                  </h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>E-ticket resmi wajib ditunjukkan saat pemindaian di pintu masuk.</li>
                    <li>Satu tiket hanya berlaku untuk satu orang penonton.</li>
                    <li>Dilarang membawa senjata tajam, kembang api, atau benda berbahaya lainnya.</li>
                    <li>Dilarang membawa kamera profesional, drone, atau alat perekam komersial tanpa izin resmi panitia.</li>
                    <li>Penonton di bawah umur 12 tahun wajib didampingi orang tua atau wali.</li>
                    <li>Tiket yang telah dibeli tidak dapat ditukar atau diuangkan kembali kecuali konser dibatalkan oleh penyelenggara.</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#1B1E2C]">
                  <h3 className="text-base font-bold text-[#F4F5FA] mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#F1C875]" />
                    <span>Pertanyaan Umum (FAQ)</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#10121C] border border-[#1B1E2C]">
                      <div className="font-bold text-[#F4F5FA] mb-1">Kapan saya menerima e-ticket?</div>
                      <div>E-ticket langsung dikirimkan ke alamat email terdaftar setelah pembayaran Anda terverifikasi oleh sistem.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#10121C] border border-[#1B1E2C]">
                      <div className="font-bold text-[#F4F5FA] mb-1">Apakah bisa bayar via Transfer Bank / QRIS?</div>
                      <div>Ya, kami mendukung transfer bank manual, virtual account, dan QRIS instan.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="p-6 rounded-3xl bg-[#151824] border border-[#1B1E2C] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B1E2C]">
                <h3 className="text-base font-bold text-[#F4F5FA]">Ringkasan Pesanan</h3>
                <span className="text-xs text-[#A78BFA] font-medium">{totalTickets} Tiket Dipilih</span>
              </div>

              {/* Selected List */}
              <div className="space-y-2.5">
                {concert.ticketTypes.map((t) => {
                  const qty = quantities[t.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={t.id} className="flex items-center justify-between text-xs">
                      <span className="text-[#A7AEC3] truncate max-w-[170px]">{t.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F4F5FA]">x{qty}</span>
                        <span className="font-bold text-[#A78BFA]">
                          Rp{(t.price * qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {totalTickets === 0 && (
                  <div className="text-center py-6 text-xs text-[#7F89A0]">
                    Pilih kategori tiket di atas untuk memulai pemesanan.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1B1E2C] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#7F89A0]">
                  <span>Biaya Layanan</span>
                  <span className="text-[#8DE2BD]">Gratis</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#F4F5FA]">Total Pembayaran</span>
                  <span className="text-lg font-black text-[#F4F5FA]">
                    Rp{subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                disabled={totalTickets === 0 || !concert.available}
                type="button"
                className="w-full py-3.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white shadow-xl shadow-[#7953E8]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {concert.available ? 'Lanjutkan Pemesanan' : 'Tiket Telah Habis'}
              </button>

              <div className="text-center text-[11px] text-[#7F89A0]">
                Transaksi dilindungi enkripsi 256-bit aman
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Simulator Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5FA]">Konfirmasi Pemesanan Tiket</h3>
              <button
                onClick={() => { setCheckoutModalOpen(false); setOrderSuccess(false); }}
                className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#193029] border border-[#8DE2BD]/30 text-[#8DE2BD] flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F4F5FA]">Pemesanan Berhasil!</h4>
                  <p className="text-xs text-[#A7AEC3] mt-1">
                    Instruksi pembayaran dan rincian e-ticket telah dikirim ke <span className="text-[#8DE2BD]">{customerEmail}</span>.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#10121C] border border-[#1B1E2C] text-xs space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#7F89A0]">ID Pesanan:</span>
                    <span className="font-bold text-[#A78BFA]">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7F89A0]">Konser:</span>
                    <span className="font-bold text-[#F4F5FA]">{concert.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7F89A0]">Total Tagihan:</span>
                    <span className="font-bold text-[#F4F5FA]">Rp{subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setCheckoutModalOpen(false); setOrderSuccess(false); setQuantities({}); }}
                  className="w-full py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleProceedCheckout} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A7AEC3] mb-1">
                    Nama Pemesan Sesuai Identitas
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A7AEC3] mb-1">
                    Alamat Email (untuk pengiriman e-ticket)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#10121C] border border-[#1B1E2C] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7F89A0]">Jumlah Tiket:</span>
                    <span className="font-bold text-[#F4F5FA]">{totalTickets} tiket</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7F89A0]">Total Bayar:</span>
                    <span className="font-bold text-[#A78BFA]">Rp{subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white cursor-pointer"
                  >
                    Konfirmasi & Bayar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#10121C] text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA] cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
