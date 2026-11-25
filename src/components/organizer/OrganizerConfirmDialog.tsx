import { AlertCircle, SendHorizontal } from 'lucide-react';
import { ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import OrganizerDialog from './OrganizerDialog';

export default function OrganizerConfirmDialog({ title, description, action, busy, onConfirm, onCancel }: {
  title: string;
  description: string;
  action: 'Ajukan' | 'Hapus';
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const deleting = action === 'Hapus';
  const Icon = deleting ? AlertCircle : SendHorizontal;
  const confirmButton = deleting
    ? primaryButton.replace('bg-blaze', 'bg-status-danger').replace('hover:bg-tangerine', 'hover:bg-status-danger/80')
    : primaryButton;

  return (
    <OrganizerDialog title={title} onClose={onCancel} busy={busy} className="max-w-sm">
      <div className="p-6">
        <Icon className={`mb-3 size-5 ${deleting ? 'text-status-danger-bg' : 'text-blaze'}`} aria-hidden="true" />
        <h2 className="wrap-break-word font-display text-lg font-bold text-ink">{title}</h2>
        <p className="mt-1.5 text-sm text-ink/65">{description}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className={ghostButton}>
            Batal
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={confirmButton}>
            {busy ? 'Memproses…' : action}
          </button>
        </div>
      </div>
    </OrganizerDialog>
  );
}
