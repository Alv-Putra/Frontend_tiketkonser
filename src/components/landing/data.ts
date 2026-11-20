// Konten statis landing page Tixo.

/** Link unduh app; `null` = "Segera hadir". */
export const APP_LINKS: { playStore: string | null; appStore: string | null } = {
  playStore: null,
  appStore: null,
};

export const ORGANIZER_HREF = '/organizer';

export interface BandPhoto {
  name: string;
  src: string;
  width: number;
  height: number;
  credit: string;
  license: string;
  source: string;
}

// Foto band (kredit: docs/photo-credits.md).
export const BAND_PHOTOS: BandPhoto[] = [
  {
    name: 'Slank',
    src: '/images/bands/slank.jpg',
    width: 600,
    height: 399,
    credit: '@gueamu',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Slank_at_2009_Java_Jazz_Festival.jpg',
  },
  {
    name: 'Dewa 19',
    src: '/images/bands/dewa19.jpg',
    width: 600,
    height: 398,
    credit: 'Irwandy Mazwir',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Dewa_19.jpg',
  },
  {
    name: 'NOAH',
    src: '/images/bands/noah.jpg',
    width: 600,
    height: 450,
    credit: 'Dhimas Driawan',
    license: 'CC BY-SA 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Noah_2013.jpg',
  },
  {
    name: 'Sheila on 7',
    src: '/images/bands/sheila-on-7.jpg',
    width: 600,
    height: 225,
    credit: 'Mas Agung Wilis Yudha Baskoro; kolase oleh AnsyahF',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Sheila_on_7.jpg',
  },
];

export const TAPE_WORDS = [
  'Tiket resmi',
  'Anti calo',
  'QR check-in',
  'Bayar sekali tap',
  'Konser',
  'Festival',
  'Gig kecil',
  'Stadion',
];

export const AUDIENCE_STEPS = [
  {
    no: '01',
    title: 'Cari gig-nya',
    body: 'Konser stadion sampai gig di kafe sebelah, semua ada di satu feed.',
  },
  {
    no: '02',
    title: 'Bayar sekali tap',
    body: 'QRIS, e-wallet, atau transfer bank. Harga jelas sejak awal, tanpa biaya kejutan.',
  },
  {
    no: '03',
    title: 'Scan, masuk, teriak',
    body: 'E-ticket ber-QR tersimpan di app. Tunjukkan di gerbang, langsung masuk.',
  },
];

export const ORGANIZER_FEATURES = [
  {
    title: 'Bikin event dalam menit',
    body: 'Isi detail, lineup, dan poster. Ajukan ke admin, lalu tiket langsung tayang di app.',
  },
  {
    title: 'Atur kategori tiket',
    body: 'Presale, reguler, VIP, dengan kuota dan harga masing-masing. Ubah kapan saja.',
  },
  {
    title: 'Pantau penjualan live',
    body: 'Lihat tiket terjual dan pendapatan per kategori secara real time dari dashboard.',
  },
  {
    title: 'Check-in pakai QR',
    body: 'Petugas scan tiket di gerbang. Tiket ganda dan tiket palsu langsung ditolak.',
  },
];

export interface EventPhoto {
  src: string;
  credit: string;
  license: string;
  source: string;
}

// Foto sampul tiket (JPEG 640×400).
const PHOTO: Record<string, EventPhoto> = {
  'rock-revolution': { src: '/images/events/rock-revolution.jpg', credit: 'Raph_PH', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:GunsNRoses160617-61_(35271773841).jpg' },
  'java-jazz': { src: '/images/events/java-jazz.jpg', credit: 'Azwari Nugraha', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Hubert_Laws_at_the_Jakarta_International_Java_Jazz_Festival_2010.jpg' },
  coldplay: { src: '/images/events/coldplay.jpg', credit: 'Richard Humphrey', license: 'CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Coldplay_concert_at_The_Emirates_Stadium_-_geograph.org.uk_-_2982682.jpg' },
  'backstreet-boys': { src: '/images/events/backstreet-boys.jpg', credit: 'Anirudh Koul', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Backstreet_Boys_Concert_2.jpg' },
  mltr: { src: '/images/events/mltr.jpg', credit: 'Ian Paul Saligumba', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Michael_Learns_to_Rock_live_at_Philippines_(2022).jpg' },
  'live-band-night': { src: '/images/events/live-band-night.jpg', credit: 'Shixart1985', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Live_band_performing_on_stage_at_night_during_a_music_festival_in_an_outdoor_venue.jpg' },
  'summer-festival': { src: '/images/events/summer-festival.jpg', credit: 'Shixart1985', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Live_music_performance_at_a_summer_festival_with_energetic_crowd_and_talented_musicians_on_stage.jpg' },
  'dj-stage': { src: '/images/events/dj-stage.jpg', credit: 'Vyacheslav Argenberg', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Pattaya_Music_Festival,_DJ_on_stage_playing_music.jpg' },
  'crowd-lights': { src: '/images/events/crowd-lights.jpg', credit: 'Hannah Rodrigo', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Concert_crowd_(Unsplash).jpg' },
  'stadium-stage': { src: '/images/events/stadium-stage.jpg', credit: 'Ian Hughes', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Guns_n_Roses_concert_at_Tottenham_July_2022.jpg' },
};

// Pasangan event → foto.
const PHOTO_RULES: [RegExp, string][] = [
  // Java Jazz harus lebih dulu (artisnya Guns N Roses).
  [/java jazz/i, 'java-jazz'],
  [/rock revolution|guns n/i, 'rock-revolution'],
  [/coldplay/i, 'coldplay'],
  [/backstreet|festival musik indonesia/i, 'backstreet-boys'],
  [/michael learns|mltr/i, 'mltr'],
  [/hindia/i, 'live-band-night'],
  [/god bless/i, 'stadium-stage'],
  [/ifan|seventeen/i, 'summer-festival'],
  [/enau|edm|dj/i, 'dj-stage'],
  [/soundrenaline/i, 'crowd-lights'],
];

// Foto cadangan untuk event lain.
const FALLBACK = ['live-band-night', 'summer-festival', 'stadium-stage', 'crowd-lights', 'dj-stage'];

export function photoForEvent(event: { title?: string; artist?: string; genre?: string }): EventPhoto {
  const text = `${event.title ?? ''} ${event.artist ?? ''} ${event.genre ?? ''}`;
  const rule = PHOTO_RULES.find(([re]) => re.test(text));
  if (rule) return PHOTO[rule[1]];
  let hash = 0;
  for (const ch of event.title ?? '') hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PHOTO[FALLBACK[hash % FALLBACK.length]];
}

export const EVENT_PHOTOS = Object.values(PHOTO);
