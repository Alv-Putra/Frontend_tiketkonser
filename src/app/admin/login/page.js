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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-slate-50">
            Conser<span className="text-violet-400">Id</span>
          </Link>
          <p className="text-slate-400 mt-2">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#111827] border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-50 mb-2">Selamat Datang</h1>
            <p className="text-slate-400 text-sm">Masuk ke akun admin Anda</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400">
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all pr-12"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          <div className="rounded-xl bg-[#0F172A] border border-slate-800 p-3 text-xs text-slate-500 leading-relaxed">
            Demo: admin@conserid.com / Admin123
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
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
