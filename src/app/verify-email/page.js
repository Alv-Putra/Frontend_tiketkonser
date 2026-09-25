'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import authService from '@/services/authService';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(token ? 'loading' : 'form');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    let active = true;
    authService
      .confirmEmailVerification(token)
      .then(() => {
        if (active) {
          setStatus('success');
          setMessage('Email Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.');
        }
      })
      .catch((error) => {
        if (active) {
          setStatus('error');
          setMessage(error.message || 'Token verifikasi tidak valid atau sudah kadaluarsa.');
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const resMessage = await authService.requestEmailVerification(email);
      setStatus('sent');
      setMessage(resMessage || 'Link verifikasi telah dikirim. Silakan periksa kotak masuk Anda.');
    } catch (error) {
      setStatus('form');
      setToast({ isOpen: true, type: 'error', message: error.message || 'Gagal mengirim link verifikasi.' });
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
          Kembali ke Masuk
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black mb-2">
                <span className="text-gradient">Verifikasi Email</span>
              </h1>
              <p className="text-text-muted text-sm">
                Aktifkan akun Anda untuk mulai membeli tiket
              </p>
            </div>

            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-8 text-text-muted">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm">Memverifikasi akun Anda...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 size={48} className="text-success" />
                <p className="text-text-secondary font-medium">{message}</p>
                <Link href="/auth/login">
                  <Button size="lg" className="mt-2">
                    Masuk Sekarang
                  </Button>
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <XCircle size={48} className="text-error" />
                <p className="text-text-secondary font-medium">{message}</p>
                <button
                  type="button"
                  onClick={() => setStatus('form')}
                  className="mt-2 text-sm text-primary-accent hover:underline cursor-pointer"
                >
                  Kirim ulang link verifikasi
                </button>
              </div>
            )}

            {status === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Button type="submit" className="w-full" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Mengirim...' : 'Kirim Link Verifikasi'}
                </Button>
              </form>
            )}

            {status === 'sent' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 size={48} className="text-success" />
                <p className="text-text-secondary font-medium">{message}</p>
                <Link href="/auth/login">
                  <Button variant="outline" className="mt-2">
                    Kembali ke Masuk
                  </Button>
                </Link>
              </div>
            )}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}