import Image from 'next/image';
import s from './login.module.css';

/** Baris teks latar raksasa yang berjalan. */
function BackdropRow({ title, reverse = false }: { title: string; reverse?: boolean }) {
  const words = ['Backstage', 'Staff only', title, 'All access', 'Crew'];
  return (
    <div className={`flex w-max gap-10 whitespace-nowrap ${reverse ? s.marqueeReverse : s.marquee}`}>
      {[...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center gap-10">
          {w}
          <span className="text-blaze/60">✦</span>
        </span>
      ))}
    </div>
  );
}

type PassProps = {
  title: string;
  account: string;
  passCode: string;
  scanning: boolean;
  shaking: boolean;
  onShakeEnd: () => void;
};

function BackstagePass({ title, account, passCode, scanning, shaking, onShakeEnd }: PassProps) {
  return (
    <div className={`relative mx-auto w-[300px] ${s.drop}`}>
      {/* Tali lanyard */}
      <div className="absolute -top-[60px] left-1/2 h-[64px] w-5 -translate-x-1/2 bg-[repeating-linear-gradient(45deg,#FF4D00_0_8px,#09090B_8px_16px)]" />
      <div
        className={shaking ? s.shake : ''}
        onAnimationEnd={(e) => e.target === e.currentTarget && onShakeEnd()}
      >
        <div className={s.swing}>
          <div className="relative overflow-hidden rounded-[28px] bg-paper text-ink shadow-[0_40px_80px_-30px_rgba(255,77,0,0.6)]">
            {/* Lubang gantungan */}
            <div className="absolute left-1/2 top-3 h-3 w-16 -translate-x-1/2 rounded-full bg-ink" />

            <div className="relative bg-blaze px-6 pb-5 pt-9">
              <span
                className={`absolute right-5 top-14 rotate-[-12deg] rounded-md border-[3px] border-ink px-2 py-0.5 font-display text-sm font-extrabold uppercase tracking-wider text-ink ${s.stamp}`}
              >
                Verified
              </span>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Tixo · Crew pass</p>
              <p className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter">
                All
                <br />
                access
              </p>
            </div>

            <div className="relative px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink p-2 shadow-inner">
                  <Image
                    src="/LogoTixo.png"
                    alt="Tixo"
                    width={48}
                    height={48}
                    unoptimized
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Peran</p>
                  <p className="font-display text-2xl font-extrabold leading-none">{account}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-ink/60">
                    <span className={`h-2 w-2 rounded-full bg-[#16A34A] ${s.blink}`} />
                    Gerbang belakang terbuka
                  </p>
                </div>
              </div>

              {/* Barcode + laser */}
              <div className="relative mt-5 h-16 overflow-hidden rounded-xl bg-white p-2">
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg,#09090B 0 3px,transparent 3px 5px,#09090B 5px 6px,transparent 6px 9px,#09090B 9px 13px,transparent 13px 15px)',
                  }}
                />
                <div
                  className={`absolute inset-x-0 top-1 h-0.5 bg-blaze shadow-[0_0_12px_2px_rgba(255,77,0,0.8)] ${scanning ? s.scanFast : s.scan}`}
                />
              </div>
              <p className="mt-2 text-center font-mono text-[10px] font-bold tracking-[0.4em] text-ink/50">{passCode}</p>

            </div>
          </div>
        </div>
      </div>

      {/* Stiker berputar */}
      <div className="absolute -left-20 bottom-24 h-24 w-24">
        <svg viewBox="0 0 100 100" className={`h-full w-full ${s.spin}`} aria-hidden>
          <defs>
            <path id="staff-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <circle cx="50" cy="50" r="49" fill="#09090B" stroke="#FF7A00" strokeWidth="2" />
          <text className="font-display" fontSize="11" fontWeight="800" letterSpacing="2.5" fill="#FF7A00">
            <textPath href="#staff-circle">STAFF ONLY • NO ENTRY •</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-2xl">🔒</span>
      </div>
    </div>
  );
}

export function WorkspaceLoginBackdrop({ title }: { title: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(700px 500px at 85% 15%, rgba(255,77,0,0.18), transparent 70%), radial-gradient(600px 500px at 5% 95%, rgba(255,122,0,0.1), transparent 70%)',
        }}
      />
      <div className="text-outline absolute inset-x-0 top-[12%] -rotate-6 font-display text-[9rem] font-extrabold uppercase leading-none opacity-[0.07] [--stroke:#FFFFFF]">
        <BackdropRow title={title} />
      </div>
      <div className="text-outline absolute inset-x-0 bottom-[8%] rotate-3 font-display text-[9rem] font-extrabold uppercase leading-none opacity-[0.07] [--stroke:#FF7A00]">
        <BackdropRow title={title} reverse />
      </div>
    </div>
  );
}

export function WorkspaceLoginIntro(pass: PassProps) {
  return (
    <div className="hidden lg:block" aria-hidden="true">
      <p className={`font-mono text-xs font-bold uppercase tracking-[0.3em] text-tangerine ${s.rise}`} style={{ ['--d' as string]: '0.1s' }}>
        Khusus kru · Area terbatas
      </p>
      <h2 className="mt-4 font-display text-[clamp(3rem,5.5vw,5.2rem)] font-extrabold uppercase leading-[0.86] tracking-tight">
        {['Selamat', 'datang', 'di', 'belakang', 'panggung.'].map((w, i) => (
          <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span
              className={`${s.word} ${w === 'belakang' ? 'text-blaze' : ''} ${w === 'panggung.' ? 'text-outline' : ''}`}
              style={{ ['--d' as string]: `${0.15 + i * 0.08}s` }}
            >
              {w}
            </span>
            {' '}
          </span>
        ))}
      </h2>
      <div className="mt-20">
        <BackstagePass {...pass} />
      </div>
    </div>
  );
}
