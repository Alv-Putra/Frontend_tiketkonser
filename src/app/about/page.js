'use client';

import { motion } from 'framer-motion';
import {
  Music2, Users, Zap, Shield, Heart, Globe,
  Ticket, Smartphone, Star, Award, Target, Eye
} from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';

const stats = [
  { value: '500+', label: 'Festival Terdaftar' },
  { value: '1M+', label: 'Tiket Terjual' },
  { value: '100K+', label: 'Pengguna Aktif' },
  { value: '50+', label: 'Kota Terjangkau' },
];

const values = [
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Transaksi yang aman dengan enkripsi data tingkat tinggi dan verifikasi berlapis.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Cepat & Mudah',
    description: 'Proses pembelian tiket hanya dalam hitungan detik dengan antarmuka yang intuitif.',
    color: 'warning',
  },
  {
    icon: Globe,
    title: 'Jangkauan Nasional',
    description: 'Festival dari Sabang sampai Merauke, dari kota besar hingga destinasi wisata.',
    color: 'success',
  },
  {
    icon: Heart,
    title: 'Layanan Prima',
    description: 'Tim customer service siap membantu 24/7 melalui berbagai channel komunikasi.',
    color: 'error',
  },
];

const team = [
  {
    name: 'Ahmad Wijaya',
    role: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Sari Dewi',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Budi Santoso',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Maya Putri',
    role: 'Head of Marketing',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
];

const milestones = [
  { year: '2022', title: 'Didirikan', description: 'ConserId resmi diluncurkan di Jakarta' },
  { year: '2023', title: 'Ekspansi', description: 'Meluas ke 20 kota di Indonesia' },
  { year: '2024', title: '1 Juta Users', description: 'Mencapai 1 juta pengguna aktif' },
  { year: '2025', title: 'Mobile App', description: 'Luncur aplikasi mobile iOS & Android' },
];

const partners = [
  'JakFEST', 'GoWork', 'WeWork', 'Tiket.com', 'Traveloka',
  'BCA', 'Mandiri', 'OVO', 'GoPay', 'DANA'
];

export default function AboutPage() {
  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Music2 size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-gradient">Tentang ConserId</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
            ConserId adalah platform penjualan tiket festival dan konser musik terdepan di Indonesia.
            Kami menghubungkan pecinta musik dengan event-event terbaik dari seluruh Nusantara.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-secondary-bg border border-border rounded-2xl p-6 text-center hover:border-primary-accent/30 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-black text-primary-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Vision & Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-gradient-to-br from-primary-accent/5 to-primary-accent/10 border border-border rounded-2xl p-8">
            <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-primary-accent" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Visi Kami</h2>
            <p className="text-text-secondary leading-relaxed">
              Menjadi platform tiket festival dan konser номер satu di Asia Tenggara,
              memberikan pengalaman yang tak terlupakan bagi setiap pecinta musik Indonesia.
            </p>
          </div>
          <div className="bg-gradient-to-br from-success/5 to-success/10 border border-success/30 rounded-2xl p-8">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Misi Kami</h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span>Memudahkan akses tiket festival untuk semua kalangan</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span>Mendukung ekosistem musik dan festival di Indonesia</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span>Memberikan pengalaman пользователя yang terbaik</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colorClasses = {
                primary: 'bg-primary-accent/10 text-primary-accent',
                warning: 'bg-warning/10 text-warning',
                success: 'bg-success/10 text-success',
                error: 'bg-error/10 text-error',
              };
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-secondary-bg border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[value.color]}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-text-muted">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Perjalanan Kami
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                  <h3 className="font-bold text-text-primary mb-1">{milestone.title}</h3>
                  <p className="text-sm text-text-muted">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Tim Kami
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-secondary-bg border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-surface">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-text-primary">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Partner & Kolaborator
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-6 py-3 bg-surface rounded-full text-sm font-medium text-text-secondary"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-primary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Siap Menemukan Festival Favoritmu?
          </h3>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Jelajahi ribuan festival dan konser dari seluruh Indonesia.
            Beli tiket dengan mudah dan dapatkan e-ticket dengan QR Code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/festivals">
              <Button size="lg">
                <Ticket size={20} />
                Jelajahi Festival
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
