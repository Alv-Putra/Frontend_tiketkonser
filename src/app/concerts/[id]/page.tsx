'use client';

import { useState, useEffect, use } from 'react';
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
  CreditCard,
  Smartphone,
  QrCode,
  Lock,
  Download
} from 'lucide-react';
import StatusBadge from '@/components/workspace/StatusBadge';
import { mockFestivals } from '@/services/mockData';
import festivalService from '@/services/festivalService';

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

export default function ConcertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [liveConcert, setLiveConcert] = useState(null);

  // Fetch real festival/concert from backend if available
  useEffect(() => {
    let mounted = true;
    if (id) {
      festivalService
        .getFestivalById(id, { useApi: true })
        .then((data) => {
          if (mounted && data) {
            setLiveConcert(data);
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  // Match by id or slug
  const matchedConcert =
    ALL_CONCERTS.find(
      (c) => c.id === id || c.slug === id || c.id.toLowerCase() === id.toLowerCase()
    ) ||
    // Try matching mockFestivals
    mockFestivals.find((f) => f.id === id || f.slug === id) ||
    // Default fallback to first concert
    ALL_CONCERTS[0];

  // Normalized concert data with safe fallbacks for benefits, lineup, schedule, and ticketTypes
  const concert = {
    ...matchedConcert,
    ...(liveConcert || {}),
    title: liveConcert?.title || matchedConcert?.title || 'Festival Konser',
    artist: liveConcert?.artist || matchedConcert?.artist || 'Various Artists',
    genre: liveConcert?.genre || matchedConcert?.genre || 'Musik',
    date: liveConcert?.date
      ? (typeof liveConcert.date === 'string' && liveConcert.date.includes('T')
          ? new Date(liveConcert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : liveConcert.date)
      : (matchedConcert?.date || 'Segera Diumumkan'),
    venue: liveConcert?.venue || matchedConcert?.venue || 'Venue',
    city: liveConcert?.city || matchedConcert?.city || 'Indonesia',
    image: liveConcert?.image || matchedConcert?.image || 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: liveConcert?.description || matchedConcert?.description || '',
    status: liveConcert?.status || matchedConcert?.status || 'TERSEDIA',
    available: liveConcert?.ticketStatus !== 'sold_out' && ((matchedConcert as { available?: boolean })?.available !== false),
    lineup: Array.isArray(liveConcert?.lineup)
      ? liveConcert.lineup
      : Array.isArray(matchedConcert?.lineup)
      ? matchedConcert.lineup
      : [liveConcert?.artist || matchedConcert?.artist || matchedConcert?.title || 'Bintang Tamu Spesial'],
    schedule: Array.isArray(matchedConcert?.schedule) && matchedConcert.schedule.length > 0
      ? matchedConcert.schedule.map((s) => ({
          time: typeof s.time === 'string' && s.time.includes('T')
            ? new Date(s.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            : (s.time || '18.00 WIB'),
          title: s.title || 'Live Performance',
        }))
      : [
          { time: '14.00 WIB', title: 'Open Gate & Pintu Masuk' },
          { time: '18.00 WIB', title: 'Pertunjukan Pembuka' },
          { time: '20.00 WIB', title: 'Panggung Utama' },
        ],
    ticketTypes: ((liveConcert?.ticketTypes || matchedConcert?.ticketTypes) || []).map((t, idx) => {
      const sold = Number(t.sold || 0);
      const quota = Number(t.quota || 0);
      const isSoldOut = t.quota === 'Habis' || t.status === 'sold_out' || (quota > 0 && sold >= quota);
      const remaining = quota > 0 ? Math.max(0, quota - sold) : null;
      return {
        ...t,
        id: String(t.id || `ticket-${idx}`),
        name: t.name || 'General Admission',
        price: Number(t.price || 0),
        formattedPrice: t.formattedPrice || `Rp${Number(t.price || 0).toLocaleString('id-ID')}`,
        quota: isSoldOut
          ? 'Habis'
          : (typeof t.quota === 'string' ? t.quota : (remaining !== null ? `Tersisa ${remaining} tiket` : 'Tersedia')),
        benefits: Array.isArray(t.benefits) && t.benefits.length > 0
          ? t.benefits
          : ['Akses area festival resmi', 'Konfirmasi instan & e-ticket QR Code', 'Pajak dan biaya masuk termasuk'],
      };
    }),
  };

  const [activeTab, setActiveTab] = useState('tickets');
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans selection:bg-[#FF4D00] selection:text-[#09090B] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/#event"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors py-2 px-3 rounded-lg hover:bg-[#141417]"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF7A00]" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4" />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-[#FFFFFF]">Conser</span>
              <span className="text-lg font-bold text-[#FF7A00]">Id</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-[#141417] border border-[#27272A] text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF]"
            >
              Monitoring Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Authentic Poster */}
      <section className="relative overflow-hidden bg-[#0F0F12] border-b border-[#27272A]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${concert.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-[#0F0F12]/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Poster Thumbnail */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#141417] border border-[#27272A] shadow-2xl group">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${concert.image}')` }}
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={concert.status} />
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#09090B]/80 backdrop-blur-sm border border-[#27272A] text-[#FFFFFF]">
                  {concert.genre}
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A1000] border border-[#4A1D00] text-[#FF7A00] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL TICKETING CONCERT</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
                {concert.title}
              </h1>

              <div className="text-base sm:text-lg text-[#FF7A00] font-semibold">
                {concert.artist}
              </div>

              <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                {concert.description}
              </p>

              {/* Date & Location Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
                <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#71717A]">Tanggal & Jadwal</div>
                    <div className="text-xs font-bold text-[#FFFFFF]">{concert.date}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#71717A]">Lokasi & Tempat</div>
                    <div className="text-xs font-bold text-[#FFFFFF]">{concert.venue}, {concert.city}</div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#71717A]">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile-Only Booking Notice Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1F0D00] via-[#141417] to-[#0F0F12] border border-[#FF4D00]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/20 border border-[#FF4D00]/40 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
                <span>Pemesanan Tiket Tersedia di Aplikasi Mobile</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#FF4D00] text-[#09090B]">
                  Mobile App
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed">
                Halaman web ConserId khusus untuk eksplorasi katalog konser dan informasi ketersediaan tiket. Pemesanan dan verifikasi tiket dilakukan melalui aplikasi mobile ConserId demi keamanan Dynamic QR Code.
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileModalOpen(true)}
            type="button"
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B] flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-[#FF4D00]/20 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Cara Pesan di Mobile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tab Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#141417] border border-[#27272A] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('tickets')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'tickets'
                    ? 'bg-[#FF4D00] text-[#09090B] shadow-md'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]'
                }`}
              >
                Pilihan Kategori Tiket
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-[#FF4D00] text-[#09090B] shadow-md'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]'
                }`}
              >
                Lineup & Rundown
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                type="button"
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-[#FF4D00] text-[#09090B] shadow-md'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]'
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
                    <h2 className="text-lg font-bold text-[#FFFFFF]">Daftar Kategori Tiket</h2>
                    <p className="text-xs text-[#71717A]">
                      Status ketersediaan tiket resmi konser ini (Pemesanan dilakukan via aplikasi mobile)
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#8DE2BD] bg-[#193029] px-2.5 py-1 rounded-full border border-[#8DE2BD]/30">
                    Garansi Harga Resmi
                  </span>
                </div>

                <div className="space-y-3">
                  {(concert.ticketTypes || []).map((ticket) => {
                    const isTicketSoldOut = ticket.quota === 'Habis' || !concert.available;

                    return (
                      <div
                        key={ticket.id}
                        className="p-5 rounded-2xl border transition-all bg-[#141417] border-[#27272A] hover:border-[#3F3F46]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#FFFFFF]">{ticket.name}</h3>
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
                            <div className="text-lg font-black text-[#FF7A00]">
                              {ticket.formattedPrice}
                            </div>
                            <div className="space-y-1 pt-1">
                              {(ticket.benefits || []).map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                                  <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                            {isTicketSoldOut ? (
                              <span className="text-xs font-bold text-[#FFA4B8] px-3.5 py-2 rounded-xl bg-[#36202C]">
                                Habis Terjual
                              </span>
                            ) : (
                              <button
                                onClick={() => setMobileModalOpen(true)}
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A1000] hover:bg-[#4A1D00] border border-[#4A1D00] text-xs font-semibold text-[#FF7A00] hover:text-white transition-all cursor-pointer"
                              >
                                <Smartphone className="w-4 h-4" />
                                <span>Pesan di Mobile</span>
                              </button>
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
              <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272A] space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#FF7A00]" />
                    <span>Daftar Bintang Tamu & Lineup</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(concert.lineup || []).map((art, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#0F0F12] border border-[#27272A] text-xs font-semibold text-[#FFFFFF]"
                      >
                        {art}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#27272A]">
                  <h3 className="text-base font-bold text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF7A00]" />
                    <span>Rundown Jadwal Acara</span>
                  </h3>
                  <div className="space-y-3">
                    {(concert.schedule || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0F0F12] border border-[#27272A] flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-[#FF7A00]">{item.time}</span>
                        <span className="text-xs font-medium text-[#FFFFFF]">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Ketentuan & FAQ */}
            {activeTab === 'rules' && (
              <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272A] space-y-6 text-xs text-[#A1A1AA]">
                <div>
                  <h3 className="text-base font-bold text-[#FFFFFF] mb-3 flex items-center gap-2">
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

                <div className="pt-4 border-t border-[#27272A]">
                  <h3 className="text-base font-bold text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#F1C875]" />
                    <span>Pertanyaan Umum (FAQ)</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#0F0F12] border border-[#27272A]">
                      <div className="font-bold text-[#FFFFFF] mb-1">Kapan saya menerima e-ticket?</div>
                      <div>E-ticket langsung dikirimkan ke alamat email terdaftar setelah pembayaran Anda terverifikasi oleh sistem.</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#0F0F12] border border-[#27272A]">
                      <div className="font-bold text-[#FFFFFF] mb-1">Apakah bisa bayar via Transfer Bank / QRIS?</div>
                      <div>Ya, kami mendukung transfer bank manual, virtual account, dan QRIS instan.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Mobile Booking Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="p-6 rounded-3xl bg-[#141417] border border-[#27272A] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#FFFFFF]">Pemesanan Tiket</h3>
                </div>
                <span className="text-[11px] text-[#FF7A00] bg-[#2A1000] px-2.5 py-0.5 rounded-full font-semibold border border-[#4A1D00]">
                  Mobile Only
                </span>
              </div>

              {/* Price Preview */}
              <div className="p-4 rounded-2xl bg-[#0F0F12] border border-[#27272A] space-y-1.5">
                <div className="text-[11px] text-[#71717A]">Harga Tiket Resmi</div>
                <div className="text-xl font-black text-[#FFFFFF]">
                  {concert.priceStart || (concert.ticketTypes && concert.ticketTypes[0]?.formattedPrice) || 'Tersedia'}
                </div>
                <div className="text-[11px] text-[#8DE2BD] flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Garansi tiket resmi terverifikasi</span>
                </div>
              </div>

              {/* Ticket Categories List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#A1A1AA]">Kategori Tiket:</div>
                <div className="space-y-1.5">
                  {(concert.ticketTypes || []).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F0F12] border border-[#27272A] text-xs"
                    >
                      <span className="text-[#FFFFFF] font-medium truncate max-w-[170px]">{t.name}</span>
                      <span className="font-bold text-[#FF7A00] shrink-0">{t.formattedPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Order Steps */}
              <div className="pt-3 border-t border-[#27272A] space-y-2.5">
                <div className="text-xs font-bold text-[#FFFFFF]">Cara Memesan di Mobile:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-[#A1A1AA]">
                      Buka aplikasi <strong className="text-[#FFFFFF]">ConserId</strong> di smartphone Anda.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-[#A1A1AA]">
                      Cari festival <strong className="text-[#FFFFFF]">{concert.title}</strong> dan pilih kategori tiket.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-[#A1A1AA]">
                      Selesaikan pembayaran, e-ticket dengan QR Code instan langsung aktif di aplikasi.
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setMobileModalOpen(true)}
                type="button"
                className="w-full py-3.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B] shadow-xl shadow-[#FF4D00]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pesan Melalui Aplikasi Mobile</span>
              </button>

              <div className="text-center text-[11px] text-[#71717A] flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-[#8DE2BD]" />
                <span>Dynamic QR Code resmi anti-calo & pemalsuan</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile App Download & Booking Modal */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141417] border border-[#27272A] p-6 space-y-5 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#FFFFFF]">Pemesanan Tiket di Mobile</h3>
                  <p className="text-[11px] text-[#71717A]">Aplikasi resmi ConserId</p>
                </div>
              </div>
              <button
                onClick={() => setMobileModalOpen(false)}
                className="text-[#71717A] hover:text-[#FFFFFF] p-1 rounded-lg hover:bg-[#0F0F12] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QR Code Frame */}
            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-[#27272A] flex flex-col items-center justify-center space-y-3">
              <div className="w-40 h-40 rounded-xl bg-white p-3 flex flex-col items-center justify-center shadow-inner relative">
                <div className="w-full h-full border-4 border-dashed border-[#09090B] rounded-lg flex flex-col items-center justify-center p-2 text-center">
                  <QrCode className="w-20 h-20 text-[#09090B]" />
                  <span className="text-[9px] font-bold text-[#09090B] mt-1 tracking-tight">SCAN VIA SMARTPHONE</span>
                </div>
              </div>
              <div className="text-xs text-[#A1A1AA] max-w-xs leading-relaxed">
                Arahkan kamera smartphone Anda ke QR code di atas untuk membuka pemesanan tiket <strong>{concert.title}</strong> di aplikasi mobile ConserId.
              </div>
            </div>

            {/* Platform Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#0F0F12] border border-[#27272A] text-left">
                <div className="text-[10px] text-[#71717A]">Tersedia di</div>
                <div className="text-xs font-bold text-[#FFFFFF] mt-0.5">Google Play Store</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0F0F12] border border-[#27272A] text-left">
                <div className="text-[10px] text-[#71717A]">Tersedia di</div>
                <div className="text-xs font-bold text-[#FFFFFF] mt-0.5">Apple App Store</div>
              </div>
            </div>

            <button
              onClick={() => setMobileModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
