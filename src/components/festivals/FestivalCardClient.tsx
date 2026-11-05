'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { formatDateShort, formatCurrency } from '@/lib/formatters';

export default function FestivalCardClient({ festival }) {
  const ticketStatus = festival.ticketStatus === 'sold_out' ? 'sold' : 'available';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/festivals/${festival.id}`}>
        <div className="group relative bg-secondary-bg border border-border rounded-[18px] overflow-hidden hover:shadow-lg hover:shadow-primary-accent/10 transition-all duration-500">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${festival.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-bg via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              {festival.featured && <Badge variant="featured">Featured</Badge>}
              <Badge variant={ticketStatus}>
                {festival.ticketStatus === 'sold_out' ? 'Habis' : festival.ticketStatus === 'coming_soon' ? 'Segera' : 'Tersedia'}
              </Badge>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-primary-accent">{festival.genre}</span>
              <span className="text-xs text-text-muted">{festival.city}</span>
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-primary-accent transition-colors line-clamp-1">
              {festival.title}
            </h3>
            <p className="text-text-secondary text-sm mb-3 line-clamp-1">{festival.artist}</p>

            <div className="flex items-center gap-4 text-text-muted text-xs mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDateShort(festival.date)}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <MapPin size={14} />
                {festival.venue}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-text-muted text-xs">Mulai dari</span>
              <span className="text-base font-bold text-gradient">
                {formatCurrency(festival.priceStart)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}