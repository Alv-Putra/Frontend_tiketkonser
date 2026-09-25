'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  Landmark,
  Wallet,
  CreditCard,
  QrCode,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import Skeleton from '@/components/ui/Skeleton';
import orderService from '@/services/orderService';
import useOrderStore from '@/stores/orderStore';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency, formatDateTime, isPaymentExpired } from '@/lib/formatters';

const methodIcons = {
  bank_transfer: Landmark,
  ewallet: Wallet,
  credit_card: CreditCard,
  qris: QrCode,
};

function PaymentContent({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const payOrder = useOrderStore((state) => state.payOrder);
  const isLoading = useOrderStore((state) => state.isLoading);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  useEffect(() => {
    const load = async () => {
      const result = await orderService.getOrderById(id);
      setOrder(result);
      setLoading(false);
    };
    load();
  }, [id]);

  const handlePay = async () => {
    if (!order) return;
    if (isPaymentExpired(order.createdAt)) {
      setToast({ isOpen: true, type: 'error', message: 'Order sudah kadaluarsa. Silakan buat pesanan baru.' });
      return;
    }
    setIsProcessing(true);
    const result = await payOrder(order.id, selectedMethod);
    setIsProcessing(false);
    if (result.success) {
      router.push(`/payment/success/${order.id}`);
    } else {
      setToast({ isOpen: true, type: 'error', message: result.error });
    }
  };

  if (loading || !order) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
          <Skeleton className="h-6 w-40 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-80" />
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const expired = isPaymentExpired(order.createdAt);
  const selectedMethodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        <button
          onClick={() => router.push('/checkout')}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black mb-2"
        >
          <span className="text-gradient">Pembayaran</span>
        </motion.h1>
        <p className="text-text-secondary mb-2">No. Pesanan: <span className="text-primary-accent font-medium">{order.orderNumber}</span></p>

        <div className={`inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-full border ${
          expired ? 'bg-error/10 text-error border-error/30' : 'bg-warning/10 text-warning border-warning/30'
        }`}>
          <Clock size={14} />
          {expired ? 'Order telah kadaluarsa' : `Bayar sebelum ${formatDateTime(order.expiresAt)}`}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {expired && (
              <div className="bg-error/10 border border-error/30 rounded-[18px] p-5 flex items-start gap-3">
                <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-error text-sm">Order Kadaluarsa</p>
                  <p className="text-xs text-text-muted mt-1">
                    Batas waktu pembayaran telah lewat. Order tidak dapat diproses. Silakan buat pesanan baru.
                  </p>
                </div>
              </div>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8"
            >
              <h2 className="font-bold text-lg mb-6">Pilih Metode Pembayaran</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = methodIcons[method.id] || Wallet;
                  const active = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-5 rounded-[18px] border text-left transition-all duration-200 cursor-pointer ${
                        active
                          ? 'border-primary-accent bg-primary-accent/10'
                          : 'border-border bg-surface hover:border-primary-accent/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon
                          size={22}
                          className={active ? 'text-primary-accent' : 'text-text-muted'}
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          active ? 'border-primary-accent' : 'border-text-muted'
                        }`}>
                          {active && <div className="w-2 h-2 rounded-full bg-primary-accent" />}
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${active ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{method.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8"
            >
              <h2 className="font-bold text-lg mb-6">Instruksi Pembayaran</h2>
              <div className="flex items-center gap-4 p-5 bg-surface rounded-[18px] border border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-primary/10 flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = methodIcons[selectedMethod] || Wallet;
                    return <Icon size={22} className="text-primary-accent" />;
                  })()}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{selectedMethodData.name}</p>
                  <p className="text-sm text-text-muted">{selectedMethodData.description}</p>
                </div>
              </div>
              <ol className="mt-5 space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-xs shrink-0">1</span>
                  Pilih metode {selectedMethodData.name} di aplikasi payment.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-xs shrink-0">2</span>
                  Bayar sesuai nominal total pembayaran.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-xs shrink-0">3</span>
                  Sistem akan otomatis mengonfirmasi pembayaran yang berhasil.
                </li>
              </ol>
            </motion.section>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[24px] p-6 md:p-8">
              <h2 className="font-bold text-lg mb-6">Detail Pesanan</h2>

              <div className="rounded-[18px] bg-surface border border-border p-5 mb-6">
                <p className="font-semibold text-text-primary mb-2">{order.festivalTitle}</p>
                <p className="text-xs text-text-muted mb-4">{order.venue}</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.ticketTypeId} className="flex justify-between text-sm">
                      <span className="text-text-muted">{item.name} x{item.quantity}</span>
                      <span className="text-text-secondary">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Biaya layanan</span>
                  <span>{formatCurrency(order.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Pajak</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Diskon</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-secondary">Total</span>
                  <span className="text-2xl font-black text-gradient">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePay}
                disabled={isProcessing || expired || order.status !== 'waiting_payment'}
              >
                {isProcessing ? 'Memproses Pembayaran...' : `Bayar ${formatCurrency(order.total)}`}
              </Button>

              <div className="mt-5 flex items-start gap-3 text-xs text-text-muted">
                <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                <p>
                  Pembayaran diproses melalui payment gateway yang aman. E-Ticket dibuat otomatis
                  setelah pembayaran berhasil.
                </p>
              </div>
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

export default function PaymentPage({ params }) {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <PaymentContent params={params} />
    </ProtectedRoute>
  );
}