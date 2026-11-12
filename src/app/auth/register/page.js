'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Ticket } from 'lucide-react';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { PasswordStrengthIndicator, BackButton } from '@/components/ui';
import useAuthStore from '@/stores/authStore';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from '@/lib/validators';
import { RATE_LIMIT } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer';
const disabledButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const { hit } = useRateLimit(RATE_LIMIT.REGISTER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const nameError = validateName(form.fullName);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(form.password, form.confirmPassword);
    if (nameError) nextErrors.fullName = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmError) nextErrors.confirmPassword = confirmError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const rateCheck = hit('register');
    if (!rateCheck.allowed) {
      setToast({
        isOpen: true,
        type: 'error',
        message: `Terlalu banyak percobaan. Coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
      });
      return;
    }

    const result = await register(form);
    if (result.success) {
      router.push('/auth/login?registered=1');
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
                <h1 className="text-2xl font-bold text-slate-50">Daftar</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Buat akun untuk membeli tiket festival
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                name="fullName"
                type="text"
                placeholder="Nama kamu"
                icon={UserIcon}
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                autoComplete="name"
              />

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

              <div className="space-y-3">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter, huruf besar & angka"
                  icon={Lock}
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="new-password"
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
                {form.password && (
                  <PasswordStrengthIndicator password={form.password} />
                )}
              </div>

              <Input
                label="Konfirmasi Password"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi password"
                icon={Lock}
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="cursor-pointer hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-4 text-xs text-slate-400 leading-relaxed">
                <p>
                  Setelah mendaftar, Anda perlu memverifikasi email melalui link yang dikirim ke
                  inbox Anda sebelum bisa masuk.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? disabledButton : primaryButton}`}
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Sudah punya akun?{' '}
                <Link
                  href="/auth/login"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Masuk
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
