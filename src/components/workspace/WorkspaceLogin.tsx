'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from 'lucide-react';
import { WorkspaceLoginBackdrop, WorkspaceLoginIntro } from './WorkspaceLoginArtwork';
import WorkspaceLoginForm from './WorkspaceLoginForm';
import useAuthStore from '@/stores/authStore';
import { validateLoginForm } from '@/lib/validators';
import { RATE_LIMIT } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';
import type { FormErrors } from '@/types';
import s from './login.module.css';

type WorkspaceRole = 'admin' | 'organizer';

const workspaceLabels = {
  admin: { title: 'Admin', account: 'Administrator', passCode: 'TX-ADM-0001' },
  organizer: { title: 'Organizer', account: 'Organizer', passCode: 'TX-ORG-0001' },
};

function workspaceDestination(role: WorkspaceRole) {
  const workspace = '/' + role;
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (!redirect || !new RegExp('^/' + role + '([/?#]|$)').test(redirect)) return workspace;

  const target = new URL(redirect, window.location.origin);
  const path = target.pathname.replace(/\/$/, '');
  if (
    target.origin === window.location.origin &&
    (path === workspace || path.startsWith(workspace + '/')) &&
    path !== workspace + '/login'
  ) {
    return target.pathname + target.search + target.hash;
  }
  return workspace;
}

export default function WorkspaceLogin({ role }: { role: WorkspaceRole }) {
  const { title, account, passCode } = workspaceLabels[role];
  const rateLimitKey = role + '_login';
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrate = useAuthStore((state) => state.hydrate);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [shaking, setShaking] = useState(false);
  const { hit, reset } = useRateLimit(RATE_LIMIT.LOGIN);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      return;
    }
    if (user?.role === role) {
      router.replace(workspaceDestination(role));
    }
  }, [user, isHydrated, hydrate, role, router]);

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
      const firstInvalid = e.currentTarget.elements.namedItem(formErrors.email ? 'email' : 'password');
      if (firstInvalid instanceof HTMLInputElement) firstInvalid.focus();
      setShaking(true);
      return;
    }

    const rateCheck = hit(rateLimitKey);
    if (!rateCheck.allowed) {
      showError(`Terlalu banyak percobaan masuk. Silakan tunggu ${rateCheck.retryAfterSeconds} detik sebelum mencoba kembali.`);
      return;
    }

    const result = await login(form.email, form.password, { mockFallback: false, role });

    if (result.success && result.user) {
      reset(rateLimitKey);
      if (result.user.role !== role) {
        await logout();
        showError('Akses ditolak: Akun Anda tidak memiliki hak akses ' + account + '. Halaman ini hanya diperuntukkan bagi pengelola sistem.');
        return;
      }

      router.replace(workspaceDestination(role));
    } else {
      setErrors(result.fieldErrors ?? {});
      showError(result.error || 'Email atau password yang Anda masukkan salah.');
    }
  };

  const stopShake = () => setShaking(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white">
      <WorkspaceLoginBackdrop title={title} />

      <header className={`relative mx-auto flex w-full max-w-7xl items-center px-5 py-6 sm:px-8 ${s.rise}`}>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 -rotate-6 place-items-center rounded-lg bg-blaze text-ink">
            <Ticket aria-hidden="true" className="h-5 w-5" />
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
        <WorkspaceLoginIntro
          title={title}
          account={account}
          passCode={passCode}
          scanning={isLoading}
          shaking={shaking}
          onShakeEnd={stopShake}
        />
        <WorkspaceLoginForm
          role={role}
          title={title}
          account={account}
          form={form}
          errors={errors}
          serverError={serverError}
          isLoading={isLoading}
          shaking={shaking}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onShakeEnd={stopShake}
        />
      </main>
    </div>
  );
}
