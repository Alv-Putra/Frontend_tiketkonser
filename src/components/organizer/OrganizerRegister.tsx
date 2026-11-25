'use client';

import { useState, type FormEvent, type InputHTMLAttributes } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, FileUp, MailCheck, Ticket } from 'lucide-react';
import { fieldErrorsFrom } from '@/lib/api';
import { slugify } from '@/lib/formatters';
import { ORGANIZER_DOCUMENTS, validateOrganizerRegisterForm } from '@/lib/validators';
import authService from '@/services/authService';
import { WorkspaceLoginBackdrop } from '@/components/workspace/WorkspaceLoginArtwork';
import s from '@/components/workspace/login.module.css';

type DocumentType = (typeof ORGANIZER_DOCUMENTS)[number];

const documentLabels: Record<DocumentType, { label: string; hint: string }> = {
  business_entity: { label: 'Akta badan usaha', hint: 'Akta pendirian PT atau CV beserta pengesahannya.' },
  nib: { label: 'NIB', hint: 'Nomor Induk Berusaha dari OSS.' },
  npwp: { label: 'NPWP perusahaan', hint: 'Kartu atau surat keterangan NPWP badan usaha.' },
  pic_ktp: { label: 'KTP penanggung jawab', hint: 'KTP orang yang mewakili perusahaan.' },
};

const inputClass = (error?: string) =>
  `w-full rounded-md border-2 bg-ink px-4 py-3 text-sm text-white placeholder-[#52525B] outline-none transition-colors hover:border-[#3F3F46] focus:border-blaze/60 disabled:opacity-60 ${error ? 'border-[#EF4444]' : 'border-line'}`;

function Field({ name, label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string }) {
  const id = `organizer-${name}`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-white">{label}</label>
      <input id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={inputClass(error)} {...props} />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-[#EF4444]">{error}</p>}
    </div>
  );
}

export default function OrganizerRegister() {
  const [companyName, setCompanyName] = useState('');
  const [slug, setSlug] = useState<string | null>(null);
  const [files, setFiles] = useState<Partial<Record<DocumentType, File>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const profileSlug = slug ?? slugify(companyName);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const value = (key: string) => String(fd.get(key) ?? '').trim();
    const fields = {
      fullName: value('fullName'), companyName: value('companyName'), email: value('email'),
      password: String(fd.get('password') ?? ''), confirmPassword: String(fd.get('confirmPassword') ?? ''),
    };
    const { isValid, errors: formErrors } = validateOrganizerRegisterForm(fields, files);
    setErrors(formErrors);
    setServerError('');
    if (!isValid) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _confirm, ...account } = fields;
      const result = await authService.registerOrganizer(
        { ...account, slug: slugify(profileSlug), phone: value('phone'), website: value('website'), description: value('description') },
        files as Record<DocumentType, File>,
      );
      setDone(result.message ?? 'Pendaftaran organizer berhasil. Verifikasi email lalu tunggu persetujuan admin.');
    } catch (error) {
      setErrors(fieldErrorsFrom(error));
      setServerError(error instanceof Error ? error.message : 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white">
      <WorkspaceLoginBackdrop title="Organizer" />

      <header className={`relative mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-5 py-6 sm:px-8 ${s.rise}`}>
        <Link href="/" className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tangerine">
          <span className="grid h-9 w-9 -rotate-6 place-items-center rounded-lg bg-blaze text-ink"><Ticket aria-hidden="true" className="h-5 w-5" /></span>
          <span className="font-display text-2xl font-extrabold tracking-tight">Tix<span className="text-blaze">o</span></span>
        </Link>
        <Link href="/organizer/login" className="text-sm font-semibold text-mute underline-offset-4 hover:text-white hover:underline">Sudah punya akun? Masuk</Link>
      </header>

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-5 pb-16 sm:px-8">
        <div className={`rounded-2xl border-2 border-line bg-onyx/95 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-10 ${s.rise}`} style={{ ['--d' as string]: '0.15s' }}>
          {done ? (
            <div role="status" className="py-6 text-center">
              <span className="mx-auto grid h-14 w-14 -rotate-6 place-items-center rounded-2xl bg-blaze text-ink"><MailCheck aria-hidden="true" className="h-7 w-7" /></span>
              <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">Pendaftaran terkirim</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mute">{done}</p>
              <Link href="/organizer/login" className="mt-6 inline-flex rounded-md bg-blaze px-6 py-3.5 font-display font-extrabold text-ink hover:bg-tangerine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine">
                Ke halaman masuk
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Daftar jadi organizer</h1>
              <p className="mt-2 text-sm leading-relaxed text-mute">Isi data akun dan perusahaan, lalu unggah berkas legalitas. Admin memeriksa berkasmu sebelum akun bisa membuat konser.</p>

              {serverError && (
                <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-md border border-[#F87171]/40 bg-[#45121A]/80 p-3.5 text-xs text-[#FCA5A5]">
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />{serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
                <fieldset disabled={loading} className="space-y-4">
                  <legend className="mb-3 font-display text-lg font-bold">Akun</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="fullName" label="Nama lengkap *" autoComplete="name" error={errors.fullName} />
                    <Field name="email" label="Email *" type="email" autoComplete="email" spellCheck={false} error={errors.email} />
                    <Field name="password" label="Kata sandi *" type="password" autoComplete="new-password" error={errors.password} />
                    <Field name="confirmPassword" label="Ulangi kata sandi *" type="password" autoComplete="new-password" error={errors.confirmPassword} />
                  </div>
                </fieldset>

                <fieldset disabled={loading} className="space-y-4">
                  <legend className="mb-3 font-display text-lg font-bold">Perusahaan</legend>
                  <Field name="companyName" label="Nama perusahaan *" autoComplete="organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} error={errors.companyName} />
                  <div className="min-w-0">
                    <label htmlFor="organizer-slug" className="mb-1.5 block text-xs font-bold text-white">Link profil</label>
                    <div className={`flex items-center rounded-md border-2 bg-ink focus-within:border-blaze/60 ${errors.slug ? 'border-[#EF4444]' : 'border-line'}`}>
                      <span className="shrink-0 pl-4 text-sm text-mute">tixo.id/</span>
                      <input
                        id="organizer-slug"
                        value={profileSlug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-'))}
                        placeholder="nama-perusahaan"
                        spellCheck={false}
                        aria-invalid={Boolean(errors.slug)}
                        aria-describedby="organizer-slug-hint"
                        className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-sm text-white placeholder-[#52525B] outline-none"
                      />
                    </div>
                    <p id="organizer-slug-hint" className={`mt-1.5 text-xs ${errors.slug ? 'font-semibold text-[#EF4444]' : 'text-mute'}`}>{errors.slug ?? 'Dibuat otomatis dari nama perusahaan. Boleh diubah.'}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="phone" label="Nomor telepon (opsional)" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" error={errors.phone} />
                    <Field name="website" label="Website (opsional)" type="url" placeholder="https://" error={errors.website} />
                  </div>
                  <div>
                    <label htmlFor="organizer-description" className="mb-1.5 block text-xs font-bold text-white">Tentang perusahaan (opsional)</label>
                    <textarea id="organizer-description" name="description" rows={3} className={inputClass(errors.description)} />
                  </div>
                </fieldset>

                <fieldset disabled={loading}>
                  <legend className="font-display text-lg font-bold">Berkas legalitas</legend>
                  <p className="mt-1 text-xs text-mute">PDF, JPG, atau PNG, maksimal 5 MB per berkas.</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {ORGANIZER_DOCUMENTS.map((type) => {
                      const file = files[type];
                      const id = `organizer-${type}`;
                      return (
                        <li key={type}>
                          <input
                            id={id}
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            className="peer sr-only"
                            aria-invalid={Boolean(errors[type])}
                            aria-describedby={`${id}-status`}
                            onChange={(e) => {
                              const chosen = e.target.files?.[0];
                              setFiles((current) => ({ ...current, [type]: chosen }));
                              setErrors((current) => ({ ...current, [type]: undefined }));
                            }}
                          />
                          <label
                            htmlFor={id}
                            className={`flex h-full cursor-pointer items-start gap-3 rounded-md border-2 border-dashed p-4 transition-colors hover:border-blaze/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tangerine ${errors[type] ? 'border-[#EF4444]' : file ? 'border-solid border-line bg-ink' : 'border-line'}`}
                          >
                            {file
                              ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-status-success" />
                              : <FileUp aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-mute" />}
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">{documentLabels[type].label} *</span>
                              <span id={`${id}-status`} className={`mt-0.5 block break-words text-xs ${errors[type] ? 'font-semibold text-[#EF4444]' : 'text-mute'}`}>
                                {errors[type] ?? (file ? file.name : documentLabels[type].hint)}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-blaze px-4 py-4 font-display text-base font-extrabold text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-tangerine active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Mengirim pendaftaran…' : 'Kirim pendaftaran'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
