'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { validateLoginForm } from '@/lib/validators';

export default function LoginPage() {
  const [form, setForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: formErrors } = validateLoginForm(form);
    setErrors(formErrors);
    if (!isValid) return;
    await new Promise((r) => setTimeout(r, 600));
    setToast({ isOpen: true, type: 'success', message: 'Masuk berhasil (simulasi).' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-bg">
      <div className="max-w-7xl mx-auto w-full px-5 md:px-10 xl:px-20 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="bg-secondary-bg border border-border rounded-[24px] p-8 md:p-10 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black mb-2">
                <span className="text-gradient">Masuk</span>
              </h1>
              <p className="text-text-muted text-sm">
                Silakan masuk untuk melanjutkan pembelian tiket
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end -mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-accent hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Masuk
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted">
                Belum punya akun?{' '}
                <Link href="/auth/register" className="text-primary-accent hover:underline">
                  Daftar sekarang
                </Link>
              </p>
              <p className="text-sm text-text-muted mt-2">
                Belum menerima email verifikasi?{' '}
                <Link href="/verify-email" className="text-primary-accent hover:underline">
                  Kirim ulang
                </Link>
              </p>
            </div>
          </div>
        </div>
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
