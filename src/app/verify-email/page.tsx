'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import authService from '@/services/authService';

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

  return (
    <div className="min-h-screen flex flex-col bg-primary-bg">
      <div className="max-w-7xl mx-auto w-full px-5 md:px-10 xl:px-20 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl text-center">
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                status === 'success'
                  ? 'bg-success/15'
                  : status === 'error'
                    ? 'bg-error/15'
                    : 'bg-primary-accent/15'
              }`}
            >
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={36} className="text-primary-accent" />
                </motion.div>
              ) : status === 'success' ? (
                <CheckCircle size={36} className="text-success" />
              ) : status === 'error' ? (
                <AlertCircle size={36} className="text-error" />
              ) : (
                <Mail size={36} className="text-primary-accent" />
              )}
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-black mb-3">
              {status === 'loading' && 'Memverifikasi...'}
              {status === 'success' && 'Berhasil!'}
              {status === 'error' && 'Gagal'}
              {status === 'resend' && 'Verifikasi Email'}
            </h1>

            {/* Message */}
            <p className="text-text-secondary mb-6 leading-relaxed">
              {status === 'loading' && 'Sedang memverifikasi email Anda...'}
              {status === 'success' && message}
              {status === 'error' && message}
              {status === 'resend' && message}
            </p>

            {/* Resend Form */}
            {status === 'resend' && (
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-text-secondary mb-2 text-left">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-primary-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleResend}
                  disabled={resending || !email}
                >
                  {resending ? 'Mengirim...' : 'Kirim Ulang Link Verifikasi'}
                </Button>
              </div>
            )}

            {/* Success Actions */}
            {status === 'success' && (
              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button className="w-full" size="lg">
                    Masuk ke ConserId
                  </Button>
                </Link>
              </div>
            )}

            {/* Error Actions */}
            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStatus('resend')}
                >
                  Kirim Ulang Link Verifikasi
                </Button>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full" size="lg">
                    Masuk
                  </Button>
                </Link>
              </div>
            )}

            {/* Help Link */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-muted">
                Butuh bantuan?{' '}
                <Link href="/help" className="text-primary-accent hover:underline">
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
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw size={32} className="text-primary-accent" />
        </motion.div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
