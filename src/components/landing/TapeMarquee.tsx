'use client';

import { useRef } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { TAPE_WORDS } from './data';

function Tape({ tone, className }: { tone: 'blaze' | 'paper'; className: string }) {
  // Kata digandakan agar loop -50% menyambung tanpa jeda.
  const words = [...TAPE_WORDS, ...TAPE_WORDS];
  const colors = tone === 'blaze' ? 'bg-blaze text-ink' : 'bg-paper text-ink';

  return (
    <div data-tape="band" className={`absolute left-[-10%] w-[120%] overflow-hidden py-3 ${colors} ${className}`}>
      <div
        data-tape="track"
        className="flex w-max gap-8 whitespace-nowrap will-change-transform font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8">
            {word}
            <span aria-hidden className="text-[0.8em]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Dua pita "caution tape" bersilangan. GSAP menjalankan loop tanpa henti;
 * kecepatan scroll mempercepat, membalik arah, dan memiringkan pita.
 */
export default function TapeMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>('[data-tape="track"]');
        const loops = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i === 0 ? -50 : 0 },
            { xPercent: i === 0 ? 0 : -50, duration: 30 + i * 4, ease: 'none', repeat: -1, paused: true }
          )
        );

        const skewTo = gsap.utils.toArray<HTMLElement>('[data-tape="track"]').map((el) =>
          gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' })
        );

        // Satu objek kecepatan untuk semua loop: lebih murah daripada membuat tween per event scroll.
        const speed = { value: 1 };
        const applySpeed = () => loops.forEach((loop) => loop.timeScale(speed.value));
        let direction = 1;

        // Saat scroll berhenti: pita kembali tegak dan kecepatan kembali normal.
        const settle = gsap
          .delayedCall(0.15, () => {
            skewTo.forEach((fn) => fn(0));
            gsap.to(speed, { value: direction, duration: 1.2, ease: 'power2.out', overwrite: true, onUpdate: applySpeed });
          })
          .pause();

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          // Loop hanya berjalan saat pita terlihat.
          onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause())),
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 400);
            gsap.to(speed, { value: boost * direction, duration: 0.2, overwrite: true, onUpdate: applySpeed });
            const skew = gsap.utils.clamp(-12, 12, velocity / -120);
            skewTo.forEach((fn) => fn(skew));
            settle.restart(true);
          },
        });

        // Pita berputar saat melintasi layar. Nilai absolut: GSAP menggantikan rotasi CSS dasarnya.
        gsap.fromTo(
          '[data-tape="band"]',
          { rotate: (i) => (i === 0 ? 10 : -9) },
          {
            rotate: (i) => (i === 0 ? 5 : -4),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden className="relative h-56 overflow-hidden border-b border-line bg-ink sm:h-72">
      <Tape tone="paper" className="top-1/2 -translate-y-1/2 rotate-[7deg]" />
      <Tape tone="blaze" className="top-1/2 -translate-y-1/2 -rotate-6 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
