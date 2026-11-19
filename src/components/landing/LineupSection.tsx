'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BAND_PHOTOS } from './data';
import SplitHeading from './SplitHeading';

const ROWS = [
  { photo: 0, tag: 'Rock · sejak 1983' },
  { photo: 1, tag: 'Rock · sejak 1986' },
  { photo: 2, tag: 'Pop rock · sejak 2012' },
  { photo: 3, tag: 'Pop · sejak 1996' },
];

/** Daftar nama raksasa; foto band muncul dan mengikuti kursor saat baris di-hover. */
export default function LineupSection() {
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 26, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 26, mass: 0.6 });
  const rotate = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const lastX = useRef(0);
  const handleMove = (e: PointerEvent<HTMLUListElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nextX = e.clientX - rect.left;
    // Foto sedikit miring searah gerakan kursor.
    rotate.set(Math.max(-12, Math.min(12, (nextX - lastX.current) * 0.8)));
    lastX.current = nextX;
    x.set(nextX);
    y.set(e.clientY - rect.top);
  };

  return (
    <section className="relative overflow-hidden border-b border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SplitHeading className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Panggung yang <span className="text-blaze">bisa</span> kamu kejar
          </SplitHeading>
          <p className="max-w-xs text-mute">Arahkan kursor ke nama band. Sisanya biar adrenalin yang bicara.</p>
        </div>

        <ul
          className="relative mt-12 border-t border-line"
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
        >
          {ROWS.map((row, i) => {
            const photo = BAND_PHOTOS[row.photo];
            const isActive = active === i;
            return (
              <li key={photo.name} onPointerEnter={() => setActive(i)} className="border-b border-line">
                <a
                  href="#penonton"
                  className="group flex items-center justify-between gap-4 py-6 sm:py-8"
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <span className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-sm font-bold text-mute">0{i + 1}</span>
                    <m.span
                      animate={{ x: isActive ? 24 : 0, color: isActive ? '#FF4D00' : '#FFFFFF' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="font-display text-[clamp(2.2rem,8vw,6.5rem)] font-extrabold uppercase leading-none tracking-tighter"
                    >
                      {photo.name}
                    </m.span>
                  </span>
                  <span className="hidden items-center gap-4 sm:flex">
                    <span className="text-sm text-mute">{row.tag}</span>
                    <m.span
                      animate={{ rotate: isActive ? 45 : 0, backgroundColor: isActive ? '#FF4D00' : '#141417' }}
                      className="grid h-12 w-12 place-items-center rounded-full text-white"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </m.span>
                  </span>
                </a>
              </li>
            );
          })}

          {/* Foto melayang mengikuti kursor (hanya perangkat dengan hover). */}
          <m.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden [@media(hover:hover)]:block"
            style={{ x, y, rotate, translateX: '-50%', translateY: '-50%' }}
          >
            <AnimatePresence mode="popLayout">
              {active !== null && (
                <m.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.6, clipPath: 'inset(50% 50% 50% 50% round 20px)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-56 w-80 overflow-hidden rounded-[20px] border-4 border-blaze shadow-2xl"
                >
                  <Image
                    src={BAND_PHOTOS[ROWS[active].photo].src}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        </ul>
      </div>
    </section>
  );
}
