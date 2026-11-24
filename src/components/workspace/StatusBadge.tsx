'use client';

export default function StatusBadge({ status }) {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-white text-ink/60 border-ink/20';

  if (['terverifikasi', 'lunas', 'aktif', 'dibuka', 'tersedia', 'selesai'].includes(norm)) {
    styles = 'bg-status-success/25 text-ink border-transparent';
  } else if (['perlu verifikasi', 'tertunda', 'menunggu', 'tinggal 400', 'peringatan'].includes(norm)) {
    styles = 'bg-status-warning/25 text-ink border-transparent';
  } else if (['gagal', 'dibatalkan', 'ditutup', 'habis', 'habis terjual', 'ditolak'].includes(norm)) {
    styles = 'bg-status-danger/25 text-ink border-transparent';
  } else if (['admin', 'super admin'].includes(norm)) {
    styles = 'bg-blaze/10 text-blaze border-blaze/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styles}`}>
      {status}
    </span>
  );
}
