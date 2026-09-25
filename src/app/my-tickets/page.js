'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, QrCode, Download, MapPin, Calendar, X, CheckCircle, Ban } from 'lucide-react';
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

  const groupedTickets = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.orderId]) {
      acc[ticket.orderId] = [];
    }
    acc[ticket.orderId].push(ticket);
    return acc;
  }, {});

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-72" />
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
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-gradient">Tiket Saya</span>
          </h1>
          <p className="text-text-secondary">
            Semua E-ticket kamu dalam satu tempat. Tunjukkan QR Code saat check-in.
          </p>
        </motion.div>

        {tickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="Belum ada tiket"
            description="Kamu belum memiliki tiket. Jelajahi festival dan beli tiket pertamamu."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTickets).map(([orderId, orderTickets]) => (
              <div key={orderId} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-text-primary">{orderTickets[0].festivalTitle}</p>
                    <p className="text-sm text-text-muted">
                      No. Pesanan: {orderTickets[0].orderNumber}
                    </p>
                  </div>
                  <Badge variant={orderTickets[0].status === 'used' ? 'default' : 'success'}>
                    {orderTickets[0].status === 'used' ? 'Sudah Check-in' : 'Aktif'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orderTickets.map((ticket) => (
                    <motion.button
                      key={ticket.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-left bg-secondary-bg border border-border rounded-[18px] p-5 hover:border-primary-accent/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <QrCode size={18} className="text-primary-accent" />
                          <span className="font-mono text-xs text-text-muted">{ticket.code}</span>
                        </div>
                        {ticket.status === 'used' ? (
                          <CheckCircle size={14} className="text-success" />
                        ) : (
                          <Ban size={14} className="text-text-muted" />
                        )}
                      </div>

                      <p className="font-semibold text-text-primary mb-1">{ticket.ticketTypeName}</p>
                      <div className="space-y-1 text-xs text-text-muted">
                        <p className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatDate(ticket.festivalDate)}
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin size={12} />
                          {ticket.venue}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-text-muted">{formatCurrency(ticket.price)}</span>
                        <span className="text-xs text-primary-accent font-medium">Lihat Detail</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `E-Ticket ${selectedTicket.code}` : ''}
      >
        {selectedTicket && (
          <div className="text-center">
            <div className="inline-block p-6 bg-white rounded-[18px] mb-6">
              <QRCode
                id={`qr-${selectedTicket.id}`}
                value={selectedTicket.qrData}
                size={200}
                level="H"
              />
            </div>
            <p className="font-mono text-lg font-bold text-text-primary mb-2">
              {selectedTicket.code}
            </p>

            <div className="bg-surface rounded-[18px] border border-border p-5 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Festival</span>
                <span className="text-text-primary font-medium">{selectedTicket.festivalTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Jenis Tiket</span>
                <span className="text-text-primary font-medium">{selectedTicket.ticketTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tanggal</span>
                <span className="text-text-primary font-medium">{formatDate(selectedTicket.festivalDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Lokasi</span>
                <span className="text-text-primary font-medium">{selectedTicket.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={selectedTicket.status === 'used' ? 'text-success font-medium' : 'text-text-primary font-medium'}>
                  {selectedTicket.status === 'used' ? 'Sudah Check-in' : 'Valid'}
                </span>
              </div>
              {selectedTicket.usedAt && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Waktu Check-in</span>
                  <span className="text-text-primary font-medium">
                    {new Date(selectedTicket.usedAt).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={() => downloadQR(selectedTicket)}>
              <Download size={16} />
              Download QR Code
            </Button>
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