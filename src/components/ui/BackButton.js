'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable, accessible BackButton component following antislop principles.
 * Avoids repetitive inline back-button logic and tacky gradients.
 *
 * @param {string} [href] - Target URL to navigate to. If omitted, uses router.back().
 * @param {string} [label='Kembali'] - Text label to display.
 * @param {'subtle' | 'pill' | 'button'} [variant='subtle'] - Visual style variant.
 * @param {string} [className] - Additional classes.
 * @param {function} [onClick] - Optional custom click handler.
 */
export default function BackButton({
  href,
  label = 'Kembali',
  variant = 'subtle',
  className = '',
  onClick,
  ...props
}) {
  const router = useRouter();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (!href) {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const variantStyles = {
    subtle:
      'inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg py-1 px-2 -ml-2',
    pill:
      'inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full px-4 py-2 transition-all shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 min-h-[40px]',
    button:
      'inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 min-h-[44px]',
  };

  const content = (
    <>
      <ArrowLeft
        size={16}
        className="transition-transform duration-200 group-hover:-translate-x-1 shrink-0 text-slate-400 group-hover:text-violet-400"
      />
      <span>{label}</span>
    </>
  );

  const combinedClass = `${variantStyles[variant] || variantStyles.subtle} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass} aria-label={label} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={combinedClass}
      aria-label={label}
      {...props}
    >
      {content}
    </button>
  );
}
