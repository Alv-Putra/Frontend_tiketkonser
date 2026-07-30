'use client';

import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-primary text-white hover:opacity-90 glow-yellow',
  secondary: 'bg-secondary-accent text-white hover:bg-blue-700',
  outline: 'border border-border text-text-primary hover:bg-surface',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface',
  success: 'bg-success text-white hover:opacity-90',
  danger: 'bg-error text-white hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
  xl: 'px-10 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
