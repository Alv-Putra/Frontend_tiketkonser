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
  { value: '500+', label: 'Festival Terdaftar', accent: 'text-violet-400' },
  { value: '1M+', label: 'Tiket Terjual', accent: 'text-pink-400' },
  { value: '100K+', label: 'Pengguna Aktif', accent: 'text-cyan-400' },
  { value: '50+', label: 'Kota Terjangkau', accent: 'text-emerald-400' },
];

const values = [
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Transaksi yang aman dengan enkripsi data tingkat tinggi dan verifikasi berlapis.',
    color: 'violet',
  },
  {
    icon: Zap,
    title: 'Cepat & Mudah',
    description: 'Proses pembelian tiket hanya dalam hitungan detik dengan antarmuka yang intuitif.',
    color: 'amber',
  },
  {
    icon: Globe,
    title: 'Jangkauan Nasional',
    description: 'Festival dari Sabang sampai Merauke, dari kota besar hingga destinasi wisata.',
    color: 'cyan',
  },
  {
    icon: Heart,
    title: 'Layanan Prima',
    description: 'Tim customer service siap membantu 24/7 melalui berbagai channel komunikasi.',
    color: 'pink',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-violet-600/20"
          >
            <Music2 size={40} className="text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mb-4">
            Tentang ConserId
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            ConserId adalah platform penjualan tiket festival dan konser musik terdepan di Indonesia.
            Kami menghubungkan conservateurs musik dengan event-event terbaik dari seluruh Nusantara.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 text-center hover:border-violet-500/40 transition-colors"
            >
              <div className={`text-3xl md:text-4xl font-extrabold mb-2 ${stat.accent}`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Vision & Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
            <div className="w-14 h-14 bg-violet-600/15 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Visi Kami</h2>
            <p className="text-slate-400 leading-relaxed">
              Menjadi platform tiket festival dan konser nomor satu di Asia Tenggara,
              memberikan pengalaman yang tak terlupakan bagi setiap pencinta musik Indonesia.
            </p>
          </div>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
            <div className="w-14 h-14 bg-cyan-500/15 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Misi Kami</h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>Memudahkan akses tiket festival untuk semua kalangan</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>Mendukung ekosistem musik dan festival di Indonesia</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>Memberikan pengalaman pengguna yang terbaik</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-8 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colorClasses = {
                violet: 'bg-violet-600/15 text-violet-400',
                amber: 'bg-amber-500/15 text-amber-400',
                cyan: 'bg-cyan-500/15 text-cyan-400',
                pink: 'bg-pink-500/15 text-pink-400',
              };
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-violet-500/40 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[value.color]}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-50 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
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
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-8 text-center">
            Perjalanan Kami
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-violet-600/20">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                  <h3 className="font-bold text-slate-50 mb-1">{milestone.title}</h3>
                  <p className="text-sm text-slate-500">{milestone.description}</p>
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
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-8 text-center">
            Tim Kami
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-6 text-center hover:border-violet-500/40 transition-colors"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-[#0F172A]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-slate-50">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-8 text-center">
            Partner & Kolaborator
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-5 py-2.5 bg-[#111827] border border-slate-800 rounded-full text-sm font-medium text-slate-400"
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
          className="bg-[#111827] border border-slate-800 rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-50 mb-4">
            Siap Menemukan Festival Favoritmu?
          </h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
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
              <Button variant="secondary" size="lg">
                <Smartphone size={20} />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
