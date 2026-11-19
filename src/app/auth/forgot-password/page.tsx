'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import authService from '@/services/authService';
import type { FormErrors } from '@/types';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const validateEmail = (email) => {
    if (!email) return 'Email wajib diisi';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.requestPasswordReset(email);
      setStep('success');
    } catch (error) {
      setToast({
        isOpen: true,
        type: 'error',
        message: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          {step === 'form' ? (
            <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-primary-accent" />
                </div>
                <h1 className="text-2xl font-black mb-2">
                  <span className="text-gradient">Lupa Password</span>
                </h1>
                <p className="text-text-muted text-sm">
                  Masukkan email Anda dan kami akan mengirim link untuk mereset password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({});
                      }}
                      placeholder="nama@email.com"
                      className={`w-full bg-primary-bg border rounded-xl px-4 py-3 pl-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all ${
                        errors.email
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-border focus:border-primary-accent focus:ring-primary-accent/30'
                      }`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-error">{errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </Button>
              </form>

              {/* Help */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-text-muted">
                  Tidak menerima email?{' '}
                  <Link href="/help" className="text-primary-accent hover:underline">
                    Hubungi Kami
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-success" />
              </motion.div>

              <h1 className="text-2xl font-black mb-3">
                <span className="text-gradient">Email Terkirim!</span>
              </h1>

              <p className="text-text-secondary mb-6 leading-relaxed">
                Kami telah mengirim link reset password ke <span className="font-semibold text-text-primary">{email}</span>.
                <br />
                Periksa inbox atau folder spam Anda.
              </p>

              <div className="bg-surface rounded-[18px] border border-border p-4 mb-6">
                <p className="text-sm text-text-muted">
                  Link reset akan kadaluarsa dalam <span className="font-semibold text-text-primary">1 jam</span>.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setEmail('');
                    setStep('form');
                  }}
                >
                  Kirim Ulang Email
                </Button>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full" size="lg">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-text-muted">
                  Tidak menerima email?{' '}
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
