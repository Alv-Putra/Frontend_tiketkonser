'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  error: {
    icon: XCircle,
    color: 'text-error',
    bgColor: 'bg-error/10',
    borderColor: 'border-error/30',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
};

function ToastItem({ toast, onClose }) {
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 50, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-secondary-bg border ${config.borderColor} rounded-[18px] px-6 py-4 shadow-xl max-w-md w-[calc(100%-40px)]`}
    >
      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
        )}
        <p className={`text-sm text-text-secondary ${toast.title ? 'mt-0.5' : ''}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration ?? 4000,
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (message, options) => addToast(message, { ...options, type: 'success' }),
    error: (message, options) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options) => addToast(message, { ...options, type: 'info' }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback for when used outside provider
    return {
      success: (message) => console.log('Toast success:', message),
      error: (message) => console.error('Toast error:', message),
      warning: (message) => console.warn('Toast warning:', message),
      info: (message) => console.info('Toast info:', message),
    };
  }
  return context;
}

export default ToastContext;
