'use client';

import { useRef } from 'react';
import { useGsap } from '@/lib/gsap';

// Kata bertanda * diberi warna aksen.
const TEXT =
  'Konser terbaik bukan yang kamu tonton lewat *layar* orang lain. Tapi yang kamu *teriakkan* sendiri, dari *barisan* *depan,* dengan tiket resmi di saku.';

/** Kata menyala satu per satu mengikuti scroll. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const words = TEXT.split(' ');

  useGsap(
    ({ gsap }) => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: 'power1.out',
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: text.current,
            start: 'top 78%',
            // Selesai selagi paragraf masih terlihat utuh.
            end: 'bottom 62%',
            scrub: 0.6,
          },
        }
      );
    },
    root
  );

  return (
    <section ref={root} className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.3em] text-tangerine">Manifesto Tixo</p>
        <p
          ref={text}
          className="font-display text-[clamp(1.9rem,4.6vw,3.8rem)] font-extrabold leading-[1.08] tracking-tight"
        >
          {words.map((raw, i) => {
            const accent = raw.startsWith('*');
            const word = raw.replace(/\*/g, '');
            return (
              <span key={i}>
                <span data-word className={accent ? 'text-blaze' : 'text-white'}>
                  {word}
                </span>{' '}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
