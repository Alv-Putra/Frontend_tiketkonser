'use client';

import { motion } from 'framer-motion';
import ConcertCard from './ConcertCard';

const upcomingConcerts = [
  {
    id: 5,
    title: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    date: '28 Agustus 2026',
    venue: 'Balai Sarbini, Jakarta',
    priceStart: 400000,
    image: 'https://hindia.id/archive/hd2.jpg',
    status: 'Available',
  },
  {
    id: 6,
    title: 'God Bless: Rockin\' the Nation',
    artist: 'God Bless',
    date: '5 September 2026',
    venue: 'Lapangan Gasibu, Bandung',
    priceStart: 150000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    status: 'Available',
  },
  {
    id: 7,
    title: 'Ifan Seventeen: The Last Chapter',
    artist: 'Ifan Seventeen',
    date: '18 September 2026',
    venue: 'Ciputra Artpreneur, Jakarta',
    priceStart: 550000,
    image: 'https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Jakarta/o/1740326465552-FOTO_IFAN_NEW_2/oxyn9qzdmij8656.jpeg',
    status: 'Sold Out',
  },
  {
    id: 8,
    title: 'Enau Festival 2026',
    artist: 'Enau',
    date: '2 Oktober 2026',
    venue: 'Stadion Batakan, Balikpapan',
    priceStart: 250000,
    image: 'https://cdn.medcom.id/dynamic/content/2024/11/22/1730140/7qrnEDxdyu.jpg?w=1024',
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
