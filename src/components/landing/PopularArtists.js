'use client';

import { motion } from 'framer-motion';

const artists = [
  { name: 'Tulus', image: 'https://akcdn.detik.net.id/community/media/visual/2023/03/01/lagu-tulus-paling-favorit-di-spotify.jpeg?w=700&q=90', genre: 'Pop' },
  { name: 'Raisa', image: 'https://assets.telkomsel.com/public/2024-02/27%20%281%29_0.png', genre: 'Pop' },
  { name: 'Rich Brian', image: 'https://assets.telkomsel.com/public/2025-07/mengenal-rich-brian.png?VersionId=YbuLijBp8IszLoGsmBown8RMc.o91XVq', genre: 'Hip Hop' },
  { name: 'For Revenge', image: 'https://awsimages.detik.net.id/community/media/visual/2025/03/19/for-revenge-1742372092396.jpeg?w=1200', genre: 'Classical Pop' },
  { name: 'Dia', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUG5XMdWEzQ3lOpbTlPte1t78px-n0M_m17o7uKhMlSWEumi06kD6fbB0&s=10', genre: 'Hipdut' },
  { name: 'Perunggu', image: 'https://awsimages.detik.net.id/community/media/visual/2024/04/06/perunggu.png?w=700&q=90', genre: 'Indie' },
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
