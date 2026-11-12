'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import BackButton from '@/components/ui/BackButton';
import authService from '@/services/authService';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer';
const disabledButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60';

const inputBase =
  'w-full bg-[#0F172A] border rounded-xl px-4 py-3 pl-12 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState(() => (token ? 'form' : 'error')); // 'form' | 'success' | 'error'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength criteria
  const criteria = [
    { id: 'length', label: 'Minimal 8 karakter', test: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', label: 'Mengandung huruf besar', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'Mengandung huruf kecil', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'Mengandung angka', test: (pwd) => /\d/.test(pwd) },
  ];

  const getStrengthIndex = (pwd) => {
    if (!pwd) return 0;
    const passed = criteria.filter((c) => c.test(pwd)).length;
    return passed;
  };

  const strengthIndex = getStrengthIndex(password);
  const strengthConfig = {
    0: { label: '', bar: '#1E293B', width: '0%' },
    1: { label: 'Sangat Lemah', bar: '#EF4444', width: '25%' },
    2: { label: 'Lemah', bar: '#F97316', width: '50%' },
    3: { label: 'Sedang', bar: '#F59E0B', width: '75%' },
    4: { label: 'Kuat', bar: '#10B981', width: '100%' },
  };

  const validateForm = () => {
    const newErrors = {};

    // Check password strength
    if (strengthIndex < 3) {
      newErrors.password = 'Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, dan angka.';
    }

    // Check confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await authService.confirmPasswordReset({ token, newPassword: password });
      setStep('success');
    } catch (error) {
      setToast({
        isOpen: true,
        type: 'error',
        message: error.message || 'Terjadi kesalahan. Link mungkin sudah kadaluarsa.',
      });
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setStep('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw size={32} className="text-violet-400" />
        </motion.div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Login
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle size={30} className="text-rose-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-50">Link Tidak Valid</h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Link reset password tidak valid atau sudah kadaluarsa.
                  Silakan minta link baru.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/auth/forgot-password" className={`w-full ${primaryButton}`}>
                  Minta Link Baru
                </Link>
                <Link href="/auth/login" className={`w-full ${secondaryButton}`}>
                  Kembali ke Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton href="/auth/login" label="Kembali ke Login" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {step === 'success' ? (
            <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckCircle size={30} className="text-emerald-400" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-50">Password Berhasil Diubah!</h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Password akun Anda telah berhasil direset.
                  Sekarang Anda dapat masuk dengan password baru.
                </p>
              </div>

              <Link href="/auth/login" className={`w-full ${primaryButton}`}>
                Masuk ke ConserId
              </Link>
            </div>
          ) : (
            <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
                  <Lock size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-50">Reset Password</h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Masukkan password baru untuk akun Anda.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Password Baru
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({});
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Minimal 8 karakter"
                      className={`${inputBase} ${
                        errors.password
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/20'
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {passwordFocused && password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Kekuatan password:</span>
                        <span className={`font-medium ${
                          strengthIndex < 2 ? 'text-rose-400' :
                          strengthIndex < 3 ? 'text-orange-400' :
                          strengthIndex < 4 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {strengthConfig[strengthIndex].label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{
                            width: strengthConfig[strengthIndex].width,
                            backgroundColor: strengthConfig[strengthIndex].bar,
                          }}
                          className="h-full rounded-full"
                        />
                      </div>
                      <ul className="space-y-1">
                        {criteria.map((c) => (
                          <li
                            key={c.id}
                            className={`flex items-center gap-1.5 text-xs ${
                              c.test(password) ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {c.test(password) ? (
                              <CheckCircle size={12} />
                            ) : (
                              <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">-</span>
                            )}
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({});
                      }}
                      placeholder="Ulangi password baru"
                      className={`${inputBase} ${
                        errors.confirmPassword
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/20'
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-rose-400">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${isLoading ? disabledButton : primaryButton}`}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>

              {/* Help */}
              <div className="pt-6 border-t border-slate-800 text-center">
                <p className="text-sm text-slate-400">
                  Butuh bantuan?{' '}
                  <Link
                    href="/help"
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </p>
              </div>
            </div>
          )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw size={32} className="text-violet-400" />
        </motion.div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
