'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, ShieldCheck, Save } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
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

function ProfileContent() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [fullName, setFullName] = useState(user?.name || '');
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
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: error.message || 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-5 md:px-10 xl:px-20 py-10">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
              <UserIcon size={28} className="text-primary-bg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary truncate">{user?.name}</h2>
              <p className="text-sm text-text-muted truncate">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
            />
            <Input
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              value={user?.email || ''}
              disabled
            />
            <div className="rounded-[18px] bg-surface border border-border p-4 flex items-center gap-3">
              <ShieldCheck size={18} className="text-primary-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Role</p>
                <p className="text-xs text-text-muted">{roleLabels[user?.role] || user?.role || '-'}</p>
              </div>
            </div>
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
          </form>
        </motion.div>
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