'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const navButton =
    'inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer';

  const pageButton = (active) =>
    `inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
      active
        ? 'bg-violet-600/20 text-violet-400 border-violet-500/30 font-semibold'
        : 'bg-slate-800/60 text-slate-400 hover:text-slate-50 hover:bg-slate-800 border border-slate-800'
    }`;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
      <span className="text-xs text-slate-500">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Sebelumnya"
          className={navButton}
        >
          <ChevronLeft size={16} />
        </button>

        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={pageButton(false)}
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-sm text-slate-500">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={pageButton(p === page)}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-sm text-slate-500">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={pageButton(false)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Berikutnya"
          className={navButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
