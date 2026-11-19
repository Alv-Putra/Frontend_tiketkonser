'use client';

import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';

// Kata bertanda * diberi warna aksen.
const TEXT =
  'Konser terbaik bukan yang kamu tonton lewat *layar* orang lain. Tapi yang kamu *teriakkan* sendiri, dari *barisan* *depan,* dengan tiket resmi di saku.';

/**
 * Pernyataan besar yang katanya "menyala" satu per satu mengikuti scroll.
 * Rentang animasi diukur dari paragrafnya sendiri (bukan section beserta padding-nya),
 * sehingga seluruh kalimat sudah menyala selagi paragraf masih utuh terlihat di layar.
 * Hanya opacity yang dianimasikan (satu tween GSAP ber-stagger), jadi tetap ringan.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const words = TEXT.split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'power1.out',
            // Durasi per kata lebih panjang dari jeda stagger: kata saling tumpang-tindih
            // sehingga nyalanya mengalir, bukan berkedip satu per satu.
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
              trigger: text.current,
              // Mulai saat paragraf sudah cukup masuk layar...
              start: 'top 78%',
              // ...dan selesai saat bagian bawahnya masih di atas tengah layar.
              end: 'bottom 62%',
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: root }
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
