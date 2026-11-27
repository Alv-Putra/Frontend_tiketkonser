'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import TixoLogo from './TixoLogo';
import TextRoll from './TextRoll';
import { ORGANIZER_HREF } from './data';

const LINKS = [
  { id: 'jalur', label: 'Pilih jalur' },
  { id: 'event', label: 'Event' },
  { id: 'penonton', label: 'Penonton' },
  { id: 'organizer', label: 'Organizer' },
];

/** Section yang sedang dibaca. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive((hit.target as HTMLElement).id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const landingTheme = useThemeStore((state) => state.landingTheme);
  const toggleLandingTheme = useThemeStore((state) => state.toggleLandingTheme);
  const isDark = landingTheme === 'dark';

  // Navbar mengecil saat di-scroll.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 40;
    setCompact((prev) => (prev === next ? prev : next));
  });

  // Kunci scroll halaman saat menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const highlight = hovered ?? active;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 ${
          compact ? 'pt-2' : 'pt-4'
        }`}
      >
        <nav
          className={`relative mx-auto flex items-center justify-between overflow-hidden rounded-full border bg-ink/90 transition-[max-width,padding,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            compact
              ? 'max-w-4xl border-line py-1.5 pl-4 pr-1.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)]'
              : 'max-w-6xl border-transparent py-3 pl-5 pr-3 shadow-none'
          }`}
        >
          <TixoLogo className={`origin-left transition-transform duration-500 ${compact ? 'scale-90' : 'scale-100'}`} />

          <ul className="hidden items-center gap-1 md:flex" onPointerLeave={() => setHovered(null)}>
            {LINKS.map((link) => {
              const isOn = highlight === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onPointerEnter={() => setHovered(link.id)}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={`group relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isOn ? 'text-ink' : 'text-mute hover:text-white'
                    }`}
                  >
                    {isOn && (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-blaze"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <TextRoll className="relative">{link.label}</TextRoll>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={toggleLandingTheme}
              aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 hover:border-blaze hover:text-blaze focus-visible:outline-2 focus-visible:outline-blaze ${
                isDark
                  ? 'border-line bg-onyx/70 text-white'
                  : 'border-ink/10 bg-white text-ink shadow-xs'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href={ORGANIZER_HREF}
              className={`group rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:text-tangerine ${
                isDark ? 'text-white' : 'text-ink'
              }`}
            >
              <TextRoll>Masuk organizer</TextRoll>
            </Link>
            <a
              href="#penonton"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-300 hover:bg-blaze shadow-xs"
            >
              <TextRoll>Unduh app</TextRoll>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleLandingTheme}
              aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 ${
                isDark
                  ? 'border-line bg-onyx text-white'
                  : 'border-ink/10 bg-white text-ink shadow-xs'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full bg-blaze text-ink"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Progres scroll halaman */}
          <m.span
            aria-hidden
            className="absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-blaze to-tangerine"
            style={{ scaleX: progress }}
          />
        </nav>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <m.div
            key="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-blaze px-6 pb-10 pt-6 text-ink md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold">Tixo</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLandingTheme}
                  aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink text-blaze"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <m.ul
              className="mt-12 flex-1 space-y-2"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
            >
              {LINKS.map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <m.a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                    className="flex items-baseline gap-3 font-display text-5xl font-extrabold uppercase tracking-tight"
                  >
                    <span className="font-mono text-sm font-bold opacity-60">0{i + 1}</span>
                    {link.label}
                  </m.a>
                </li>
              ))}
            </m.ul>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="#penonton"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink py-4 text-center font-bold text-blaze"
              >
                Unduh app
              </a>
              <Link href={ORGANIZER_HREF} className="rounded-full border-2 border-ink py-4 text-center font-bold">
                Masuk organizer
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
