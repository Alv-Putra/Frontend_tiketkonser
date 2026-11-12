'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, Clock, CheckCircle, XCircle, AlertCircle, Ticket, Calendar, MapPin, ChevronRight, Receipt, QrCode, X } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import orderService from '@/services/orderService';
import { formatDateTime, formatCurrency, isPaymentExpired } from '@/lib/formatters';

const statusConfig = {
  waiting_payment: { label: 'Menunggu Pembayaran', variant: 'warning', icon: Clock },
  paid: { label: 'Lunas', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'pending', icon: AlertCircle },
  cancelled: { label: 'Batal', variant: 'error', icon: XCircle },
  expired: { label: 'Gagal', variant: 'error', icon: XCircle },
};

function OrdersContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const result = await orderService.getOrdersByUser(user.id);
      setOrders(result);
      setLoading(false);
    };
    load();
  }, [user]);

  const getConfig = (order) => {
    if (order.status === 'waiting_payment' && isPaymentExpired(order.createdAt)) {
      return statusConfig.expired;
    }
    return statusConfig[order.status] || statusConfig.pending;
  };

  const canCancel = (order) => {
    if (order.status !== 'waiting_payment') return false;
    return !isPaymentExpired(order.createdAt);
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await orderService.cancelOrder(cancelTarget.id);
      const result = await orderService.getOrdersByUser(user.id);
      setOrders(result);
      setCancelTarget(null);
    } catch (error) {
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  const totals = useMemo(() => {
    const paid = orders.filter((o) => o.status === 'paid').length;
    const pending = orders.filter(
      (o) => o.status === 'waiting_payment' && !isPaymentExpired(o.createdAt)
    ).length;
    const spent = orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return { paid, pending, spent };
  }, [orders]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-violet-600/15 rounded-xl flex items-center justify-center">
              <Receipt size={24} className="text-violet-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50">
              Riwayat Pesanan
            </h1>
          </div>
          <p className="text-slate-400">
            Lacak semua pesanan tiket kamu di sini.
          </p>

          {/* Summary strip */}
          {orders.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">Total Pesanan</p>
                <p className="text-xl font-extrabold text-slate-50">{orders.length}</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">Lunas</p>
                <p className="text-xl font-extrabold text-emerald-400">{totals.paid}</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">Total Pengeluaran</p>
                <p className="text-xl font-extrabold text-pink-400">
                  {formatCurrency(totals.spent)}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Belum ada pesanan"
            description="Kamu belum memiliki pesanan tiket. Jelajahi festival dan beli tiket pertamamu."
            actionLabel="Lihat Festival"
            actionHref="/festivals"
            onAction={() => router.push('/festivals')}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const config = getConfig(order);
              const Icon = config.icon;
              const isExpanded = expandedOrder === order.id;
              const totalTickets = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-colors"
                >
                  {/* Order Header */}
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center shrink-0">
                          <Icon size={24} className={
                            config.variant === 'success' ? 'text-emerald-400' :
                            config.variant === 'warning' ? 'text-amber-400' :
                            config.variant === 'error' ? 'text-rose-400' :
                            'text-violet-400'
                          } />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-50 truncate">{order.festivalTitle}</h3>
                          <p className="text-sm text-slate-500 font-mono mt-0.5 break-all">
                            {order.orderNumber}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-cyan-400" />
                              {new Date(order.festivalDate).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1 min-w-0">
                              <MapPin size={12} className="text-cyan-400 shrink-0" />
                              <span className="truncate">{order.venue}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Ticket size={12} className="text-cyan-400" />
                              {totalTickets} tiket
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <Badge variant={config.variant}>
                          <Icon size={12} />
                          {config.label}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="font-extrabold text-slate-50 text-lg">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        Lihat Detail
                        <ChevronRight
                          size={14}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </Button>

                      {order.status === 'paid' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push('/my-tickets')}
                        >
                          <QrCode size={14} />
                          Lihat E-Ticket
                        </Button>
                      )}

                      {order.status === 'waiting_payment' && !getConfig(order).label.includes('Gagal') && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(`/payment/${order.id}`)}
                        >
                          Lanjutkan Pembayaran
                        </Button>
                      )}

                      {canCancel(order) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setCancelTarget(order)}
                        >
                          <X size={14} />
                          Batal Pesanan
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-slate-800">
                          {/* Items */}
                          <div className="mt-4 space-y-2">
                            {order.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-center justify-between gap-3 py-2 px-4 bg-[#0F172A] rounded-xl border border-slate-800"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 bg-violet-600/15 rounded-lg flex items-center justify-center shrink-0">
                                    <Ticket size={14} className="text-violet-400" />
                                  </div>
                                  <span className="text-sm text-slate-100 truncate">{item.name}</span>
                                </div>
                                <span className="text-sm text-slate-400 shrink-0">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Summary */}
                          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500 text-xs">Tanggal Pesanan</p>
                              <p className="text-slate-50 font-medium">{formatDateTime(order.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Jumlah Tiket</p>
                              <p className="text-slate-50 font-medium">{totalTickets} tiket</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Subtotal</p>
                              <p className="text-slate-50 font-medium">{formatCurrency(order.subtotal)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Status</p>
                              <p className="font-medium text-slate-50">{config.label}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Batalkan Pesanan?"
        message={
          cancelTarget
            ? `Pesanan ${cancelTarget.orderNumber} akan dibatalkan dan tidak dapat diproses lagi.`
            : ''
        }
        confirmLabel="Ya, Batalkan"
        cancelLabel="Tidak"
        loading={cancelling}
      />
    </CustomerLayout>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
