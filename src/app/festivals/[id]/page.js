'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  Ticket,
  Users,
  ShieldCheck,
  HelpCircle,
  ListChecks,
  Building2,
  Minus,
  Plus,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Toast from '@/components/ui/Toast';
import useFestivalStore from '@/stores/festivalStore';
import { formatDate, formatDateTime, formatCurrency, getTicketQuotaStatus } from '@/lib/formatters';
import { MAX_TICKET_PER_ORDER } from '@/lib/constants';

const tabs = [
  { id: 'tickets', label: 'Tiket', icon: Ticket },
  { id: 'schedule', label: 'Jadwal', icon: Calendar },
  { id: 'information', label: 'Informasi', icon: ShieldCheck },
];

export default function FestivalDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { festival, isLoading, fetchFestivalById } = useFestivalStore();
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTickets, setSelectedTickets] = useState({});
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    fetchFestivalById(id);
  }, [id, fetchFestivalById]);

  if (isLoading || !festival) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
          <Skeleton className="h-80 mb-8" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CustomerLayout>
    );
  }

  const updateQuantity = (ticketType, delta) => {
    const current = selectedTickets[ticketType.id] || 0;
    const next = Math.max(0, Math.min(MAX_TICKET_PER_ORDER, current + delta));
    setSelectedTickets((prev) => ({ ...prev, [ticketType.id]: next }));
  };

  const totalSelected = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
  const hasSelected = totalSelected > 0;

  const handleBuyTicket = () => {
    if (festival.ticketStatus === 'sold_out') {
      setToast({ isOpen: true, type: 'error', message: 'Maaf, seluruh tiket telah habis terjual.' });
      return;
    }
    if (festival.ticketStatus === 'coming_soon') {
      setToast({ isOpen: true, type: 'warning', message: 'Penjualan tiket belum dibuka.' });
      return;
    }
    const items = Object.entries(selectedTickets)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => {
        const type = festival.ticketTypes.find((t) => t.id === ticketTypeId);
        return { ticketTypeId, name: type.name, price: type.price, quantity };
      });
    if (items.length === 0) {
      setToast({ isOpen: true, type: 'warning', message: 'Pilih minimal satu tiket terlebih dahulu.' });
      return;
    }
    const query = new URLSearchParams();
    query.set('festivalId', festival.id);
    query.set('title', festival.title);
    items.forEach((item) => {
      query.append('ticketTypeId', item.ticketTypeId);
      query.append('name', item.name);
      query.append('price', item.price);
      query.append('quantity', item.quantity);
    });
    router.push(`/checkout?${query.toString()}`);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <CustomerLayout>
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${festival.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-bg via-secondary-bg/40 to-black/60" />
        <div className="absolute top-8 left-5 md:left-10 xl:left-20 z-10">
          <button
            onClick={() => router.push('/festivals')}
            className="inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
            Kembali ke Festival
          </button>
        </div>
      </div>

      <div className="relative z-10 -mt-24 md:-mt-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {festival.featured && <Badge variant="featured">Featured</Badge>}
              <Badge
                variant={festival.ticketStatus === 'sold_out' ? 'sold' : 'available'}
              >
                {festival.ticketStatus === 'sold_out' ? 'Habis Terjual' : festival.ticketStatus === 'coming_soon' ? 'Segera' : 'Tersedia'}
              </Badge>
              <Badge variant="secondary">{festival.genre}</Badge>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3">{festival.title}</h1>
            <p className="text-xl text-text-secondary mb-6">{festival.artist}</p>

            <div className="flex flex-wrap gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-primary-accent" />
                {formatDate(festival.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-primary-accent" />
                {formatDateTime(festival.date).split(',')[1]?.trim()}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-accent" />
                {festival.venue}, {festival.city}
              </span>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            <div className="lg:col-span-2 space-y-10 lg:w-[65%]">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="text-2xl font-bold mb-4">Tentang Event</h2>
                <p className="text-text-secondary leading-relaxed">{festival.description}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="text-2xl font-bold mb-4">Lineup</h2>
                <div className="flex flex-wrap gap-3">
                  {festival.lineup.map((artist) => (
                    <span
                      key={artist}
                      className="px-5 py-2.5 bg-surface border border-border rounded-full text-sm text-text-primary"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </motion.section>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold">Detail</h2>
                  <div className="flex bg-secondary-bg border border-border rounded-full p-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all cursor-pointer ${
                            active
                              ? 'bg-gradient-primary text-primary-bg font-semibold'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <Icon size={14} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeTabData.id === 'tickets' && (
                  <div className="space-y-4">
                    {festival.ticketTypes.map((tc) => {
                      const { remaining, isSoldOut } = getTicketQuotaStatus(tc.sold, tc.quota);
                      const selected = selectedTickets[tc.id] || 0;
                      return (
                        <div
                          key={tc.id}
                          className="bg-secondary-bg border border-border rounded-[18px] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-text-primary">{tc.name}</h3>
                              <span className={`text-xs ${isSoldOut ? 'text-error' : 'text-success'}`}>
                                {isSoldOut ? 'Habis' : `${remaining} tersisa`}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-gradient mb-3">
                              {formatCurrency(tc.price)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <Users size={13} />
                              {tc.sold}/{tc.quota} terjual
                            </div>
                            <div className="w-full h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                                style={{ width: `${(tc.sold / tc.quota) * 100}%` }}
                              />
                            </div>
                          </div>

                          {!isSoldOut && !festival.ticketStatus.includes('sold') && (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(tc, -1)}
                                disabled={selected === 0}
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-primary hover:border-primary-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                              >
                                <Minus size={15} />
                              </button>
                              <span className="w-8 text-center font-semibold text-text-primary">{selected}</span>
                              <button
                                onClick={() => updateQuantity(tc, 1)}
                                disabled={selected >= MAX_TICKET_PER_ORDER || remaining === 0}
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-primary hover:border-primary-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTabData.id === 'schedule' && (
                  <div className="space-y-3">
                    {festival.schedule.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-secondary-bg border border-border rounded-[18px] p-5"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-primary/10 flex items-center justify-center shrink-0">
                          <Clock size={18} className="text-primary-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{s.title}</p>
                          <p className="text-sm text-text-muted">{formatDateTime(s.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTabData.id === 'information' && (
                  <div className="space-y-6">
                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                        <Building2 size={18} className="text-primary-accent" />
                        Organizer
                      </h3>
                      <div className="bg-secondary-bg border border-border rounded-[18px] p-5">
                        <p className="font-semibold text-text-primary mb-1">{festival.organizer.name}</p>
                        <p className="text-sm text-text-muted leading-relaxed">{festival.organizer.description}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                        <ListChecks size={18} className="text-primary-accent" />
                        Ketentuan Festival
                      </h3>
                      <ul className="bg-secondary-bg border border-border rounded-[18px] p-5 space-y-3">
                        {festival.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-accent mt-1.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                        <HelpCircle size={18} className="text-primary-accent" />
                        FAQ
                      </h3>
                      <div className="space-y-3">
                        {festival.faq.map((item) => (
                          <details
                            key={item.q}
                            className="group bg-secondary-bg border border-border rounded-[18px] p-5"
                          >
                            <summary className="font-medium text-text-primary cursor-pointer list-none flex items-center justify-between">
                              {item.q}
                              <span className="text-text-muted group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                            </summary>
                            <p className="mt-3 text-sm text-text-muted leading-relaxed">{item.a}</p>
                          </details>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-[35%]"
            >
              <div className="lg:sticky lg:top-24 bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[24px] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket size={20} className="text-primary-accent" />
                  <span className="text-lg font-semibold">Beli Tiket</span>
                </div>

                <div className="space-y-3 mb-6">
                  {festival.ticketTypes.map((tc) => {
                    const qty = selectedTickets[tc.id] || 0;
                    return (
                      <div key={tc.id} className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">{tc.name}</span>
                        <div className="flex items-center gap-2">
                          {qty > 0 && (
                            <span className="font-semibold text-text-primary">x{qty}</span>
                          )}
                          <span className="text-text-secondary font-medium">
                            {formatCurrency(tc.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted text-sm">Total tiket dipilih</span>
                    <span className="font-bold text-text-primary">{totalSelected}</span>
                  </div>
                  {totalSelected > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-sm">Estimasi subtotal</span>
                      <span className="font-bold text-gradient">
                        {formatCurrency(
                          festival.ticketTypes.reduce(
                            (sum, tc) => sum + tc.price * (selectedTickets[tc.id] || 0),
                            0
                          )
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBuyTicket}
                  disabled={
                    festival.ticketStatus === 'sold_out' ||
                    festival.ticketStatus === 'coming_soon'
                  }
                >
                  <Ticket size={18} />
                  Beli Tiket
                </Button>
                <p className="text-xs text-text-muted mt-4 text-center">
                  Biaya layanan & pajak dihitung saat checkout.
                  Maksimal {MAX_TICKET_PER_ORDER} tiket per order.
                </p>
              </div>
            </motion.aside>
          </div>
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