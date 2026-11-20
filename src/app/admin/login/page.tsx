'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, Ticket } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import { validateLoginForm } from '@/lib/validators';
import { RATE_LIMIT, ROLES } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';
import s from './login.module.css';

const MARQUEE = ['Backstage', 'Staff only', 'Admin', 'All access', 'Crew'];

/** Baris teks latar raksasa yang berjalan. */
function BackdropRow({ reverse = false, className = '' }: { reverse?: boolean; className?: string }) {
  const words = [...MARQUEE, ...MARQUEE];
  return (
    <div className={`flex w-max gap-10 whitespace-nowrap ${reverse ? s.marqueeReverse : s.marquee} ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-10">
          {w}
          <span className="text-blaze/60">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Kartu "backstage pass" yang tergantung di lanyard. */
function BackstagePass({ scanning, shaking, onShakeEnd }: { scanning: boolean; shaking: boolean; onShakeEnd: () => void }) {
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
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ink font-display text-3xl font-extrabold text-blaze">
                  A
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Peran</p>
                  <p className="font-display text-2xl font-extrabold leading-none">Administrator</p>
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
              <p className="mt-2 text-center font-mono text-[10px] font-bold tracking-[0.4em] text-ink/50">TX-ADM-0001</p>

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

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [shaking, setShaking] = useState(false);
  const { hit, reset } = useRateLimit(RATE_LIMIT.LOGIN);

  // Sudah login sebagai admin: langsung ke workspace.
  useEffect(() => {
    if (isHydrated && user && user.role === ROLES.ADMIN) {
      const redirect = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      router.replace(redirect || '/admin');
    }
  }, [user, isHydrated, router]);

  const showError = (message: string) => {
    setServerError(message);
    setShaking(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    const { isValid, errors: formErrors } = validateLoginForm(form);
    setErrors(formErrors);
    if (!isValid) {
      setShaking(true);
      return;
    }

    const rateCheck = hit('admin_login');
    if (!rateCheck.allowed) {
      showError(`Terlalu banyak percobaan masuk. Silakan tunggu ${rateCheck.retryAfterSeconds} detik sebelum mencoba kembali.`);
      return;
    }

    const result = await login(form.email, form.password, { mockFallback: false, role: 'admin' });

    if (result.success && result.user) {
      reset('admin_login');
      if (result.user.role !== ROLES.ADMIN) {
        await logout();
        showError('Akses ditolak: Akun Anda tidak memiliki hak akses Administrator. Halaman ini hanya diperuntukkan bagi pengelola sistem.');
        return;
      }

      const redirect = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      router.replace(redirect || '/admin');
    } else {
      setErrors(result.fieldErrors ?? {});
      showError(result.error || 'Email atau password yang Anda masukkan salah.');
    }
  };

  const inputClass = (hasError?: string) =>
    `peer w-full rounded-2xl border-2 bg-ink py-3.5 pl-11 text-sm text-white placeholder-[#52525B] outline-none transition-colors duration-200 disabled:opacity-60 ${
      hasError ? 'border-[#EF4444]' : 'border-line focus:border-blaze/60 hover:border-[#3F3F46]'
    }`;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white">
      {/* Latar: teks raksasa berjalan + cahaya */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(700px 500px at 85% 15%, rgba(255,77,0,0.18), transparent 70%), radial-gradient(600px 500px at 5% 95%, rgba(255,122,0,0.1), transparent 70%)',
          }}
        />
        <div className="text-outline absolute inset-x-0 top-[12%] -rotate-6 font-display text-[9rem] font-extrabold uppercase leading-none opacity-[0.07] [--stroke:#FFFFFF]">
          <BackdropRow />
        </div>
        <div className="text-outline absolute inset-x-0 bottom-[8%] rotate-3 font-display text-[9rem] font-extrabold uppercase leading-none opacity-[0.07] [--stroke:#FF7A00]">
          <BackdropRow reverse />
        </div>
      </div>

      {/* Header */}
      <header className={`relative mx-auto flex w-full max-w-7xl items-center px-5 py-6 sm:px-8 ${s.rise}`}>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 -rotate-6 place-items-center rounded-lg bg-blaze text-ink">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Tix<span className="text-blaze">o</span>
          </span>
          <span className="ml-1 rotate-3 rounded-md bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
            Backstage
          </span>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Kiri: judul + kartu pass */}
        <div className="hidden lg:block">
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
            <BackstagePass scanning={isLoading} shaking={shaking} onShakeEnd={() => setShaking(false)} />
          </div>
        </div>

        {/* Kanan: form */}
        <div className="mx-auto w-full max-w-md">
          {/* Di mobile kartu pass tersembunyi, jadi form yang bergetar */}
          <div
            className={shaking ? s.shakeMobile : ''}
            onAnimationEnd={(e) => e.target === e.currentTarget && setShaking(false)}
          >
          <div
            className={`relative rounded-[32px] border-2 border-line bg-onyx/95 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-8 ${s.rise}`}
            style={{ ['--d' as string]: '0.25s' }}
          >
            {/* Pita sudut */}
            <span className="absolute -right-3 -top-3 rotate-6 rounded-lg bg-blaze px-3 py-1 font-display text-xs font-extrabold uppercase text-ink shadow-lg">
              Admin only
            </span>

            <div className={`mb-6 ${s.rise}`} style={{ ['--d' as string]: '0.35s' }}>
              <span className="grid h-12 w-12 -rotate-6 place-items-center rounded-2xl bg-blaze text-ink">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">Admin Workspace</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">
                Tunjukkan pass-mu. Masuk dengan kredensial resmi backend untuk mengelola panggung Tixo.
              </p>
            </div>

            {serverError && (
              <div
                role="alert"
                className={`mb-5 flex items-start gap-2.5 rounded-2xl border border-[#F87171]/40 bg-[#45121A]/80 p-3.5 text-xs text-[#FCA5A5] ${s.rise}`}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
                <div className="leading-relaxed">{serverError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className={s.rise} style={{ ['--d' as string]: '0.55s' }}>
                <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                  Email Administrator
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`${inputClass(errors.email)} pr-4`}
                  />
                  <span className={`pointer-events-none absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-blaze ${s.focusLine}`} />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-[#EF4444]">{errors.email}</p>}
              </div>

              <div className={s.rise} style={{ ['--d' as string]: '0.63s' }}>
                <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`${inputClass(errors.password)} pr-12`}
                  />
                  <span className={`pointer-events-none absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-blaze ${s.focusLine}`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-mute transition-[color,transform] duration-300 hover:rotate-12 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs font-semibold text-[#EF4444]">{errors.password}</p>}
              </div>

              <div className={`pt-2 ${s.rise}`} style={{ ['--d' as string]: '0.71s' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blaze px-4 py-4 font-display text-base font-extrabold text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-tangerine active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span aria-hidden className={`absolute inset-y-0 left-0 w-1/3 bg-white/40 ${s.shine}`} />
                  {isLoading ? (
                    <>
                      <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      <span className="relative">Memverifikasi Kredensial...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="relative h-5 w-5" />
                      <span className="relative">Masuk ke Admin Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          </div>

          <p className={`mt-6 text-center font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#52525B] ${s.rise}`} style={{ ['--d' as string]: '0.9s' }}>
            Tixo Backstage
          </p>
        </div>
      </main>
    </div>
  );
}
