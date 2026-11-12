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
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
      {searchable && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-xs bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-900/90">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-xs text-slate-400 uppercase tracking-wider font-semibold px-6 py-4 ${
                    col.sortable ? 'cursor-pointer hover:text-slate-100 select-none' : ''
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
                className={`border-b border-slate-800/60 ${onRowClick ? 'cursor-pointer hover:bg-slate-800/40' : 'hover:bg-slate-800/40'} transition-colors`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Sebelumnya"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-slate-500">{page} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="Berikutnya"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
