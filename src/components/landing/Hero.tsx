'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { useGsap } from '@/lib/gsap';
import { BAND_PHOTOS } from './data';
import DemoQR from './DemoQR';
import { Magnetic } from './motion';
import RotatingWord from './RotatingWord';
import TextRoll from './TextRoll';

// Lubang sobekan di sudut atas/bawah potongan tiket.
const holes = (y: '0' | '100%') => {
  const g = (x: string) => `radial-gradient(circle 14px at ${x} ${y}, #0000 98%, #000)`;
  const mask = `${g('0')} left / 51% 100% no-repeat, ${g('100%')} right / 51% 100% no-repeat`;
  return { WebkitMask: mask, mask };
};

function TicketStack() {
  const photo = BAND_PHOTOS[1];
  return (
    <div className="relative mx-auto w-[270px] sm:w-[300px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24"
        style={{ background: 'radial-gradient(closest-side, rgba(255,77,0,0.28), transparent)' }}
      />
      {/* Tiket di belakang: parallax GSAP > melayang */}
      <div data-hero="ticket-back" className="absolute inset-x-0 top-0">
        <div data-hero="float">
          <div className="-translate-x-10 -translate-y-6 -rotate-[11deg] rounded-3xl bg-blaze p-5 text-ink">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Sab, 22 Agu</span>
              <span>Gate A</span>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold leading-none">NOAH</p>
            <div className="h-[340px]" />
          </div>
        </div>
      </div>

      <div data-hero="ticket" className="relative">
        <m.div
          initial={{ rotate: 4 }}
          whileHover={{ rotate: 0, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-ink"
        >
          <div className="rounded-t-3xl bg-paper p-3 pb-5" style={holes('100%')}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-line">
              <Image src={photo.src} alt={`${photo.name} di atas panggung`} fill sizes="300px" className="object-cover contrast-125" priority />
              <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Sab, 15 Agu
              </span>
            </div>
            <p className="mt-4 px-1 font-display text-4xl font-extrabold leading-none">{photo.name}</p>
            <p className="mt-1 px-1 text-xs font-semibold text-ink/70">JIExpo Kemayoran, Jakarta</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 px-1 text-ink">
              {[
                ['Gate', 'B'],
                ['Kelas', 'CAT 1'],
                ['Area', 'Festival'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-semibold text-ink/60">{k}</dt>
                  <dd className="font-display text-sm font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative rounded-b-3xl bg-paper px-4 pb-4 pt-5" style={holes('0')}>
            <div className="absolute inset-x-5 top-0 border-t-2 border-dashed border-ink/25" />
            <div className="flex items-center gap-3">
              <div data-hero="qr" className="hero-pop overflow-hidden rounded-lg" style={{ ['--d' as string]: '0.95s' }}>
                <DemoQR size={72} />
              </div>
              <div>
                <p className="font-mono text-xs font-bold">#TX-0815-2026</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tangerine" />
                  Siap scan
                </p>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

// Lampu sorot (tanpa blur).
const BEAMS = ['left-[14%]', 'left-[78%]'];
const beamStyle = {
  background: 'linear-gradient(to bottom, rgba(255,122,0,0.22), rgba(255,77,0,0.05) 55%, transparent 85%)',
  clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
};

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, ScrollTrigger }) => {
      // Intro memakai CSS (.hero-* di globals.css).
      // Loop, dijeda saat hero tidak terlihat.
      const loops = [
        ...gsap.utils.toArray<HTMLElement>('[data-hero="float"]').map((el, i) =>
          gsap.to(el, { y: -14, duration: 2.6 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4 })
        ),
        ...gsap.utils.toArray<HTMLElement>('[data-hero="beam"]').map((el, i) =>
          gsap.fromTo(
            el,
            { rotate: i ? 12 : -12 },
            { rotate: i ? -8 : 8, duration: 5 + i * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }
          )
        ),
      ];
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => loops.forEach((t) => (self.isActive ? t.resume() : t.pause())),
      });

      // Parallax saat scroll.
      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
      gsap.to('[data-hero="ticket"]', { y: -120, rotate: -6, ease: 'none', scrollTrigger: scrub });
      gsap.to('[data-hero="ticket-back"]', { y: 60, rotate: -6, ease: 'none', scrollTrigger: scrub });
      gsap.to('[data-hero="line-shift"]', { x: (i) => (i % 2 === 0 ? -70 : 70), ease: 'none', scrollTrigger: scrub });
    },
    root
  );

  // Spotlight mengikuti kursor.
  const mx = useSpring(useMotionValue(-600), { stiffness: 150, damping: 22 });
  const my = useSpring(useMotionValue(-600), { stiffness: 150, damping: 22 });

  return (
    <section
      ref={root}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left - 300);
        my.set(e.clientY - rect.top - 300);
      }}
      className="grain relative overflow-hidden border-b border-line"
      style={{
        // Cahaya panggung statis.
        backgroundImage:
          'radial-gradient(600px 480px at 92% 8%, rgba(255,77,0,0.22), transparent 70%), radial-gradient(520px 420px at 0% 100%, rgba(255,122,0,0.12), transparent 70%)',
      }}
    >
      <m.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full"
        style={{ x: mx, y: my, background: 'radial-gradient(circle, rgba(255,122,0,0.12), transparent 65%)' }}
      />

      {BEAMS.map((pos) => (
        <div
          key={pos}
          aria-hidden
          data-hero="beam"
          className={`hero-fade-in pointer-events-none absolute -top-16 ${pos} hidden h-[120%] w-56 origin-top will-change-transform md:block`}
          style={beamStyle}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-36">
        <div>
          <p
            data-hero="eyebrow"
            className="hero-fade inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-tangerine px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-tangerine"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-blaze" />
            Musim <RotatingWord words={['konser', 'festival', 'tur', 'gig']} className="text-white" /> sudah mulai
          </p>

          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-tight">
            <span data-hero="line-shift" className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line" className="hero-rise block" style={{ ['--d' as string]: '0.1s' }}>
                Jangan cuma
              </span>
            </span>{' '}
            <span data-hero="line-shift" className="block overflow-hidden px-1 py-[0.06em]">
              <span data-hero="line" className="hero-rise block" style={{ ['--d' as string]: '0.2s' }}>
                <span data-hero="badge" className="hero-stretch relative inline-block -rotate-2 bg-blaze px-3 text-ink">
                  nonton
                </span>
              </span>
            </span>{' '}
            <span data-hero="line-shift" className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line" className="hero-rise block" style={{ ['--d' as string]: '0.3s' }}>
                <span className="text-outline">story</span> orang.
              </span>
            </span>
          </h1>

          <p data-hero="fade" style={{ ['--d' as string]: '0.50s' }} className="hero-fade mt-7 max-w-xl text-lg leading-relaxed text-mute">
            Tixo menaruhmu di barisan depan. Beli tiket resmi lewat app dalam beberapa tap, atau buka panggungmu
            sendiri sebagai organizer dan jual tiket ke ribuan penonton.
          </p>

          <div data-hero="fade" style={{ ['--d' as string]: '0.58s' }} className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#penonton"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-blaze px-7 py-4 font-display text-lg font-extrabold text-ink transition-[transform,background-color] duration-300 hover:-rotate-2 hover:bg-tangerine"
              >
                <TextRoll>Beli tiket di app</TextRoll>
                <ArrowDownRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-45deg]" />
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#organizer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-4 font-display text-lg font-extrabold text-white transition-[transform,background-color,color] duration-300 hover:rotate-2 hover:bg-white hover:text-ink"
              >
                <TextRoll>Jadi organizer</TextRoll>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
          </div>

          <dl data-hero="fade" style={{ ['--d' as string]: '0.66s' }} className="hero-fade mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ['100%', 'Tiket resmi'],
              ['< 1 mnt', 'Checkout'],
              ['1 scan', 'Masuk gerbang'],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-xs text-mute">{label}</dt>
                <dd className="font-display text-2xl font-extrabold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[520px] w-full max-w-[460px] sm:h-[560px]">
          <div className="hero-drop absolute inset-0 flex items-center justify-center" style={{ ['--d' as string]: '0.25s' }}>
            <TicketStack />
          </div>
        </div>
      </div>
    </section>
  );
}
