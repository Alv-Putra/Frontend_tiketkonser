'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Mohon isi semua kolom');
      return;
    }
    const result = await login(email, password);
    if (result.success && result.user.role === 'admin') {
      router.push('/admin');
    } else if (result.success) {
      setToast({ isOpen: true, type: 'error', message: 'Email ini bukan akun admin.' });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 via-transparent to-secondary-accent/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold">
             <span className="text-gradient">Conser</span>Id
          </Link>
          <p className="text-text-muted mt-2">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-secondary-bg border border-border rounded-3xl p-8 space-y-6"
        >
          <h1 className="text-2xl font-bold text-center mb-2">Selamat Datang</h1>
          <p className="text-text-muted text-sm text-center mb-6">Masuk ke akun admin Anda</p>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="admin@conserid.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          <div className="rounded-xl bg-surface border border-border p-3 text-xs text-text-muted leading-relaxed">
            Demo: admin@conserid.com / Admin123
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-text-muted hover:text-secondary-accent transition-colors">
              Kembali ke Website
            </Link>
          </div>
        </form>
      </motion.div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}