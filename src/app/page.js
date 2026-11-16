'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Ticket,
  ShieldCheck,
  ArrowRight,
  Search,
  ExternalLink,
  Play,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Calendar,
  Lock,
  Headphones,
  Flame,
  Sparkles,
  Clock
} from 'lucide-react';
import StatusBadge from '@/components/workspace/StatusBadge';

const HERO_SLIDES = [
  {
    id: 'hero-gnr',
    name: 'Guns N Roses',
    festivalTitle: 'Java Jazz Festival 2026',
    badge: 'KONSER TERPOPULER',
    badgeClass: 'bg-[#FFA4B8]/15 text-[#FFA4B8] border-[#FFA4B8]/30',
    date: '15–17 Mei 2026',
    venue: 'JIExpo Kemayoran, Jakarta',
    city: 'Jakarta',
    genre: 'Jazz & Rock',
    price: 'Rp350.000',
    quotaStatus: 'Tinggal 400 tiket',
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner! Festival musik terbesar di Asia Tenggara ini akan memanjakan penonton dengan penampilan legendaris dan ratusan musisi papan atas.',
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
  },
  {
    id: 'hero-westlife',
    name: 'Westlife',
    festivalTitle: 'Westlife: With Love Tour',
    badge: 'SPECIAL EVENT',
    badgeClass: 'bg-[#8DE2BD]/15 text-[#8DE2BD] border-[#8DE2BD]/30',
    date: '22 September 2026',
    venue: 'Stadion Utama GBK, Jakarta',
    city: 'Jakarta',
    genre: 'Pop',
    price: 'Rp650.000',
    quotaStatus: 'Tersedia',
    description: 'Westlife kembali menyapa penggemar di Indonesia dengan lagu-lagu romantis sepanjang masa dalam kemegahan Stadion Utama GBK.',
    image: 'https://dynamicmedia.livenationinternational.com/x/t/a/f868fd4b-afa3-4943-ac01-0f1900d6c2f3.jpg',
  },
  {
    id: 'hero-oasis',
    name: 'Oasis',
    festivalTitle: "Oasis Live '26 Tour",
    badge: 'PILIHAN MINGGU INI',
    badgeClass: 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30',
    date: '10 Oktober 2026',
    venue: 'Istora Senayan, Jakarta',
    city: 'Jakarta',
    genre: 'Rock',
    price: 'Rp1.200.000',
    quotaStatus: 'Tinggal 250 tiket',
    description: 'Setelah 15 tahun penantian, Liam & Noel Gallagher kembali ke panggung dalam tur reuni dunia yang paling dinanti abad ini di Istora Senayan.',
    image: 'https://dynamicmedia.livenationinternational.com/l/w/v/19637ec1-9fb2-454b-a744-28c7d1bf3d91.jpg?format=webp&width=1080&quality=75',
  },
  {
    id: 'hero-taylor',
    name: 'Taylor Swift',
    festivalTitle: 'Taylor Swift: The Eras Tour',
    badge: 'SOLD OUT FAST',
    badgeClass: 'bg-[#F1C875]/15 text-[#F1C875] border-[#F1C875]/30',
    date: '5 November 2026',
    venue: 'Stadion Madya, Jakarta',
    city: 'Jakarta',
    genre: 'Pop',
    price: 'Rp1.500.000',
    quotaStatus: 'Habis terjual',
    description: 'Perjalanan melintasi era musik dari salah satu artis terhebat generasi ini dengan tata panggung megah, visual memukau, dan atmosfer tak terlupakan.',
    image: 'https://dynamicmedia.livenationinternational.com/Media/b/m/i/5ca47483-ed3a-4916-88e6-8e9bc688a42a.jpg?format=webp&width=1080&quality=75',
  },
  {
    id: 'hero-coldplay',
    name: 'Coldplay',
    festivalTitle: 'Coldplay: Music of the Spheres',
    badge: 'HEADLINER GLOBAL',
    badgeClass: 'bg-[#8DE2BD]/15 text-[#8DE2BD] border-[#8DE2BD]/30',
    date: '20 Juni 2026',
    venue: 'Gelora Bung Karno, Jakarta',
    city: 'Jakarta',
    genre: 'Rock / Pop',
    price: 'Rp850.000',
    quotaStatus: 'Habis terjual',
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres! Pertunjukan penuh visual spektakuler, lagu-lagu ikonik, dan pengalaman konser yang tak terlupakan di Gelora Bung Karno.',
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
  }
];

const TRIPLE_SLIDES = [...HERO_SLIDES, ...HERO_SLIDES, ...HERO_SLIDES];

const CONCERTS_DATA = [
  {
    id: 'c1',
    status: 'TERSEDIA',
    date: '15–17 MEI 2026',
    title: 'Java Jazz Festival 2026',
    artist: 'Guns N Roses',
    lineup: 'Guns N Roses · Musisi Jazz Nasional & Internasional',
    location: 'JIExpo Kemayoran, Jakarta',
    city: 'Jakarta',
    genre: 'Jazz',
    price: 'Rp350.000',
    available: true,
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner! Festival musik terbesar di Asia Tenggara ini akan memanjakan penonton dengan penampilan legendaris dan ratusan musisi papan atas.',
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    ticketTypes: [
      { name: 'Festival Standing', price: 'Rp350.000', quota: 'Tersedia' },
      { name: 'Tribune Seated', price: 'Rp650.000', quota: 'Tersedia' },
      { name: 'VIP Lounge', price: 'Rp1.500.000', quota: 'Tinggal 50 tiket' }
    ]
  },
  {
    id: 'c2',
    status: 'HABIS TERJUAL',
    date: '20 JUNI 2026',
    title: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    lineup: 'Coldplay · Special Guest',
    location: 'Gelora Bung Karno, Jakarta',
    city: 'Jakarta',
    genre: 'Rock',
    price: 'Rp850.000',
    available: false,
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres! Pertunjukan penuh visual spektakuler, lagu-lagu ikonik, dan pengalaman konser yang tak terlupakan di Gelora Bung Karno.',
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    ticketTypes: [
      { name: 'CAT 2', price: 'Rp850.000', quota: 'Habis' },
      { name: 'CAT 1', price: 'Rp1.500.000', quota: 'Habis' },
      { name: 'Ultimate VIP', price: 'Rp2.500.000', quota: 'Habis' }
    ]
  },
  {
    id: 'c3',
    status: 'TERSEDIA',
    date: '3–5 JULI 2026',
    title: 'Festival Musik Indonesia 2026',
    artist: 'Backstreet Boys',
    lineup: 'Backstreet Boys · Penampil Lokal · DJ Performance',
    location: 'Lapangan Rampal, Malang',
    city: 'Malang',
    genre: 'Pop',
    price: 'Rp200.000',
    available: true,
    description: 'Festival Musik Indonesia 2026 menghadirkan Backstreet Boys sebagai bintang utama! Tiga hari penuh musik, panggung megah, dan penampil yang tak boleh dilewatkan di Lapangan Rampal.',
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    ticketTypes: [
      { name: 'Early Bird', price: 'Rp200.000', quota: 'Tersedia' },
      { name: 'Reguler Festival', price: 'Rp350.000', quota: 'Tersedia' },
      { name: 'VIP Front Row', price: 'Rp750.000', quota: 'Tersedia' }
    ]
  },
  {
    id: 'c4',
    status: 'TERSEDIA',
    date: '12 AGUSTUS 2026',
    title: 'Michael Learns To Rock Reunion Tour',
    artist: 'Michael Learns To Rock',
    lineup: 'Michael Learns To Rock · Opening Act',
    location: 'Stadion Utama GBK, Jakarta',
    city: 'Jakarta',
    genre: 'Pop',
    price: 'Rp500.000',
    available: true,
    description: "Legenda musik pop Michael Learns To Rock kembali tampil dalam Reunion Tour! Saksikan lagu-lagu hits era 90-an seperti That's Why You Go Away dan Paint My Love secara live.",
    image: 'https://dynamicmedia.livenationinternational.com/d/q/q/97fa78ed-62e1-4f35-ab15-ccd9ee3d2545.jpg?format=webp&width=1080&quality=75',
    ticketTypes: [
      { name: 'CAT 2', price: 'Rp500.000', quota: 'Tersedia' },
      { name: 'CAT 1', price: 'Rp900.000', quota: 'Tersedia' },
      { name: 'VIP', price: 'Rp1.500.000', quota: 'Tersedia' }
    ]
  },
  {
    id: 'c5',
    status: 'TINGGAL 400',
    date: '28 AGUSTUS 2026',
    title: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    lineup: 'Hindia · Special Guest',
    location: 'Balai Sarbini, Jakarta',
    city: 'Jakarta',
    genre: 'Indie',
    price: 'Rp400.000',
    available: true,
    description: 'Hindia membawa tur tunggalnya The Tour 2026! Malam penuh musik, lirik mendalam, dan energi khas Hindia yang menghipnotis penonton di Balai Sarbini.',
    image: 'https://hindia.id/archive/hd2.jpg',
    ticketTypes: [
      { name: 'Festival Standing', price: 'Rp400.000', quota: 'Tersedia' },
      { name: 'VIP Front Row', price: 'Rp750.000', quota: 'Tinggal 100 tiket' }
    ]
  },
  {
    id: 'c6',
    status: 'TERSEDIA',
    date: '5 SEPTEMBER 2026',
    title: "God Bless: Rockin' the Nation",
    artist: 'God Bless',
    lineup: 'God Bless · Ahmad Albar · Ian Antono',
    location: 'Lapangan Gasibu, Bandung',
    city: 'Bandung',
    genre: 'Rock',
    price: 'Rp150.000',
    available: true,
    description: "God Bless, legenda rock Indonesia, kembali menggelegar lewat konser Rockin' the Nation! Persembahan spesial untuk para penggemar setia rock n roll Tanah Air.",
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    ticketTypes: [
      { name: 'Festival Area', price: 'Rp150.000', quota: 'Tersedia' },
      { name: 'VIP Tribune', price: 'Rp350.000', quota: 'Tersedia' }
    ]
  }
];

const CURATOR_VIDEOS = [
  {
    id: 'vid-1',
    artist: 'God Bless',
    title: "God Bless • Rockin' the Nation (Live Session)",
    sub: 'God Bless · Live performance di Bandung',
    tag: 'Rock',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    description: 'God Bless, legenda rock Indonesia, membawakan hits legendaris dengan tata panggung megah dan energi konser luar biasa.'
  },
  {
    id: 'vid-2',
    artist: 'Coldplay',
    title: 'Coldplay • Music of the Spheres (Live in Jakarta)',
    sub: 'Coldplay · Live show at GBK',
    tag: 'Pop Rock',
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    description: 'Cuplikan visual spektakuler xylobands bercahaya dan lautan penonton di Stadion Gelora Bung Karno.'
  },
  {
    id: 'vid-3',
    artist: 'Guns N Roses',
    title: 'Guns N Roses • Headliner Java Jazz Festival',
    sub: 'Guns N Roses · Main Stage',
    tag: 'Jazz & Rock',
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: 'Penampilan legendaris Guns N Roses yang mengguncang panggung festival internasional di JIExpo Kemayoran.'
  },
  {
    id: 'vid-4',
    artist: 'Hindia',
    title: 'Hindia • The Tour 2026 (Live di Balai Sarbini)',
    sub: 'Hindia · Live intimate session',
    tag: 'Indie',
    image: 'https://hindia.id/archive/hd2.jpg',
    description: 'Momen magis ribuan penonton menyanyikan Secukupnya dan Evaluasi bersama Hindia dalam suasana intim.'
  },
  {
    id: 'vid-5',
    artist: 'Backstreet Boys',
    title: 'Backstreet Boys • Festival Musik Indonesia',
    sub: 'Backstreet Boys · Live in Malang',
    tag: 'Pop',
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    description: 'Kembalinya boyband kelas dunia dengan lagu-lagu legendaris I Want It That Way secara langsung.'
  }
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedConcertDetail, setSelectedConcertDetail] = useState(null);
  const [activeCuratorIndex, setActiveCuratorIndex] = useState(0);

  // Hero carousel state with gestures & infinite smooth slide
  const [activeSlideIndex, setActiveSlideIndex] = useState(HERO_SLIDES.length); // Start at middle set (index 5)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1280);
  const heroContainerRef = useRef(null);
  const dragStartXRef = useRef(0);
  const touchStartXRef = useRef(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua kota');
  const [selectedGenre, setSelectedGenre] = useState('Semua');
  const [activeGenreTab, setActiveGenreTab] = useState('Semua');

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Ticket Lookup state
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  // Modal ticket order selection state
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderPlacedMessage, setOrderPlacedMessage] = useState(null);

  // Real slide index for dots and badges (0..4)
  const currentRealIndex =
    ((activeSlideIndex % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;

  const nextHeroSlide = useCallback(() => {
    setIsTransitioning(true);
    setActiveSlideIndex((prev) => prev + 1);
  }, []);

  const prevHeroSlide = useCallback(() => {
    setIsTransitioning(true);
    setActiveSlideIndex((prev) => prev - 1);
  }, []);

  const goToSlide = useCallback((realIdx) => {
    setIsTransitioning(true);
    const currentReal =
      ((activeSlideIndex % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
    const delta = realIdx - currentReal;
    setActiveSlideIndex((prev) => prev + delta);
  }, [activeSlideIndex]);

  // Handle transition end for seamless infinite loop
  const handleTrackTransitionEnd = useCallback(() => {
    if (activeSlideIndex >= HERO_SLIDES.length * 2) {
      setIsTransitioning(false);
      setActiveSlideIndex(activeSlideIndex - HERO_SLIDES.length);
    } else if (activeSlideIndex < HERO_SLIDES.length) {
      setIsTransitioning(false);
      setActiveSlideIndex(activeSlideIndex + HERO_SLIDES.length);
    }
  }, [activeSlideIndex]);

  // Re-enable transitioning on next frame after teleporting
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Container width measurement for responsive peek calculations
  useEffect(() => {
    const updateWidth = () => {
      if (heroContainerRef.current) {
        setContainerWidth(heroContainerRef.current.offsetWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Autoplay hero carousel
  useEffect(() => {
    if (isHeroPaused || isDragging) return;
    const interval = setInterval(nextHeroSlide, 5000);
    return () => clearInterval(interval);
  }, [isHeroPaused, isDragging, nextHeroSlide]);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setIsHeroPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragOffset < -45) {
      nextHeroSlide();
    } else if (dragOffset > 45) {
      prevHeroSlide();
    }
    setDragOffset(0);
    setIsHeroPaused(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setIsHeroPaused(true);
    dragStartXRef.current = e.clientX;
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      nextHeroSlide();
    } else if (dragOffset > 50) {
      prevHeroSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
    setIsHeroPaused(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsHeroPaused(false);
  };

  const filteredConcerts = CONCERTS_DATA.filter((c) => {
    const matchQuery =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lineup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCity = selectedCity === 'Semua kota' || c.city === selectedCity;

    const currentGenre = activeGenreTab !== 'Semua' ? activeGenreTab : selectedGenre;
    const matchGenre = currentGenre === 'Semua' || c.genre.toLowerCase().includes(currentGenre.toLowerCase());

    return matchQuery && matchCity && matchGenre;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Masukkan alamat email yang valid.');
      return;
    }
    setSubscribed(true);
    setEmailInput('');
  };

  const handleTicketLookup = (e) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;
    setLookupResult({
      code: lookupCode.toUpperCase(),
      concert: 'Java Jazz Festival 2026',
      holder: 'Budi Santoso',
      category: 'Festival Standing (Gate A)',
      status: 'Aktif / Siap Pakai'
    });
  };

  const currentHero = HERO_SLIDES[currentRealIndex];
  const activeCurator = CURATOR_VIDEOS[activeCuratorIndex];

  const isMobile = containerWidth < 640;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const slideWidth = isMobile
    ? Math.round(containerWidth * 0.9)
    : isTablet
    ? Math.round(containerWidth * 0.86)
    : Math.min(Math.round(containerWidth * 0.84), 1180);
  const slideGap = isMobile ? 12 : isTablet ? 16 : 20;

  const centerOffset = (containerWidth - slideWidth) / 2;
  const trackOffset = centerOffset - activeSlideIndex * (slideWidth + slideGap) + dragOffset;

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[#0B0D14] text-[#F4F5FA] flex flex-col font-sans selection:bg-[#7953E8] selection:text-white"
    >
      {/* ========================================================
          1. SECTION: Navigasi
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1B1E2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#2A2240] border border-[#362A54] flex items-center justify-center text-[#A78BFA] group-hover:border-[#7953E8] transition-colors">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold tracking-tight text-[#F4F5FA]">Conser</span>
              <span className="text-xl font-bold text-[#A78BFA]">Id</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-[#A78BFA] transition-colors">
              Beranda
            </Link>
            <a href="#jelajahi" className="text-sm text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors">
              Jelajahi konser
            </a>
            <button
              onClick={() => setTicketModalOpen(true)}
              type="button"
              suppressHydrationWarning
              className="text-sm text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors"
            >
              Tiket saya
            </button>
            <button
              onClick={() => setHelpModalOpen(true)}
              type="button"
              suppressHydrationWarning
              className="text-sm text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors"
            >
              Pusat bantuan
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              type="button"
              suppressHydrationWarning
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#2A2E40] text-xs font-semibold text-[#F4F5FA] transition-colors"
            >
              <span>Akses Monitoring</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A78BFA]" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            suppressHydrationWarning
            className="md:hidden p-2 rounded-lg bg-[#151824] border border-[#1B1E2C] text-[#A7AEC3]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1B1E2C] bg-[#10121C] px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#A78BFA] py-1"
            >
              Beranda
            </Link>
            <a
              href="#jelajahi"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#A7AEC3] py-1"
            >
              Jelajahi konser
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTicketModalOpen(true);
              }}
              type="button"
              suppressHydrationWarning
              className="block text-sm text-[#A7AEC3] py-1 text-left w-full"
            >
              Tiket saya
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              type="button"
              suppressHydrationWarning
              className="block text-sm text-[#A7AEC3] py-1 text-left w-full"
            >
              Pusat bantuan
            </button>
            <div className="pt-2 border-t border-[#1B1E2C] flex gap-2">
              <Link
                href="/admin"
                className="flex-1 py-2 text-center rounded-lg bg-[#151824] border border-[#1B1E2C] text-xs font-semibold text-[#F4F5FA]"
              >
                Admin
              </Link>
              <Link
                href="/organizer"
                className="flex-1 py-2 text-center rounded-lg bg-[#7953E8] text-xs font-semibold text-white"
              >
                Organizer
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. SECTION: Hero Banner Carousel (Full Width with Side Peeks & Sliding)
          ======================================================== */}
      <section
        ref={heroContainerRef}
        suppressHydrationWarning
        className="relative overflow-hidden pt-4 sm:pt-6 pb-8 sm:pb-12 border-b border-[#1B1E2C] select-none"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ambient Dynamic Glow from Active Slide */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7953E8]/15 blur-[140px] rounded-full pointer-events-none transition-all duration-700"
        />

        {/* Carousel Track Viewport */}
        <div
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Circular Navigation Buttons on Hero Edges (Consistent with screenshot) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevHeroSlide();
            }}
            type="button"
            suppressHydrationWarning
            aria-label="Konser sebelumnya"
            className="absolute left-2 sm:left-4 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/60"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextHeroSlide();
            }}
            type="button"
            suppressHydrationWarning
            aria-label="Konser berikutnya"
            className="absolute right-2 sm:right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/60"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>

          {/* Sliding Track with GPU acceleration */}
          <div
            className="flex items-center will-change-transform"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transition: isTransitioning && !isDragging ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {TRIPLE_SLIDES.map((slide, idx) => {
              const isCenter = idx === activeSlideIndex;
              return (
                <div
                  key={`${slide.id}-${idx}`}
                  style={{
                    width: `${slideWidth}px`,
                    marginRight: `${slideGap}px`
                  }}
                  className={`shrink-0 h-[210px] sm:h-[290px] md:h-[360px] lg:h-[410px] xl:h-[430px] rounded-2xl sm:rounded-3xl md:rounded-[24px] overflow-hidden relative transition-all duration-500 cursor-pointer ${
                    isCenter
                      ? 'opacity-100 scale-100 shadow-2xl shadow-black/80 ring-1 ring-white/10'
                      : 'opacity-50 hover:opacity-75 scale-[0.98]'
                  }`}
                  onClick={() => {
                    if (Math.abs(dragOffset) < 5) {
                      if (!isCenter) {
                        const delta = idx - activeSlideIndex;
                        setActiveSlideIndex((prev) => prev + delta);
                        setIsTransitioning(true);
                      } else {
                        setSelectedConcertDetail(
                          CONCERTS_DATA.find((c) => c.id === slide.id) || CONCERTS_DATA[0]
                        );
                      }
                    }
                  }}
                >
                  {/* Poster Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url('${slide.image}')` }}
                  />

                  {/* High Contrast Cinematic Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/95 via-[#0B0D14]/75 to-transparent/30 sm:via-[#0B0D14]/65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14]/90 via-transparent to-black/30" />

                  {/* Banner Content */}
                  <div className="relative z-10 h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                    {/* Top Row: Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider border ${slide.badgeClass} pt-sans-bold`}>
                        {slide.badge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-[#A7AEC3] bg-[#0B0D14]/70 border border-[#1B1E2C] backdrop-blur-sm pt-sans-regular">
                        {slide.genre}
                      </span>
                      <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-[#8DE2BD] bg-[#193029]/80 border border-[#8DE2BD]/30 pt-sans-regular">
                        {slide.quotaStatus}
                      </span>
                    </div>

                    {/* Middle Row: Artist & Festival Title */}
                    <div className="my-auto py-1 sm:py-2">
                      <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] pt-sans-bold drop-shadow-md">
                        {slide.name}
                      </h2>
                      <div className="text-xs sm:text-base md:text-lg font-semibold text-[#A78BFA] mt-1 pt-sans-regular">
                        {slide.festivalTitle}
                      </div>

                      <p className="hidden md:block text-xs sm:text-sm text-[#A7AEC3] mt-2 max-w-xl line-clamp-2 leading-relaxed pt-sans-regular">
                        {slide.description}
                      </p>

                      {/* Date & Venue meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#F4F5FA] mt-2 sm:mt-3 pt-sans-regular">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{slide.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{slide.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Price & Action Button */}
                    <div className="flex items-center justify-between gap-3 pt-2 sm:pt-3 border-t border-white/10">
                      <div>
                        <div className="text-[10px] sm:text-xs text-[#7F89A0] uppercase font-semibold pt-sans-regular">
                          Mulai dari
                        </div>
                        <div className="text-sm sm:text-lg md:text-xl font-bold text-[#F4F5FA] pt-sans-bold">
                          {slide.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConcertDetail(
                              CONCERTS_DATA.find((c) => c.id === slide.id) || CONCERTS_DATA[0]
                            );
                          }}
                          type="button"
                          suppressHydrationWarning
                          className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#7953E8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer pt-sans-bold"
                        >
                          <span>Lihat Detail</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centered Pagination Indicator Dots (Just like in screenshot) */}
        <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              type="button"
              suppressHydrationWarning
              aria-label={`Slide ke ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentRealIndex
                  ? 'w-6 h-2 bg-[#7953E8]'
                  : 'w-2 h-2 bg-[#2A2E40] hover:bg-[#7F89A0]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          3. SECTION: Kepercayaan (4 Trust Pillars)
          ======================================================== */}
      <section className="bg-[#10121C] border-b border-[#1B1E2C] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#1B1E2C]">
            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:px-4 first:pl-0">
              <div className="w-10 h-10 rounded-xl bg-[#151824] border border-[#2A2E40] text-[#A78BFA] flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F4F5FA] tracking-wider uppercase">TIKET RESMI</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Langsung dari penyelenggara</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#151824] border border-[#2A2E40] text-[#8DE2BD] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F4F5FA] tracking-wider uppercase">TRANSAKSI AMAN</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Pembayaran terlindungi</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#151824] border border-[#2A2E40] text-[#A78BFA] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F4F5FA] tracking-wider uppercase">AKSES MUDAH</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Tiket langsung di genggaman</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#151824] border border-[#2A2E40] text-[#F1C875] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F4F5FA] tracking-wider uppercase">SELALU ADA</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Bantuan untuk setiap momen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION: Jelajahi konser (Data & Gambar Real)
          ======================================================== */}
      <section id="jelajahi" className="py-20 border-b border-[#1B1E2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider">
              FIND YOUR NEXT MOMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5FA]">
              Panggung berikutnya menunggumu.
            </h2>
            <p className="text-sm text-[#A7AEC3] max-w-xl">
              Cari jadwal konser dan festival musik impianmu. Dapatkan tiket resmi tanpa rasa khawatir.
            </p>
          </div>

          {/* Search, Filter, & City Selector */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#7F89A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  suppressHydrationWarning
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artis, nama festival, atau lokasi..."
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  suppressHydrationWarning
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                >
                  <option value="Semua kota">Semua kota</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Malang">Malang</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedGenre}
                  suppressHydrationWarning
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                >
                  <option value="Semua">Semua genre</option>
                  <option value="Rock">Rock</option>
                  <option value="Pop">Pop</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Indie">Indie</option>
                </select>
              </div>
            </div>

            {/* Genre Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
              {['Semua', 'Rock', 'Pop', 'Jazz', 'Indie'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenreTab(genre)}
                  type="button"
                  suppressHydrationWarning
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeGenreTab === genre
                      ? 'bg-[#7953E8] text-white'
                      : 'bg-[#10121C] hover:bg-[#1B1E2C] text-[#A7AEC3] border border-[#1B1E2C]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Concerts Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-[#A7AEC3]">
                Menampilkan <span className="text-[#F4F5FA] font-bold">{filteredConcerts.length}</span> konser tersedia
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcerts.map((concert) => (
                <div
                  key={concert.id}
                  className="rounded-2xl bg-[#151824] border border-[#1B1E2C] hover:border-[#7953E8]/50 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-[#7953E8]/10"
                >
                  <div>
                    {/* Poster Image */}
                    <Link href={`/concerts/${concert.id}`} className="block relative aspect-[16/10] overflow-hidden bg-[#10121C]">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${concert.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151824] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3">
                        <StatusBadge status={concert.status} />
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0B0D14]/80 backdrop-blur-sm border border-[#1B1E2C] text-[#F4F5FA]">
                        {concert.genre}
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-[#A78BFA] bg-[#0B0D14]/80 px-2.5 py-1 rounded-md border border-[#1B1E2C]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{concert.date}</span>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <Link href={`/concerts/${concert.id}`} className="block">
                        <h3 className="text-base font-bold text-[#F4F5FA] group-hover:text-[#A78BFA] transition-colors line-clamp-1">
                          {concert.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#A78BFA] font-medium line-clamp-1">
                        {concert.lineup}
                      </p>
                      <p className="text-xs text-[#A7AEC3] line-clamp-2 leading-relaxed pt-1">
                        {concert.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-[#7F89A0] pt-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#7953E8]" />
                        <span className="truncate">{concert.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-5 pt-4 border-t border-[#1B1E2C] flex items-center justify-between bg-[#151824]/90">
                    <div>
                      <div className="text-[10px] text-[#7F89A0] uppercase font-medium">Mulai dari</div>
                      <div className="text-sm font-bold text-[#F4F5FA]">{concert.price}</div>
                    </div>
                    <Link
                      href={`/concerts/${concert.id}`}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        concert.available
                          ? 'bg-[#2A2240] hover:bg-[#7953E8] text-[#A78BFA] hover:text-white'
                          : 'bg-[#1B1E2C] text-[#7F89A0] cursor-not-allowed'
                      }`}
                    >
                      {concert.available ? 'Lihat Detail & Pesan' : 'Habis'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION: Pilihan kurator (Live Video Clips)
          ======================================================== */}
      <section id="kurator" className="py-20 border-b border-[#1B1E2C] bg-[#10121C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider">
              DI BALIK PANGGUNG
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5FA] mt-1">
              Putar dulu. Rasakan nanti.
            </h2>
            <p className="text-sm text-[#A7AEC3] mt-2">
              Cuplikan penampilan dari artis yang sedang tampil di panggung musik Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Featured Video Banner */}
            <div className="lg:col-span-7 rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-end min-h-[340px] group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url('${activeCurator.image}')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151824] via-[#151824]/70 to-transparent" />

              <div className="relative z-10 space-y-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#7953E8] text-white uppercase tracking-wider">
                  LIVE SESSION · {activeCurator.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5FA]">
                  {activeCurator.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A7AEC3] max-w-lg">
                  {activeCurator.description}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A2240] hover:bg-[#7953E8] text-[#A78BFA] hover:text-white border border-[#362A54] text-xs font-semibold transition-all cursor-pointer shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Tonton cuplikan live ↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Playlist / Clip Cards */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              {CURATOR_VIDEOS.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveCuratorIndex(idx);
                    if (window.innerWidth < 1024) {
                      setVideoModalOpen(true);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                    idx === activeCuratorIndex
                      ? 'bg-[#1E1933] border-[#7953E8]'
                      : 'bg-[#151824] hover:bg-[#1B1E2C] border-[#1B1E2C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-[#2A2E40] relative overflow-hidden"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#F4F5FA] group-hover:text-[#A78BFA] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#A7AEC3] truncate">{item.sub}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#7F89A0] px-2 py-0.5 rounded bg-[#10121C] shrink-0 ml-2">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION: Tiket terbatas (Last Call Banner)
          ======================================================== */}
      <section className="py-16 border-b border-[#1B1E2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151824] border border-[#332B1B] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
              style={{
                backgroundImage: `url('https://hindia.id/archive/hd2.jpg')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#151824] via-[#151824]/90 to-transparent" />

            <div className="relative z-10 space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold bg-[#332B1B] text-[#F1C875] border border-[#F1C875]/20 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-[#F1C875]" />
                <span>LAST CALL FOR TICKETS</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5FA]">
                Jangan sampai cuma lihat dari story teman.
              </h3>
              <p className="text-xs sm:text-sm text-[#A7AEC3]">
                Hindia: The Tour 2026 · 28 Agustus 2026 · Balai Sarbini, Jakarta
              </p>
              <div className="text-xs font-semibold text-[#F1C875] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Hanya tersisa 400 tiket untuk pertunjukan ini!</span>
              </div>
            </div>

            <Link
              href="/concerts/c5"
              className="relative z-10 px-6 py-3.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-xl shadow-[#7953E8]/25 transition-all self-start md:self-auto shrink-0 cursor-pointer"
            >
              Amankan tiketmu
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SECTION: Cara memesan
          ======================================================== */}
      <section className="py-20 border-b border-[#1B1E2C] bg-[#10121C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#F4F5FA]">Momen besar, langkah simpel.</h2>
            <p className="text-xs text-[#A7AEC3] mt-2">Dapatkan tiket konser impianmu dalam tiga langkah mudah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-3">
              <span className="text-3xl font-black text-[#A78BFA]">01</span>
              <h3 className="text-base font-bold text-[#F4F5FA]">Temukan konsermu</h3>
              <p className="text-xs text-[#A7AEC3] leading-relaxed">
                Cari artis, kota, atau genre favoritmu di katalog kurasi festival dan konser kami.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-3">
              <span className="text-3xl font-black text-[#A78BFA]">02</span>
              <h3 className="text-base font-bold text-[#F4F5FA]">Pilih tiket, bayar aman</h3>
              <p className="text-xs text-[#A7AEC3] leading-relaxed">
                Tentukan kelas tiket dan selesaikan pembayaran melalui metode terverifikasi dengan konfirmasi instan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-3">
              <span className="text-3xl font-black text-[#8DE2BD]">03</span>
              <h3 className="text-base font-bold text-[#F4F5FA]">Datang dan bernyanyi</h3>
              <p className="text-xs text-[#A7AEC3] leading-relaxed">
                Simpan e-ticket di ponselmu, masuk lewat pemindaian resmi di pintu gerbang, dan nikmati pertunjukannya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SECTION: Newsletter
          ======================================================== */}
      <section className="py-20 border-b border-[#1B1E2C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider">
            JANGAN KETINGGALAN PRESALE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5FA]">
            Jadi yang pertama tahu.
          </h2>
          <p className="text-xs sm:text-sm text-[#A7AEC3] max-w-lg mx-auto">
            Info konser dan akses presale, langsung ke inbox kamu.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-[#193029] border border-[#8DE2BD]/30 text-xs text-[#8DE2BD] font-semibold">
              Terima kasih! Kamu telah terdaftar untuk kabar konser dan presale terbaru.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                suppressHydrationWarning
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Masukkan alamat email"
                className="flex-1 bg-[#151824] border border-[#1B1E2C] rounded-xl px-4 py-3 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="px-6 py-3 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white shadow-lg shadow-[#7953E8]/25 transition-all cursor-pointer"
              >
                Langganan
              </button>
            </form>
          )}

          <div className="text-[11px] text-[#7F89A0]">
            Dengan mendaftar, kamu menyetujui kebijakan privasi kami.
          </div>
        </div>
      </section>

      {/* ========================================================
          9. SECTION: Footer
          ======================================================== */}
      <footer className="bg-[#10121C] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2A2240] text-[#A78BFA] flex items-center justify-center font-bold">
                  <Ticket className="w-4 h-4" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-[#F4F5FA]">Conser</span>
                  <span className="text-lg font-bold text-[#A78BFA]">Id</span>
                </div>
              </div>
              <p className="text-xs text-[#A7AEC3] leading-relaxed">
                Lebih dekat dengan musik yang kamu cintai.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-[#F4F5FA] mb-3">Jelajahi</div>
              <ul className="space-y-2 text-xs text-[#A7AEC3]">
                <li><a href="#jelajahi" className="hover:text-[#F4F5FA]">Semua konser</a></li>
                <li><a href="#kurator" className="hover:text-[#F4F5FA]">Festival musik</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-[#F4F5FA] mb-3">Tentang</div>
              <ul className="space-y-2 text-xs text-[#A7AEC3]">
                <li><span className="text-[#A7AEC3]">Tentang ConserId</span></li>
                <li><Link href="/organizer" className="hover:text-[#A78BFA]">Untuk organizer</Link></li>
                <li><Link href="/admin" className="hover:text-[#A78BFA]">Dashboard admin</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-[#F4F5FA] mb-3">Bantuan</div>
              <ul className="space-y-2 text-xs text-[#A7AEC3]">
                <li><button onClick={() => setHelpModalOpen(true)} suppressHydrationWarning className="hover:text-[#F4F5FA]">Pusat bantuan</button></li>
                <li><span className="text-[#7F89A0]">support@conserid.com</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1B1E2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F89A0]">
            <div>© 2026 ConserId. Semua hak dilindungi.</div>
            <div className="flex items-center gap-4">
              <span>Kebijakan privasi</span>
              <span>•</span>
              <span>Syarat & ketentuan</span>
              <span>•</span>
              <span>Indonesia</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODALS FOR USER INTERACTION
          ======================================================== */}
      {/* 1. Ticket Lookup Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5FA]">Cari Tiket Saya</h3>
              <button onClick={() => setTicketModalOpen(false)} suppressHydrationWarning className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#A7AEC3]">
              Masukkan kode pesanan tiket (contoh: ORD-001) untuk memeriksa status e-ticket.
            </p>
            <form onSubmit={handleTicketLookup} className="space-y-3">
              <input
                type="text"
                required
                suppressHydrationWarning
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Kode Pesanan (mis. ORD-001)"
                className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="w-full py-2.5 rounded-lg bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white cursor-pointer"
              >
                Cek Tiket
              </button>
            </form>

            {lookupResult && (
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7F89A0]">Konser:</span>
                  <span className="font-bold text-[#F4F5FA]">{lookupResult.concert}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7F89A0]">Pemegang:</span>
                  <span className="text-[#F4F5FA]">{lookupResult.holder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7F89A0]">Kategori:</span>
                  <span className="text-[#A78BFA]">{lookupResult.category}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#2A2E40]">
                  <span className="text-[#7F89A0]">Status:</span>
                  <span className="text-[#8DE2BD] font-semibold">{lookupResult.status}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5FA]">Pusat Bantuan ConserId</h3>
              <button onClick={() => setHelpModalOpen(false)} suppressHydrationWarning className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#A7AEC3]">
              <div className="p-3 rounded-xl bg-[#1B1E2C]">
                <div className="font-bold text-[#F4F5FA] mb-1">Bagaimana cara menerima e-ticket?</div>
                <div>E-ticket diterbitkan secara otomatis setelah verifikasi pembayaran berhasil.</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1B1E2C]">
                <div className="font-bold text-[#F4F5FA] mb-1">Apakah tiket bisa dipindahtangankan?</div>
                <div>Tiket resmi dapat diverifikasi lewat pemindaian kode QR di pintu masuk.</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1B1E2C]">
                <div className="font-bold text-[#F4F5FA] mb-1">Butuh bantuan darurat saat konser?</div>
                <div>Hubungi support@conserid.com atau hubungi staf di lokasi pintu masuk.</div>
              </div>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              suppressHydrationWarning
              className="w-full py-2 rounded-lg bg-[#2A2240] text-xs font-semibold text-[#A78BFA] cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* 3. Auth Quick Role Selector Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5FA]">Akses Portal & Monitoring</h3>
              <button onClick={() => setAuthModalOpen(false)} suppressHydrationWarning className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#A7AEC3]">
              Pilih workspace yang ingin Anda pantau:
            </p>
            <div className="space-y-2.5">
              <Link
                href="/admin"
                onClick={() => setAuthModalOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#1B1E2C] hover:bg-[#2A2240] border border-[#2A2E40] transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-[#F4F5FA] group-hover:text-[#A78BFA]">Admin Workspace</div>
                  <div className="text-[11px] text-[#A7AEC3]">Monitoring seluruh konser, pesanan, dan verifikasi</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
              </Link>

              <Link
                href="/organizer"
                onClick={() => setAuthModalOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#1B1E2C] hover:bg-[#2A2240] border border-[#2A2E40] transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-[#F4F5FA] group-hover:text-[#A78BFA]">Organizer Workspace</div>
                  <div className="text-[11px] text-[#A7AEC3]">Monitoring performa kuota dan tiket konser sendiri</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Session Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F5FA]">Cuplikan Live Performance</h3>
              <button onClick={() => setVideoModalOpen(false)} className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-64 rounded-xl bg-[#0B0D14] border border-[#2A2E40] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url('${activeCurator.image}')` }}
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-[#7953E8] text-white flex items-center justify-center shadow-xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div className="relative z-10 text-sm font-semibold text-[#F4F5FA]">{activeCurator.title}</div>
              <p className="relative z-10 text-xs text-[#A7AEC3] max-w-md">{activeCurator.description}</p>
            </div>
            <button
              onClick={() => setVideoModalOpen(false)}
              suppressHydrationWarning
              className="w-full py-2.5 rounded-lg bg-[#7953E8] text-xs font-semibold text-white cursor-pointer"
            >
              Selesai Menonton
            </button>
          </div>
        </div>
      )}

      {/* 5. Concert Detail & Ticket Order Modal */}
      {selectedConcertDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#A78BFA] px-2.5 py-1 rounded bg-[#2A2240] border border-[#362A54]">
                {selectedConcertDetail.date}
              </span>
              <button onClick={() => { setSelectedConcertDetail(null); setOrderPlacedMessage(null); }} suppressHydrationWarning className="text-[#7F89A0] hover:text-[#F4F5FA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Thumbnail */}
            {selectedConcertDetail.image && (
              <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-[#10121C]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${selectedConcertDetail.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151824] to-transparent" />
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-[#F4F5FA]">{selectedConcertDetail.title}</h3>
              <div className="text-xs text-[#A78BFA] font-medium mt-0.5">{selectedConcertDetail.lineup}</div>
              <div className="text-xs text-[#A7AEC3] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7953E8]" />
                <span>{selectedConcertDetail.location}</span>
              </div>
            </div>

            <p className="text-xs text-[#A7AEC3] leading-relaxed bg-[#10121C] p-3 rounded-xl border border-[#1B1E2C]">
              {selectedConcertDetail.description}
            </p>

            {/* Category selection */}
            {selectedConcertDetail.ticketTypes && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#F4F5FA]">Pilih Kategori Tiket:</div>
                <div className="grid grid-cols-1 gap-2">
                  {selectedConcertDetail.ticketTypes.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategoryIndex(idx)}
                      type="button"
                      suppressHydrationWarning
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                        selectedCategoryIndex === idx
                          ? 'border-[#7953E8] bg-[#2A2240] text-white'
                          : 'border-[#1B1E2C] bg-[#10121C] text-[#A7AEC3] hover:border-[#2A2E40]'
                      }`}
                    >
                      <div className="font-semibold">{cat.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#A78BFA]">{cat.price}</span>
                        <span className="text-[10px] text-[#7F89A0]">({cat.quota})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Quantity & Total */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#10121C] border border-[#1B1E2C] text-xs">
              <span className="text-[#A7AEC3]">Jumlah Tiket:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  suppressHydrationWarning
                  className="w-7 h-7 rounded-lg bg-[#151824] border border-[#2A2E40] text-[#F4F5FA] flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sm text-[#F4F5FA]">{orderQuantity}</span>
                <button
                  onClick={() => setOrderQuantity(Math.min(5, orderQuantity + 1))}
                  suppressHydrationWarning
                  className="w-7 h-7 rounded-lg bg-[#151824] border border-[#2A2E40] text-[#F4F5FA] flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {orderPlacedMessage ? (
              <div className="p-3.5 rounded-xl bg-[#193029] border border-[#8DE2BD]/30 text-xs text-[#8DE2BD] font-semibold text-center">
                {orderPlacedMessage}
              </div>
            ) : null}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  const catName = selectedConcertDetail.ticketTypes
                    ? selectedConcertDetail.ticketTypes[selectedCategoryIndex]?.name
                    : 'Reguler';
                  setOrderPlacedMessage(`Pesanan ${orderQuantity}x tiket (${catName}) berhasil dibuat! Menunggu instruksi pembayaran.`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white text-center cursor-pointer shadow-lg shadow-[#7953E8]/20 transition-all"
              >
                Pesan Sekarang ({orderQuantity} Tiket)
              </button>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => { setSelectedConcertDetail(null); setOrderPlacedMessage(null); }}
                className="px-4 py-2.5 rounded-xl bg-[#1B1E2C] text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
