'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const slides = [
  {
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    name: 'Guns N Roses',
    date: '15 Agustus 2026',
    venue: 'Gelora Bung Karno',
  },
  {
    image: 'https://dynamicmedia.livenationinternational.com/x/t/a/f868fd4b-afa3-4943-ac01-0f1900d6c2f3.jpg',
    name: 'Westlife',
    date: '22 September 2026',
    venue: 'Stadion Utama GBK',
  },
  {
    image: 'https://dynamicmedia.livenationinternational.com/l/w/v/19637ec1-9fb2-454b-a744-28c7d1bf3d91.jpg?format=webp&width=1080&quality=75',
    name: 'Oasis',
    date: '10 Oktober 2026',
    venue: 'Istora Senayan',
  },
  {
    image: 'https://dynamicmedia.livenationinternational.com/Media/b/m/i/5ca47483-ed3a-4916-88e6-8e9bc688a42a.jpg?format=webp&width=1080&quality=75',
    name: 'Taylor Swift',
    date: '5 November 2026',
    venue: 'Stadion Madya',
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end justify-center overflow-hidden pt-24"
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
          style={{ backgroundImage: `url(${slides[current].image})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />

      <button
        onClick={prev}
        className="absolute left-5 top-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-5 top-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      <div className="relative z-25 max-w-8xl mx-auto px-5 md:px-10 xl:px-20 w-full pb-8   md:pb-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm md:text-base text-primary-accent font-semibold tracking-widest uppercase mb-2"
            >
              {slides[current].date}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-2"
            >
              {slides[current].name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-lg md:text-xl text-white/70 mb-6"
            >
              {slides[current].venue}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('concerts')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Beli Tiket
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 z-20 flex items-center gap-3 left-1/2 -translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-10 h-2.5 bg-primary-accent'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
