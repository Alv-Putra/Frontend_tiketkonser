'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, ShieldCheck, Save, Camera, CheckCircle, Edit3 } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import useAuthStore from '@/stores/authStore';
import { validateName } from '@/lib/validators';

const roleLabels = {
  admin: 'Admin',
  organizer: 'Organizer',
  customer: 'Customer',
  buyer: 'Customer',
};

const menuItems = [
  { label: 'Tiket Saya', href: '/my-tickets', icon: '🎫', color: 'primary' },
  { label: 'Riwayat Pesanan', href: '/orders', icon: '📋', color: 'success' },
  { label: 'Kebijakan Privasi', href: '/privacy', icon: '🔒', color: 'secondary' },
  { label: 'Syarat & Ketentuan', href: '/terms', icon: '📜', color: 'warning' },
];

function ProfileContent() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [fullName, setFullName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(fullName);
    if (nameError) {
      setError(nameError);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await updateProfile({ name: fullName, full_name: fullName });
      setToast({ isOpen: true, type: 'success', message: 'Profil berhasil diperbarui' });
      setIsEditing(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: error.message || 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-gradient">Profil Saya</span>
          </h1>
          <p className="text-text-secondary">Kelola informasi akun Anda.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-secondary-bg border border-border rounded-2xl p-6 md:p-8">
              {/* Avatar & Edit */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-primary-accent hover:text-white transition-colors cursor-pointer">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
                    <p className="text-sm text-text-muted">{user?.email}</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary-accent/10 text-primary-accent rounded-full text-xs font-medium">
                      <ShieldCheck size={12} />
                      {roleLabels[user?.role] || user?.role || '-'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 size={16} />
                  {isEditing ? 'Batal' : 'Edit'}
                </Button>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nama Lengkap"
                    name="fullName"
                    type="text"
                    placeholder="Nama kamu"
                    icon={UserIcon}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={error}
                    autoComplete="name"
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                {/* Role Display */}
                <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} className="text-primary-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Role Akun</p>
                      <p className="text-xs text-text-muted">
                        {roleLabels[user?.role] === 'Admin' && 'Akses penuh ke semua fitur platform'}
                        {roleLabels[user?.role] === 'Organizer' && 'Dapat membuat dan mengelola event'}
                        {(roleLabels[user?.role] === 'Customer' || roleLabels[user?.role] === 'Buyer') && 'Dapat membeli tiket dan melihat e-ticket'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                  <span className="text-text-muted">Anggota sejak</span>
                  <span className="text-text-primary font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Baru'}
                  </span>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4"
                  >
                    <Button type="submit" size="lg" className="w-full" disabled={saving}>
                      {saving ? (
                        'Menyimpan...'
                      ) : (
                        <>
                          <Save size={16} />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-secondary-bg border border-border rounded-2xl p-5">
              <h3 className="font-bold text-text-primary mb-4">Menu Cepat</h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface transition-colors group"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm text-text-primary group-hover:text-primary-accent transition-colors">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-secondary-bg border border-border rounded-2xl p-5">
              <h3 className="font-bold text-text-primary mb-4">Keamanan Akun</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔑</span>
                    <span className="text-sm text-text-primary">Ubah Password</span>
                  </div>
                  <span className="text-text-muted">→</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📱</span>
                    <span className="text-sm text-text-primary">Verifikasi 2FA</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">Tersedia</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-colors cursor-pointer">
              <span>🚪</span>
              <span className="text-sm font-medium">Keluar</span>
            </button>
          </motion.div>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </CustomerLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}