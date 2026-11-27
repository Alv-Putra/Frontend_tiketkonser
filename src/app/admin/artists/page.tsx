'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Mic, Music, Edit2, RotateCw } from 'lucide-react';
import StatCard from '@/components/workspace/StatCard';
import useMonitoringStore from '@/stores/monitoringStore';
import { closeOnBackdrop } from '@/lib/backdrop';

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
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Artis & musisi</h1>
          <p className="text-xs text-ink/60">
            Kelola talenta di balik setiap pertunjukan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blaze hover:bg-tangerine text-ink text-xs font-semibold shadow-lg shadow-blaze/20 transition-all self-start md:self-auto"
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Direktori artis</h2>
              <p className="text-xs text-ink/45">Daftar penampil terdaftar</p>
            </div>

            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
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
            <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama artis..."
              className="w-full bg-paper border border-ink/10 rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink/45 focus:outline-none focus:border-blaze"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/45 text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Nama Artis</th>
                  <th className="pb-2.5">Genre</th>
                  <th className="pb-2.5">Negara</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredArtists.map((art) => (
                  <tr
                    key={art.id}
                    onClick={() => setSelectedArtist(art)}
                    className={`cursor-pointer transition-colors ${
                      selectedArtist?.id === art.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'
                    }`}
                  >
                    <td className="py-3 font-semibold text-ink flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blaze/10 text-blaze flex items-center justify-center font-bold text-xs">
                        {art.name[0]}
                      </div>
                      <span>{art.name}</span>
                    </td>
                    <td className="py-3 text-ink/60">{art.genre}</td>
                    <td className="py-3 text-ink/60">{art.country}</td>
                    <td className="py-3 font-medium text-ink">{art.concertsCount || 0} konser</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArtist(art);
                        }}
                        type="button"
                        className="px-2.5 py-1 rounded-full bg-ink/5 hover:bg-border-hover border border-ink/20 text-[11px] text-blaze font-medium transition-colors"
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
            <div className="p-5 rounded-2xl bg-white border border-ink/10">
              <div className="text-[10px] font-bold text-blaze uppercase tracking-wider mb-2">
                PROFIL ARTIS
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blaze/10 text-blaze flex items-center justify-center font-bold text-lg">
                  {selectedArtist.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">{selectedArtist.name}</h3>
                  <div className="text-xs text-ink/60">{selectedArtist.genre} • {selectedArtist.country}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-paper border border-ink/10 space-y-2 mb-4">
                <div className="text-xs text-ink/45">Keterlibatan konser</div>
                <div className="text-sm font-bold text-ink">{selectedArtist.concertsCount || 0} konser terdaftar</div>
                <p className="text-[11px] text-ink/60 leading-relaxed">
                  Data artis dapat digunakan kembali pada beberapa konser tanpa dibuat ulang.
                </p>
              </div>

              <div className="text-xs text-ink/45 mb-3">
                Informasi tersimpan: Nama artis • Genre musik • Negara
              </div>

              <button
                type="button"
                onClick={() => alert('Fitur edit profil artis disinkronkan ke direktori.')}
                className="w-full py-2 px-3 rounded-lg bg-ink/5 hover:bg-border-hover border border-ink/20 text-xs font-semibold text-ink transition-colors"
              >
                Edit profil artis
              </button>
            </div>
          )}

          {/* Genre Distribution */}
          <div className="p-5 rounded-2xl bg-white border border-ink/10">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blaze mb-2">
              Sebaran genre
            </h2>
            <div className="text-xs text-ink/45 mb-3">Ragam musik dalam direktori</div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-ink/5">
                <span className="text-ink">Pop</span>
                <span className="font-semibold text-blaze">2 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-ink/5">
                <span className="text-ink">Rock</span>
                <span className="font-semibold text-blaze">2 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-ink/5">
                <span className="text-ink">Hip Hop</span>
                <span className="font-semibold text-blaze">1 artis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-ink/5">
                <span className="text-ink">Indie</span>
                <span className="font-semibold text-blaze">1 artis</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-ink/45">
            Data artis mengikuti referensi • Data contoh
          </div>
        </div>
      </div>

      {/* Add Artist Modal */}
      {isModalOpen && (
        <div {...closeOnBackdrop(() => setIsModalOpen(false))} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-ink/10 p-6">
            <h2 className="font-display text-base font-bold text-ink mb-1">Tambah artis</h2>
            <p className="text-xs text-ink/60 mb-4">
              Daftarkan penampil baru ke direktori musik.
            </p>
            <form onSubmit={handleCreateArtist} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Nama Artis / Band</label>
                <input
                  type="text"
                  required
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Contoh: Feast"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Genre</label>
                <select
                  value={artistGenre}
                  onChange={(e) => setArtistGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                >
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Indie">Indie</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Jazz">Jazz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Negara Asal</label>
                <input
                  type="text"
                  value={artistCountry}
                  onChange={(e) => setArtistCountry(e.target.value)}
                  placeholder="Contoh: Indonesia"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-ink/60 hover:text-ink"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-blaze hover:bg-tangerine text-xs font-semibold text-ink"
                >
                  Simpan Artis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
