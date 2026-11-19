import Link from 'next/link';
import { ArrowRight, Mic2, Ticket } from 'lucide-react';
import { ORGANIZER_HREF } from './data';
import { Reveal, TiltCard } from './motion';
import SplitHeading from './SplitHeading';

/** Dua jalur utama: penonton (beli tiket di app) dan organizer (jual tiket). */
export default function ChooseSide() {
  return (
    <section id="jalur" className="scroll-mt-24 border-b border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SplitHeading className="max-w-2xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Kamu di <span className="text-blaze">depan</span> panggung, atau <span className="text-outline">di atasnya?</span>
          </SplitHeading>
          <Reveal delay={0.2} className="max-w-sm text-mute">
            Satu platform, dua pintu masuk. Pilih peranmu dan Tixo urus sisanya.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
          <TiltCard className="group rounded-3xl">
          <a
            href="#penonton"
            className="ticket-notch group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl bg-blaze p-8 text-ink sm:p-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-10 font-display text-[11rem] font-extrabold leading-none text-ink/10"
            >
              01
            </span>
            <div className="relative">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-blaze">
                <Ticket className="h-7 w-7" />
              </span>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em]">Untuk penonton</p>
              <h3 className="mt-2 font-display text-4xl font-extrabold leading-none sm:text-5xl">
                Amankan tiketmu
                <br />
                sebelum habis.
              </h3>
            </div>
            <div className="relative mt-8 flex items-center justify-between border-t-2 border-dashed border-ink/30 pt-6">
              <span className="font-semibold">Unduh app Tixo, beli dalam beberapa tap</span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-blaze transition-transform group-hover:translate-x-1 group-hover:-rotate-45">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </a>
          </TiltCard>
          </Reveal>

          <Reveal delay={0.15}>
          <TiltCard className="group rounded-3xl">
          <Link
            href={ORGANIZER_HREF}
            className="ticket-notch group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl border-2 border-line bg-onyx p-8 transition-colors duration-300 hover:border-tangerine sm:p-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-10 font-display text-[11rem] font-extrabold leading-none text-white/5"
            >
              02
            </span>
            <div className="relative">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-tangerine text-ink">
                <Mic2 className="h-7 w-7" />
              </span>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-tangerine">Untuk organizer</p>
              <h3 className="mt-2 font-display text-4xl font-extrabold leading-none sm:text-5xl">
                Bikin acara,
                <br />
                kami jual tiketnya.
              </h3>
            </div>
            <div className="relative mt-8 flex items-center justify-between border-t-2 border-dashed border-line pt-6">
              <span className="font-semibold text-mute">Buka dashboard organizer, gratis</span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1 group-hover:-rotate-45">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
          </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
