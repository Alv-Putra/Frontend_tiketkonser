'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import authService from '@/services/authService';
import type { FormErrors } from '@/types';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Tanpa token, link reset tidak valid: langsung tampilkan state error.
  const [stepState, setStep] = useState('form'); // 'form' | 'success' | 'error'
  const step = token ? stepState : 'error';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    0: { label: '', color: 'bg-border', width: '0%' },
    1: { label: 'Sangat Lemah', color: 'bg-error', width: '25%' },
    2: { label: 'Lemah', color: 'bg-orange-500', width: '50%' },
    3: { label: 'Sedang', color: 'bg-yellow-500', width: '75%' },
    4: { label: 'Kuat', color: 'bg-success', width: '100%' },
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Aturan kekuatan password dicek backend; indikator di atas hanya petunjuk.
    if (!password) newErrors.password = 'Password wajib diisi';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';

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

  if (step === 'error') {
    return (
      <div className="min-h-screen flex flex-col bg-primary-bg">
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 xl:px-20 pt-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Login
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-secondary-bg border border-border rounded-[24px] p-8 shadow-xl">
              <div className="w-20 h-20 bg-error/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-error" />
              </div>

              <h1 className="text-2xl font-black mb-3">
                <span className="text-gradient">Link Tidak Valid</span>
              </h1>

              <p className="text-text-secondary mb-6 leading-relaxed">
                Link reset password tidak valid atau sudah kadaluarsa.
                Silakan minta link baru.
              </p>

              <div className="space-y-3">
                <Link href="/auth/forgot-password">
                  <Button className="w-full" size="lg">
                    Minta Link Baru
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full" size="lg">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-bg">
      <div className="max-w-7xl mx-auto w-full px-5 md:px-10 xl:px-20 pt-8">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {step === 'success' ? (
            <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-success" />
              </motion.div>

              <h1 className="text-2xl font-black mb-3">
                <span className="text-gradient">Password Berhasil Diubah!</span>
              </h1>

              <p className="text-text-secondary mb-6 leading-relaxed">
                Password akun Anda telah berhasil direset.
                Sekarang Anda dapat masuk dengan password baru.
              </p>

              <Link href="/auth/login">
                <Button className="w-full" size="lg">
                  Masuk ke Tixo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-primary-accent" />
                </div>
                <h1 className="text-2xl font-black mb-2">
                  <span className="text-gradient">Reset Password</span>
                </h1>
                <p className="text-text-muted text-sm">
                  Masukkan password baru untuk akun Anda.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({});
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Minimal 8 karakter"
                      className={`w-full bg-primary-bg border rounded-xl px-4 py-3 pl-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all ${
                        errors.password
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-border focus:border-primary-accent focus:ring-primary-accent/30'
                      }`}
                      autoComplete="new-password"
                    />
                  </div>

                  {/* Password Strength */}
                  {passwordFocused && password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Kekuatan password:</span>
                        <span className={`font-medium ${
                          strengthIndex < 2 ? 'text-error' :
                          strengthIndex < 3 ? 'text-orange-500' :
                          strengthIndex < 4 ? 'text-yellow-500' : 'text-success'
                        }`}>
                          {strengthConfig[strengthIndex].label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{
                            width: strengthConfig[strengthIndex].width,
                            backgroundColor: strengthConfig[strengthIndex].color,
                          }}
                          className="h-full rounded-full"
                        />
                      </div>
                      <ul className="space-y-1">
                        {criteria.map((c) => (
                          <li
                            key={c.id}
                            className={`flex items-center gap-1.5 text-xs ${
                              c.test(password) ? 'text-success' : 'text-text-muted'
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
                    <p className="mt-2 text-sm text-error">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({});
                      }}
                      placeholder="Ulangi password baru"
                      className={`w-full bg-primary-bg border rounded-xl px-4 py-3 pl-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all ${
                        errors.confirmPassword
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-border focus:border-primary-accent focus:ring-primary-accent/30'
                      }`}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-error">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
              </form>

              {/* Help */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-text-muted">
                  Butuh bantuan?{' '}
                  <Link href="/help" className="text-primary-accent hover:underline">
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
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw size={32} className="text-primary-accent" />
        </motion.div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
