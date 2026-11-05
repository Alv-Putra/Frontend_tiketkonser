'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
      <span className="text-xs text-text-muted">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Sebelumnya"
          className="p-2 rounded-[12px] hover:bg-surface text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 rounded-[12px] text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-sm text-text-muted">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-[12px] text-sm transition-colors cursor-pointer ${
              p === page
                ? 'bg-primary-accent/15 text-primary-accent font-medium'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-sm text-text-muted">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 rounded-[12px] text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Berikutnya"
          className="p-2 rounded-[12px] hover:bg-surface text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
