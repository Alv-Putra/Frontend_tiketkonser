'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Bagaimana cara membeli tiket konser?',
    a: 'Untuk membeli tiket, silakan download aplikasi ConcertHub melalui Google Play Store atau App Store. Setelah terinstal, kamu bisa mendaftar/login dan langsung memesan tiket konser favoritmu.',
  },
  {
    q: 'Apakah saya bisa membeli tiket melalui website?',
    a: 'Website ConcertHub digunakan untuk melihat informasi konser. Untuk pembelian tiket, kamu perlu menggunakan aplikasi mobile ConcertHub.',
  },
  {
    q: 'Bagaimana cara mendapatkan e-ticket setelah pembayaran?',
    a: 'Setelah pembayaran berhasil, e-ticket akan muncul secara otomatis di aplikasi ConcertHub pada menu "My Tickets". Kamu juga akan mendapatkan notifikasi email.',
  },
  {
    q: 'Apakah tiket bisa diretur atau dibatalkan?',
    a: 'Kebijakan retur tiket tergantung pada masing-masing event. Silakan cek syarat dan ketentuan pada halaman detail konser di aplikasi.',
  },
  {
    q: 'Bagaimana cara melakukan check-in di venue?',
    a: 'Cukup tunjukkan QR Code e-ticket di aplikasi ConcertHub kepada petugas di venue. Scan QR Code dan kamu langsung masuk!',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
          <p className="text-text-secondary text-lg">Punya pertanyaan? Kami siap membantu.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary-bg border border-border rounded-[18px] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="font-medium text-text-primary pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-text-secondary leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
