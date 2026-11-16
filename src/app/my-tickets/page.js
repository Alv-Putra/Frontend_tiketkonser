'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, QrCode, Download, MapPin, Calendar, X, CheckCircle, Ban, Sparkles, Clock } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import orderService from '@/services/orderService';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

function TicketsContent() {
  const user = useAuthStore((state) => state.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'used'

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const result = await orderService.getTicketsByUser(user.id);
      setTickets(result);
      setLoading(false);
    };
    load();
  }, [user]);

  const downloadQR = (ticket) => {
    const canvas = document.getElementById(`qr-${ticket.id}`);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${ticket.code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'active') return ticket.status !== 'used';
    if (filter === 'used') return ticket.status === 'used';
    return true;
  });

  const groupedTickets = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.orderId]) {
      acc[ticket.orderId] = [];
    }
    acc[ticket.orderId].push(ticket);
    return acc;
  }, {});

  const activeCount = tickets.filter(t => t.status !== 'used').length;
  const usedCount = tickets.filter(t => t.status === 'used').length;

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} className="text-primary-accent" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black">
                  <span className="text-gradient">Tiket Saya</span>
                </h1>
              </div>
              <p className="text-text-secondary">
                Semua E-ticket kamu dalam satu tempat. Tunjukkan QR Code saat check-in.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-secondary-bg border border-border rounded-xl p-1">
              {[
                { id: 'all', label: 'Semua', count: tickets.length },
                { id: 'active', label: 'Aktif', count: activeCount },
                { id: 'used', label: 'Terpakai', count: usedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    filter === tab.id
                      ? 'bg-primary-accent text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab.label} ({tab.count})
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
          />
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={`Tidak ada tiket ${filter === 'active' ? 'aktif' : 'terpakai'}`}
            description={`Semua tiket kamu sudah ${filter === 'active' ? 'terpakai' : 'dibeli'}.`}
            actionLabel="Lihat Festival"
            actionHref="/festivals"
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTickets).map(([orderId, orderTickets]) => (
              <div key={orderId} className="space-y-4">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-text-primary">{orderTickets[0].festivalTitle}</p>
                    <p className="text-sm text-text-muted flex items-center gap-2">
                      <span className="font-mono">{orderTickets[0].orderNumber}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(orderTickets[0].festivalDate)}
                      </span>
                    </p>
                  </div>
                  <Badge variant={orderTickets[0].status === 'used' ? 'default' : 'success'}>
                    {orderTickets[0].status === 'used' ? 'Sudah Check-in' : 'Aktif'}
                  </Badge>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(orderTickets || []).map((ticket, index) => (
                    <motion.button
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-left bg-secondary-bg border border-border rounded-2xl p-5 hover:border-primary-accent/50 transition-all cursor-pointer relative overflow-hidden group"
                    >
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {ticket.status === 'used' ? (
                          <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                            <CheckCircle size={14} className="text-success" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-primary-accent/10 rounded-full flex items-center justify-center">
                            <Clock size={14} className="text-primary-accent" />
                          </div>
                        )}
                      </div>

                      {/* QR Preview */}
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <QrCode size={32} className="text-primary-accent" />
                      </div>

                      {/* Ticket Info */}
                      <p className="font-semibold text-text-primary text-center mb-3 truncate">
                        {ticket.ticketTypeName}
                      </p>

                      <div className="space-y-2 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} />
                          <span className="truncate">{ticket.venue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Code:</span>
                          <span className="font-mono font-medium text-text-primary">
                            {ticket.code.substring(0, 8)}...
                          </span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">
                          {formatCurrency(ticket.price)}
                        </span>
                        <span className="text-xs text-primary-accent font-medium group-hover:underline">
                          Lihat Detail
                        </span>
                      </div>
                    </motion.button>
                  ))}
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
        title={selectedTicket ? `${selectedTicket.status === 'used' ? '✓' : '🎫'} E-Ticket ${selectedTicket.code}` : ''}
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
            <p className="font-mono text-2xl font-bold text-text-primary mb-6 tracking-wider">
              {selectedTicket.code}
            </p>

            {/* Status */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              selectedTicket.status === 'used'
                ? 'bg-success/10 text-success'
                : 'bg-primary-accent/10 text-primary-accent'
            }`}>
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
            <div className="bg-surface rounded-2xl border border-border p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Festival</p>
                  <p className="text-sm font-medium text-text-primary">{selectedTicket.festivalTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Jenis Tiket</p>
                  <p className="text-sm font-medium text-text-primary">{selectedTicket.ticketTypeName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Tanggal</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(selectedTicket.festivalDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Lokasi</p>
                  <p className="text-sm font-medium text-text-primary">{selectedTicket.venue}</p>
                </div>
                {selectedTicket.usedAt && (
                  <div className="col-span-2">
                    <p className="text-xs text-text-muted mb-1">Waktu Check-in</p>
                    <p className="text-sm font-medium text-success">
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

            <p className="text-xs text-text-muted mt-4">
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