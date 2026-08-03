'use client';

import { motion } from 'framer-motion';
import ConcertCard from './ConcertCard';

const featuredConcerts = [
  {
    id: 1,
    title: 'Java Jazz Festival 2026',
    artist: 'Guns N Roses',
    date: '15-17 Mei 2026',
    venue: 'JIExpo Kemayoran, Jakarta',
    priceStart: 350000,
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
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
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    status: 'Sold Out',
    featured: true,
  },
  {
    id: 3,
    title: 'Festival Musik Indonesia 2026',
    artist: 'Backstreet Boys',
    date: '3-5 Juli 2026',
    venue: 'Lapangan Rampal, Malang',
    priceStart: 200000,
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    status: 'Available',
    featured: true,
  },
  {
    id: 4,
    title: 'Michael Learns To Rock Reunion Tour',
    artist: 'Michael Learns To Rock',
    date: '12 Agustus 2026',
    venue: 'Stadion Utama GBK, Jakarta',
    priceStart: 500000,
    image: 'https://dynamicmedia.livenationinternational.com/d/q/q/97fa78ed-62e1-4f35-ab15-ccd9ee3d2545.jpg?format=webp&width=1080&quality=75',
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
