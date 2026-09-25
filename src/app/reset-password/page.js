'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import authService from '@/services/authService';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(token ? 'form' : 'invalid');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setToast({ isOpen: true, type: 'error', message: 'Kata sandi minimal 8 karakter' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setToast({ isOpen: true, type: 'error', message: 'Konfirmasi kata sandi tidak cocok' });
      return;
    }
    setStatus('submitting');
    try {
      const resMessage = await authService.confirmPasswordReset({
        token,
        newPassword: form.password,
      });
      setStatus('success');
      setMessage(resMessage || 'Kata sandi berhasil direset.');
    } catch (error) {
      setStatus('form');
      setToast({ isOpen: true, type: 'error', message: error.message || 'Token reset tidak valid atau sudah kadaluarsa.' });
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
                <span className="text-gradient">Reset Kata Sandi</span>
              </h1>
              <p className="text-text-muted text-sm">
                Buat kata sandi baru untuk akun Anda
              </p>
            </div>

            {status === 'invalid' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <XCircle size={48} className="text-error" />
                <p className="text-text-secondary font-medium">
                  Link reset tidak valid. Silakan minta link baru dari halaman lupa kata sandi.
                </p>
                <Link href="/auth/forgot-password">
                  <Button size="lg" className="mt-2">
                    Minta Link Baru
                  </Button>
                </Link>
              </div>
            )}

            {status === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Input
                    label="Kata Sandi Baru"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 karakter"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Konfirmasi Kata Sandi"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi baru"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-[38px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Memproses...' : 'Reset Kata Sandi'}
                </Button>
              </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}