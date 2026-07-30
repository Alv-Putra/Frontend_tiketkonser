const colors = {
  default: 'bg-surface text-text-secondary',
  primary: 'bg-primary-accent/15 text-primary-accent',
  secondary: 'bg-secondary-accent/15 text-secondary-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  sold: 'bg-error/15 text-error',
  available: 'bg-success/15 text-success',
  featured: 'bg-gradient-primary text-white',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${colors[variant] || colors.default} ${className}`}
    >
      {children}
    </span>
  );
}
