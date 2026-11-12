'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Ticket, Download, MapPin, Calendar, CheckCircle, Ban, Sparkles, Clock, Music2 } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import orderService from '@/services/orderService';
import festivalService from '@/services/festivalService';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const FILTER_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'pending', label: 'Menunggu Pembayaran' },
  { id: 'active', label: 'Tiket Aktif' },
  { id: 'done', label: 'Selesai/Batal' },
];

const statusMeta = {
  active: { label: 'Tiket Aktif', variant: 'success', icon: Sparkles },
  valid: { label: 'Tiket Aktif', variant: 'success', icon: Sparkles },
  pending: { label: 'Menunggu Pembayaran', variant: 'warning', icon: Clock },
  used: { label: 'Sudah Check-in', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Dibatalkan', variant: 'error', icon: Ban },
  refunded: { label: 'Refunded', variant: 'error', icon: Ban },
};

function getStatusMeta(status) {
  return statusMeta[status] || { label: 'Tiket Aktif', variant: 'success', icon: Sparkles };
}

function isActiveStatus(status) {
  return status === 'active' || status === 'valid';
}

function isDoneStatus(status) {
  return status === 'used' || status === 'cancelled' || status === 'refunded';
}

function TicketsContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [tickets, setTickets] = useState([]);
  const [posters, setPosters] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'active' | 'done'

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const result = await orderService.getTicketsByUser(user.id);
      setTickets(result);
      setLoading(false);
    };
    load();
  }, [user]);

  // Poster image per festival (tickets only carry festivalId)
  useEffect(() => {
    let cancelled = false;
    const loadPosters = async () => {
      try {
        const festivals = await festivalService.getAllFestivals();
        if (cancelled) return;
        const map = {};
        festivals.forEach((f) => {
          if (f && f.id) map[f.id] = f.image || null;
        });
        setPosters(map);
      } catch {
        setPosters({});
      }
    };
    loadPosters();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveCanvas = (canvas, fileName) => {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadQR = (ticket) => {
    const canvas = document.getElementById(`qr-${ticket.id}`);
    saveCanvas(canvas, `${ticket.code}.png`);
  };

  const downloadCardQR = (ticket) => {
    const canvas = document.getElementById(`qr-card-${ticket.id}`);
    saveCanvas(canvas, `${ticket.code}.png`);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return ticket.status === 'pending';
      if (filter === 'active') return isActiveStatus(ticket.status);
      if (filter === 'done') return isDoneStatus(ticket.status);
      return true;
    });
  }, [tickets, filter]);

  const groupedTickets = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.orderId]) {
      acc[ticket.orderId] = [];
    }
    acc[ticket.orderId].push(ticket);
    return acc;
  }, {});

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      pending: tickets.filter((t) => t.status === 'pending').length,
      active: tickets.filter((t) => isActiveStatus(t.status)).length,
      done: tickets.filter((t) => isDoneStatus(t.status)).length,
    };
  }, [tickets]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-violet-600/15 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} className="text-violet-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50">
                  Tiket Saya
                </h1>
              </div>
              <p className="text-slate-400">
                Semua E-ticket kamu dalam satu tempat. Tunjukkan QR Code saat check-in.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex flex-wrap gap-1 rounded-xl bg-[#111827] border border-slate-800 p-1 self-start">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    filter === tab.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label} ({counts[tab.id]})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {tickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="Belum ada tiket"
            description="Kamu belum memiliki tiket. Jelajahi festival dan beli tiket pertamamu."
            actionLabel="Lihat Festival"
            actionHref="/festivals"
            onAction={() => router.push('/festivals')}
          />
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="Tidak ada tiket pada filter ini"
            description="Coba pilih tab lain untuk melihat tiket kamu yang tersedia."
            actionLabel="Lihat Festival"
            actionHref="/festivals"
            onAction={() => router.push('/festivals')}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTickets).map(([orderId, orderTickets]) => (
              <div key={orderId} className="space-y-4">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-50">{orderTickets[0].festivalTitle}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="font-mono">{orderTickets[0].orderNumber}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(orderTickets[0].festivalDate)}
                      </span>
                    </p>
                  </div>
                  <Badge variant={isDoneStatus(orderTickets[0].status) ? 'default' : 'success'}>
                    {isDoneStatus(orderTickets[0].status) ? 'Sudah Check-in' : 'Aktif'}
                  </Badge>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {orderTickets.map((ticket, index) => {
                    const meta = getStatusMeta(ticket.status);
                    const StatusIcon = meta.icon;
                    const poster = posters[ticket.festivalId];

                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-colors"
                      >
                        {/* Ticket body: stacked on mobile, split on desktop */}
                        <div className="flex flex-col md:flex-row">
                          {/* Left part */}
                          <div className="flex-1 min-w-0 p-5 md:p-6 border-b md:border-b-0 md:border-r border-dashed border-slate-700">
                            <div className="relative w-full h-36 md:h-full min-h-[9rem] rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800 mb-4">
                              {poster ? (
                                <img
                                  src={poster}
                                  alt={ticket.festivalTitle}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#0F172A]">
                                  <Music2 size={36} className="text-violet-400/60" />
                                </div>
                              )}
                              <div className="absolute top-3 right-3">
                                <Badge variant={meta.variant}>
                                  <StatusIcon size={12} />
                                  {meta.label}
                                </Badge>
                              </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-50 mb-1 line-clamp-2">
                              {ticket.festivalTitle}
                            </h3>
                            <p className="text-sm font-medium text-pink-400 mb-4">{ticket.ticketTypeName}</p>

                            <div className="space-y-2 text-xs text-slate-400">
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-cyan-400 shrink-0" />
                                <span className="truncate">{formatDate(ticket.festivalDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-cyan-400 shrink-0" />
                                <span className="truncate">{ticket.venue}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right part */}
                          <div className="md:w-64 shrink-0 p-5 md:p-6 bg-[#0F172A]/40">
                            <div className="flex flex-col items-center">
                              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                                QR Code
                              </p>
                              <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-black/40">
                                <QRCode
                                  id={`qr-card-${ticket.id}`}
                                  value={ticket.qrData}
                                  size={96}
                                  level="H"
                                />
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Kode Booking</span>
                                <span className="font-mono font-semibold text-slate-100 truncate">
                                  {ticket.orderNumber}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Kode Tiket</span>
                                <span className="font-mono font-semibold text-slate-100 truncate">
                                  {ticket.code}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Harga</span>
                                <span className="font-semibold text-slate-50">
                                  {formatCurrency(ticket.price)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadCardQR(ticket)}
                              >
                                <Download size={14} />
                                Unduh E-Ticket
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Ticket size={14} />
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `E-Ticket ${selectedTicket.code}` : ''}
        size="md"
      >
        {selectedTicket && (
          <div className="text-center">
            {/* QR Code */}
            <div className="inline-block p-6 bg-white rounded-2xl mb-6 shadow-lg">
              <QRCode
                id={`qr-${selectedTicket.id}`}
                value={selectedTicket.qrData}
                size={200}
                level="H"
              />
            </div>

            {/* Ticket Code */}
            <p className="font-mono text-2xl font-bold text-slate-50 mb-6 tracking-wider">
              {selectedTicket.code}
            </p>

            {/* Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {selectedTicket.status === 'used' ? (
                <>
                  <CheckCircle size={16} />
                  <span className="font-medium">Sudah Check-in</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span className="font-medium">Tiket Valid</span>
                </>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Festival</p>
                  <p className="text-sm font-medium text-slate-50">{selectedTicket.festivalTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Jenis Tiket</p>
                  <p className="text-sm font-medium text-slate-50">{selectedTicket.ticketTypeName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                  <p className="text-sm font-medium text-slate-50">{formatDate(selectedTicket.festivalDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Lokasi</p>
                  <p className="text-sm font-medium text-slate-50">{selectedTicket.venue}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Kode Booking</p>
                  <p className="text-sm font-medium text-cyan-400 font-mono">{selectedTicket.orderNumber}</p>
                </div>
                {selectedTicket.usedAt && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Waktu Check-in</p>
                    <p className="text-sm font-medium text-emerald-400">
                      {new Date(selectedTicket.usedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <Button className="w-full" size="lg" onClick={() => downloadQR(selectedTicket)}>
              <Download size={18} />
              Download QR Code
            </Button>

            <p className="text-xs text-slate-500 mt-4">
              Tunjukkan QR code ini saat check-in di venue event.
            </p>
          </div>
        )}
      </Modal>
    </CustomerLayout>
  );
}

export default function MyTicketsPage() {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <TicketsContent />
    </ProtectedRoute>
  );
}
