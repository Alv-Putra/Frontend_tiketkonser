'use client';

export default function StatusBadge({ status }) {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-[#151824] text-[#A7AEC3] border-[#2A2E40]';

  if (['terverifikasi', 'lunas', 'aktif', 'dibuka', 'tersedia', 'selesai'].includes(norm)) {
    styles = 'bg-[#193029] text-[#8DE2BD] border-[#193029]';
  } else if (['perlu verifikasi', 'tertunda', 'menunggu', 'tinggal 400', 'peringatan'].includes(norm)) {
    styles = 'bg-[#332B1B] text-[#F1C875] border-[#332B1B]';
  } else if (['gagal', 'dibatalkan', 'ditutup', 'habis', 'habis terjual', 'ditolak'].includes(norm)) {
    styles = 'bg-[#36202C] text-[#FFA4B8] border-[#36202C]';
  } else if (['admin', 'super admin'].includes(norm)) {
    styles = 'bg-[#2A2240] text-[#A78BFA] border-[#362A54]';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styles}`}>
      {status}
    </span>
  );
}
