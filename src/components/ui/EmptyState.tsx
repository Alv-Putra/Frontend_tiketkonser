import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: ComponentType<{ size?: number; className?: string }>;
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  /** Tujuan tautan untuk tombol aksi; dipakai bila `onAction` tidak diberikan. */
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'Tidak ada konser',
  description = 'Tidak ada konser yang sesuai dengan pencarian.',
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center mb-4">
        <Icon size={32} className="text-[#FF7A00]" />
      </div>
      <h3 className="text-lg font-semibold text-slate-50 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && !onAction ? (
        <Link href={actionHref}>
          <Button variant="secondary">{actionLabel}</Button>
        </Link>
      ) : (
        actionLabel && (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
