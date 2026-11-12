'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
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
  Clock,
  Check,
  User,
  CreditCard,
  QrCode,
  Landmark,
  Wallet,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { Stepper, BackButton } from '@/components/ui';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/stores/authStore';
import useOrderStore from '@/stores/orderStore';
import { validateVoucher, applyVoucherDiscount } from '@/lib/vouchers';
import { formatCurrency } from '@/lib/formatters';
import {
  SERVICE_FEE_PERCENT,
  TAX_PERCENT,
  MAX_TICKET_PER_ORDER,
  RATE_LIMIT,
} from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

export const PAYMENT_METHOD_STORAGE_KEY = 'conserid:payment-method';
export const BUYER_DATA_STORAGE_KEY = 'conserid:buyer-data';

const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer';

const SECONDARY_BTN =
  'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer';

/** Metode pembayaran yang ditawarkan di checkout (id tetap sama dengan PAYMENT_METHODS). */
const CHECKOUT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Scan QRIS dari aplikasi e-wallet favoritmu.',
    icon: QrCode,
  },
  {
    id: 'bank_transfer',
    name: 'Virtual Account',
    description: 'BCA, Mandiri, BRI, BNI - transfer terverifikasi otomatis.',
    icon: Landmark,
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, ShopeePay.',
    icon: Wallet,
  },
];

const CHECKOUT_STEPS = [
  { title: 'Pilih Tiket', description: 'Atur jumlah tiket' },
  { title: 'Data Pemesan', description: 'Lengkapi data pemesan' },
  { title: 'Pembayaran & E-Ticket', description: 'Konfirmasi & bayar' },
];

const COUNTDOWN_SECONDS = 10 * 60;

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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

  const [buyer, setBuyer] = useState(() => ({
    fullName: user?.name || user?.full_name || '',
    email: user?.email || '',
    whatsapp: '',
  }));
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (!buyer.fullName && (user?.name || user?.full_name)) {
      setBuyer((prev) => ({
        ...prev,
        fullName: prev.fullName || user?.name || user?.full_name || '',
        email: prev.email || user?.email || '',
      }));
    }
  }
  const [buyerErrors, setBuyerErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleBuyerChange = (field, value) => {
    setBuyer((prev) => ({ ...prev, [field]: value }));
    setBuyerErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateBuyer = () => {
    const errors = {};
    if (!buyer.fullName.trim()) {
      errors.fullName = 'Nama lengkap sesuai KTP wajib diisi.';
    }
    if (!buyer.email.trim()) {
      errors.email = 'Email aktif wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) {
      errors.email = 'Format email tidak valid.';
    }
    const digits = buyer.whatsapp.replace(/\D/g, '');
    if (!digits) {
      errors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (digits.length < 9 || digits.length > 15) {
      errors.whatsapp = 'Nomor WhatsApp tidak valid.';
    }
    setBuyerErrors(errors);
    return Object.keys(errors).length === 0;
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

    if (!validateBuyer()) {
      setToast({
        isOpen: true,
        type: 'error',
        message: 'Lengkapi data pemesan dengan benar sebelum melanjutkan.',
      });
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

    try {
      window.localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, paymentMethod);
      window.localStorage.setItem(
        BUYER_DATA_STORAGE_KEY,
        JSON.stringify({
          fullName: buyer.fullName.trim(),
          email: buyer.email.trim(),
          whatsapp: buyer.whatsapp.trim(),
        })
      );
    } catch {
      /* localStorage tidak tersedia - abaikan */
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
            <Ticket size={36} className="text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-50 mb-2">Keranjang kosong</h2>
          <p className="text-slate-400 mb-8">Pilih tiket terlebih dahulu dari halaman festival.</p>
          <Button onClick={() => router.push('/festivals')}>Lihat Festival</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <BackButton href="/festivals" label="Kembali ke Festival" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black mb-2"
        >
          <span className="text-gradient">Checkout</span>
        </motion.h1>
        <p className="text-slate-400 mb-8 break-words">{festivalTitle || 'Pesanan kamu'}</p>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 md:p-6 mb-6">
          <Stepper steps={CHECKOUT_STEPS} currentStep={1} />
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl flex items-center gap-3 mb-8">
          <Clock size={18} className="shrink-0" />
          <p className="text-sm font-medium">
            Selesaikan pembayaran dalam{' '}
            <span className="font-bold tabular-nums">{formatCountdown(secondsLeft)}</span> menit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {!user && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LogIn size={20} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-50 text-sm">Kamu belum login</p>
                    <p className="text-xs text-slate-500">Masuk untuk melanjutkan checkout</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    router.push(
                      `/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
                    )
                  }
                >
                  Masuk
                </Button>
              </div>
            )}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-bold text-lg text-slate-50 mb-5 flex items-center gap-2">
                <Ticket size={18} className="text-violet-400" />
                Tiket Dipilih
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.ticketTypeId}
                    className="flex items-center justify-between gap-3 p-4 bg-[#0F172A] rounded-xl border border-slate-800"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-50 truncate">{item.name}</p>
                      <p className="text-sm text-slate-500">{formatCurrency(item.price)} / tiket</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.ticketTypeId, -1)}
                        aria-label="Kurangi jumlah tiket"
                        className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-200 hover:border-violet-500 hover:text-violet-300 transition-all cursor-pointer"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-50">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.ticketTypeId, 1)}
                        aria-label="Tambah jumlah tiket"
                        disabled={item.quantity >= MAX_TICKET_PER_ORDER}
                        className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-200 hover:border-violet-500 disabled:opacity-40 disabled:hover:border-slate-700 transition-all cursor-pointer"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() => removeItem(item.ticketTypeId)}
                        aria-label="Hapus tiket"
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
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
              transition={{ delay: 0.15 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-bold text-lg text-slate-50 mb-5 flex items-center gap-2">
                <User size={18} className="text-violet-400" />
                Data Pemesan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="buyer-fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nama Lengkap (sesuai KTP)
                  </label>
                  <input
                    id="buyer-fullName"
                    type="text"
                    value={buyer.fullName}
                    onChange={(e) => handleBuyerChange('fullName', e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      buyerErrors.fullName
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/20'
                    }`}
                  />
                  {buyerErrors.fullName && (
                    <p className="mt-1.5 text-sm text-rose-400">{buyerErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="buyer-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email Aktif
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    value={buyer.email}
                    onChange={(e) => handleBuyerChange('email', e.target.value)}
                    placeholder="nama@email.com"
                    className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      buyerErrors.email
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/20'
                    }`}
                  />
                  {buyerErrors.email && (
                    <p className="mt-1.5 text-sm text-rose-400">{buyerErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="buyer-whatsapp" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="buyer-whatsapp"
                    type="tel"
                    inputMode="numeric"
                    value={buyer.whatsapp}
                    onChange={(e) => handleBuyerChange('whatsapp', e.target.value)}
                    placeholder="0812 3456 7890"
                    className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      buyerErrors.whatsapp
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/20'
                    }`}
                  />
                  {buyerErrors.whatsapp && (
                    <p className="mt-1.5 text-sm text-rose-400">{buyerErrors.whatsapp}</p>
                  )}
                </div>
              </div>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-bold text-lg text-slate-50 mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-violet-400" />
                Metode Pembayaran
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CHECKOUT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      aria-pressed={active}
                      className={`relative text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        active
                          ? 'border-violet-500 bg-violet-600/10 ring-1 ring-violet-500/40'
                          : 'border-slate-800 bg-[#111827] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <Icon
                          size={22}
                          className={active ? 'text-violet-400' : 'text-slate-500'}
                        />
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center shrink-0">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <p
                        className={`font-semibold text-sm ${
                          active ? 'text-violet-300' : 'text-slate-200'
                        }`}
                      >
                        {method.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{method.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-bold text-lg text-slate-50 mb-5 flex items-center gap-2">
                <Tag size={18} className="text-violet-400" />
                Kode Voucher
              </h2>
              {appliedVoucher ? (
                <div className="flex items-center justify-between gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-semibold text-emerald-400">{appliedVoucher.code}</p>
                    <p className="text-xs text-slate-500">
                      Diskon{' '}
                      {appliedVoucher.type === 'flat'
                        ? formatCurrency(appliedVoucher.value)
                        : `${appliedVoucher.value}%`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-rose-400 hover:underline cursor-pointer shrink-0"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setVoucherError('');
                    }}
                    placeholder="Masukkan kode voucher"
                    aria-label="Kode voucher"
                    className="flex-1 w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                  />
                  <Button variant="secondary" onClick={handleApplyVoucher}>
                    Terapkan
                  </Button>
                </div>
              )}
              {voucherError && <p className="mt-2 text-sm text-rose-400">{voucherError}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {['KONSER10', 'FEST15', 'GAKITU20', 'FLAT50', 'VIP100'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setVoucherCode(code)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-violet-300 hover:border-violet-500/40 transition-all cursor-pointer"
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
            className="lg:sticky lg:top-24 lg:self-start min-w-0"
          >
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="font-bold text-lg text-slate-50 mb-6">Ringkasan Pembayaran</h2>

              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.ticketTypeId} className="flex justify-between gap-3">
                    <span className="text-slate-400 min-w-0 break-words">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-slate-100 shrink-0 tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-800 mt-4 pt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Harga Tiket</span>
                  <span className="text-slate-100 tabular-nums">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Biaya Layanan ({SERVICE_FEE_PERCENT}%)</span>
                  <span className="text-slate-100 tabular-nums">{formatCurrency(totals.serviceFee)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Pajak ({TAX_PERCENT}%)</span>
                  <span className="text-slate-100 tabular-nums">{formatCurrency(totals.tax)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between gap-3 text-emerald-400">
                    <span>Diskon voucher</span>
                    <span className="tabular-nums">-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-800 mt-4 pt-4 mb-6">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-slate-300 font-medium">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={isLoading || items.length === 0}
                className={`${PRIMARY_BTN} w-full py-3.5 ${
                  isLoading || items.length === 0
                    ? 'bg-slate-800/60 text-slate-500 border border-slate-800 font-medium cursor-not-allowed opacity-60 shadow-none hover:translate-y-0'
                    : ''
                }`}
              >
                {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
              </button>

              <div className="mt-5 flex items-start gap-3 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Pesanan dibuat dengan nomor unik. Pembayaran harus diselesaikan sebelum order
                  kadaluarsa.
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
