'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Book, ChevronRight, Headphones, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const faqCategories = [
  {
    title: 'Akun & Login',
    icon: '👤',
    items: [
      {
        title: 'Bagaimana cara membuat akun di ConserId?',
        content: 'Untuk membuat akun, klik tombol "Daftar" di pojok kanan atas halaman utama. Isi nama lengkap, email, dan password Anda. Setelah mendaftar, Anda akan menerima email verifikasi untuk mengaktifkan akun.',
      },
      {
        title: 'Saya lupa password. Apa yang harus saya lakukan?',
        content: 'Klik "Lupa kata sandi?" di halaman login. Masukkan email Anda, dan kami akan mengirim link reset password ke email Anda. Ikuti instruksi dalam email tersebut untuk membuat password baru.',
      },
      {
        title: 'Bagaimana cara mengubah informasi profil?',
        content: 'Masuk ke akun Anda, lalu klik "Profil Saya" di menu dropdown pengguna. Di halaman profil, Anda dapat mengubah nama lengkap dan informasi lainnya.',
      },
      {
        title: 'Apakah saya bisa login dengan media sosial?',
        content: 'Saat ini kami belum mendukung login dengan media sosial. Gunakan email dan password untuk login ke ConserId.',
      },
    ],
  },
  {
    title: 'Pembelian Tiket',
    icon: '🎫',
    items: [
      {
        title: 'Bagaimana cara membeli tiket?',
        content: 'Pilih festival yang Anda inginkan dari halaman "Festival". Pilih jenis tiket dan jumlah yang diinginkan, lalu klik "Beli Tiket". Anda akan diarahkan ke halaman checkout untuk menyelesaikan pembayaran.',
      },
      {
        title: 'Metode pembayaran apa saja yang tersedia?',
        content: 'Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit (Visa, Mastercard, JCB), dan QRIS.',
      },
      {
        title: 'Apakah saya bisa membeli tiket lebih dari satu?',
        content: 'Ya, Anda dapat membeli maksimal 10 tiket per transaksi. Pembelian dalam jumlah besar untuk grup dapat menghubungi tim kami.',
      },
      {
        title: 'Kapan saya bisa mulai membeli tiket?',
        content: 'Tiket dapat dibeli setelah penjualan dibuka. Perhatikan status tiket di halaman detail festival: "Tersedia" berarti bisa dibeli, "Segera" berarti penjualan belum dibuka, dan "Habis" berarti tiket sudah sold out.',
      },
      {
        title: 'Apakah ada biaya tambahan selain harga tiket?',
        content: 'Ya, terdapat biaya layanan sebesar 5% dan pajak 11% dari subtotal. Total biaya ditampilkan di halaman checkout sebelum Anda menyelesaikan pembayaran.',
      },
    ],
  },
  {
    title: 'Pembayaran',
    icon: '💳',
    items: [
      {
        title: 'Berapa lama batas waktu pembayaran?',
        content: 'Anda memiliki waktu 60 menit untuk menyelesaikan pembayaran setelah order dibuat. Jika melewati batas waktu, order akan otomatis dibatalkan.',
      },
      {
        title: 'Bagaimana cara mengetahui pembayaran saya berhasil?',
        content: 'Setelah pembayaran berhasil, Anda akan melihat halaman konfirmasi dan menerima email notifikasi. E-ticket juga akan otomatis terbuat dan dapat dilihat di halaman "Tiket Saya".',
      },
      {
        title: 'Apa yang harus saya lakukan jika pembayaran gagal?',
        content: 'Pastikan Saldo atau limit kartu Anda cukup dan detail pembayaran benar. Coba ulangi pembayaran. Jika masih gagal, hubungi customer service kami.',
      },
      {
        title: 'Apakah saya bisa mengubah metode pembayaran setelah checkout?',
        content: 'Maaf, metode pembayaran tidak dapat diubah setelah checkout. Anda perlu membatalkan order dan membuat order baru dengan metode pembayaran yang diinginkan.',
      },
    ],
  },
  {
    title: 'Tiket & Check-in',
    icon: '🎟️',
    items: [
      {
        title: 'Bagaimana cara mendapatkan e-ticket?',
        content: 'E-ticket akan otomatis terbuat setelah pembayaran berhasil. Anda dapat mengakses e-ticket di halaman "Tiket Saya" atau melalui email konfirmasi.',
      },
      {
        title: 'Bagaimana cara check-in di venue?',
        content: 'Tunjukkan QR code di e-ticket Anda kepada petugas saat check-in. Pastikan layar HP Anda cukup terang dan QR code terlihat jelas. QR code hanya bisa digunakan sekali.',
      },
      {
        title: 'Apakah e-ticket bisa di-print?',
        content: 'Ya, Anda bisa mengunduh QR code dari halaman detail e-ticket dan mencetaknya. Pastikan hasil print jelas dan QR code tidak rusak.',
      },
      {
        title: 'Apa yang harus saya lakukan jika QR code tidak bisa di-scan?',
        content: 'Pastikan QR code bersih dan tidak rusak. Jika masih bermasalah, hubungi customer service kami dengan membawa bukti identitas dan confirmation code.',
      },
    ],
  },
  {
    title: 'Refund & Komplain',
    icon: '💬',
    items: [
      {
        title: 'Apakah tiket bisa di-refund?',
        content: 'Secara umum, tiket festival tidak dapat di-refund setelah pembelian berhasil. Namun, kami mungkin bisa membantu dalam kasus khusus seperti event yang dibatalkan. Lihat Kebijakan Refund untuk detail.',
      },
      {
        title: 'Event dibatalkan. Kapan saya mendapatkan refund?',
        content: 'Jika event dibatalkan, refund akan diproses dalam 7-14 hari kerja setelah pengumuman pembatalan. Dana akan dikembalikan ke metode pembayaran asli.',
      },
      {
        title: 'Bagaimana cara mengajukan komplain?',
        content: 'Hubungi kami melalui email di support@conserid.com atau telepon di +62-21-1234-5678. Sertakan nomor order dan deskripsi masalah Anda.',
      },
    ],
  },
];

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@conserid.com',
    href: 'mailto:support@conserid.com',
    description: 'Respon dalam 1x24 jam',
    color: 'primary',
  },
  {
    icon: Phone,
    title: 'Telepon',
    value: '+62 21 1234 5678',
    href: 'tel:+622112345678',
    description: 'Senin-Jumat, 09:00-17:00 WIB',
    color: 'success',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    value: 'Chat Sekarang',
    href: '#',
    description: 'Respon cepat via website',
    color: 'secondary',
  },
];

const quickLinks = [
  { label: 'Kebijakan Privasi', href: '/privacy' },
  { label: 'Syarat & Ketentuan', href: '/terms' },
  { label: 'Kebijakan Refund', href: '/refund' },
];

export default function HelpCenterPage() {
  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto px-5 md:px-10 xl:px-20 py-10">
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
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Headphones size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient">Pusat Bantuan</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim kami untuk bantuan lebih lanjut.
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={method.title}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-secondary-bg border border-border rounded-2xl p-6 hover:border-primary-accent/40 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  method.color === 'primary' ? 'bg-primary-accent/10' :
                  method.color === 'success' ? 'bg-success/10' : 'bg-secondary-accent/10'
                }`}>
                  <Icon size={24} className={
                    method.color === 'primary' ? 'text-primary-accent' :
                    method.color === 'success' ? 'text-success' : 'text-secondary-accent'
                  } />
                </div>
                <h3 className="font-bold text-text-primary mb-1">{method.title}</h3>
                <p className="text-primary-accent font-semibold text-sm group-hover:underline mb-2">
                  {method.value}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-1.5">
                  <Clock size={12} />
                  {method.description}
                </p>
              </motion.a>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-primary-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-sm text-text-muted">Klik untuk melihat jawaban</p>
            </div>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-bold text-text-primary">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + categoryIndex * 0.05 + itemIndex * 0.03 }}
                      className="bg-secondary-bg border border-border rounded-xl overflow-hidden hover:border-primary-accent/30 transition-colors"
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
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-3xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            Tidak menemukan jawaban yang Anda cari?
          </h3>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Tim customer service kami siap membantu Anda 24/7 melalui berbagai channel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">
              <MessageCircle size={20} />
              Mulai Chat
            </Button>
            <Button variant="outline" size="lg">
              <Mail size={20} />
              Kirim Email
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-text-muted mb-4">atau lihat kebijakan kami:</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-primary-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
