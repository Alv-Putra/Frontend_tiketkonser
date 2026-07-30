'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Download, ChevronLeft, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const concertData = {
  1: {
    id: 1,
    title: 'Java Jazz Festival 2026',
    artist: 'Various Artists',
    date: '15-17 Mei 2026',
    time: '14:00 - 23:00 WIB',
    venue: 'JIExpo Kemayoran, Jakarta',
    priceStart: 350000,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    status: 'Available',
    featured: true,
    description: 'Java Jazz Festival 2026 kembali hadir dengan lineup yang lebih spektakuler! Festival jazz terbesar di Asia Tenggara ini akan menampilkan ratusan musisi jazz nasional dan internasional.',
    lineup: ['Tulus', 'Raisa', 'Tompi', 'Barry Likumahuwa', 'Andien', 'International Guest Stars'],
    ticketClasses: [
      { name: 'VIP', price: 1500000, quota: 200, sold: 150 },
      { name: 'Category 1', price: 850000, quota: 500, sold: 400 },
      { name: 'Category 2', price: 500000, quota: 1000, sold: 600 },
      { name: 'Festival', price: 350000, quota: 2000, sold: 1200 },
    ],
    faq: [
      { q: 'Apakah anak-anak boleh masuk?', a: 'Anak-anak di atas 5 tahun diperbolehkan masuk dengan tiket masuk.' },
      { q: 'Apakah tersedia area parkir?', a: 'Tersedia area parkir yang luas di kompleks JIExpo.' },
    ],
  },
};

const benefits = [
  { icon: Smartphone, text: 'Beli tiket via aplikasi' },
  { icon: CheckCircle, text: 'Pilih kelas tiket' },
  { icon: Download, text: 'Dapatkan E-Ticket' },
];

export default function ConcertDetail({ params }) {
  const [activeTab, setActiveTab] = useState('tickets');
  const concert = concertData[params.id] || concertData[1];

  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${concert.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/60 to-transparent" />
        <div className="absolute top-8 left-5 md:left-10 xl:left-20 z-10">
          <Link
            href="/#concerts"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={18} />
            Kembali ke Konser
          </Link>
        </div>
      </div>

      <div className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {concert.featured && <Badge variant="featured">Featured</Badge>}
              <Badge variant={concert.status === 'Sold Out' ? 'sold' : 'available'}>{concert.status}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3">{concert.title}</h1>
            <p className="text-xl text-text-secondary mb-6">{concert.artist}</p>

            <div className="flex flex-wrap gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-2"><Calendar size={16} />{concert.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} />{concert.time}</span>
              <span className="flex items-center gap-2"><MapPin size={16} />{concert.venue}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">Tentang Event</h2>
                <p className="text-text-secondary leading-relaxed">{concert.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Lineup</h2>
                <div className="flex flex-wrap gap-3">
                  {concert.lineup.map((artist) => (
                    <span key={artist} className="px-4 py-2 bg-surface rounded-full text-sm text-text-primary">
                      {artist}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Kelas Tiket</h2>
                <div className="space-y-3">
                  {concert.ticketClasses.map((tc) => (
                    <div key={tc.name} className="bg-secondary-bg border border-border rounded-[18px] p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">{tc.name}</h3>
                        <p className="text-sm text-text-muted">
                          {tc.sold}/{tc.quota} terjual
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gradient">Rp{tc.price.toLocaleString('id-ID')}</p>
                        <div className="w-32 h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${(tc.sold / tc.quota) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[18px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone size={20} className="text-primary-accent" />
                  <span className="font-semibold">Beli via App</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                  Untuk membeli tiket, silakan download aplikasi ConcertHub.
                </p>

                <div className="space-y-3 mb-6">
                  {benefits.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle size={14} className="text-success" />
                        </div>
                        <span className="text-text-secondary">{b.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-surface rounded-[18px] border border-border flex items-center justify-center">
                    <QrCode size={50} className="text-text-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button className="w-full">
                    <Download size={16} />
                    Download App
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin size={16} />
                    Lihat di Maps
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
