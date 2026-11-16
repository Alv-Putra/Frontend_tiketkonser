'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, CheckCircle, XCircle, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';

const lastUpdated = '15 Januari 2026';

const refundScenarios = [
  {
    scenario: 'Event Dibatalkan',
    eligible: true,
    icon: CheckCircle,
    color: 'success',
    description: 'Jika event dibatalkan oleh penyelenggara, Anda berhak mendapatkan refund 100% dari total pembayaran.',
    process: 'Refund akan diproses dalam 7-14 hari kerja ke metode pembayaran asli.',
  },
  {
    scenario: 'Jadwal Berubah Signifikan',
    eligible: true,
    icon: CheckCircle,
    color: 'success',
    description: 'Jika jadwal event berubah secara signifikan (tanggal bergeser lebih dari 7 hari atau venue berbeda), Anda dapat meminta refund.',
    process: 'Hubungi customer service dalam 14 hari setelah pengumuman perubahan.',
  },
  {
    scenario: 'Kesalahan Teknis dari ConserId',
    eligible: true,
    icon: CheckCircle,
    color: 'success',
    description: 'Jika terjadi kesalahan teknis dari sistem kami yang menyebabkan kegagalan transaksi atau double charging.',
    process: 'Refund akan diproses setelah konfirmasi oleh tim teknis kami.',
  },
  {
    scenario: 'Pembeli Ingin Membatalkan',
    eligible: false,
    icon: XCircle,
    color: 'error',
    description: 'Pembelian tiket festival bersifat final. Pembatalan sukarela oleh pembeli tidak diperkenankan.',
    process: 'Tiket tidak dapat di-refund karena alasan pribadi.',
  },
  {
    scenario: 'Tidak Hadir di Event',
    eligible: false,
    icon: XCircle,
    color: 'error',
    description: 'Jika Anda tidak dapat hadir di event, tiket tidak dapat di-refund.',
    process: 'Tiket tetap berlaku dan dapat dipindahtangankan ke orang lain.',
  },
  {
    scenario: 'Tiket Sudah Dicetak/Digunakan',
    eligible: false,
    icon: XCircle,
    color: 'error',
    description: 'Tiket yang sudah digunakan untuk check-in tidak dapat di-refund.',
    process: 'Setiap tiket hanya bisa digunakan sekali.',
  },
];

const faqItems = [
  {
    title: 'Berapa lama proses refund?',
    content: 'Proses refund memakan waktu 7-14 hari kerja setelah pengajuan disetujui. Untuk pembayaran dengan kartu kredit, mungkin perlu waktu tambahan 5-10 hari kerja tergantung bank.',
  },
  {
    title: 'Ke mana refund akan dikirim?',
    content: 'Refund akan dikembalikan ke metode pembayaran asli yang digunakan saat pembelian. Jika tidak memungkinkan, kami akan menghubungi Anda untuk alternatif.',
  },
  {
    title: 'Apakah saya akan mendapat email notifikasi?',
    content: 'Ya, Anda akan menerima email notifikasi di setiap tahap proses refund: saat pengajuan diterima, saat refund diproses, dan saat refund selesai.',
  },
  {
    title: 'Apa yang terjadi jika event ditunda?',
    content: 'Jika event ditunda ke tanggal baru, Anda memiliki opsi untuk mengikuti event di tanggal baru atau meminta refund. Keputusan harus disampaikan dalam 14 hari setelah pengumuman penundaan.',
  },
  {
    title: 'Apakah saya bisa memindahtangankan tiket saya?',
    content: 'Tiket dapat dipindahtangankan ke orang lain. E-ticket dapat diakses oleh siapa pun yang memiliki QR code. Pastikan untuk memberikan e-ticket hanya kepada orang yang Anda percaya.',
  },
];

const steps = [
  { num: 1, title: 'Hubungi Customer Service', desc: 'Ajukan permintaan refund melalui email atau telepon.' },
  { num: 2, title: 'Verifikasi', desc: 'Tim kami akan memverifikasi permintaan Anda.' },
  { num: 3, title: 'Persetujuan', desc: 'Anda akan menerima konfirmasi jumlah refund.' },
  { num: 4, title: 'Proses Refund', desc: 'Dana akan masuk dalam 7-14 hari kerja.' },
];

export default function RefundPolicyPage() {
  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <RefreshCw size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient">Kebijakan Refund</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-text-muted mb-4">
            <Clock size={16} />
            <span className="text-sm">Terakhir diperbarui: {lastUpdated}</span>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Pelajari tentang kebijakan refund kami dan bagaimana mengajukan permintaan refund jika diperlukan.
          </p>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-warning/10 border border-warning/30 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-3">Penting untuk Diketahui</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  Pembelian tiket bersifat FINAL dan tidak dapat dibatalkan tanpa alasan yang sah.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  Refund hanya berlaku untuk event yang dibatalkan atau berubah signifikan.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  Pengajuan refund harus dilakukan dalam 14 hari setelah kejadian.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Refund Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-primary-accent" />
            </span>
            Skenario Refund
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {refundScenarios.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.scenario}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className={`bg-secondary-bg border rounded-2xl p-5 ${
                    item.eligible ? 'border-success/30' : 'border-error/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      item.color === 'success' ? 'bg-success/10' : 'bg-error/10'
                    }`}>
                      <Icon size={24} className={item.color === 'success' ? 'text-success' : 'text-error'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-text-primary">{item.scenario}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.eligible
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        }`}>
                          {item.eligible ? '✓ Eligible' : '✗ Tidak Eligible'}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted bg-surface/50 rounded-lg px-3 py-2">
                        <Clock size={12} />
                        {item.process}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* How to Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-bg border border-border rounded-2xl p-6 md:p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <ArrowRight size={20} className="text-primary-accent" />
            </span>
            Cara Mengajukan Refund
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-text-primary mb-1 text-sm">{step.title}</h3>
                  <p className="text-xs text-text-muted">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-primary-accent" />
            </span>
            Pertanyaan Umum
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="bg-secondary-bg border border-border rounded-xl overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none">
                    <span className="font-medium text-text-primary pr-4">{item.title}</span>
                    <ChevronRight
                      size={18}
                      className="text-text-muted shrink-0 group-open:rotate-90 transition-transform duration-200"
                    />
                  </summary>
                  <div className="px-6 pb-5 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border/50 mt-0 pt-4">
                    {item.content}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-3xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            Butuh Bantuan Lebih Lanjut?
          </h3>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Tim customer service kami siap membantu Anda dengan pertanyaan tentang refund.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">
              <MessageCircle size={20} />
              Hubungi Kami
            </Button>
            <Link href="/help">
              <Button variant="outline" size="lg">
                <ChevronRight size={20} />
                Pusat Bantuan
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
