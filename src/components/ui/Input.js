export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all duration-200 ${Icon ? 'pl-12' : ''} ${error ? 'border-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
