'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Ticket, Info } from 'lucide-react';
import Button from '@/components/ui/Button';

const slides = [
  {
    image:
      'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    name: 'Guns N Roses',
    date: '15 Agustus 2026',
    venue: 'Gelora Bung Karno',
    href: '/festivals',
  },
  {
    image:
      'https://dynamicmedia.livenationinternational.com/x/t/a/f868fd4b-afa3-4943-ac01-0f1900d6c2f3.jpg',
    name: 'Westlife',
    date: '22 September 2026',
    venue: 'Stadion Utama GBK',
    href: '/festivals',
  },
  {
    image:
      'https://dynamicmedia.livenationinternational.com/l/w/v/19637ec1-9fb2-454b-a744-28c7d1bf3d91.jpg?format=webp&width=1080&quality=75',
    name: 'Oasis',
    date: '10 Oktober 2026',
    venue: 'Istora Senayan',
    href: '/festivals',
  },
  {
    image:
      'https://dynamicmedia.livenationinternational.com/Media/b/m/i/5ca47483-ed3a-4916-88e6-8e9bc688a42a.jpg?format=webp&width=1080&quality=75',
    name: 'Taylor Swift',
    date: '5 November 2026',
    venue: 'Stadion Madya',
    href: '/festivals',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative min-h-[70vh] lg:min-h-screen flex items-end justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-[#0B0F19]/25 z-10" />

      {/* Carousel arrows */}
      <button
        onClick={prev}
        aria-label="Konser sebelumnya"
        className="absolute left-4 sm:left-6 top-1/2 z-30 p-2.5 rounded-full bg-[#0B0F19]/70 border border-slate-700 text-slate-200 backdrop-blur-md hover:bg-[#111827] hover:text-slate-50 transition-all duration-300 hidden md:flex cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Konser berikutnya"
        className="absolute right-4 sm:right-6 top-1/2 z-30 p-2.5 rounded-full bg-[#0B0F19]/70 border border-slate-700 text-slate-200 backdrop-blur-md hover:bg-[#111827] hover:text-slate-50 transition-all duration-300 hidden md:flex cursor-pointer"
      >
        <ChevronRight size={22} />
      </button>

      <div className="relative z-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {/* Featured badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Ticket size={14} />
              Konser Terpopuler
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl md:text-5xl font-extrabold text-slate-50 leading-tight mb-3"
            >
              {slide.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base text-slate-400 mb-7"
            >
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-violet-400" />
                {slide.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                {slide.venue}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() =>
                  document.getElementById('concerts')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Ticket size={18} />
                Beli Tiket Sekarang
              </Button>
              <Link href={slide.href} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  <Info size={18} />
                  Lihat Detail
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 z-20 flex items-center gap-2.5 left-1/2 -translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ke slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === current
                ? 'w-8 h-2 bg-violet-500'
                : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
