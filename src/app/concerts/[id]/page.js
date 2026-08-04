'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Download, ChevronLeft, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const concertData = {
  1: {
    id: 1,
    title: 'Java Jazz Festival 2026',
    artist: 'Guns N Roses',
    date: '15-17 Mei 2026',
    time: '14:00 - 23:00 WIB',
    venue: 'JIExpo Kemayoran, Jakarta',
    priceStart: 350000,
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    status: 'Available',
    featured: true,
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner! Festival musik terbesar di Asia Tenggara ini akan memanjakan penonton dengan penampilan legendaris dan ratusan musisi papan atas.',
    lineup: ['Guns N Roses', 'Musisi Jazz Nasional', 'Musisi Jazz Internasional'],
    ticketClasses: [
      { name: 'VIP', price: 1500000, quota: 200, sold: 150 },
      { name: 'Category 1', price: 850000, quota: 500, sold: 400 },
      { name: 'Category 2', price: 500000, quota: 1000, sold: 600 },
      { name: 'Festival', price: 350000, quota: 2000, sold: 1200 },
    ],
    faq: [
      { q: 'Apakah anak-anak boleh masuk?', a: 'Anak-anak di atas 5 tahun diperbolehkan masuk dengan tiket masuk.' },
      { q: 'Apakah tersedia area parkir?', a: 'Tersedia area parkir yang luas di kompleks JIExpo.' },
    ],
  },
  2: {
    id: 2,
    title: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    date: '20 Juni 2026',
    time: '19:30 - 22:30 WIB',
    venue: 'Gelora Bung Karno, Jakarta',
    priceStart: 850000,
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    status: 'Sold Out',
    featured: true,
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres! Pertunjukan penuh visual spektakuler, lagu-lagu ikonik, dan pengalaman konser yang tak terlupakan di Gelora Bung Karno.',
    lineup: ['Coldplay', 'Special Guest'],
    ticketClasses: [
      { name: 'Ultimate', price: 2500000, quota: 500, sold: 500 },
      { name: 'CAT 1', price: 1500000, quota: 1500, sold: 1500 },
      { name: 'CAT 2', price: 850000, quota: 3000, sold: 3000 },
    ],
    faq: [
      { q: 'Apakah tiket masih tersedia?', a: 'Maaf, seluruh tiket untuk konser ini sudah habis terjual.' },
      { q: 'Apakah tersedia tribune?', a: 'Seluruh kategori tiket menggunakan standing area di lapangan GBK.' },
    ],
  },
  3: {
    id: 3,
    title: 'Festival Musik Indonesia 2026',
    artist: 'Backstreet Boys',
    date: '3-5 Juli 2026',
    time: '13:00 - 22:00 WIB',
    venue: 'Lapangan Rampal, Malang',
    priceStart: 200000,
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    status: 'Available',
    featured: true,
    description: 'Festival Musik Indonesia 2026 menghadirkan Backstreet Boys sebagai bintang utama! Tiga hari penuh musik, panggung megah, dan penampil yang tak boleh dilewatkan di Lapangan Rampal.',
    lineup: ['Backstreet Boys', 'Penampil Lokal', 'DJ Performance'],
    ticketClasses: [
      { name: 'VIP', price: 750000, quota: 1000, sold: 700 },
      { name: 'Reguler', price: 350000, quota: 3000, sold: 2000 },
      { name: 'Early Bird', price: 200000, quota: 2000, sold: 2000 },
    ],
    faq: [
      { q: 'Apakah area VIP dekat dengan panggung?', a: 'Ya, area VIP berada paling dekat dengan panggung utama.' },
      { q: 'Berapa durasi festival setiap harinya?', a: 'Festival berlangsung dari siang hingga malam setiap harinya.' },
    ],
  },
  4: {
    id: 4,
    title: 'Michael Learns To Rock Reunion Tour',
    artist: 'Michael Learns To Rock',
    date: '12 Agustus 2026',
    time: '19:00 - 22:00 WIB',
    venue: 'Stadion Utama GBK, Jakarta',
    priceStart: 500000,
    image: 'https://dynamicmedia.livenationinternational.com/d/q/q/97fa78ed-62e1-4f35-ab15-ccd9ee3d2545.jpg?format=webp&width=1080&quality=75',
    status: 'Available',
    featured: false,
    description: 'Legenda musik pop Michael Learns To Rock kembali tampil dalam Reunion Tour! Saksikan lagu-lagu hits era 90-an seperti That\'s Why You Go Away dan Paint My Love secara live.',
    lineup: ['Michael Learns To Rock', 'Opening Act'],
    ticketClasses: [
      { name: 'VIP', price: 1500000, quota: 500, sold: 300 },
      { name: 'CAT 1', price: 900000, quota: 1000, sold: 650 },
      { name: 'CAT 2', price: 500000, quota: 2000, sold: 1100 },
    ],
    faq: [
      { q: 'Apakah tersedia kursi?', a: 'Kategori VIP dan CAT 1 menggunakan kursi bernomor, CAT 2 standing area.' },
      { q: 'Kapan pintu dibuka?', a: 'Pintu dibuka pukul 17.00 WIB, konser dimulai pukul 19.00 WIB.' },
    ],
  },
  5: {
    id: 5,
    title: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    date: '28 Agustus 2026',
    time: '19:30 - 22:30 WIB',
    venue: 'Balai Sarbini, Jakarta',
    priceStart: 400000,
    image: 'https://hindia.id/archive/hd2.jpg',
    status: 'Available',
    featured: false,
    description: 'Hindia membawa tur tunggalnya The Tour 2026! Malam penuh musik, lirik mendalam, dan energi khas Hindia yang menghipnotis penonton di Balai Sarbini.',
    lineup: ['Hindia', 'Special Guest'],
    ticketClasses: [
      { name: 'VIP', price: 750000, quota: 300, sold: 200 },
      { name: 'Festival', price: 400000, quota: 800, sold: 500 },
    ],
    faq: [
      { q: 'Apakah konser menggunkaan kursi?', a: 'Area VIP bersebelahan dengan panggung, area festival standing.' },
      { q: 'Apakah boleh membawa kamera?', a: 'Kamera saku diperbolehkan, kamera profesional tidak diizinkan.' },
    ],
  },
  6: {
    id: 6,
    title: 'God Bless: Rockin\' the Nation',
    artist: 'God Bless',
    date: '5 September 2026',
    time: '19:00 - 23:00 WIB',
    venue: 'Lapangan Gasibu, Bandung',
    priceStart: 150000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    status: 'Available',
    featured: false,
    description: 'God Bless, legenda rock Indonesia, kembali menggelegar lewat konser Rockin\' the Nation! Persembahan spesial untuk para penggemar setia rock n roll Tanah Air.',
    lineup: ['God Bless', 'Ahmad Albar', 'Eross Candra', 'Special Guest'],
    ticketClasses: [
      { name: 'VIP', price: 350000, quota: 500, sold: 320 },
      { name: 'Festival', price: 150000, quota: 2000, sold: 1200 },
    ],
    faq: [
      { q: 'Apakah anak-anak diperbolehkan?', a: 'Boleh, namun wajib didampingi orang tua.' },
      { q: 'Apakah tersedia area VIP dekat panggung?', a: 'Ya, area VIP paling dekat dengan panggung utama.' },
    ],
  },
  7: {
    id: 7,
    title: 'Ifan Seventeen: The Last Chapter',
    artist: 'Ifan Seventeen',
    date: '18 September 2026',
    time: '19:30 - 22:00 WIB',
    venue: 'Ciputra Artpreneur, Jakarta',
    priceStart: 550000,
    image: 'https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Jakarta/o/1740326465552-FOTO_IFAN_NEW_2/oxyn9qzdmij8656.jpeg',
    status: 'Sold Out',
    featured: false,
    description: 'Ifan Seventeen menutup babak terakhir perjalanan musiknya lewat The Last Chapter. Malam penuh haru dengan lagu-lagu ikonik yang menemani perjalanan banyak orang.',
    lineup: ['Ifan Seventeen', 'Orchestra Live'],
    ticketClasses: [
      { name: 'VIP', price: 1200000, quota: 400, sold: 400 },
      { name: 'CAT 1', price: 850000, quota: 700, sold: 700 },
      { name: 'CAT 2', price: 550000, quota: 1200, sold: 1200 },
    ],
    faq: [
      { q: 'Apakah tiket masih tersedia?', a: 'Maaf, seluruh tiket untuk konser ini sudah habis terjual.' },
      { q: 'Apakah ada orkestra live?', a: 'Ya, konser ini diiringi orkestra live yang menambah kesan dramatis.' },
    ],
  },
  8: {
    id: 8,
    title: 'Enau Festival 2026',
    artist: 'Enau',
    date: '2 Oktober 2026',
    time: '15:00 - 23:00 WIB',
    venue: 'Stadion Batakan, Balikpapan',
    priceStart: 250000,
    image: 'https://cdn.medcom.id/dynamic/content/2024/11/22/1730140/7qrnEDxdyu.jpg?w=1024',
    status: 'Available',
    featured: false,
    description: 'Enau Festival 2026 kembali hadir di Kalimantan! Festival musik tahunan dengan lineup terbaik, panggung megah, dan suasana konser yang meriah di Stadion Batakan.',
    lineup: ['Enau', 'Penampil Lokal', 'DJ Performance'],
    ticketClasses: [
      { name: 'VIP', price: 600000, quota: 800, sold: 400 },
      { name: 'Reguler', price: 350000, quota: 2500, sold: 1500 },
      { name: 'Early Bird', price: 250000, quota: 1500, sold: 1500 },
    ],
    faq: [
      { q: 'Berapa lama festival berlangsung?', a: 'Festival dimulai siang hari dan berakhir menjelang tengah malam.' },
      { q: 'Apakah tersedia penginapan?', a: 'Area sekitar Stadion Batakan memiliki banyak pilihan penginapan.' },
    ],
  },
};

const benefits = [
  { icon: Smartphone, text: 'Beli tiket via aplikasi' },
  { icon: CheckCircle, text: 'Pilih kelas tiket' },
  { icon: Download, text: 'Dapatkan E-Ticket' },
];

export default function ConcertDetail({ params }) {
  const [activeTab, setActiveTab] = useState('tickets');
  const { id } = use(params);
  const concert = concertData[id] || concertData[1];

  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${concert.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/60 to-transparent" />
        <div className="absolute top-8 left-5 md:left-10 xl:left-20 z-10">
          <Link
            href="/#concerts"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={18} />
            Kembali ke Konser
          </Link>
        </div>
      </div>

      <div className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {concert.featured && <Badge variant="featured">Featured</Badge>}
              <Badge variant={concert.status === 'Sold Out' ? 'sold' : 'available'}>{concert.status}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3">{concert.title}</h1>
            <p className="text-xl text-text-secondary mb-6">{concert.artist}</p>

            <div className="flex flex-wrap gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-2"><Calendar size={16} />{concert.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} />{concert.time}</span>
              <span className="flex items-center gap-2"><MapPin size={16} />{concert.venue}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">Tentang Event</h2>
                <p className="text-text-secondary leading-relaxed">{concert.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Lineup</h2>
                <div className="flex flex-wrap gap-3">
                  {concert.lineup.map((artist) => (
                    <span key={artist} className="px-4 py-2 bg-surface rounded-full text-sm text-text-primary">
                      {artist}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Kelas Tiket</h2>
                <div className="space-y-3">
                  {concert.ticketClasses.map((tc) => (
                    <div key={tc.name} className="bg-secondary-bg border border-border rounded-[18px] p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">{tc.name}</h3>
                        <p className="text-sm text-text-muted">
                          {tc.sold}/{tc.quota} terjual
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gradient">Rp{tc.price.toLocaleString('id-ID')}</p>
                        <div className="w-32 h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${(tc.sold / tc.quota) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[18px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone size={20} className="text-primary-accent" />
                  <span className="font-semibold">Beli via App</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                  Untuk membeli tiket, silakan download aplikasi ConcertHub.
                </p>

                <div className="space-y-3 mb-6">
                  {benefits.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle size={14} className="text-success" />
                        </div>
                        <span className="text-text-secondary">{b.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-surface rounded-[18px] border border-border flex items-center justify-center">
                    <QrCode size={50} className="text-text-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button className="w-full">
                    <Download size={16} />
                    Download App
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin size={16} />
                    Lihat di Maps
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
