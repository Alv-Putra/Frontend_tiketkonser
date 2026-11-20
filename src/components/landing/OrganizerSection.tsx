'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BarChart3, QrCode, Sparkles, Tags } from 'lucide-react';
import { useGsap } from '@/lib/gsap';
import { ORGANIZER_FEATURES, ORGANIZER_HREF } from './data';
import { Magnetic, Reveal } from './motion';
import SplitHeading from './SplitHeading';

const ICONS = [Sparkles, Tags, BarChart3, QrCode];
// Data ilustrasi dashboard.
const BARS = [32, 48, 41, 66, 58, 82, 74, 95, 88, 100];

function DashboardMock() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap }) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 0.8 },
      });
      tl.from('[data-bar]', { scaleY: 0, transformOrigin: 'bottom', stagger: 0.06, ease: 'power2.out' }, 0);

      // Angka menghitung naik sekali saat terlihat.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const prefix = el.dataset.prefix ?? '';
        const suffix = el.dataset.suffix ?? '';
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.v).toLocaleString('id-ID')}${suffix}`;
          },
        });
      });
    },
    root
  );

  return (
    <div
      ref={root}
      className="relative rotate-2 rounded-3xl border-2 border-line bg-ink p-6 shadow-[0_40px_120px_-30px_rgba(255,122,0,0.45)] sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mute">Dashboard organizer</p>
          <p className="mt-1 font-display text-xl font-extrabold">Pesta Rakyat 2026</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-blaze/15 px-3 py-1 text-xs font-bold text-tangerine">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-blaze" />
            <span className="relative h-2 w-2 rounded-full bg-blaze" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Terjual', count: 8420, suffix: '' },
          { label: 'Pendapatan', count: 2100, prefix: 'Rp', suffix: ' jt' },
          { label: 'Check-in', count: 92, suffix: '%' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-onyx p-3 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mute">{stat.label}</p>
            <p
              className="mt-1 whitespace-nowrap font-display text-base font-extrabold sm:text-2xl"
              data-count={stat.count}
              data-prefix={stat.prefix}
              data-suffix={stat.suffix}
            >
              {stat.prefix}
              {stat.count.toLocaleString('id-ID')}
              {stat.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-onyx p-4">
        <div className="flex items-center justify-between text-xs text-mute">
          <span className="font-bold uppercase tracking-widest">Penjualan 10 hari</span>
          <span className="font-bold text-tangerine">+38%</span>
        </div>
        <div className="mt-4 flex h-36 items-end gap-2">
          {BARS.map((h, i) => (
            <div
              key={i}
              data-bar
              className={`flex-1 rounded-t-lg ${i === BARS.length - 1 ? 'bg-blaze' : 'bg-tangerine/40'}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 -rotate-6 rounded-xl bg-paper px-4 py-2 font-display text-sm font-extrabold text-ink shadow-xl">
        Presale habis dalam 4 menit ⚡
      </div>
    </div>
  );
}

export default function OrganizerSection() {
  const reduce = useReducedMotion();

  return (
    <section id="organizer" className="grain relative scroll-mt-24 overflow-hidden border-b border-line bg-onyx py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-1/4 h-[640px] w-[640px] bg-[radial-gradient(circle,rgba(255,77,0,0.16),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <Reveal y={20}>
            <p className="inline-block rotate-2 bg-tangerine px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-ink">
              Untuk organizer
            </p>
          </Reveal>
          <SplitHeading className="mt-5 font-display text-[clamp(2.6rem,6.5vw,5rem)] font-extrabold uppercase leading-[0.88] tracking-tight">
            Kamu urus <span className="text-blaze">panggungnya.</span> Kami urus antreannya.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
              Dari gig 50 orang sampai festival ribuan penonton. Jual tiket lewat app Tixo, pantau penjualan, dan
              check-in penonton tanpa ribet.
            </p>
          </Reveal>

          <m.ul
            className="mt-10 grid gap-4 sm:grid-cols-2"
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {ORGANIZER_FEATURES.map((f, i) => {
              const Icon = ICONS[i];
              return (
                <m.li
                  key={f.title}
                  variants={{
                    hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
                    show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  whileHover={{ y: -4, borderColor: '#FF7A00' }}
                  className="rounded-2xl border-2 border-line bg-ink/60 p-5"
                >
                  <Icon className="h-6 w-6 text-tangerine" />
                  <h3 className="mt-3 font-display text-lg font-extrabold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{f.body}</p>
                </m.li>
              );
            })}
          </m.ul>

          <Reveal delay={0.2} className="mt-10">
            <Magnetic>
              <Link
                href={ORGANIZER_HREF}
                className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-display text-lg font-extrabold text-ink transition-colors duration-300 hover:bg-blaze"
              >
                Buka dashboard organizer
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}
