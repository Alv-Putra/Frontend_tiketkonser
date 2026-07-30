'use client';

import { motion } from 'framer-motion';

const sponsors = [
  { name: 'GoPay', color: '#00B5AD' },
  { name: 'OVO', color: '#4A2C70' },
  { name: 'DANA', color: '#4353FF' },
  { name: 'Bank Mandiri', color: '#058B53' },
  { name: 'Telkomsel', color: '#CC0000' },
  { name: 'Indosat', color: '#E31E24' },
];

export default function Sponsor() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-text-muted tracking-widest uppercase mb-8"
        >
          Official Payment & Partners
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-text-muted hover:text-text-primary transition-colors duration-300"
            >
              <span className="text-lg md:text-xl font-bold tracking-tight" style={{ color: sponsor.color }}>
                {sponsor.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
