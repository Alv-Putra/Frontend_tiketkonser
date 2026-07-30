'use client';

import { motion } from 'framer-motion';
import { Smartphone, QrCode, Download, CheckCircle, Ticket, ScanLine, History, Bell } from 'lucide-react';
import Button from '@/components/ui/Button';

const benefits = [
  { icon: Ticket, text: 'Beli tiket dengan mudah' },
  { icon: ScanLine, text: 'QR Check-in instan' },
  { icon: History, text: 'E-Ticket & Riwayat pembelian' },
  { icon: Bell, text: 'Notifikasi event terbaru' },
];

export default function MobileAppPreview() {
  return (
    <section id="download" className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <div className="relative bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-3xl overflow-hidden p-8 md:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-accent/5 rounded-full blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Smartphone size={20} className="text-primary-accent" />
                <span className="text-sm text-text-secondary tracking-wider uppercase font-medium">Mobile App</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Download <span className="text-gradient">ConcertHub</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Dapatkan pengalaman terbaik dalam membeli tiket konser.
                Download aplikasi ConcertHub sekarang dan nikmati kemudahan
                dalam setiap langkah.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle size={16} className="text-success" />
                      </div>
                      <span className="text-text-primary">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg">
                  <Download size={18} />
                  Google Play
                </Button>
                <Button variant="outline" size="lg">
                  <Download size={18} />
                  App Store
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-secondary-accent/10 to-primary-accent/10 rounded-3xl border border-border p-6 flex flex-col items-center justify-center text-center">
                  <QrCode size={80} className="text-text-primary mb-4" />
                  <p className="text-sm text-text-secondary">Scan untuk download</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
