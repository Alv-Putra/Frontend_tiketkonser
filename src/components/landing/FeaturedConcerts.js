'use client';

import { motion } from 'framer-motion';
import ConcertCard from './ConcertCard';

const featuredConcerts = [
  {
    id: 1,
    title: 'Java Jazz Festival 2026',
    artist: 'Various Artists',
    date: '15-17 Mei 2026',
    venue: 'JIExpo Kemayoran, Jakarta',
    priceStart: 350000,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    status: 'Available',
    featured: true,
  },
  {
    id: 2,
    title: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    date: '20 Juni 2026',
    venue: 'Gelora Bung Karno, Jakarta',
    priceStart: 850000,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    status: 'Sold Out',
    featured: true,
  },
  {
    id: 3,
    title: 'Festival Musik Indonesia 2026',
    artist: 'Tulus, Raisa, Pamungkas',
    date: '3-5 Juli 2026',
    venue: 'Lapangan Rampal, Malang',
    priceStart: 200000,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    status: 'Available',
    featured: true,
  },
  {
    id: 4,
    title: 'Dewa 19 Reunion Tour',
    artist: 'Dewa 19',
    date: '12 Agustus 2026',
    venue: 'Stadion Utama GBK, Jakarta',
    priceStart: 500000,
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    status: 'Available',
    featured: false,
  },
];

export default function FeaturedConcerts() {
  return (
    <section id="concerts" className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className="text-gradient">Concerts</span></h2>
          <p className="text-text-secondary text-lg max-w-xl">Konser paling populer yang sayang untuk dilewatkan.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredConcerts.map((concert, i) => (
            <ConcertCard key={concert.id} concert={concert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
