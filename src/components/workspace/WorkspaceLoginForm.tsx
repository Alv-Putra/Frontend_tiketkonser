import { useState, type ChangeEventHandler, type FormEventHandler } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { FormErrors } from '@/types';
import s from './login.module.css';

type WorkspaceLoginFormProps = {
  role: string;
  title: string;
  account: string;
  form: { email: string; password: string };
  errors: FormErrors;
  serverError: string;
  isLoading: boolean;
  shaking: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onShakeEnd: () => void;
};

function inputClass(hasError?: string) {
  return `peer w-full rounded-2xl border-2 bg-ink py-3.5 pl-11 text-sm text-white placeholder-[#52525B] outline-none transition-colors duration-200 disabled:opacity-60 ${
    hasError ? 'border-[#EF4444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine' : 'border-line focus:border-blaze/60 hover:border-[#3F3F46]'
  }`;
}

export default function WorkspaceLoginForm({
  role,
  title,
  account,
  form,
  errors,
  serverError,
  isLoading,
  shaking,
  onChange,
  onSubmit,
  onShakeEnd,
}: WorkspaceLoginFormProps) {
  const emailId = role + '-email';
  const passwordId = role + '-password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Di mobile kartu pass tersembunyi, jadi form yang bergetar */}
      <div
        className={shaking ? s.shakeMobile : ''}
        onAnimationEnd={(e) => e.target === e.currentTarget && onShakeEnd()}
      >
        <div
          className={`relative rounded-[32px] border-2 border-line bg-onyx/95 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-8 ${s.rise}`}
          style={{ ['--d' as string]: '0.25s' }}
        >
          {/* Pita sudut */}
          <span className="absolute -right-3 -top-3 rotate-6 rounded-lg bg-blaze px-3 py-1 font-display text-xs font-extrabold uppercase text-ink shadow-lg">
            {title} only
          </span>

          <div className={`mb-6 ${s.rise}`} style={{ ['--d' as string]: '0.35s' }}>
            <span className="grid h-12 w-12 -rotate-6 place-items-center rounded-2xl bg-blaze text-ink">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-xl leading-9 font-extrabold tracking-tight min-[375px]:text-2xl sm:text-3xl">{title} Workspace</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">
              Tunjukkan pass-mu. Masuk dengan kredensial resmi backend untuk mengelola panggung Tixo.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className={`mb-5 flex items-start gap-2.5 rounded-2xl border border-[#F87171]/40 bg-[#45121A]/80 p-3.5 text-xs text-[#FCA5A5] ${s.rise}`}
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
              <div className="leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className={s.rise} style={{ ['--d' as string]: '0.55s' }}>
              <label htmlFor={emailId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                Email {account}
              </label>
              <div className="relative">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? emailId + '-error' : undefined}
                  disabled={isLoading}
                  className={`${inputClass(errors.email)} pr-4`}
                />
                <span className={`pointer-events-none absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-blaze ${s.focusLine}`} />
              </div>
              {errors.email && <p id={emailId + '-error'} role="alert" className="mt-1.5 text-xs font-semibold text-[#EF4444]">{errors.email}</p>}
            </div>

            <div className={s.rise} style={{ ['--d' as string]: '0.63s' }}>
              <label htmlFor={passwordId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                <input
                  id={passwordId}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? passwordId + '-error' : undefined}
                  disabled={isLoading}
                  className={`${inputClass(errors.password)} pr-12`}
                />
                <span className={`pointer-events-none absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-blaze ${s.focusLine}`} />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-mute transition-[color,transform] duration-300 hover:rotate-12 hover:text-white focus-visible:outline-2 focus-visible:outline-tangerine"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id={passwordId + '-error'} role="alert" className="mt-1.5 text-xs font-semibold text-[#EF4444]">{errors.password}</p>}
            </div>

            <div className={`pt-2 ${s.rise}`} style={{ ['--d' as string]: '0.71s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blaze px-3 py-4 font-display text-sm/6 font-extrabold sm:px-4 sm:text-base text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-tangerine active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span aria-hidden className={`absolute inset-y-0 left-0 w-1/3 bg-white/40 ${s.shine}`} />
                {isLoading ? (
                  <>
                    <span className="relative h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    <span className="relative">Memverifikasi Kredensial…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck aria-hidden="true" className="relative h-5 w-5" />
                    <span className="relative">Masuk ke {title} Workspace</span>
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
  );
}
