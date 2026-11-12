const colors = {
  default: 'bg-slate-800/60 text-slate-300 border border-slate-700',
  primary: 'bg-violet-600/15 text-violet-400 border border-violet-500/30',
  secondary: 'bg-pink-500/15 text-pink-400 border border-pink-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  available: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  error: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  sold: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  info: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  featured: 'bg-violet-600 text-white border border-violet-400/40 shadow-sm',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`font-heading inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${colors[variant] || colors.default} ${className}`}
    >
      {children}
    </span>
  );
}
