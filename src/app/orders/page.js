'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Clock, CheckCircle, XCircle, AlertCircle, Ticket, Calendar, MapPin, ChevronRight, Receipt, QrCode } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import orderService from '@/services/orderService';
import { formatDateTime, formatCurrency, isPaymentExpired } from '@/lib/formatters';

const statusConfig = {
  waiting_payment: { label: 'Menunggu Pembayaran', variant: 'warning', icon: Clock, bg: 'bg-warning/10', text: 'text-warning' },
  paid: { label: 'Lunas', variant: 'success', icon: CheckCircle, bg: 'bg-success/10', text: 'text-success' },
  pending: { label: 'Diproses', variant: 'default', icon: AlertCircle, bg: 'bg-primary-accent/10', text: 'text-primary-accent' },
  cancelled: { label: 'Dibatalkan', variant: 'error', icon: XCircle, bg: 'bg-error/10', text: 'text-error' },
  expired: { label: 'Kadaluarsa', variant: 'error', icon: XCircle, bg: 'bg-error/10', text: 'text-error' },
};

function OrdersContent() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-10">
          <Skeleton className="h-10 w-48 mb-8" />
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
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <Receipt size={24} className="text-primary-accent" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black">
              <span className="text-gradient">Riwayat Pesanan</span>
            </h1>
          </div>
          <p className="text-text-secondary">
            Lacak semua pesanan tiket kamu di sini.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Belum ada pesanan"
            description="Kamu belum memiliki pesanan tiket. Jelajahi festival dan beli tiket pertamamu."
            actionLabel="Lihat Festival"
            actionHref="/festivals"
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
                  className="bg-secondary-bg border border-border rounded-2xl overflow-hidden hover:border-primary-accent/30 transition-colors"
                >
                  {/* Order Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={24} className={config.text} />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">{order.festivalTitle}</h3>
                          <p className="text-sm text-text-muted font-mono mt-0.5">{order.orderNumber}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(order.festivalDate).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {order.venue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant={config.variant}>
                          <Icon size={12} />
                          {config.label}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">Total</p>
                          <p className="font-bold text-gradient text-lg">{formatCurrency(order.total)}</p>
                        </div>
                        <ChevronRight
                          size={20}
                          className={`text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-border/50">
                      {/* Items */}
                      <div className="mt-4 space-y-2">
                        {(order.items || []).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between py-2 px-4 bg-surface/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                                <Ticket size={14} className="text-primary-accent" />
                              </div>
                              <span className="text-sm text-text-primary">{item.name}</span>
                            </div>
                            <span className="text-sm text-text-muted">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-text-muted text-xs">Tanggal Pesanan</p>
                          <p className="text-text-primary font-medium">{formatDateTime(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs">Jumlah Tiket</p>
                          <p className="text-text-primary font-medium">{totalTickets} tiket</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs">Subtotal</p>
                          <p className="text-text-primary font-medium">{formatCurrency(order.subtotal)}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs">Status</p>
                          <p className={`font-medium ${config.text}`}>{config.label}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3">
                        {order.status === 'paid' && (
                          <Button size="sm" onClick={() => window.location.href = '/my-tickets'}>
                            <QrCode size={14} />
                            Lihat E-Ticket
                          </Button>
                        )}
                        {order.status === 'waiting_payment' && !getConfig(order).label.includes('expired') && (
                          <Button size="sm" onClick={() => window.location.href = `/payment/${order.id}`}>
                            Lanjutkan Pembayaran
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Detail Pesanan
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
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