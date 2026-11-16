'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Ticket, Home, ListOrdered } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ProtectedRoute from '@/components/ProtectedRoute';
import orderService from '@/services/orderService';
import useOrderStore from '@/stores/orderStore';
import { formatCurrency, formatDateTime } from '@/lib/formatters';

function SuccessContent({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const paymentResult = useOrderStore((state) => state.paymentResult);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await orderService.getOrderById(id);
      setOrder(result);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !order) {
    return (
      <CustomerLayout>
        <div className="max-w-2xl mx-auto px-5 py-16 text-center">
          <Skeleton className="h-32 w-32 rounded-full mx-auto mb-8" />
          <Skeleton className="h-8 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </CustomerLayout>
    );
  }

  const isPaid = order.status === 'paid';
  const ticketsGenerated = paymentResult?.tickets?.length || null;

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto px-5 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPaid ? 'bg-success/15' : 'bg-warning/15'
            }`}
          >
            <CheckCircle size={56} className={isPaid ? 'text-success' : 'text-warning'} />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className={isPaid ? 'text-gradient' : ''}>
              {isPaid ? 'Pembayaran Berhasil!' : 'Pembayaran Diterima'}
            </span>
          </h1>
          <p className="text-text-secondary">
            {isPaid
              ? `Terima kasih! ${ticketsGenerated || order.items.reduce((s, i) => s + i.quantity, 0)} tiket telah dibuat.`
              : 'Pembayaran kamu sedang diproses.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-text-muted mb-1">No. Pesanan</p>
              <p className="font-bold text-text-primary">{order.orderNumber}</p>
            </div>
            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <p className="text-sm text-text-muted mb-1">Total Pembayaran</p>
              <p className="font-bold text-gradient text-xl">{formatCurrency(order.total)}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className={isPaid ? 'text-success font-medium' : 'text-warning font-medium'}>
                {isPaid ? 'Lunas' : 'Menunggu Konfirmasi'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Metode Pembayaran</span>
              <span className="text-text-primary">{order.paymentMethod || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Festival</span>
              <span className="text-text-primary text-right">{order.festivalTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Jumlah Tiket</span>
              <span className="text-text-primary">
                {order.items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Dibayar pada</span>
              <span className="text-text-primary">
                {order.paidAt ? formatDateTime(order.paidAt) : '-'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" size="lg" onClick={() => router.push('/my-tickets')}>
            <Ticket size={18} />
            Lihat E-Ticket Saya
          </Button>
          <Button variant="outline" className="flex-1" size="lg" onClick={() => router.push('/orders')}>
            <ListOrdered size={18} />
            Riwayat Pesanan
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home size={16} />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default function PaymentSuccessPage({ params }) {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <SuccessContent params={params} />
    </ProtectedRoute>
  );
}