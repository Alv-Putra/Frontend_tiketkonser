'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Clock, CheckCircle, FileKey, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Button from '@/components/ui/Button';

const lastUpdated = '15 Januari 2026';

const keyPoints = [
  {
    icon: Shield,
    title: 'Data Terenkripsi',
    description: 'Semua data dienkripsi menggunakan standar industri.',
    color: 'primary',
  },
  {
    icon: Lock,
    title: 'Akses Terbatas',
    description: 'Hanya staff yang berhak dapat mengakses data Anda.',
    color: 'success',
  },
  {
    icon: Eye,
    title: 'Transparansi',
    description: 'Kami jelaskan bagaimana data Anda digunakan.',
    color: 'info',
  },
  {
    icon: Database,
    title: 'Penyimpanan Aman',
    description: 'Data disimpan di server yang aman di Indonesia.',
    color: 'secondary',
  },
];

const sections = [
  {
    title: '1. Informasi yang Kami Kumpulkan',
    icon: '📋',
    content: `Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk:

a) Informasi Akun:
• Nama lengkap
• Alamat email
• Nomor telepon
• Kata sandi (terenkripsi)

b) Informasi Pembayaran:
• Metode pembayaran yang dipilih
• Riwayat transaksi (kami tidak menyimpan nomor kartu lengkap)

c) Informasi Penggunaan:
• Data aplikasi seperti cookies dan similar technologies
• Informasi perangkat (model, sistem operasi)
• Log aktivitas dan interaksi dengan layanan kami

d) Informasi dari Pihak Ketiga:
• Data dari partner pembayaran
• Informasi verifikasi dari integrator`,
  },
  {
    title: '2. Cara Kami Menggunakan Informasi',
    icon: '⚙️',
    content: `Kami menggunakan informasi yang dikumpulkan untuk:

a) Menyediakan Layanan:
• Memproses pembelian tiket
• Mengirimkan e-ticket dan notifikasi
• Memberikan layanan pelanggan

b) Meningkatkan Layanan:
• Menganalisis pola penggunaan
• Mengembangkan fitur baru
• Memperbaiki keamanan

c) Komunikasi:
• Mengirim konfirmasi pesanan
• Memberikan informasi event
• Merespons pertanyaan dan komplain

d) Kewajiban Hukum:
• Mematuhi kewajiban hukum
• Mencegah penipuan
• Melindungi hak kami dan pengguna`,
  },
  {
    title: '3. Dasar Hukum Pemrosesan',
    icon: '⚖️',
    content: `Kami memproses data Anda berdasarkan:

a) Persetujuan (Consent)
Dengan membuat akun atau membeli tiket, Anda memberikan persetujuan untuk pemrosesan data Anda sebagaimana dijelaskan dalam kebijakan ini.

b) Pelaksanaan Kontrak (Contract)
Pemrosesan data diperlukan untuk pelaksanaan kontrak pembelian tiket antara Anda dan ConserId.

c) Kepentingan Sah (Legitimate Interest)
Kami mungkin memproses data untuk kepentingan sah kami, seperti pencegahan penipuan, dengan memastikan hak tersebut tidak mengabaikan hak Anda.

d) Kewajiban Hukum (Legal Obligation)
Dalam beberapa kasus, kami diharuskan oleh hukum untuk memproses data tertentu.`,
  },
  {
    title: '4. Berbagi Informasi dengan Pihak Ketiga',
    icon: '🤝',
    content: `Kami tidak menjual data pribadi Anda. Kami mungkin berbagi informasi dengan:

a) Penyelenggara Event:
• Nama Anda (sesuai data pemesanan)
• Jumlah tiket yang dibeli
• Informasi check-in

b) Penyedia Layanan Pembayaran:
• Proses transaksi pembayaran
• Pencegahan penipuan

c) Penyedia Infrastruktur:
• Hosting dan penyimpanan data
• Layanan cloud
• Analitik

d) Otoritas Hukum:
• Jika diminta oleh otoritas yang berwenang
• Untuk mematuhi subpoena atau perintah pengadilan
• Untuk melindungi hak dan keamanan kami`,
  },
  {
    title: '5. Keamanan Data',
    icon: '🔐',
    content: `Kami mengambil langkah-langkah keamanan yang sesuai, termasuk:

a) Enkripsi:
• Data ditransmisikan menggunakan HTTPS/TLS
• Kata sandi di-hash menggunakan algoritma kuat

b) Kontrol Akses:
• Akses data dibatasi berdasarkan prinsip need-to-know
• Autentikasi multi-faktor untuk staff

c) Monitoring:
• Sistem deteksi intrusi
• Audit log reguler

d) Respons Insiden:
• Prosedur respons insiden data
• Pemberitahuan jika terjadi pelanggaran`,
  },
  {
    title: '6. Retensi Data',
    icon: '📅',
    content: `Kami menyimpan data Anda selama diperlukan untuk tujuan yang dijelaskan:

a) Data Akun:
• Disimpan selama akun aktif
• Dihapus 2 tahun setelah akun tidak aktif

b) Data Transaksi:
• Disimpan minimal 10 tahun sesuai kewajiban perpajakan
• Arsip dapat disimpan lebih lama untuk keperluan hukum

c) Log Aktivitas:
• Disimpan maksimal 2 tahun
• Log keamanan disimpan 1 tahun

Anda dapat meminta penghapusan data lebih awal (lihat bagian Hak Anda).`,
  },
  {
    title: '7. Hak Anda',
    icon: '✅',
    content: `Sebagai pengguna, Anda memiliki hak untuk:

a) Akses:
• Mendapatkan salinan data pribadi Anda
• Meminta informasi tentang cara data digunakan

b) Koreksi:
• Mengoreksi data yang tidak akurat
• Melengkapi data yang tidak lengkap

c) Penghapusan:
• Meminta penghapusan data dalam kondisi tertentu
• "Hak untuk dilupakan"

d) Pembatasan:
• Meminta pembatasan pemrosesan dalam kondisi tertentu

e) Portabilitas:
• Menerima data dalam format yang terstruktur
• Mentransfer data ke pengendali lain

f) Keberatan:
• Menolak pemrosesan untuk kepentingan sah tertentu

Untuk menggunakan hak Anda, hubungi kami di privacy@conserid.com. Kami akan merespons dalam 30 hari.`,
  },
  {
    title: '8. Cookies dan Teknologi Serupa',
    icon: '🍪',
    content: `Kami menggunakan cookies dan teknologi serupa untuk:

a) Cookies Wajib:
• Session cookies untuk fungsi dasar
• Tidak dapat dinonaktifkan

b) Cookies Analitik:
• Google Analytics untuk memahami penggunaan
• Dapat dinonaktifkan melalui pengaturan browser

c) Cookies Preferensi:
• Menyimpan preferensi Anda
• Mengingat pengaturan bahasa

Anda dapat mengontrol cookies melalui pengaturan browser Anda. Menonaktifkan cookies mungkin mempengaruhi fungsionalitas situs.`,
  },
  {
    title: '9. Anak-anak',
    icon: '👶',
    content: `Layanan kami tidak ditujukan untuk anak-anak di bawah 17 tahun. Kami tidak secara sengaja mengumpulkan informasi dari anak-anak di bawah batas usia ini.

Jika kami mengetahui bahwa kami telah mengumpulkan informasi dari anak di bawah 17 tahun tanpa persetujuan orang tua, kami akan mengambil langkah untuk menghapus informasi tersebut secepat mungkin.`,
  },
  {
    title: '10. Perubahan Kebijakan',
    icon: '📝',
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan dipublikasikan di halaman ini dengan tanggal "Terakhir diperbarui" yang baru.

Untuk perubahan signifikan, kami akan:
• Memberi tahu melalui email
• Menampilkan pemberitahuan di aplikasi
• Meminta persetujuan ulang jika diperlukan

Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.`,
  },
  {
    title: '11. Kontak',
    icon: '📞',
    content: `Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak Anda:

Petugas Perlindungan Data (DPO)
ConserId
Email: privacy@conserid.com
Telepon: +62 21 1234 5678
Alamat: Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia

Kami akan merespons pertanyaan Anda dalam 30 hari kerja.`,
  },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(0);

  const colorClasses = {
    primary: 'bg-primary-accent/10 text-primary-accent',
    success: 'bg-success/10 text-success',
    info: 'bg-info/10 text-info',
    secondary: 'bg-secondary-accent/10 text-secondary-accent',
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-10 xl:px-20 py-10">
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
            <FileKey size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient">Kebijakan Privasi</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-text-muted mb-6">
            <Clock size={16} />
            <span className="text-sm">Terakhir diperbarui: {lastUpdated}</span>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Kami berkomitmen untuk melindungi data pribadi Anda. Baca kebijakan ini untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </p>
        </motion.div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {keyPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-secondary-bg border border-border rounded-2xl p-5 text-center hover:border-primary-accent/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${colorClasses[point.color]}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-text-primary text-sm mb-1">{point.title}</h3>
                <p className="text-xs text-text-muted">{point.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-success/10 border border-success/30 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-3">Komitmen Kami</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  Kami tidak menjual data pribadi Anda
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  Kami tidak menyimpan nomor kartu kredit
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  Kami transparan tentang penggunaan data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  Kami menghormati hak privasi Anda
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-72 shrink-0"
          >
            <div className="sticky top-24 bg-secondary-bg border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <Globe size={18} className="text-primary-accent" />
                <h3 className="font-bold text-text-primary">Navigasi</h3>
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
            transition={{ delay: 0.25 }}
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
              className="mt-6 text-center"
            >
              <p className="text-text-muted mb-4">
                Ada pertanyaan tentang privasi Anda?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/help">
                  <Button>
                    <ChevronRight size={16} />
                    Hubungi Kami
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline">
                    Syarat & Ketentuan
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </CustomerLayout>
  );
}
