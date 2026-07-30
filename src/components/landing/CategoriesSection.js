'use client';

import { motion } from 'framer-motion';
import { Music, Mic2, PartyPopper, Heart, Star, Radio } from 'lucide-react';

const categories = [
  { name: 'Pop', icon: Music, count: 24, color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Rock', icon: Mic2, count: 18, color: 'from-red-500/20 to-red-600/10' },
  { name: 'Festival', icon: PartyPopper, count: 12, color: 'from-purple-500/20 to-purple-600/10' },
  { name: 'Jazz & Blues', icon: Heart, count: 9, color: 'from-amber-500/20 to-amber-600/10' },
  { name: 'K-Pop', icon: Star, count: 15, color: 'from-pink-500/20 to-pink-600/10' },
  { name: 'Electronic', icon: Radio, count: 11, color: 'from-cyan-500/20 to-cyan-600/10' },
];

export default function CategoriesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Explore by <span className="text-gradient">Genre</span></h2>
          <p className="text-text-secondary text-lg max-w-xl">Temukan konser berdasarkan genre musik favoritmu.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden bg-secondary-bg border border-border rounded-[18px] p-6 text-center group cursor-pointer hover:border-primary-accent/30 transition-all duration-300`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-accent/10 transition-colors">
                    <Icon size={22} className="text-text-secondary group-hover:text-primary-accent transition-colors" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{cat.name}</h3>
                  <p className="text-xs text-text-muted">{cat.count} Concerts</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
