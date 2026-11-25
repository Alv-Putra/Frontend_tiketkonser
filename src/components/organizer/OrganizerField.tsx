import { cloneElement, type AriaAttributes, type ReactElement } from 'react';

export default function OrganizerField({ label, id, children, error }: {
  label: string;
  id: string;
  children: ReactElement<AriaAttributes>;
  error?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-ink">{label}</label>
      {error ? cloneElement(children, { 'aria-invalid': true, 'aria-describedby': `${id}-error` }) : children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-status-danger-bg">{error}</p>}
    </div>
  );
}

export const organizerInput = 'min-h-11 w-full min-w-0 rounded-xl border border-ink/20 bg-paper [color-scheme:light] px-3 py-2 text-sm text-ink placeholder-ink/55 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blaze disabled:opacity-70';
