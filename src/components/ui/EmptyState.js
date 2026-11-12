import { SearchX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'Tidak ada konser',
  description = 'Tidak ada konser yang sesuai dengan pencarian.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-4">
        <Icon size={32} className="text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-50 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
