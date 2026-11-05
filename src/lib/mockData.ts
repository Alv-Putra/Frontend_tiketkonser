export const dummyUser = {
  id: 'user1',
  name: 'Pengguna Contoh',
  email: 'user@example.com',
  role: 'customer',
};

export const dummyFestivals = [
  {
    id: 'f1',
    title: 'Festival Musik Nusantara 2026',
    artist: 'Raisa & Isyana',
    genre: 'Pop',
    description: 'Festival musik terbesar di Nusantara dengan lineup bintang.',
    venue: 'Gelora Bung Karno',
    city: 'Jakarta',
    date: new Date(Date.now() + 86400000 * 30).toISOString(),
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1080',
    lineup: ['Raisa', 'Isyana', 'Tulus'],
    schedule: [
      { title: 'Pembukaan', time: new Date(Date.now() + 86400000 * 30).toISOString() },
    ],
    rules: ['Dilarang membawa makanan luar', 'Waktu check-in pukul 17.00 WIB'],
    faq: [],
    ticketStatus: 'available',
    status: 'published',
    priceStart: 350000,
    ticketTypes: [
      { id: 't1', name: 'VIP', price: 350000, quota: 100, sold: 20 },
      { id: 't2', name: 'Reguler', price: 200000, quota: 200, sold: 50 },
    ],
    organizer: { name: 'ConserId Team', description: 'Penyelenggara resmi' },
  },
  {
    id: 'f2',
    title: 'Rock Fest Asia',
    artist: 'The Adams & Sheila on 7',
    genre: 'Rock',
    description: 'Pengalaman rock live terbaik di Asia.',
    venue: 'Istora Senayan',
    city: 'Jakarta',
    date: new Date(Date.now() + 86400000 * 45).toISOString(),
    image: 'https://images.unsplash.com/photo-1533174072645-5b90b1b64add?w=1080',
    lineup: ['The Adams', 'Sheila on 7'],
    schedule: [],
    rules: [],
    faq: [],
    ticketStatus: 'available',
    status: 'published',
    priceStart: 250000,
    ticketTypes: [
      { id: 't3', name: 'VIP', price: 250000, quota: 80, sold: 10 },
      { id: 't4', name: 'Reguler', price: 150000, quota: 150, sold: 30 },
    ],
    organizer: { name: 'Rock Promo', description: 'Penyelenggara rock' },
  },
];

export const dummyOrders = [
  {
    id: 'o1',
    orderNumber: 'ORD-20260101-ABCD',
    festivalId: 'f1',
    festivalTitle: 'Festival Musik Nusantara 2026',
    venue: 'Gelora Bung Karno',
    festivalDate: dummyFestivals[0].date,
    status: 'paid',
    paymentMethod: 'qris',
    total: 550000,
    subtotal: 500000,
    serviceFee: 25000,
    tax: 25000,
    discount: 0,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    items: [
      { ticketTypeId: 't1', name: 'VIP', price: 350000, quantity: 1, total: 350000 },
      { ticketTypeId: 't2', name: 'Reguler', price: 200000, quantity: 1, total: 200000 },
    ],
  },
];

export const dummyTickets = dummyOrders.flatMap((o) =>
  o.items.map((item, i) => ({
    id: `tk-${o.id}-${i}`,
    code: `TKT-${o.orderNumber.split('-')[1]}-${i + 1}`,
    orderId: o.id,
    orderNumber: o.orderNumber,
    festivalTitle: o.festivalTitle,
    venue: o.venue,
    festivalDate: o.festivalDate,
    ticketTypeName: item.name,
    price: item.price,
    status: 'valid',
    qrData: JSON.stringify({ code: `TKT-${o.orderNumber.split('-')[1]}-${i + 1}`, festival: o.festivalId, order: o.id }),
  }))
);

export const dummyUsers = [
  { id: 'u1', email: 'admin@conserid.com', fullName: 'Admin Konser', role: 'admin', isActive: true, createdAt: new Date().toISOString() },
  { id: 'u2', email: 'organizer@conserid.com', fullName: 'Organizer Contoh', role: 'organizer', isActive: true, createdAt: new Date().toISOString() },
  { id: 'u3', email: 'user@example.com', fullName: 'Pengguna Contoh', role: 'customer', isActive: true, createdAt: new Date().toISOString() },
];
