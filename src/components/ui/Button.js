'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button hierarchy (Midnight Stage)
 *  - primary   : gradient violet -> fuchsia, for the main action of a view
 *  - secondary : slate surface, for supporting actions
 *  - danger    : rose outline, for destructive actions
 *  - disabled  : muted slate, rendered automatically when disabled/loading
 */
const variants = {
  primary:
    'bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  secondary:
    'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium hover:-translate-y-0.5 active:scale-[0.98]',
  outline:
    'bg-transparent hover:bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium hover:-translate-y-0.5 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-slate-50 font-medium',
  success:
    'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold shadow-sm hover:-translate-y-0.5 active:scale-[0.98]',
  danger:
    'bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-medium hover:-translate-y-0.5 active:scale-[0.98]',
  warning:
    'bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-300 border border-amber-500/30 font-medium hover:-translate-y-0.5 active:scale-[0.98]',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg min-h-[32px]',
  sm: 'px-4 py-2 text-sm rounded-lg min-h-[38px]',
  md: 'px-5 py-2.5 text-sm rounded-xl min-h-[44px]',
  lg: 'px-6 py-3 text-base rounded-xl min-h-[48px]',
  xl: 'px-8 py-3.5 text-lg rounded-xl min-h-[52px]',
};

const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const disabledClasses =
  'bg-slate-800/60 text-slate-500 border border-slate-800 font-medium cursor-not-allowed opacity-60 shadow-none hover:bg-slate-800/60 hover:text-slate-500 hover:border-slate-800 hover:translate-y-0 active:scale-100';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    onClick,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  const iconSize = iconSizes[size] || 16;
  const LeftIcon = leftIcon;
  const RightIcon = rightIcon;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-heading transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19] cursor-pointer ${
        isDisabled ? disabledClasses : variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={iconSize} className="animate-spin shrink-0" />}
      {!loading && LeftIcon && (
        <span className="shrink-0">
          <LeftIcon size={iconSize} />
        </span>
      )}
      {loading ? loadingText || 'Memproses...' : children}
      {!loading && RightIcon && (
        <span className="shrink-0">
          <RightIcon size={iconSize} />
        </span>
      )}
    </button>
  );
});

export default Button;
