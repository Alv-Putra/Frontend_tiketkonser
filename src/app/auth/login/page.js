'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Ticket } from 'lucide-react';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { BackButton } from '@/components/ui';
import useAuthStore from '@/stores/authStore';
import { validateLoginForm } from '@/lib/validators';
import { RATE_LIMIT } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer';
const disabledButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const [wasRegistered, setWasRegistered] = useState(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('registered') === '1' : false
  );
  const { check, hit, reset } = useRateLimit(RATE_LIMIT.LOGIN);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: formErrors } = validateLoginForm(form);
    setErrors(formErrors);
    if (!isValid) return;

    const rateCheck = hit('login');
    if (!rateCheck.allowed) {
      setToast({
        isOpen: true,
        type: 'error',
        message: `Terlalu banyak percobaan. Coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
      });
      return;
    }

    const result = await login(form.email, form.password);
    if (result.success) {
      reset('login');
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      if (result.user.role === 'admin') {
        router.push(redirect || '/admin');
      } else if (result.user.role === 'organizer') {
        router.push(redirect || '/organizer');
      } else {
        router.push(redirect || '/');
      }
    } else {
      setToast({ isOpen: true, type: 'error', message: result.error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton href="/" label="Kembali ke Beranda" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            {/* Brand */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
                <Ticket size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-50">Masuk</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Silakan masuk untuk melanjutkan pembelian tiket
                </p>
              </div>
            </div>

            {wasRegistered && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-emerald-400 mb-0.5">Akun berhasil dibuat</p>
                <p>
                  Periksa email Anda dan klik link verifikasi untuk mengaktifkan akun sebelum masuk.{' '}
                  <Link href="/verify-email" className="text-violet-400 hover:text-violet-300 font-medium">
                    Kirim ulang link verifikasi
                  </Link>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                icon={Mail}
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                icon={Lock}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="cursor-pointer hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? disabledButton : primaryButton}`}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-800 text-center space-y-2">
              <p className="text-sm text-slate-400">
                Belum punya akun?{' '}
                <Link
                  href="/auth/register"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
              <p className="text-sm text-slate-400">
                Belum menerima email verifikasi?{' '}
                <Link
                  href="/verify-email"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Kirim ulang
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
