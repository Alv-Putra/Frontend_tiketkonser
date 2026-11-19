import type { AdminMetrics, Approval, Artist, Concert, MonitoringOrder, MonitoringUser, Payment } from '@/types';
import { apiFetch } from '@/lib/api';

/**
 * Monitoring Service
 * Provides centralized data access, metrics computation, and business logic
 * for the ConserId monitoring dashboards (Admin & Organizer).
 */

const INITIAL_CONCERTS = [
  {
    id: 'c1',
    name: 'Java Jazz Festival 2026',
    artist: 'Various Artists',
    schedule: '15–17 Mei 2026',
    location: 'JIExpo Kemayoran, Jakarta',
    genre: 'Jazz',
    sold: 2350,
    quota: 3700,
    priceFrom: 'Rp850.000',
    salesOpen: true,
    organizer: 'Java Festival Production',
    image: 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    description: 'Java Jazz Festival 2026 kembali hadir lebih spektakuler dengan Guns N Roses sebagai headliner!',
    categories: [
      { id: 'cat1', name: 'VIP', price: 1500000, sold: 150, quota: 200, remaining: 50, status: 'Tersedia' },
      { id: 'cat2', name: 'Festival', price: 850000, sold: 1200, quota: 1500, remaining: 300, status: 'Tersedia' },
      { id: 'cat3', name: 'Tribune A', price: 650000, sold: 600, quota: 1000, remaining: 400, status: 'Tersedia' },
      { id: 'cat4', name: 'Tribune B', price: 450000, sold: 400, quota: 1000, remaining: 600, status: 'Tersedia' }
    ]
  },
  {
    id: 'c2',
    name: 'Coldplay: Music of the Spheres',
    artist: 'Coldplay',
    schedule: '20 Juni 2026',
    location: 'Gelora Bung Karno, Jakarta',
    genre: 'Rock',
    sold: 5000,
    quota: 5000,
    priceFrom: 'Rp1.250.000',
    salesOpen: false,
    organizer: 'PK Entertainment',
    image: 'https://dynamicmedia.livenationinternational.com/b/z/w/1f16b59d-09c9-432d-ad90-39fcc1a6f25a.jpg',
    description: 'Coldplay kembali ke Indonesia lewat tur dunia Music of the Spheres!',
    categories: [
      { id: 'cat5', name: 'VIP', price: 3500000, sold: 500, quota: 500, remaining: 0, status: 'Habis' },
      { id: 'cat6', name: 'Cat 1', price: 2200000, sold: 1500, quota: 1500, remaining: 0, status: 'Habis' },
      { id: 'cat7', name: 'Festival', price: 1250000, sold: 3000, quota: 3000, remaining: 0, status: 'Habis' }
    ]
  },
  {
    id: 'c3',
    name: 'Dewa 19 Reunion Tour',
    artist: 'Dewa 19',
    schedule: '12 Juli 2026',
    location: 'Stadion Madya, Jakarta',
    genre: 'Rock',
    sold: 1800,
    quota: 3000,
    priceFrom: 'Rp500.000',
    salesOpen: true,
    organizer: 'Redline Kreasindo',
    image: 'https://dynamicmedia.livenationinternational.com/t/r/j/4ff345c9-05b8-455b-9970-900cc6a6320e.jpg?format=webp&width=1080&quality=75',
    description: 'Dewa 19 menggelar reuni akbar bersama seluruh vokalis legendaris di Stadion Madya.',
    categories: [
      { id: 'cat8', name: 'VIP', price: 1500000, sold: 350, quota: 500, remaining: 150, status: 'Tersedia' },
      { id: 'cat9', name: 'Reguler', price: 500000, sold: 1450, quota: 2500, remaining: 1050, status: 'Tersedia' }
    ]
  },
  {
    id: 'c4',
    name: 'Hindia: The Tour 2026',
    artist: 'Hindia',
    schedule: '29 Agustus 2026',
    location: 'Balai Sarbini, Jakarta',
    genre: 'Indie',
    sold: 600,
    quota: 1000,
    priceFrom: 'Rp450.000',
    salesOpen: true,
    organizer: 'Sun Eater',
    image: 'https://hindia.id/archive/hd2.jpg',
    description: 'Hindia membawa tur tunggalnya The Tour 2026 di Balai Sarbini!',
    categories: [
      { id: 'cat10', name: 'General', price: 450000, sold: 600, quota: 1000, remaining: 400, status: 'Tersedia' }
    ]
  },
  {
    id: 'c5',
    name: 'God Bless: Rockin’ the Nation',
    artist: 'God Bless',
    schedule: '6 September 2026',
    location: 'Tennis Indoor Senayan, Jakarta',
    genre: 'Rock',
    sold: 700,
    quota: 1200,
    priceFrom: 'Rp500.000',
    salesOpen: true,
    organizer: 'Rock Nation',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/God_Bless_2020_stamp_of_Indonesia.jpg',
    description: 'God Bless, legenda rock Indonesia, kembali menggelegar lewat konser Rockin’ the Nation!',
    categories: [
      { id: 'cat11', name: 'Tribun', price: 500000, sold: 700, quota: 1200, remaining: 500, status: 'Tersedia' }
    ]
  }
];

const INITIAL_ARTISTS = [
  { id: 'art1', name: 'Tulus', genre: 'Pop', country: 'Indonesia', concertsCount: 12 },
  { id: 'art2', name: 'Hindia', genre: 'Indie', country: 'Indonesia', concertsCount: 8 },
  { id: 'art3', name: 'Coldplay', genre: 'Rock', country: 'Inggris', concertsCount: 4 },
  { id: 'art4', name: 'God Bless', genre: 'Rock', country: 'Indonesia', concertsCount: 6 },
  { id: 'art5', name: 'Dewa 19', genre: 'Rock', country: 'Indonesia', concertsCount: 15 },
  { id: 'art6', name: 'Rich Brian', genre: 'Hip Hop', country: 'Indonesia', concertsCount: 5 }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'Budi Santoso',
    concert: 'Java Jazz 2026',
    total: 'Rp1.700.000',
    amount: 1700000,
    status: 'Lunas',
    date: '10 Apr 2026',
    method: 'Transfer BCA'
  },
  {
    id: 'ORD-002',
    customer: 'Siti Rahma',
    concert: 'Coldplay Tour',
    total: 'Rp1.700.000',
    amount: 1700000,
    status: 'Tertunda',
    date: '11 Apr 2026',
    method: 'Transfer Mandiri'
  },
  {
    id: 'ORD-003',
    customer: 'Ahmad Fauzi',
    concert: 'Dewa 19 Reunion',
    total: 'Rp800.000',
    amount: 800000,
    status: 'Lunas',
    date: '12 Apr 2026',
    method: 'QRIS'
  },
  {
    id: 'ORD-004',
    customer: 'Dian Pratama',
    concert: 'Java Jazz 2026',
    total: 'Rp400.000',
    amount: 400000,
    status: 'Tertunda',
    date: '13 Apr 2026',
    method: 'Transfer BNI'
  },
  {
    id: 'ORD-005',
    customer: 'Eko Wijaya',
    concert: 'Coldplay Tour',
    total: 'Rp500.000',
    amount: 500000,
    status: 'Dibatalkan',
    date: '14 Apr 2026',
    method: 'Kartu Kredit'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-001',
    orderId: 'ORD-001',
    customer: 'Budi Santoso',
    method: 'Transfer BCA',
    amount: 'Rp1.700.000',
    numericAmount: 1700000,
    status: 'Terverifikasi',
    date: '10 Apr 2026'
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-002',
    customer: 'Siti Rahma',
    method: 'Transfer Mandiri',
    amount: 'Rp1.700.000',
    numericAmount: 1700000,
    status: 'Perlu verifikasi',
    date: '11 Apr 2026'
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-003',
    customer: 'Ahmad Fauzi',
    method: 'QRIS',
    amount: 'Rp500.000',
    numericAmount: 500000,
    status: 'Terverifikasi',
    date: '12 Apr 2026'
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-004',
    customer: 'Dian Pratama',
    method: 'Transfer BNI',
    amount: 'Rp400.000',
    numericAmount: 400000,
    status: 'Perlu verifikasi',
    date: '13 Apr 2026'
  },
  {
    id: 'PAY-005',
    orderId: 'ORD-005',
    customer: 'Eko Wijaya',
    method: 'Kartu Kredit',
    amount: 'Rp500.000',
    numericAmount: 500000,
    status: 'Gagal',
    date: '14 Apr 2026'
  }
];

const INITIAL_USERS = [
  {
    id: 'usr1',
    name: 'Administrator',
    email: 'admin@conser.id',
    role: 'Admin',
    status: 'Aktif',
    registered: '10 Jan 2026'
  },
  {
    id: 'usr2',
    name: 'Java Festival Production',
    email: 'organizer@javafestival.com',
    role: 'Organizer',
    status: 'Aktif',
    registered: '15 Feb 2026'
  },
  {
    id: 'usr3',
    name: 'Budi Santoso',
    email: 'budi@gmail.com',
    role: 'Customer',
    status: 'Aktif',
    registered: '01 Mar 2026'
  }
];

class MonitoringService {
  concerts: Concert[];
  artists: Artist[];
  orders: MonitoringOrder[];
  payments: Payment[];
  users: MonitoringUser[];
  approvals: Approval[];
  adminMetrics: AdminMetrics;

  constructor() {
    this.reset();
  }

  reset() {
    this.concerts = JSON.parse(JSON.stringify(INITIAL_CONCERTS));
    this.artists = JSON.parse(JSON.stringify(INITIAL_ARTISTS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.payments = JSON.parse(JSON.stringify(INITIAL_PAYMENTS));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.approvals = [];
    this.adminMetrics = null;
  }

  getAdminMetrics() {
    if (this.adminMetrics) {
      return this.adminMetrics;
    }
    const totalSold = this.concerts.reduce((acc, c) => acc + (c.sold || 0), 0);
    const pendingPaymentsCount = this.payments.filter((p) => p.status === 'Perlu verifikasi').length;
    const soldOutConcertsCount = this.concerts.filter((c) => !c.salesOpen || c.sold >= c.quota).length;
    const activeConcertsCount = this.concerts.filter((c) => c.salesOpen).length;

    return {
      tiketTerjual: { value: '12.450', raw: totalSold, change: '+12,5%', trend: 'up', period: 'dari bulan lalu' },
      totalPendapatan: { value: 'Rp8,2 miliar', change: '+18,3%', trend: 'up', period: 'dari bulan lalu' },
      totalPelanggan: { value: '8.920', count: this.users.length, change: '+8,1%', trend: 'up', period: 'dari bulan lalu' },
      konserAktif: { value: '24', count: activeConcertsCount, change: '-2,4%', trend: 'down', period: 'dari bulan lalu' },
      pendingPaymentsCount,
      soldOutConcertsCount,
      pendingApprovalsCount: this.approvals.length
    };
  }

  getOrganizerMetrics(concertId = 'c1') {
    const target = this.concerts.find((c) => c.id === concertId) || this.concerts[0];
    const totalSold = target ? target.sold : 2350;
    const quota = target ? target.quota : 3700;
    const remaining = Math.max(0, quota - totalSold);
    const fillPercent = quota > 0 ? Number(((totalSold / quota) * 100).toFixed(1)) : 0;

    return {
      concert: target,
      tiketTerjual: { value: totalSold.toLocaleString('id-ID'), total: quota.toLocaleString('id-ID'), percentage: fillPercent },
      pendapatanTiket: { value: 'Rp1,285 miliar', label: 'Penjualan terkonfirmasi • 4 kelas tiket' },
      tiketTersedia: { value: remaining.toLocaleString('id-ID'), note: 'Masih dapat dipesan • VIP tersisa 50 tiket' },
      weeklySales: [
        { week: 'Minggu 1', sold: 420 },
        { week: 'Minggu 2', sold: 560 },
        { week: 'Minggu 3', sold: 610 },
        { week: 'Minggu 4', sold: 760 }
      ]
    };
  }

  getConcerts(query = '', statusFilter = 'Semua') {
    return this.concerts.filter((c) => {
      const matchQuery = !query ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.artist.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'Semua' ||
        (statusFilter === 'Dibuka' && c.salesOpen) ||
        (statusFilter === 'Ditutup' && !c.salesOpen);

      return matchQuery && matchStatus;
    });
  }

  getConcertById(id) {
    return this.concerts.find((c) => c.id === id) || null;
  }

  toggleConcertSales(id) {
    const concert = this.concerts.find((c) => c.id === id);
    if (!concert) return null;
    concert.salesOpen = !concert.salesOpen;
    return { ...concert };
  }

  addConcert(concertData) {
    const newConcert = {
      id: `c_${Date.now()}`,
      sold: 0,
      salesOpen: true,
      categories: [],
      ...concertData
    };
    this.concerts.unshift(newConcert);
    return newConcert;
  }

  getCategories(query = '', concertFilter = 'Semua') {
    const allCategories = [];
    this.concerts.forEach((c) => {
      (c.categories || []).forEach((cat) => {
        allCategories.push({
          ...cat,
          concertId: c.id,
          concertName: c.name
        });
      });
    });

    return allCategories.filter((cat) => {
      const matchQuery = !query ||
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.concertName.toLowerCase().includes(query.toLowerCase());

      const matchConcert = concertFilter === 'Semua' || cat.concertName === concertFilter;

      return matchQuery && matchConcert;
    });
  }

  addCategory(concertId, categoryData) {
    const concert = this.concerts.find((c) => c.id === concertId);
    if (!concert) return null;
    const newCat = {
      id: `cat_${Date.now()}`,
      sold: 0,
      remaining: categoryData.quota || 100,
      status: 'Tersedia',
      ...categoryData
    };
    concert.categories = concert.categories || [];
    concert.categories.push(newCat);
    return newCat;
  }

  getArtists(query = '', genreFilter = 'Semua') {
    return this.artists.filter((a) => {
      const matchQuery = !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase());

      const matchGenre = genreFilter === 'Semua' || a.genre.toLowerCase() === genreFilter.toLowerCase();

      return matchQuery && matchGenre;
    });
  }

  addArtist(artistData) {
    const newArtist = {
      id: `art_${Date.now()}`,
      concertsCount: 0,
      ...artistData
    };
    this.artists.unshift(newArtist);
    return newArtist;
  }

  getOrders(query = '', statusFilter = 'Semua') {
    return this.orders.filter((o) => {
      const matchQuery = !query ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.concert.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || o.status.toLowerCase() === statusFilter.toLowerCase();

      return matchQuery && matchStatus;
    });
  }

  getPayments(query = '', statusFilter = 'Semua') {
    return this.payments.filter((p) => {
      const matchQuery = !query ||
        p.id.toLowerCase().includes(query.toLowerCase()) ||
        p.orderId.toLowerCase().includes(query.toLowerCase()) ||
        p.customer.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || p.status.toLowerCase() === statusFilter.toLowerCase();

      return matchQuery && matchStatus;
    });
  }

  verifyPayment(paymentId, isApproved) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    payment.status = isApproved ? 'Terverifikasi' : 'Gagal';

    const order = this.orders.find((o) => o.id === payment.orderId);
    if (order) {
      order.status = isApproved ? 'Lunas' : 'Dibatalkan';
    }

    return { ...payment };
  }

  getUsers(query = '', roleFilter = 'Semua') {
    return this.users.filter((u) => {
      const matchQuery = !query ||
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());

      const matchRole = roleFilter === 'Semua' || u.role.toLowerCase() === roleFilter.toLowerCase();

      return matchQuery && matchRole;
    });
  }

  getApprovals() {
    return [...this.approvals];
  }

  async fetchAdminDashboardFromApi() {
    try {
      const res = await apiFetch('/api/v1/admin/dashboard');
      if (res && res.totals) {
        const { totals, recent_orders = [] } = res;
        const totalRevenueNum = Number(totals.paid_revenue);
        const totalRevenueFormatted = totalRevenueNum >= 1000000000
          ? `Rp${(totalRevenueNum / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} miliar`
          : `Rp${totalRevenueNum.toLocaleString('id-ID')}`;

        this.adminMetrics = {
          ...this.getAdminMetrics(),
          tiketTerjual: {
            value: Number(totals.paid_orders).toLocaleString('id-ID'),
            raw: Number(totals.paid_orders),
            change: '+12,5%',
            trend: 'up',
            period: 'dari bulan lalu',
          },
          totalPendapatan: {
            value: totalRevenueFormatted,
            change: '+18,3%',
            trend: 'up',
            period: 'dari bulan lalu',
          },
          totalPelanggan: {
            value: Number(totals.users).toLocaleString('id-ID'),
            count: Number(totals.users),
            change: '+8,1%',
            trend: 'up',
            period: 'dari bulan lalu',
          },
          konserAktif: {
            value: String(totals.events),
            count: Number(totals.events),
            change: '-2,4%',
            trend: 'down',
            period: 'dari bulan lalu',
          },
          pendingApprovalsCount: Number(totals.pending_events),
        };

        if (recent_orders.length > 0) {
          this.orders = recent_orders.map((o) => ({
            id: String(o.order_number || o.id),
            customer: o.user ? o.user.email : 'Pelanggan',
            concert: 'Festival Konser',
            total: `Rp${Number(o.total).toLocaleString('id-ID')}`,
            amount: Number(o.total),
            status: o.status === 'paid' ? 'Lunas' : (o.status === 'pending' ? 'Tertunda' : 'Dibatalkan'),
            date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            method: 'Pembayaran Online',
          }));
        }
      }
    } catch {
      // Pertahankan metrik lokal jika offline
    }
    return this.getAdminMetrics();
  }

  async fetchUsersFromApi(filters: Record<string, any> = {}) {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.set('search', filters.search);
      if (filters.role && filters.role !== 'Semua') query.set('role', filters.role.toLowerCase());
      const url = `/api/v1/admin/users${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiFetch(url);
      const userList = Array.isArray(res) ? res : res.data;
      if (userList.length > 0) {
        this.users = userList.map((u) => {
          const profile = u.userProfiles?.[0];
          const roleName = u.role?.name || 'buyer';
          const displayRole = roleName === 'buyer' ? 'Customer' : roleName.charAt(0).toUpperCase() + roleName.slice(1);
          return {
            id: String(u.id),
            public_id: u.public_id || String(u.id),
            name: profile?.full_name || u.email.split('@')[0],
            email: u.email,
            role: displayRole,
            status: u.is_active ? 'Aktif' : 'Nonaktif',
            registered: new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          };
        });
      }
    } catch {
      // Pertahankan pengguna lokal
    }
    return this.getUsers(filters.search, filters.role);
  }

  async updateUserStatusApi(userId, isActive) {
    try {
      await apiFetch(`/api/v1/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: { is_active: isActive },
      });
      const user = this.users.find((u) => u.id === String(userId) || u.public_id === String(userId));
      if (user) {
        user.status = isActive ? 'Aktif' : 'Nonaktif';
      }
      return true;
    } catch {
      return false;
    }
  }

  async fetchOrganizersFromApi(filters: Record<string, any> = {}) {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.set('search', filters.search);
      if (filters.status && filters.status !== 'Semua') query.set('status', filters.status.toLowerCase());
      const url = `/api/v1/admin/organizers${query.toString() ? `?${query.toString()}` : ''}`;
      return await apiFetch(url);
    } catch {
      return null;
    }
  }

  async updateOrganizerStatusApi(organizerId, status) {
    try {
      return await apiFetch(`/api/v1/admin/organizers/${organizerId}/status`, {
        method: 'PATCH',
        body: { status },
      });
    } catch {
      return null;
    }
  }

  async approveEventApi(eventId) {
    try {
      const res = await apiFetch(`/api/v1/admin/event/${eventId}/approve`, {
        method: 'PUT',
      });
      this.approvals = this.approvals.filter((a) => a.id !== String(eventId));
      return res;
    } catch {
      return null;
    }
  }

  async fetchEventsFromApi() {
    try {
      const res = await apiFetch('/api/v1/events');
      const items = Array.isArray(res) ? res : res.data;
      if (items.length > 0) {
        this.concerts = items.map((e) => {
          const tickets = e.ticketTypes || [];
          const sold = tickets.reduce((acc, t) => acc + Number(t.sold || 0), 0);
          const quota = tickets.reduce((acc, t) => acc + Number(t.quota || 0), 0);
          const minPrice = tickets.length > 0 ? Math.min(...tickets.map((t) => Number(t.price))) : 0;
          return {
            id: String(e.id),
            public_id: e.public_id || String(e.id),
            name: e.title,
            artist: e.summary || e.title,
            schedule: new Date(e.start_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            location: e.venue?.name ? `${e.venue.name}, ${e.venue.city?.name || ''}` : 'Venue',
            genre: e.category?.name || 'Musik',
            sold,
            quota: quota || 1000,
            priceFrom: `Rp${minPrice.toLocaleString('id-ID')}`,
            salesOpen: true,
            organizer: e.organizer?.company_name || 'Organizer',
            image: e.banner || e.thumbnail || 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
            description: e.description || '',
            categories: tickets.map((t) => ({
              id: String(t.id),
              name: t.name,
              price: Number(t.price),
              sold: Number(t.sold || 0),
              quota: Number(t.quota),
              remaining: Math.max(0, Number(t.quota) - Number(t.sold || 0)),
              status: t.status === 'active' ? 'Tersedia' : 'Habis',
            })),
          };
        });
      }
    } catch {
      // Pertahankan konser lokal
    }
    return this.getConcerts();
  }

  async fetchTransactionLogsFromApi(filters: Record<string, any> = {}) {
    try {
      const query = new URLSearchParams();
      if (filters.status) query.set('status', filters.status);
      const url = `/api/v1/admin/transaction-logs${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiFetch(url);
      const logList = Array.isArray(res) ? res : res.data;
      if (logList.length > 0) {
        this.orders = logList.map((o) => ({
          id: String(o.order_number),
          customer: o.user ? (o.user.userProfiles?.[0]?.full_name || o.user.email) : 'Pelanggan',
          concert: 'Festival Musik',
          total: `Rp${Number(o.total).toLocaleString('id-ID')}`,
          amount: Number(o.total),
          status: o.status === 'paid' ? 'Lunas' : (o.status === 'pending' ? 'Tertunda' : 'Dibatalkan'),
          date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          method: o.payments?.[0]?.payment_method || 'Online',
        }));

        const mappedPayments = logList.flatMap((o) => (o.payments || []).map((p) => ({
          id: String(p.public_id),
          orderId: String(o.order_number),
          customer: o.user ? (o.user.userProfiles?.[0]?.full_name || o.user.email) : 'Pelanggan',
          concert: 'Festival Musik',
          amount: `Rp${Number(p.gross_amount).toLocaleString('id-ID')}`,
          method: p.payment_method || 'Transfer Bank',
          date: new Date(p.paid_at || o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: p.status === 'success' ? 'Terverifikasi' : 'Perlu verifikasi',
        })));
        if (mappedPayments.length > 0) {
          this.payments = mappedPayments;
        }
      }
      return res;
    } catch {
      return null;
    }
  }

  async fetchOrganizerEventsApi() {
    try {
      const res = await apiFetch('/api/v1/organizer/event');
      const events = Array.isArray(res) ? res : res.data;
      if (events.length > 0) {
        this.concerts = events.map((e) => {
          const tickets = e.ticketTypes || [];
          const sold = tickets.reduce((acc, t) => acc + Number(t.sold || 0), 0);
          const quota = tickets.reduce((acc, t) => acc + Number(t.quota || 0), 0);
          const minPrice = tickets.length > 0 ? Math.min(...tickets.map((t) => Number(t.price))) : 0;
          return {
            id: String(e.id),
            public_id: e.public_id || String(e.id),
            name: e.title,
            artist: e.summary || e.title,
            schedule: new Date(e.start_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            location: e.venue?.name ? `${e.venue.name}, ${e.venue.city?.name || ''}` : 'Venue',
            genre: e.category?.name || 'Musik',
            sold,
            quota: quota || 1000,
            priceFrom: `Rp${minPrice.toLocaleString('id-ID')}`,
            salesOpen: e.status === 'published' && Boolean(e.is_published),
            organizer: e.organizer?.company_name || 'Organizer',
            image: e.banner || e.thumbnail || 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
            description: e.description || '',
            categories: tickets.map((t) => ({
              id: String(t.id),
              name: t.name,
              price: Number(t.price),
              sold: Number(t.sold || 0),
              quota: Number(t.quota),
              remaining: Math.max(0, Number(t.quota) - Number(t.sold || 0)),
              status: t.status === 'active' ? 'Tersedia' : 'Habis',
            })),
          };
        });
      }
    } catch {
      // Pertahankan konser lokal
    }
    return this.getConcerts();
  }

  async fetchOrganizerEventSalesApi(eventId) {
    try {
      return await apiFetch(`/api/v1/organizer/event/${eventId}/sales`);
    } catch {
      return null;
    }
  }

  async createOrganizerEventApi(eventData) {
    return apiFetch('/api/v1/organizer/event', {
      method: 'POST',
      body: eventData,
    });
  }

  async createOrganizerTicketApi(ticketData) {
    return apiFetch('/api/v1/organizer/tickets', {
      method: 'POST',
      body: ticketData,
    });
  }

  async updateOrganizerTicketApi(ticketId, ticketData) {
    return apiFetch(`/api/v1/organizer/tickets/${ticketId}`, {
      method: 'PATCH',
      body: ticketData,
    });
  }

  async deleteOrganizerTicketApi(ticketId) {
    return apiFetch(`/api/v1/organizer/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;
