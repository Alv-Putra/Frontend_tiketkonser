'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Download, Printer, ChevronRight, BookOpen, ScrollText } from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';

const lastUpdated = '15 Januari 2026';

const sections = [
  {
    title: '1. Pendahuluan',
    icon: '📋',
    content: `Dengan mengakses dan menggunakan layanan ConserId, Anda setuju untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan salah satu bagian dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.

ConserId berhak mengubah, memodifikasi, menambah, atau menghapus bagian dari Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan terlebih dahulu. Perubahan akan efektif segera setelah dipublikasikan di situs web ini.`,
  },
  {
    title: '2. Layanan ConserId',
    icon: '🎵',
    content: `ConserId menyediakan platform online untuk pembelian tiket festival dan konser musik. Kami bertindak sebagai perantara antara pembeli tiket dan penyelenggara acara.

Layanan kami meliputi:
• Penyediaan platform pemesanan tiket online
• Pemrosesan pembayaran
• Penerbitan e-ticket
• Layanan pelanggan terkait pembelian tiket`,
  },
  {
    title: '3. Pendaftaran Akun',
    icon: '👤',
    content: `Untuk menggunakan layanan kami, Anda harus membuat akun dengan informasi yang akurat dan lengkap. Anda bertanggung jawab untuk:
• Menjaga kerahasiaan kata sandi akun Anda
• Mengontrol akses ke akun Anda
• Memberi tahu kami segera jika ada penggunaan tidak sah atas akun Anda

Anda harus berusia minimal 17 tahun atau memiliki persetujuan orang tua untuk membuat akun.`,
  },
  {
    title: '4. Pembelian Tiket',
    icon: '🎫',
    content: `4.1 Ketersediaan Tiket
Ketersediaan tiket ditampilkan secara real-time. Namun, kami tidak menjamin ketersediaan tersebut karena beberapa faktor eksternal yang mungkin menyebabkan ketidaksesuaian.

4.2 Harga Tiket
Semua harga tercantum dalam Rupiah Indonesia dan sudah termasuk pajak. Biaya layanan sebesar 5% dan pajak 11% akan ditambahkan saat checkout.

4.3 Pembayaran
Pembayaran harus dilakukan dalam 60 menit setelah checkout. Jika tidak, pesanan akan otomatis dibatalkan.

4.4 Konfirmasi
Pesanan dianggap berhasil setelah pembayaran terkonfirmasi. E-ticket akan dikirimkan melalui email dan dapat diakses di halaman "Tiket Saya".`,
  },
  {
    title: '5. E-Ticket dan Check-in',
    icon: '📱',
    content: `E-ticket yang valid akan dikirimkan setelah pembayaran berhasil terkonfirmasi. Setiap e-ticket memiliki QR code unik yang hanya bisa digunakan sekali untuk check-in.

Tanggung jawab Pemegang Tiket:
• Menjaga keamanan e-ticket dan QR code
• Memastikan QR code dapat dibaca saat check-in
• Membawa identitas resmi yang sesuai dengan data pemesanan

Kami tidak bertanggung jawab atas kehilangan, pencurian, atau kerusakan e-ticket setelah dikirimkan.`,
  },
  {
    title: '6. Kebijakan Harga dan Pembayaran',
    icon: '💳',
    content: `6.1 Harga
Semua harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Harga yang berlaku adalah harga pada saat checkout berhasil.

6.2 Metode Pembayaran
Kami menerima: Transfer Bank, E-Wallet, Kartu Kredit, dan QRIS.

6.3 Keamanan Pembayaran
Semua transaksi pembayaran diproses melalui gateway pembayaran yang aman. Kami tidak menyimpan informasi kartu kredit Anda.`,
  },
  {
    title: '7. Pembatalan dan Refund',
    icon: '💰',
    content: `7.1 Pembatalan oleh Pembeli
Secara umum, semua pembelian tiket bersifat final dan tidak dapat dibatalkan atau di-refund setelah pembayaran berhasil, kecuali dalam kondisi berikut:
• Event dibatalkan oleh penyelenggara
• Ada kesalahan teknis dari pihak ConserId

7.2 Pembatalan oleh Penyelenggara
Jika event dibatalkan, Anda berhak mendapatkan refund penuh. Refund akan diproses dalam 7-14 hari kerja.

7.3 Perubahan Jadwal Event
Jika jadwal event berubah, kami akan berusaha menghubungi Anda. Anda dapat memilih untuk:
• Menukar tiket ke jadwal baru (jika tersedia)
• Mendapatkan refund (jika tidak dapat hadir di jadwal baru)`,
  },
  {
    title: '8. Tanggung Jawab',
    icon: '⚖️',
    content: `8.1 Batasan Tanggung Jawab ConserId
ConserId tidak bertanggung jawab atas:
• Kerugian tidak langsung, insidental, atau konsekuensial
• Kehilangan keuntungan atau peluang bisnis
• Kerusakan atau cedera yang terjadi di venue event
• Tindakan atau kelalaian penyelenggara event

8.2 Ganti Rugi
Anda setuju untuk mengganti rugi dan membebaskan ConserId dari setiap klaim, tindakan, atau permintaan yang timbul dari penggunaan layanan kami.`,
  },
  {
    title: '9. Kebijakan Privasi',
    icon: '🔒',
    content: `Kami menghargai privasi Anda. Informasi pribadi Anda dikumpulkan dan diproses sesuai dengan Kebijakan Privasi kami yang terpisah.

Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan data sesuai dengan Kebijakan Privasi ConserId.`,
  },
  {
    title: '10. Kekayaan Intelektual',
    icon: '©️',
    content: `Semua konten di situs web ConserId, termasuk namun tidak terbatas pada teks, grafik, logo, gambar, dan perangkat lunak, adalah milik ConserId atau pemberi lisensinya dan dilindungi oleh hukum kekayaan intelektual.

Anda tidak diperkenankan mereproduksi, mendistribusikan, memodifikasi, atau menggunakan konten kami untuk tujuan komersial tanpa izin tertulis dari kami.`,
  },
  {
    title: '11. Link ke Situs Lain',
    icon: '🔗',
    content: `Situs web kami mungkin berisi tautan ke situs web pihak ketiga. Tautan ini disediakan untuk kenyamanan Anda. Kami tidak memiliki kendali atas konten atau praktik privasi situs web pihak ketiga dan tidak bertanggung jawab atas konten atau praktik mereka.

Saran kami, tinjau kebijakan privasi dan syarat ketentuan dari setiap situs yang Anda kunjungi.`,
  },
  {
    title: '12. Hukum yang Berlaku',
    icon: '🏛️',
    content: `Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau terkait dengan syarat ini akan diselesaikan melalui pengadilan yang berwenang di Indonesia.

Jika ada bagian dari Syarat dan Ketentuan ini yang dianggap tidak berlaku atau tidak dapat ditegakkan, sisa ketentuan akan tetap berlaku penuh.`,
  },
  {
    title: '13. Informasi Kontak',
    icon: '📞',
    content: `Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:

ConserId
Email: legal@conserid.com
Telepon: +62 21 1234 5678
Alamat: Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia`,
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <ScrollText size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-center mb-4">
            <span className="text-gradient">Syarat & Ketentuan</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <Clock size={16} />
            <span className="text-sm">Terakhir diperbarui: {lastUpdated}</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-72 shrink-0"
          >
            <div className="sticky top-24 bg-secondary-bg border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <BookOpen size={18} className="text-primary-accent" />
                <h3 className="font-bold text-text-primary">Daftar Isi</h3>
              </div>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === index
                        ? 'bg-primary-accent text-white font-semibold'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    <span className="text-xs mr-2 opacity-60">{index + 1}.</span>
                    {section.title.replace(/^\d+\.\s*/, '')}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-secondary-bg border border-border rounded-2xl p-6 md:p-8">
              {sections.map((section, index) => (
                <motion.section
                  key={index}
                  id={`section-${index + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeSection === index ? 1 : 0.3, y: 0 }}
                  className={`mb-10 last:mb-0 transition-opacity duration-300 ${
                    activeSection !== index ? 'hidden' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-xl font-bold text-text-primary">
                      {section.title}
                    </h2>
                  </div>
                  <div className="bg-surface/50 rounded-xl p-5 text-sm text-text-secondary leading-relaxed whitespace-pre-line border border-border/50">
                    {section.content}
                  </div>
                </motion.section>
              ))}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                >
                  ← Sebelumnya
                </Button>
                <span className="text-sm text-text-muted">
                  {activeSection + 1} / {sections.length}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sections.length - 1}
                >
                  Selanjutnya →
                </Button>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <Button variant="outline" onClick={() => window.print()}>
                <Printer size={16} />
                Cetak
              </Button>
              <Link href="/privacy">
                <Button variant="outline">
                  <FileText size={16} />
                  Kebijakan Privasi
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="ghost">
                  <ChevronRight size={16} />
                  Pusat Bantuan
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </CustomerLayout>
  );
}
