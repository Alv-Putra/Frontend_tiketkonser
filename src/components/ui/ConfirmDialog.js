'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
}) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !loading) {
          onClose?.();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, loading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-secondary-bg border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-muted mb-6">{message}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                {cancelLabel}
              </Button>
              <Button variant={variant} onClick={onConfirm} className="flex-1" disabled={loading}>
                {loading ? 'Memproses...' : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
