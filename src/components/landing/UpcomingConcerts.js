'use client';

import { motion } from 'framer-motion';
import ConcertCard from './ConcertCard';

const upcomingConcerts = [
  {
    id: 5,
    title: 'Rich Brian: The Sailor Tour',
    artist: 'Rich Brian',
    date: '28 Agustus 2026',
    venue: 'Balai Sarbini, Jakarta',
    priceStart: 400000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    status: 'Available',
  },
  {
    id: 6,
    title: 'Festival Larisong 2026',
    artist: 'Hindia, .Feast, Lomba Sihir',
    date: '5 September 2026',
    venue: 'Lapangan Gasibu, Bandung',
    priceStart: 150000,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    status: 'Available',
  },
  {
    id: 7,
    title: 'Isyana Sarasvati: Lexicon',
    artist: 'Isyana Sarasvati',
    date: '18 September 2026',
    venue: 'Ciputra Artpreneur, Jakarta',
    priceStart: 550000,
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=800&q=80',
    status: 'Sold Out',
  },
  {
    id: 8,
    title: 'Pesta Rakyat: Padi Reborn',
    artist: 'Padi',
    date: '2 Oktober 2026',
    venue: 'Stadion Batakan, Balikpapan',
    priceStart: 250000,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    status: 'Available',
  },
];

export default function UpcomingConcerts() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Upcoming <span className="text-gradient">Events</span></h2>
          <p className="text-text-secondary text-lg max-w-xl">Jangan lewatkan konser-konser seru yang akan datang.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingConcerts.map((concert, i) => (
            <ConcertCard key={concert.id} concert={concert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
