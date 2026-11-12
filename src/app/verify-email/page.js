'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import BackButton from '@/components/ui/BackButton';
import authService from '@/services/authService';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer';
const disabledButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'resend'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('resend');
        setMessage('Token verifikasi tidak ditemukan. Masukkan email Anda untuk mengirim ulang link verifikasi.');
        return;
      }

      try {
        const result = await authService.confirmEmailVerification(token);
        setStatus('success');
        setMessage('Email Anda berhasil diverifikasi! Anda sekarang dapat masuk ke akun ConserId.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Terjadi kesalahan saat memverifikasi email. Silakan coba lagi atau minta link verifikasi baru.');
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      await authService.requestEmailVerification(email);
      setStatus('success');
      setMessage(`Link verifikasi telah dikirim ke ${email}. Periksa inbox atau folder spam Anda.`);
    } catch (error) {
      setMessage('Gagal mengirim link verifikasi. Silakan coba lagi.');
    } finally {
      setResending(false);
    }
  };

  const iconTile =
    'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center';

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
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`${iconTile} ${
                status === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : status === 'error'
                    ? 'bg-rose-500/10 border border-rose-500/30'
                    : 'bg-violet-600/20 border border-violet-500/30 text-violet-400'
              }`}
            >
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={30} className="text-white" />
                </motion.div>
              ) : status === 'success' ? (
                <CheckCircle size={30} className="text-emerald-400" />
              ) : status === 'error' ? (
                <AlertCircle size={30} className="text-rose-400" />
              ) : (
                <Mail size={30} className="text-white" />
              )}
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-50">
                {status === 'loading' && 'Memverifikasi...'}
                {status === 'success' && 'Berhasil!'}
                {status === 'error' && 'Gagal'}
                {status === 'resend' && 'Verifikasi Email'}
              </h1>

              {/* Message */}
              <p className="text-sm text-slate-400 leading-relaxed">
                {status === 'loading' && 'Sedang memverifikasi email Anda...'}
                {status === 'success' && message}
                {status === 'error' && message}
                {status === 'resend' && message}
              </p>
            </div>

            {/* Resend Form */}
            {status === 'resend' && (
              <div className="space-y-4 text-left">
                <Input
                  label="Alamat Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  icon={Mail}
                  autoComplete="email"
                />
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email}
                  className={`w-full ${resending || !email ? disabledButton : primaryButton}`}
                >
                  {resending ? 'Mengirim...' : 'Kirim Ulang Link Verifikasi'}
                </button>
              </div>
            )}

            {/* Success Actions */}
            {status === 'success' && (
              <div className="space-y-3">
                <Link href="/auth/login" className={`w-full ${primaryButton}`}>
                  Masuk ke ConserId
                </Link>
              </div>
            )}

            {/* Error Actions */}
            {status === 'error' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStatus('resend')}
                  className={`w-full ${primaryButton}`}
                >
                  Kirim Ulang Link Verifikasi
                </button>
                <Link href="/auth/login" className={`w-full ${secondaryButton}`}>
                  Masuk
                </Link>
              </div>
            )}

            {/* Help Link */}
            <div className="pt-6 border-t border-slate-800">
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
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
