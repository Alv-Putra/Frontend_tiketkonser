'use client';

import { motion } from 'framer-motion';

const variants = {
  default: 'border-slate-800',
  primary: 'border-violet-500/30 bg-violet-600/5',
  success: 'border-emerald-500/30 bg-emerald-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  error: 'border-rose-500/30 bg-rose-500/5',
};

const hoverVariants = {
  default: 'hover:border-violet-500/50',
  primary: 'hover:border-violet-500',
  success: 'hover:border-emerald-500',
  warning: 'hover:border-amber-500',
  error: 'hover:border-rose-500',
};

export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  ...props
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = onClick ? motion.button : 'div';
  const motionProps = onClick
    ? {
        whileHover: hoverable ? { y: -4 } : undefined,
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`
        bg-secondary-bg border border-slate-800 rounded-2xl
        ${paddingClasses[padding]}
        ${variant !== 'default' ? variants[variant] : ''}
        ${hoverable ? hoverVariants[variant] : ''}
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-bold text-slate-50 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-slate-400 mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'up', // 'up' | 'down' | 'neutral'
  color = 'primary',
  className = '',
}) {
  const colorClasses = {
    primary: 'text-violet-400 bg-violet-500/10',
    'secondary-accent': 'text-pink-400 bg-pink-500/10',
    success: 'text-emerald-400 bg-emerald-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    error: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <Card hoverable className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            colorClasses[color] || colorClasses.primary
          }`}
        >
          <Icon size={20} />
        </div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-black text-slate-50 mb-1">{value}</p>
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up'
              ? 'text-emerald-400'
              : trend === 'down'
                ? 'text-rose-400'
                : 'text-slate-500'
          }`}
        >
          {trend === 'up' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          )}
          {trend === 'down' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
          <span>
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          <span className="text-slate-500 ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
}
