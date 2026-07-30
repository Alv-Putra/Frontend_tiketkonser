'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function ConcertCard({ concert, index = 0 }) {
  const statusVariant = concert.status === 'Sold Out' ? 'sold' : concert.status === 'Available' ? 'available' : concert.featured ? 'featured' : 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/concerts/${concert.id}`}>
        <div className="group relative bg-secondary-bg border border-border rounded-[18px] overflow-hidden hover:shadow-lg hover:shadow-primary-accent/5 transition-all duration-500">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${concert.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-bg via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              {concert.featured && <Badge variant="featured">Featured</Badge>}
              <Badge variant={statusVariant}>{concert.status}</Badge>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary-accent transition-colors line-clamp-1">
              {concert.title}
            </h3>
            <p className="text-text-secondary text-sm mb-3">{concert.artist}</p>

            <div className="flex items-center gap-4 text-text-muted text-xs mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {concert.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {concert.venue}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs">Mulai dari</span>
              <span className="text-lg font-bold text-gradient">
                Rp{concert.priceStart?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
