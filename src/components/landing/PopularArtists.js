'use client';

import { motion } from 'framer-motion';

const artists = [
  { name: 'Tulus', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', genre: 'Pop' },
  { name: 'Raisa', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', genre: 'Pop' },
  { name: 'Rich Brian', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', genre: 'Hip Hop' },
  { name: 'Isyana', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', genre: 'Classical Pop' },
  { name: 'Dewa 19', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', genre: 'Rock' },
  { name: 'Pamungkas', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', genre: 'Indie' },
];

export default function PopularArtists() {
  return (
    <section id="artists" className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Popular <span className="text-gradient">Artists</span></h2>
          <p className="text-text-secondary text-lg max-w-xl">Artis dan musisi favorit yang siap menghiburmu.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group cursor-pointer"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary-accent/50 transition-all duration-300">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${artist.image})` }}
                />
              </div>
              <h3 className="font-semibold text-text-primary group-hover:text-primary-accent transition-colors">{artist.name}</h3>
              <p className="text-xs text-text-muted">{artist.genre}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
