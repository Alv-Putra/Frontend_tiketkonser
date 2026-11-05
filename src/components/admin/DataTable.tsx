'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  onRowClick,
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key]).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-xs bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`font-heading text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3 ${
                    col.sortable ? 'cursor-pointer hover:text-text-primary select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <ChevronDown size={12} className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={row.id || i}
                className={`border-b border-border/50 ${onRowClick ? 'cursor-pointer hover:bg-surface/50' : ''} transition-colors`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-text-primary">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-text-muted">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-text-muted">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-text-muted">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
