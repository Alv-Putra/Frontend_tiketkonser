'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
  waiting_payment: { label: 'Menunggu Pembayaran', variant: 'warning', icon: Clock },
  paid: { label: 'Lunas', variant: 'success', icon: CheckCircle },
  pending: { label: 'Diproses', variant: 'default', icon: AlertCircle },
  cancelled: { label: 'Dibatalkan', variant: 'error', icon: XCircle },
  expired: { label: 'Kadaluarsa', variant: 'error', icon: XCircle },
};

function OrdersContent() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <Skeleton className="h-32 mb-4" />
          <Skeleton className="h-32 mb-4" />
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
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-gradient">Riwayat Pesanan</span>
          </h1>
          <p className="text-text-secondary">
            Lacak semua pesanan tiket kamu di sini.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Belum ada pesanan"
            description="Kamu belum memiliki pesanan tiket."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = getConfig(order);
              const Icon = config.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-secondary-bg border border-border rounded-[24px] p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                    <div className="mb-3 md:mb-0">
                      <p className="font-bold text-text-primary mb-1">{order.festivalTitle}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(order.festivalDate).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })} • {order.venue}
                      </p>
                      <p className="font-mono text-xs text-text-muted mt-1">{order.orderNumber}</p>
                    </div>
                    <Badge variant={config.variant}>
                      <Icon size={12} />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface rounded-[18px] border border-border">
                    <div className="text-sm">
                      <span className="text-text-muted mr-2">Total tiket:</span>
                      <span className="text-text-primary font-medium">
                        {order.items.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-text-muted mr-2">Dibuat:</span>
                      <span className="text-text-primary">{formatDateTime(order.createdAt)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-text-muted mb-0.5">Total</span>
                      <span className="font-bold text-gradient">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {order.status === 'paid' && (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/my-tickets'}>
                        Lihat E-Ticket
                      </Button>
                    )}
                    {order.status === 'waiting_payment' && !getConfig(order).label.includes('expired') && (
                      <Button size="sm" onClick={() => window.location.href = `/payment/${order.id}`}>
                        Lanjutkan Pembayaran
                      </Button>
                    )}
                  </div>
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