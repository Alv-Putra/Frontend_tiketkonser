'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { BAND_PHOTOS } from './data';
import DemoQR from './DemoQR';
import { Magnetic } from './motion';
import RotatingWord from './RotatingWord';
import TextRoll from './TextRoll';

function SpinSticker() {
  return (
    <div data-hero="sticker" className="absolute -left-6 top-6 z-30 h-28 w-28 sm:-left-10 sm:h-32 sm:w-32">
      <svg data-hero="sticker-ring" viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <defs>
          <path id="sticker-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="#FF7A00" />
        <text className="font-display" fontSize="10.5" fontWeight="800" letterSpacing="2" fill="#09090B">
          <textPath href="#sticker-circle">TIKET RESMI • ANTI CALO • TIXO •</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-3xl font-extrabold text-ink">★</span>
    </div>
  );
}

function PhoneTicket() {
  return (
    <div
      data-hero="phone"
      className="relative z-20 mx-auto w-[260px] rotate-3 rounded-[2.6rem] border-[6px] border-[#1F1F23] bg-ink p-3 shadow-[0_30px_60px_-24px_rgba(255,77,0,0.6)] sm:w-[290px]"
    >
      <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-[#1F1F23]" />
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">Tiket kamu</p>

      <div className="ticket-notch mt-2 overflow-hidden rounded-2xl bg-blaze text-ink">
        <div className="p-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
            <span>Sab, 15 Agu</span>
            <span>Gate B</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold leading-none">Dewa 19</p>
          <p className="text-xs font-semibold opacity-80">JIExpo Kemayoran, Jakarta</p>
        </div>
        <div className="mx-4 border-t-2 border-dashed border-ink/40" />
        <div className="flex items-center gap-3 p-4">
          <div data-hero="qr" className="overflow-hidden rounded-lg">
            <DemoQR size={76} />
          </div>
          <div className="text-[10px] font-bold uppercase leading-relaxed tracking-wider">
            <p>CAT 1 · Festival</p>
            <p className="opacity-70">#TX-0815-2026</p>
            <p className="mt-1 inline-block rounded bg-ink px-1.5 py-0.5 text-blaze">Siap scan</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 px-1 pb-2">
        {['Cari', 'Tiket', 'Profil'].map((t, i) => (
          <span
            key={t}
            className={`rounded-full py-1.5 text-center text-[10px] font-bold ${i === 1 ? 'bg-white text-ink' : 'text-mute'}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Polaroid({ index, className, tilt }: { index: number; className: string; tilt: string }) {
  const photo = BAND_PHOTOS[index];
  // Wrapper luar: parallax (GSAP). Tengah: melayang (GSAP). Figure: miring & hover (Framer).
  return (
    <div data-hero="polaroid" className={`absolute z-10 ${className}`}>
      <div data-hero="float">
        <m.figure
          initial={{ rotate: tilt }}
          whileHover={{ rotate: 0, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative w-36 bg-paper p-2 pb-7 shadow-xl sm:w-44"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-line">
            <Image
              src={photo.src}
              alt={`${photo.name} di atas panggung`}
              fill
              sizes="176px"
              className="object-cover contrast-125"
              priority={index === 0}
            />
          </div>
          <figcaption className="absolute bottom-1.5 left-0 right-0 text-center font-display text-sm font-bold text-ink">
            {photo.name}
          </figcaption>
        </m.figure>
      </div>
    </div>
  );
}

// Lampu sorot: kerucut gradien tanpa filter blur. Hanya transform yang dianimasikan.
const BEAMS = ['left-[14%]', 'left-[78%]'];
const beamStyle = {
  background: 'linear-gradient(to bottom, rgba(255,122,0,0.22), rgba(255,77,0,0.05) 55%, transparent 85%)',
  clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
};

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 1) Intro: judul naik dari balik masker, lalu panggung "jatuh" ke tempatnya.
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from('[data-hero="beam"]', { scaleY: 0, opacity: 0, transformOrigin: '50% 0%', duration: 1.2, stagger: 0.15 }, 0)
          .from('[data-hero="eyebrow"]', { y: 24, opacity: 0, rotate: -8, duration: 0.7 }, 0.05)
          .from('[data-hero="line"]', { yPercent: 110, rotate: 4, duration: 1, stagger: 0.1 }, 0.1)
          .from('[data-hero="badge"]', { scaleX: 0, transformOrigin: 'left center', duration: 0.6, ease: 'back.out(2)' }, 0.45)
          .from('[data-hero="fade"]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5)
          .from('[data-hero="phone"]', { y: 280, rotate: 20, opacity: 0, duration: 1.2 }, 0.25)
          .from('[data-hero="qr"]', { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(2.2)' }, 0.9)
          .from('[data-hero="polaroid"]', { scale: 0, rotate: (i) => (i ? 30 : -30), duration: 0.9, ease: 'back.out(1.6)', stagger: 0.12 }, 0.6)
          .from('[data-hero="sticker"]', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(1.8)' }, 0.8);

        // 2) Gerak terus-menerus, dijeda otomatis saat hero tidak terlihat.
        const loops = [
          gsap.to('[data-hero="sticker-ring"]', { rotate: 360, duration: 14, ease: 'none', repeat: -1, transformOrigin: '50% 50%' }),
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

        // 3) Parallax saat scroll keluar dari hero.
        const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
        gsap.to('[data-hero="phone"]', { y: -140, rotate: -8, ease: 'none', scrollTrigger: scrub });
        gsap.to('[data-hero="polaroid"]', { y: (i) => (i === 0 ? -240 : 150), ease: 'none', scrollTrigger: scrub });
        gsap.to('[data-hero="sticker"]', { y: -180, scale: 1.25, ease: 'none', scrollTrigger: scrub });
        gsap.to('[data-hero="line-shift"]', { x: (i) => (i % 2 === 0 ? -70 : 70), ease: 'none', scrollTrigger: scrub });
      });
    },
    { scope: root }
  );

  // Spotlight kursor: elemen kecil yang digeser lewat transform (tanpa repaint seluruh section).
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
        // Cahaya panggung statis: gradien murah, tanpa filter blur.
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
          className={`pointer-events-none absolute -top-16 ${pos} hidden h-[120%] w-56 origin-top will-change-transform md:block`}
          style={beamStyle}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-36">
        <div>
          <p
            data-hero="eyebrow"
            className="inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-tangerine px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-tangerine"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-blaze" />
            Musim <RotatingWord words={['konser', 'festival', 'tur', 'gig']} className="text-white" /> sudah mulai
          </p>

          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-tight">
            <span data-hero="line-shift" className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line" className="block">
                Jangan cuma
              </span>
            </span>{' '}
            <span data-hero="line-shift" className="block overflow-hidden px-1 py-[0.06em]">
              <span data-hero="line" className="block">
                <span data-hero="badge" className="relative inline-block -rotate-2 bg-blaze px-3 text-ink">
                  nonton
                </span>
              </span>
            </span>{' '}
            <span data-hero="line-shift" className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line" className="block">
                <span className="text-outline">story</span> orang.
              </span>
            </span>
          </h1>

          <p data-hero="fade" className="mt-7 max-w-xl text-lg leading-relaxed text-mute">
            Tixo menaruhmu di barisan depan. Beli tiket resmi lewat app dalam beberapa tap, atau buka panggungmu
            sendiri sebagai organizer dan jual tiket ke ribuan penonton.
          </p>

          <div data-hero="fade" className="mt-9 flex flex-col gap-3 sm:flex-row">
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

          <dl data-hero="fade" className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
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
          <SpinSticker />
          <Polaroid index={0} tilt="-9deg" className="-left-2 bottom-16 sm:left-0" />
          <Polaroid index={2} tilt="8deg" className="-right-2 top-4 sm:right-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <PhoneTicket />
          </div>
        </div>
      </div>
    </section>
  );
}
