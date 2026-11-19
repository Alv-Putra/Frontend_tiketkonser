'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Ticket,
} from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import { validateLoginForm } from '@/lib/validators';
import { RATE_LIMIT, ROLES } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

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
  const { hit, reset } = useRateLimit(RATE_LIMIT.LOGIN);

  // If already authenticated as admin, redirect directly to admin workspace
  useEffect(() => {
    if (isHydrated && user && user.role === ROLES.ADMIN) {
      const redirect = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      router.replace(redirect || '/admin');
    }
  }, [user, isHydrated, router]);

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

  const handleUsePreset = () => {
    setForm({
      email: 'admin@conserid.com',
      password: 'Admin123',
    });
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    const { isValid, errors: formErrors } = validateLoginForm(form);
    setErrors(formErrors);
    if (!isValid) return;

    const rateCheck = hit('admin_login');
    if (!rateCheck.allowed) {
      setServerError(`Terlalu banyak percobaan masuk. Silakan tunggu ${rateCheck.retryAfterSeconds} detik sebelum mencoba kembali.`);
      return;
    }

    const result = await login(form.email, form.password);

    if (result.success && result.user) {
      reset('admin_login');
      if (result.user.role !== ROLES.ADMIN) {
        await logout();
        setServerError('Akses ditolak: Akun Anda tidak memiliki hak akses Administrator. Halaman ini hanya diperuntukkan bagi pengelola sistem.');
        return;
      }

      const redirect = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      router.replace(redirect || '/admin');
    } else {
      setServerError(result.error || 'Email atau password yang Anda masukkan salah.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FFFFFF]">
      {/* Top Bar with Brand and Back Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Website</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2A1000] border border-[#FF4D00]/30 flex items-center justify-center text-[#FF7A00]">
            <Ticket className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#FFFFFF]">
            Conser<span className="text-[#FF7A00]">Id</span>
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#141417] text-[#FF7A00] border border-[#27272A]">
            Admin
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#141417] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Header / Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#2A1000] border border-[#FF4D00]/30 flex items-center justify-center text-[#FF7A00] mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">
                Admin Workspace
              </h1>
              <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                Masuk ke panel kendali administrator menggunakan kredensial resmi backend ConserId.
              </p>
            </div>

            {/* Backend Account Quick-Fill Card */}
            <div className="mb-6 rounded-xl bg-[#09090B] border border-[#27272A] p-3.5 text-xs text-[#A1A1AA]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#FFFFFF] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Kredensial Backend:
                </span>
                <button
                  type="button"
                  onClick={handleUsePreset}
                  className="text-[11px] font-medium text-[#FF7A00] hover:text-[#FFA366] hover:underline cursor-pointer"
                >
                  Gunakan Akun Ini
                </button>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-[#71717A] bg-[#141417] p-2 rounded border border-[#27272A]/60">
                <p>Email: <span className="text-[#FFFFFF]">admin@conserid.com</span></p>
                <p>Password: <span className="text-[#FFFFFF]">Admin123</span></p>
              </div>
            </div>

            {/* Error Message Alert */}
            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-xl bg-[#45121A]/80 border border-[#F87171]/40 p-3.5 text-xs text-[#FCA5A5] flex items-start gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
                <div className="leading-relaxed">{serverError}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#FFFFFF] mb-1.5"
                >
                  Email Administrator
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@conserid.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`w-full bg-[#09090B] border text-[#FFFFFF] placeholder-[#71717A] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                        : 'border-[#27272A] focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-[#EF4444] flex items-center gap-1">
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#FFFFFF] mb-1.5"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`w-full bg-[#09090B] border text-[#FFFFFF] placeholder-[#71717A] text-sm rounded-xl pl-10 pr-11 py-2.5 focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                        : 'border-[#27272A] focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71717A] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-[#EF4444] flex items-center gap-1">
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF4D00] hover:bg-[#E04300] active:bg-[#C23A00] text-[#09090B] font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 focus:ring-offset-[#141417] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#FF4D00]/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#09090B]/30 border-t-[#09090B] rounded-full animate-spin" />
                      <span>Memverifikasi Kredensial...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Masuk ke Admin Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Navigation within Card */}
            <div className="mt-6 pt-5 border-t border-[#27272A] text-center space-y-2">
              <p className="text-xs text-[#71717A]">
                Bukan administrator?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#FF7A00] hover:text-[#FFA366] hover:underline font-medium"
                >
                  Masuk sebagai Penonton
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-[#71717A]">
            ConserId Security Gateway • Backend UKK v1.0
          </div>
        </motion.div>
      </main>
    </div>
  );
}
