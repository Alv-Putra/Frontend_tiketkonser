'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Mic, Music, Edit2, RotateCw } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminArtistsPage() {
  const artists = useMonitoringStore((state) => state.artists);
  const addArtist = useMonitoringStore((state) => state.addArtist);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('Semua');
  const [selectedArtist, setSelectedArtist] = useState(artists[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [artistGenre, setArtistGenre] = useState('Pop');
  const [artistCountry, setArtistCountry] = useState('Indonesia');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdminData().catch(() => {});
  }, [fetchAdminData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAdminData();
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArtists = artists.filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genreFilter === 'Semua' || a.genre.toLowerCase() === genreFilter.toLowerCase();
    return matchSearch && matchGenre;
  });

  const indonesianCount = artists.filter((a) => a.country.toLowerCase() === 'indonesia').length;
  const genresSet = new Set(artists.map((a) => a.genre));

  const handleCreateArtist = (e) => {
    e.preventDefault();
    if (!artistName.trim()) return;
    const created = addArtist({
      name: artistName,
      genre: artistGenre,
      country: artistCountry
    });
    setSelectedArtist(created);
    setArtistName('');
    setIsModalOpen(false);
  };

  return (
    <WorkspaceLayout title="Artis & Musisi">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Artis & musisi</h1>
          <p className="text-xs text-[#A1A1AA]">
            Kelola talenta di balik setiap pertunjukan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-[#09090B] text-xs font-semibold shadow-lg shadow-[#FF4D00]/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah artis</span>
        </button>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Artis terdaftar" value={artists.length.toString()} subtext="Dalam direktori platform" />
        <StatCard label="Artis Indonesia" value={indonesianCount.toString()} subtext="Talenta dalam negeri" />
        <StatCard label="Genre musik" value={genresSet.size.toString()} subtext="Pop, Rock, Hip Hop, Indie" />
      </div>

      {/* Main Grid: Artists Table & Detail Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141417] border border-[#27272A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#FFFFFF]">Direktori artis</h2>
              <p className="text-xs text-[#71717A]">Daftar penampil terdaftar</p>
            </div>

            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
            >
              <option value="Semua">Semua genre</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Indie">Indie</option>
              <option value="Hip Hop">Hip Hop</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama artis..."
              className="w-full bg-[#0F0F12] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#71717A] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Nama Artis</th>
                  <th className="pb-2.5">Genre</th>
                  <th className="pb-2.5">Negara</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredArtists.map((art) => (
                  <tr
                    key={art.id}
                    onClick={() => setSelectedArtist(art)}
                    className={`cursor-pointer transition-colors ${
                      selectedArtist?.id === art.id ? 'bg-[#27272A]' : 'hover:bg-[#27272A]/50'
                    }`}
                  >
                    <td className="py-3 font-semibold text-[#FFFFFF] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-xs">
                        {art.name[0]}
                      </div>
                      <span>{art.name}</span>
                    </td>
                    <td className="py-3 text-[#A1A1AA]">{art.genre}</td>
                    <td className="py-3 text-[#A1A1AA]">{art.country}</td>
                    <td className="py-3 font-medium text-[#FFFFFF]">{art.concertsCount || 0} konser</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArtist(art);
                        }}
                        type="button"
                        className="px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-[11px] text-[#FF7A00] font-medium transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Details */}
        <div className="space-y-6">
          {selectedArtist && (
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
              <div className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider mb-2">
                PROFIL ARTIS
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-lg">
                  {selectedArtist.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#FFFFFF]">{selectedArtist.name}</h3>
                  <div className="text-xs text-[#A1A1AA]">{selectedArtist.genre} • {selectedArtist.country}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46] space-y-2 mb-4">
                <div className="text-xs text-[#71717A]">Keterlibatan konser</div>
                <div className="text-sm font-bold text-[#FFFFFF]">{selectedArtist.concertsCount || 0} konser terdaftar</div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  Data artis dapat digunakan kembali pada beberapa konser tanpa dibuat ulang.
                </p>
              </div>

              <div className="text-xs text-[#71717A] mb-3">
                Informasi tersimpan: Nama artis • Genre musik • Negara
              </div>

              <button
                type="button"
                onClick={() => alert('Fitur edit profil artis disinkronkan ke direktori.')}
                className="w-full py-2 px-3 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#FFFFFF] transition-colors"
              >
                Edit profil artis
              </button>
            </div>
          )}

          {/* Genre Distribution */}
          <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
            <h2 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Sebaran genre
            </h2>
            <div className="text-xs text-[#71717A] mb-3">Ragam musik dalam direktori</div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[#27272A]">
                <span className="text-[#FFFFFF]">Pop</span>
                <span className="font-semibold text-[#FF7A00]">2 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#27272A]">
                <span className="text-[#FFFFFF]">Rock</span>
                <span className="font-semibold text-[#FF7A00]">2 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#27272A]">
                <span className="text-[#FFFFFF]">Hip Hop</span>
                <span className="font-semibold text-[#FF7A00]">1 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#27272A]">
                <span className="text-[#FFFFFF]">Indie</span>
                <span className="font-semibold text-[#FF7A00]">1 artis</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#71717A]">
            Data artis mengikuti referensi • Data contoh
          </div>
        </div>
      </div>

      {/* Add Artist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141417] border border-[#27272A] shadow-2xl p-6">
            <h2 className="text-base font-bold text-[#FFFFFF] mb-1">Tambah artis</h2>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Daftarkan penampil baru ke direktori musik.
            </p>
            <form onSubmit={handleCreateArtist} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Nama Artis / Band</label>
                <input
                  type="text"
                  required
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Contoh: Feast"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Genre</label>
                <select
                  value={artistGenre}
                  onChange={(e) => setArtistGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                >
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Indie">Indie</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Jazz">Jazz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Negara Asal</label>
                <input
                  type="text"
                  value={artistCountry}
                  onChange={(e) => setArtistCountry(e.target.value)}
                  placeholder="Contoh: Indonesia"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B]"
                >
                  Simpan Artis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
