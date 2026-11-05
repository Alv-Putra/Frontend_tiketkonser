'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from '@/lib/validators';

export default function RegisterPage() {
  const [form, setForm] = useState<{ fullName: string; email: string; password: string; confirmPassword: string }>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    const nameError = validateName(form.fullName);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(form.password, form.confirmPassword);
    if (nameError) nextErrors.fullName = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmError) nextErrors.confirmPassword = confirmError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await new Promise((r) => setTimeout(r, 600));
    setToast({ isOpen: true, type: 'success', message: 'Pendaftaran berhasil (simulasi). Silakan verifikasi email.' });
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
                <span className="text-gradient">Daftar</span>
              </h1>
              <p className="text-text-muted text-sm">
                Buat akun untuk membeli tiket festival
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nama Lengkap"
                name="fullName"
                type="text"
                placeholder="Nama kamu"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                autoComplete="name"
              />
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
                  placeholder="Min. 8 karakter, huruf besar & angka"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
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
                  label="Konfirmasi Password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
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

              <div className="rounded-[18px] bg-surface border border-border p-4 text-xs text-text-muted leading-relaxed">
                <p>
                  Setelah mendaftar, Anda perlu memverifikasi email melalui link yang dikirim ke
                  inbox Anda sebelum bisa masuk.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Daftar
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-primary-accent hover:underline">
                  Masuk
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
