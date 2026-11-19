'use client';

import { m, useReducedMotion } from 'framer-motion';
import AppButtons from './AppButtons';
import { AUDIENCE_STEPS, BAND_PHOTOS } from './data';
import { Reveal } from './motion';
import ParallaxImage from './ParallaxImage';
import SplitHeading from './SplitHeading';

const TILTS = ['md:-rotate-1', 'md:translate-y-8 md:rotate-1', 'md:-rotate-[0.5deg]'];

export default function AudienceSection() {
  const photo = BAND_PHOTOS[1];
  const reduce = useReducedMotion();

  return (
    <section
      id="penonton"
      className="grain relative scroll-mt-24 overflow-hidden border-b border-line bg-paper py-20 text-ink sm:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Reveal y={20}>
              <p className="inline-block -rotate-2 bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blaze">
                Untuk penonton
              </p>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2.6rem,6.5vw,5rem)] font-extrabold uppercase leading-[0.88] tracking-tight">
              Tiketnya di saku. <span className="text-blaze">Teriaknya</span> di venue.
            </SplitHeading>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">
                Semua pembelian tiket Tixo ada di app. Lebih cepat, lebih aman, dan e-ticket-mu selalu siap
                walau sinyal di venue putus-putus.
              </p>
              <div className="mt-8">
                <AppButtons />
              </div>
            </Reveal>
          </div>

          <div className="-rotate-2">
            <ParallaxImage
              src={photo.src}
              alt={`${photo.name} tampil di depan penonton`}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[3/2] rounded-3xl border-4 border-ink shadow-[12px_12px_0_0_#09090B]"
            >
              <m.span
                initial={reduce ? false : { scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.6 }}
                className="absolute bottom-4 left-4 rounded-md bg-blaze px-3 py-1 font-display text-lg font-extrabold"
              >
                Ini bisa jadi kamu →
              </m.span>
            </ParallaxImage>
          </div>
        </div>

        <m.ol
          className="mt-20 grid gap-5 md:grid-cols-3"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        >
          {AUDIENCE_STEPS.map((step, i) => (
            <m.li
              key={step.no}
              variants={{
                hidden: { opacity: 0, y: 80, rotate: i % 2 ? 6 : -6 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } },
              }}
              whileHover={{ y: -8, rotate: i % 2 ? -1.5 : 1.5, boxShadow: '14px 14px 0 0 #FF4D00' }}
              className={`relative rounded-3xl border-4 border-ink bg-white p-7 shadow-[8px_8px_0_0_#09090B] ${TILTS[i]}`}
            >
              <span className="font-display text-6xl font-extrabold leading-none text-blaze">{step.no}</span>
              <h3 className="mt-4 font-display text-2xl font-extrabold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/70">{step.body}</p>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  );
}
