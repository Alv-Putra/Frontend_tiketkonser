'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { ORGANIZER_HREF } from './data';
import { Magnetic } from './motion';
import TextRoll from './TextRoll';

const LINES = [
  { text: 'Sampai', className: '' },
  { text: 'ketemu di', className: 'text-outline' },
  { text: 'barisan', className: 'text-blaze' },
  { text: 'depan.', className: '' },
];

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Baris meluncur bergantian dari kiri & kanan, terkunci di tengah saat scroll.
        gsap.from('[data-cta="line"]', {
          xPercent: (i) => (i % 2 ? 60 : -60),
          rotate: (i) => (i % 2 ? 6 : -6),
          opacity: 0,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.9 },
        });
        gsap.from('[data-cta="actions"]', {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-cta="actions"]', start: 'top 92%', once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-[clamp(3.2rem,13vw,11rem)] font-extrabold uppercase leading-[0.82] tracking-tighter">
          {LINES.map((line) => (
            <span key={line.text} data-cta="line" className={`block ${line.className}`}>
              {line.text}{' '}
            </span>
          ))}
        </h2>

        <div data-cta="actions" className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic className="w-full sm:w-auto">
            <a
              href="#penonton"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-blaze px-8 py-5 font-display text-xl font-extrabold text-ink transition-colors duration-300 hover:bg-tangerine"
            >
              <TextRoll>Unduh app Tixo</TextRoll>
              <ArrowDownRight className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </a>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Link
              href={ORGANIZER_HREF}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-5 font-display text-xl font-extrabold transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <TextRoll>Daftarkan acaramu</TextRoll>
              <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
