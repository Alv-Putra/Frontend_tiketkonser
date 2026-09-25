'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Tag,
  Ticket,
  ShieldCheck,
  ChevronLeft,
  Minus,
  Plus,
  X,
  LogIn,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import useOrderStore from '@/stores/orderStore';
import { validateVoucher, applyVoucherDiscount } from '@/lib/vouchers';
import { formatCurrency } from '@/lib/formatters';
import { SERVICE_FEE_PERCENT, TAX_PERCENT, MAX_TICKET_PER_ORDER, RATE_LIMIT } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const createOrder = useOrderStore((state) => state.createOrder);
  const isLoading = useOrderStore((state) => state.isLoading);
  const { hit } = useRateLimit(RATE_LIMIT.CHECKOUT);

  const festivalId = searchParams.get('festivalId');
  const festivalTitle = searchParams.get('title') || '';

  const [items, setItems] = useState(() => {
    const ids = searchParams.getAll('ticketTypeId');
    const names = searchParams.getAll('name');
    const prices = searchParams.getAll('price');
    const quantities = searchParams.getAll('quantity');
    return ids.map((id, i) => ({
      ticketTypeId: id,
      name: names[i],
      price: Number(prices[i]),
      quantity: Number(quantities[i]),
    }));
  });
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, type: 'error', message: '' });

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const serviceFee = Math.ceil(subtotal * (SERVICE_FEE_PERCENT / 100));
    const tax = Math.ceil((subtotal + serviceFee) * (TAX_PERCENT / 100));
    const discount = appliedVoucher
      ? Math.round(applyVoucherDiscount(appliedVoucher, subtotal))
      : 0;
    const total = Math.max(0, subtotal + serviceFee + tax - discount);
    return { subtotal, serviceFee, tax, discount, total };
  }, [items, appliedVoucher]);

  const updateQuantity = (ticketTypeId, delta) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.ticketTypeId !== ticketTypeId) return i;
        const next = Math.max(1, Math.min(MAX_TICKET_PER_ORDER, i.quantity + delta));
        return { ...i, quantity: next };
      })
    );
  };

  const removeItem = (ticketTypeId) => {
    setItems((prev) => prev.filter((i) => i.ticketTypeId !== ticketTypeId));
  };

  const handleApplyVoucher = () => {
    const result = validateVoucher(voucherCode, totals.subtotal, user ? [] : []);
    if (!result.valid) {
      setVoucherError(result.message);
      return;
    }
    setAppliedVoucher(result.voucher);
    setVoucherError('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCreateOrder = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    const rateCheck = hit('checkout');
    if (!rateCheck.allowed) {
      setToast({
        isOpen: true,
        type: 'error',
        message: `Terlalu banyak percobaan. Coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
      });
      return;
    }

    const result = await createOrder({
      festivalId,
      userId: user.id,
      items: items.map(({ ticketTypeId, quantity }) => ({ ticketTypeId, quantity })),
      voucherCode: appliedVoucher?.code,
    });

    if (result.success) {
      router.push(`/payment/${result.order.id}`);
    } else {
      setToast({ isOpen: true, type: 'error', message: result.error });
    }
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-16 text-center">
          <Ticket size={48} className="text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Keranjang kosong</h2>
          <p className="text-text-muted mb-8">Pilih tiket terlebih dahulu dari halaman festival.</p>
          <Button onClick={() => router.push('/festivals')}>Lihat Festival</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black mb-3"
        >
          <span className="text-gradient">Checkout</span>
        </motion.h1>
        <p className="text-text-secondary mb-10">{festivalTitle || 'Pesanan kamu'}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!user && (
              <div className="bg-warning/10 border border-warning/30 rounded-[18px] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogIn size={20} className="text-warning" />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Kamu belum login</p>
                    <p className="text-xs text-text-muted">Masuk untuk melanjutkan checkout</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}>
                  Masuk
                </Button>
              </div>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8"
            >
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Ticket size={18} className="text-primary-accent" />
                Tiket Dipilih
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.ticketTypeId}
                    className="flex items-center justify-between gap-4 p-4 bg-surface rounded-[18px] border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">{item.name}</p>
                      <p className="text-sm text-text-muted">{formatCurrency(item.price)} / tiket</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.ticketTypeId, -1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-primary hover:border-primary-accent transition-all cursor-pointer"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.ticketTypeId, 1)}
                        disabled={item.quantity >= MAX_TICKET_PER_ORDER}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-primary hover:border-primary-accent disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() => removeItem(item.ticketTypeId)}
                        className="p-1.5 text-text-muted hover:text-error transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8"
            >
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Tag size={18} className="text-primary-accent" />
                Kode Voucher
              </h2>
              {appliedVoucher ? (
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-[18px]">
                  <div>
                    <p className="font-semibold text-success">{appliedVoucher.code}</p>
                    <p className="text-xs text-text-muted">
                      Diskon {appliedVoucher.type === 'flat'
                        ? formatCurrency(appliedVoucher.value)
                        : `${appliedVoucher.value}%`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-error hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setVoucherError('');
                    }}
                    placeholder="Masukkan kode voucher"
                    className="flex-1 bg-surface border border-border rounded-full px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all duration-200"
                  />
                  <Button variant="outline" onClick={handleApplyVoucher}>Terapkan</Button>
                </div>
              )}
              {voucherError && <p className="mt-2 text-sm text-error">{voucherError}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {['KONSER10', 'FEST15', 'GAKITU20', 'FLAT50', 'VIP100'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setVoucherCode(code)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text-muted hover:text-primary-accent hover:border-primary-accent/40 transition-all cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </motion.section>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[24px] p-6 md:p-8">
              <h2 className="font-bold text-lg mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text-primary">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Biaya layanan ({SERVICE_FEE_PERCENT}%)</span>
                  <span className="text-text-primary">{formatCurrency(totals.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Pajak ({TAX_PERCENT}%)</span>
                  <span className="text-text-primary">{formatCurrency(totals.tax)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Diskon voucher</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">Total Pembayaran</span>
                  <span className="text-2xl font-black text-gradient">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateOrder}
                disabled={isLoading || items.length === 0}
              >
                {isLoading ? 'Memproses...' : 'Buat Pesanan'}
              </Button>

              <div className="mt-5 flex items-start gap-3 text-xs text-text-muted">
                <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                <p>
                  Pesanan dibuat dengan nomor unik. Pembayaran harus diselesaikan dalam 60 menit
                  sebelum order kadaluarsa.
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
        <CheckoutContent />
      </ProtectedRoute>
    </Suspense>
  );
}