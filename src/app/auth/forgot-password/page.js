'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { BackButton } from '@/components/ui';
import authService from '@/services/authService';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer';
const disabledButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
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
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton href="/auth/login" label="Kembali ke Masuk" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {step === 'form' ? (
            <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
                  <Mail size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-50">Lupa Password</h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Masukkan email Anda dan kami akan mengirim link untuk mereset password.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Alamat Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  placeholder="nama@email.com"
                  icon={Mail}
                  error={errors.email}
                  autoComplete="email"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${isLoading ? disabledButton : primaryButton}`}
                >
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>

              {/* Help */}
              <div className="pt-6 border-t border-slate-800 text-center">
                <p className="text-sm text-slate-400">
                  Tidak menerima email?{' '}
                  <Link
                    href="/help"
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckCircle size={30} className="text-emerald-400" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-50">Email Terkirim!</h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Kami telah mengirim link reset password ke{' '}
                  <span className="font-semibold text-slate-100">{email}</span>.
                  <br />
                  Periksa inbox atau folder spam Anda.
                </p>
              </div>

              <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Link reset akan kadaluarsa dalam <span className="font-semibold text-slate-100">1 jam</span>.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className={`w-full ${primaryButton}`}
                  onClick={() => {
                    setEmail('');
                    setStep('form');
                  }}
                >
                  Kirim Ulang Email
                </button>
                <Link href="/auth/login" className={`w-full ${secondaryButton}`}>
                  Kembali ke Login
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <p className="text-sm text-slate-400">
                  Tidak menerima email?{' '}
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
