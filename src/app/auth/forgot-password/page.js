'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import authService from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('form');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const resMessage = await authService.requestPasswordReset(email);
      setStatus('sent');
      setMessage(resMessage || 'Jika email terdaftar, link reset kata sandi telah dikirim.');
    } catch (error) {
      setStatus('form');
      setToast({ isOpen: true, type: 'error', message: error.message || 'Gagal mengirim link reset.' });
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
                <span className="text-gradient">Lupa Kata Sandi</span>
              </h1>
              <p className="text-text-muted text-sm">
                Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi
              </p>
            </div>

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
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Link Reset'
                  )}
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

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted">
                Ingat kata sandi?{' '}
                <Link href="/auth/login" className="text-primary-accent hover:underline">
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