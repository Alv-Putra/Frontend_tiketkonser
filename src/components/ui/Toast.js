'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const config = {
  success: { icon: CheckCircle, color: 'text-success' },
  error: { icon: XCircle, color: 'text-error' },
  warning: { icon: AlertCircle, color: 'text-warning' },
};

export default function Toast({ message, type = 'success', isOpen, onClose, duration = 4000 }) {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const { icon: Icon, color } = config[type] || config.success;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-secondary-bg border border-border rounded-[18px] px-6 py-4 shadow-xl"
        >
          <Icon size={20} className={color} />
          <span className="text-sm text-text-primary">{message}</span>
          <button onClick={onClose} className="ml-2 text-text-muted hover:text-text-primary cursor-pointer">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
