'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Users,
  ShieldCheck,
  HelpCircle,
  ListChecks,
  Building2,
  Minus,
  Plus,
  Music4,
  LayoutDashboard,
  Info,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import BackButton from '@/components/ui/BackButton';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Toast from '@/components/ui/Toast';
import useFestivalStore from '@/stores/festivalStore';
import { formatDate, formatDateTime, formatCurrency, getTicketQuotaStatus } from '@/lib/formatters';
import { MAX_TICKET_PER_ORDER } from '@/lib/constants';

const tabs = [
  { id: 'tickets', label: 'Pilihan Kategori Tiket', icon: Ticket },
  { id: 'layout', label: 'Denah Panggung', icon: LayoutDashboard },
  { id: 'information', label: 'Deskripsi & Ketentuan', icon: Info },
];

const CATEGORY_BENEFITS = {
  vip: ['Akses area VIP', 'Tempat duduk paling dekat panggung', 'Fasilitas lounge & drink'],
  ultimate: ['Akses area Ultimate', 'View platform tertinggi', 'Early entry & lounge premium'],
  festival: ['Akses area festival', 'Masuk salah satu hari festival', 'Area food court & merch booth'],
  reguler: ['Akses area reguler', 'Standing area', 'Akses festival 1 hari'],
  cat1: ['Akses Category 1', 'Area paling dekat panggung', 'Masuk paling awal'],
  cat2: ['Akses Category 2', 'Area tengah panggung', 'Sudut pandang jelas'],
  'category 1': ['Akses Category 1', 'Area paling dekat panggung', 'Masuk paling awal'],
  'category 2': ['Akses Category 2', 'Area tengah panggung', 'Sudut pandang jelas'],
  'early bird': ['Harga Early Bird', 'Akses area festival', 'Stok terbatas'],
};

function getBenefits(name = '') {
  const key = String(name).toLowerCase().trim();
  if (CATEGORY_BENEFITS[key]) return CATEGORY_BENEFITS[key];
  if (key.startsWith('cat')) {
    return ['Akses area kategori tiket', 'Tempat duduk sesuai kategori', 'Tiket e-ticket via QR'];
  }
  return ['Tiket e-ticket via QR', 'Masuk sesuai jadwal gate', 'Dukungan tim attendee'];
}

export default function FestivalDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { festival, isLoading, fetchFestivalById } = useFestivalStore();
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTickets, setSelectedTickets] = useState({});
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    fetchFestivalById(id);
  }, [id, fetchFestivalById]);

  if (isLoading || !festival) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-80 mb-8" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CustomerLayout>
    );
  }

  const updateQuantity = (ticketType, delta) => {
    const current = selectedTickets[ticketType.id] || 0;
    const next = Math.max(0, Math.min(MAX_TICKET_PER_ORDER, current + delta));
    setSelectedTickets((prev) => ({ ...prev, [ticketType.id]: next }));
  };

  const totalSelected = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
  const hasSelected = totalSelected > 0;
  const subtotal = festival.ticketTypes.reduce(
    (sum, tc) => sum + tc.price * (selectedTickets[tc.id] || 0),
    0
  );

  const isSoldOut = festival.ticketStatus === 'sold_out';
  const isComingSoon = festival.ticketStatus === 'coming_soon';

  const handleBuyTicket = () => {
    if (isSoldOut) {
      setToast({ isOpen: true, type: 'error', message: 'Maaf, seluruh tiket telah habis terjual.' });
      return;
    }
    if (isComingSoon) {
      setToast({ isOpen: true, type: 'warning', message: 'Penjualan tiket belum dibuka.' });
      return;
    }
    const items = Object.entries(selectedTickets)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => {
        const type = festival.ticketTypes.find((t) => t.id === ticketTypeId);
        return { ticketTypeId, name: type.name, price: type.price, quantity };
      });
    if (items.length === 0) {
      setToast({ isOpen: true, type: 'warning', message: 'Pilih minimal satu tiket terlebih dahulu.' });
      return;
    }
    const query = new URLSearchParams();
    query.set('festivalId', festival.id);
    query.set('title', festival.title);
    items.forEach((item) => {
      query.append('ticketTypeId', item.ticketTypeId);
      query.append('name', item.name);
      query.append('price', item.price);
      query.append('quantity', item.quantity);
    });
    router.push(`/checkout?${query.toString()}`);
  };

  const gatesOpen = (festival.schedule || []).find((s) =>
    String(s.title || '').toLowerCase().includes('gate')
  );
  const lineup = festival.lineup || [];
  const rules = festival.rules || [];
  const faq = festival.faq || [];

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton
          href="/festivals"
          label="Kembali ke Festival"
          className="py-6"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <img
                src={festival.image}
                alt={festival.title}
                className="aspect-video w-full object-cover rounded-2xl border border-slate-800"
              />

              <div className="flex flex-wrap gap-2">
                {festival.featured && <Badge variant="featured">Featured</Badge>}
                <Badge variant={isSoldOut ? 'sold' : 'available'}>
                  {isSoldOut ? 'Habis Terjual' : isComingSoon ? 'Segera' : 'Tersedia'}
                </Badge>
                <Badge variant="primary">{festival.genre}</Badge>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-50 mb-1">
                  {festival.title}
                </h1>
                <p className="text-base text-slate-400">{festival.artist}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs uppercase tracking-wider text-slate-400">Tanggal</span>
                    <span className="block text-sm font-semibold text-slate-50">
                      {formatDate(festival.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs uppercase tracking-wider text-slate-400">
                      Jam Open Gate
                    </span>
                    <span className="block text-sm font-semibold text-slate-50">
                      {gatesOpen
                        ? formatDateTime(gatesOpen.time).split(',')[1]?.trim()
                        : formatDateTime(festival.date).split(',')[1]?.trim()}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs uppercase tracking-wider text-slate-400">
                      Lokasi Venue
                    </span>
                    <span className="block text-sm font-semibold text-slate-50 break-words">
                      {festival.venue}, {festival.city}
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>

            {lineup.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6"
              >
                <h2 className="text-lg font-bold text-slate-50 mb-4 flex items-center gap-2">
                  <Music4 size={18} className="text-violet-400" />
                  Lineup
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lineup.map((artist) => (
                    <span
                      key={artist}
                      className="px-4 py-2 bg-[#0F172A] border border-slate-800 rounded-full text-sm text-slate-200"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {(festival.schedule || []).length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6"
              >
                <h2 className="text-lg font-bold text-slate-50 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-violet-400" />
                  Jadwal Pertunjukan
                </h2>
                <div className="space-y-3">
                  {festival.schedule.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-[#0F172A] border border-slate-800 rounded-xl p-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-50">{s.title}</p>
                        <p className="text-sm text-slate-400">{formatDateTime(s.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* TABS */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                        active
                          ? 'bg-violet-600/15 text-violet-300 border-violet-500/40'
                          : 'bg-[#0F172A] text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700'
                      }`}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  {festival.ticketTypes.map((tc) => {
                    const { remaining, isSoldOut: typeSoldOut } = getTicketQuotaStatus(
                      tc.sold,
                      tc.quota
                    );
                    const selected = selectedTickets[tc.id] || 0;
                    const canSelect = !typeSoldOut && !isSoldOut;
                    return (
                      <div
                        key={tc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#111827] border border-slate-800 rounded-2xl hover:border-violet-500/40 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-slate-50">{tc.name}</h3>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${
                                typeSoldOut
                                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                  : remaining <= 20
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {typeSoldOut ? 'Habis' : `${remaining} tersisa`}
                            </span>
                          </div>

                          <ul className="space-y-1 mb-3">
                            {getBenefits(tc.name).map((benefit) => (
                              <li
                                key={benefit}
                                className="flex items-start gap-2 text-xs text-slate-400"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Users size={13} />
                            {tc.sold}/{tc.quota} terjual
                          </div>
                          <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full transition-all duration-500"
                              style={{ width: `${(tc.sold / tc.quota) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end">
                          <span className="text-lg font-bold text-violet-400 whitespace-nowrap">
                            {formatCurrency(tc.price)}
                          </span>

                          {canSelect ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(tc, -1)}
                                disabled={selected === 0}
                                aria-label={`Kurangi ${tc.name}`}
                                className="w-9 h-9 rounded-lg bg-[#0F172A] border border-slate-700 text-slate-200 hover:border-violet-500 hover:text-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center"
                              >
                                <Minus size={15} />
                              </button>
                              <span className="w-9 text-center font-semibold text-slate-50">
                                {selected}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(tc, 1)}
                                disabled={selected >= MAX_TICKET_PER_ORDER || remaining === 0}
                                aria-label={`Tambah ${tc.name}`}
                                className="w-9 h-9 rounded-lg bg-[#0F172A] border border-slate-700 text-slate-200 hover:border-violet-500 hover:text-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center"
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60">
                              Habis
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 sm:p-6 overflow-hidden">
                    <div className="mx-auto max-w-xl space-y-3">
                      <div className="text-center">
                        <div className="inline-flex w-full max-w-sm justify-center rounded-xl bg-violet-600/90 border border-violet-500/40 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
                          Panggung Utama
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {festival.ticketTypes.map((tc) => (
                          <div
                            key={tc.id}
                            className="rounded-xl border border-slate-800 bg-[#111827] p-4 text-center"
                          >
                            <span className="block text-xs uppercase tracking-wider text-slate-500">
                              Zona
                            </span>
                            <span className="block text-sm font-semibold text-slate-50 mt-0.5">
                              {tc.name}
                            </span>
                            <span className="block text-xs text-violet-400 mt-1">
                              {formatCurrency(tc.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="h-16 rounded-xl border border-dashed border-slate-700 bg-[#111827] flex items-center justify-center text-xs text-slate-500">
                        Area convicted / area tribun
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                        Area paling dekat panggung
                        <span className="w-2 h-2 rounded-full bg-slate-600 ml-3" />
                        Area belakang panggung
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    Denah merupakan ilustrasi_area umum. Posisi bangku dan allotment final
                    dapat berbeda menyesuaikan kondisi venue serta IJLPJI organizer.
                  </p>
                </div>
              )}

              {activeTab === 'information' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="flex items-center gap-2 font-semibold text-slate-50 mb-3">
                      <Info size={18} className="text-violet-400" />
                      Deskripsi Event
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{festival.description}</p>
                  </section>

                  {festival.organizer && (
                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-slate-50 mb-3">
                        <Building2 size={18} className="text-violet-400" />
                        Organizer
                      </h3>
                      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
                        <p className="font-semibold text-slate-50 mb-1">
                          {festival.organizer.name}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {festival.organizer.description}
                        </p>
                      </div>
                    </section>
                  )}

                  {rules.length > 0 && (
                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-slate-50 mb-3">
                        <ListChecks size={18} className="text-violet-400" />
                        Syarat & Ketentuan
                      </h3>
                      <ul className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
                        {rules.map((rule, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-400"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {faq.length > 0 && (
                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-slate-50 mb-3">
                        <HelpCircle size={18} className="text-violet-400" />
                        FAQ
                      </h3>
                      <div className="space-y-3">
                        {faq.map((item) => (
                          <details
                            key={item.q}
                            className="group bg-[#0F172A] border border-slate-800 rounded-xl p-5"
                          >
                            <summary className="font-medium text-slate-50 cursor-pointer list-none flex items-center justify-between gap-4">
                              {item.q}
                              <span className="text-slate-500 group-open:rotate-45 transition-transform text-xl leading-none">
                                +
                              </span>
                            </summary>
                            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                              {item.a}
                            </p>
                          </details>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="flex items-center gap-2 font-semibold text-slate-50 mb-3">
                      <ShieldCheck size={18} className="text-violet-400" />
                      Periode Penjualan
                    </h3>
                    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 text-sm text-slate-400 space-y-1">
                      <p>
                        Mulai:{' '}
                        <span className="text-slate-50 font-medium">
                          {festival.salesPeriod?.start
                            ? formatDateTime(festival.salesPeriod.start)
                            : '-'}
                        </span>
                      </p>
                      <p>
                        Berakhir:{' '}
                        <span className="text-slate-50 font-medium">
                          {festival.salesPeriod?.end
                            ? formatDateTime(festival.salesPeriod.end)
                            : '-'}
                        </span>
                      </p>
                    </div>
                  </section>
                </div>
              )}
            </motion.section>
          </div>

          {/* RIGHT COLUMN */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 min-w-0"
          >
            <div className="sticky top-24 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Ticket size={20} className="text-violet-400" />
                <span className="text-lg font-semibold text-slate-50">Ringkasan Pesanan</span>
              </div>

              <div className="space-y-3">
                {festival.ticketTypes.map((tc) => {
                  const qty = selectedTickets[tc.id] || 0;
                  if (qty <= 0) return null;
                  return (
                    <div key={tc.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-400 truncate">{tc.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-slate-50">x{qty}</span>
                        <span className="text-slate-400 font-medium">
                          {formatCurrency(tc.price * qty)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {totalSelected === 0 && (
                  <p className="text-sm text-slate-500">
                    Belum ada tiket yang dipilih. Pilih kategori tiket pada tab
                    &ldquo;Pilihan Kategori Tiket&rdquo;.
                  </p>
                )}
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Jumlah tiket</span>
                  <span className="font-bold text-slate-50">{totalSelected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Subtotal</span>
                  <span className="font-bold text-lg text-white">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleBuyTicket}
                disabled={!hasSelected && !isSoldOut && !isComingSoon}
              >
                <Ticket size={18} />
                Lanjut ke Checkout
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Biaya layanan &amp; pajak dihitung saat checkout. Maksimal{' '}
                {MAX_TICKET_PER_ORDER} tiket per order.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </CustomerLayout>
  );
}
