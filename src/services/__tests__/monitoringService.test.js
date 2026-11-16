import defaultMonitoringService, { monitoringService } from '../monitoringService';

describe('MonitoringService', () => {
  it('exports both default and named monitoringService instances', () => {
    expect(defaultMonitoringService).toBe(monitoringService);
  });
  beforeEach(() => {
    monitoringService.reset();
  });

  describe('getAdminMetrics', () => {
    it('returns calculated metrics correctly', () => {
      const metrics = monitoringService.getAdminMetrics();
      expect(metrics.tiketTerjual.value).toBe('12.450');
      expect(metrics.totalPendapatan.value).toBe('Rp8,2 miliar');
      expect(metrics.pendingPaymentsCount).toBe(2);
      expect(metrics.soldOutConcertsCount).toBe(1);
      expect(metrics.konserAktif.count).toBe(4);
    });

    it('handles sold count with missing sold field', () => {
      monitoringService.concerts = [{ id: 'test1', salesOpen: true }];
      const metrics = monitoringService.getAdminMetrics();
      expect(metrics.tiketTerjual.raw).toBe(0);
      expect(metrics.soldOutConcertsCount).toBe(0);
      expect(metrics.konserAktif.count).toBe(1);
    });
  });

  describe('getOrganizerMetrics', () => {
    it('returns metrics with default concertId argument', () => {
      const metrics = monitoringService.getOrganizerMetrics();
      expect(metrics.concert.id).toBe('c1');
    });

    it('returns metrics for default concert c1', () => {
      const metrics = monitoringService.getOrganizerMetrics('c1');
      expect(metrics.concert.name).toBe('Java Jazz Festival 2026');
      expect(metrics.tiketTerjual.total).toBe('3.700');
      expect(metrics.weeklySales).toHaveLength(4);
    });

    it('falls back to first concert if concert id not found', () => {
      const metrics = monitoringService.getOrganizerMetrics('non-existent');
      expect(metrics.concert.id).toBe('c1');
    });

    it('handles concert with 0 quota gracefully', () => {
      monitoringService.concerts.push({
        id: 'zero',
        name: 'Zero Quota',
        sold: 0,
        quota: 0
      });
      const metrics = monitoringService.getOrganizerMetrics('zero');
      expect(metrics.tiketTerjual.percentage).toBe(0);
    });

    it('handles empty concerts array gracefully', () => {
      monitoringService.concerts = [];
      const metrics = monitoringService.getOrganizerMetrics('none');
      expect(metrics.concert).toBeUndefined();
      expect(metrics.tiketTerjual.total).toBe('3.700');
      expect(metrics.tiketTerjual.percentage).toBe(63.5);
    });
  });

  describe('getConcerts and getConcertById', () => {
    it('filters concerts by search query and status', () => {
      const jazz = monitoringService.getConcerts('Jazz', 'Semua');
      expect(jazz).toHaveLength(1);
      expect(jazz[0].name).toBe('Java Jazz Festival 2026');

      const byArtist = monitoringService.getConcerts('Coldplay', 'Semua');
      expect(byArtist).toHaveLength(1);

      const byLocation = monitoringService.getConcerts('Gelora Bung Karno', 'Semua');
      expect(byLocation).toHaveLength(1);

      const opened = monitoringService.getConcerts('', 'Dibuka');
      expect(opened.every((c) => c.salesOpen)).toBe(true);

      const closed = monitoringService.getConcerts('', 'Ditutup');
      expect(closed.every((c) => !c.salesOpen)).toBe(true);
    });

    it('finds concert by id or returns null', () => {
      const c = monitoringService.getConcertById('c1');
      expect(c).not.toBeNull();
      expect(c.id).toBe('c1');

      const non = monitoringService.getConcertById('fake');
      expect(non).toBeNull();
    });

    it('toggles concert sales', () => {
      const initial = monitoringService.getConcertById('c1').salesOpen;
      const updated = monitoringService.toggleConcertSales('c1');
      expect(updated.salesOpen).toBe(!initial);

      const fake = monitoringService.toggleConcertSales('fake');
      expect(fake).toBeNull();
    });

    it('adds new concert', () => {
      const newC = monitoringService.addConcert({
        name: 'Festival Baru',
        artist: 'Artis Baru',
        schedule: '1 Januari 2027',
        location: 'Jakarta',
        quota: 2000
      });
      expect(newC.id).toBeDefined();
      expect(monitoringService.getConcerts('Festival Baru')).toHaveLength(1);
    });
  });

  describe('getCategories and addCategory', () => {
    it('retrieves categories across concerts with filters', () => {
      const all = monitoringService.getCategories();
      expect(all.length).toBeGreaterThan(0);

      const vip = monitoringService.getCategories('VIP');
      expect(vip.every((cat) => cat.name.includes('VIP'))).toBe(true);

      const javaJazz = monitoringService.getCategories('', 'Java Jazz Festival 2026');
      expect(javaJazz.every((cat) => cat.concertName === 'Java Jazz Festival 2026')).toBe(true);
    });

    it('handles concert with no categories in getCategories', () => {
      monitoringService.concerts.push({
        id: 'no_cats',
        name: 'No Cats',
        categories: null
      });
      const cats = monitoringService.getCategories('No Cats');
      expect(cats).toHaveLength(0);
    });

    it('adds category to concert and handles non-existent concert', () => {
      const added = monitoringService.addCategory('c1', {
        name: 'VVIP',
        price: 2500000,
        quota: 50
      });
      expect(added.name).toBe('VVIP');
      expect(added.remaining).toBe(50);

      const failed = monitoringService.addCategory('fake', { name: 'None' });
      expect(failed).toBeNull();

      monitoringService.concerts.push({ id: 'c_empty', name: 'Empty' });
      const addedToEmpty = monitoringService.addCategory('c_empty', { name: 'CAT1' });
      expect(addedToEmpty.remaining).toBe(100);
    });
  });

  describe('getArtists and addArtist', () => {
    it('filters artists by name, country, and genre', () => {
      const tulus = monitoringService.getArtists('Tulus');
      expect(tulus).toHaveLength(1);

      const indo = monitoringService.getArtists('Indonesia');
      expect(indo.length).toBeGreaterThanOrEqual(4);

      const rock = monitoringService.getArtists('', 'Rock');
      expect(rock.every((a) => a.genre === 'Rock')).toBe(true);
    });

    it('adds artist', () => {
      const newArt = monitoringService.addArtist({
        name: 'Isyana Sarasvati',
        genre: 'Pop',
        country: 'Indonesia'
      });
      expect(newArt.id).toBeDefined();
      expect(monitoringService.getArtists('Isyana')).toHaveLength(1);
    });
  });

  describe('getOrders and getPayments', () => {
    it('filters orders by query and status', () => {
      const ord1 = monitoringService.getOrders('ORD-001');
      expect(ord1).toHaveLength(1);

      const budi = monitoringService.getOrders('Budi');
      expect(budi).toHaveLength(1);

      const jazz = monitoringService.getOrders('Java Jazz');
      expect(jazz.length).toBeGreaterThanOrEqual(1);

      const lunas = monitoringService.getOrders('', 'Lunas');
      expect(lunas.every((o) => o.status === 'Lunas')).toBe(true);
    });

    it('filters payments by id, orderId, customer and status', () => {
      const pay1 = monitoringService.getPayments('PAY-001');
      expect(pay1).toHaveLength(1);

      const byOrder = monitoringService.getPayments('ORD-002');
      expect(byOrder).toHaveLength(1);

      const byCustomer = monitoringService.getPayments('Siti');
      expect(byCustomer).toHaveLength(1);

      const pending = monitoringService.getPayments('', 'Perlu verifikasi');
      expect(pending.every((p) => p.status === 'Perlu verifikasi')).toBe(true);
    });

    it('verifies or rejects payment and syncs order status', () => {
      const verified = monitoringService.verifyPayment('PAY-002', true);
      expect(verified.status).toBe('Terverifikasi');

      const ord = monitoringService.getOrders('ORD-002')[0];
      expect(ord.status).toBe('Lunas');

      const rejected = monitoringService.verifyPayment('PAY-004', false);
      expect(rejected.status).toBe('Gagal');
      const ord4 = monitoringService.getOrders('ORD-004')[0];
      expect(ord4.status).toBe('Dibatalkan');

      const non = monitoringService.verifyPayment('fake-pay', true);
      expect(non).toBeNull();
    });

    it('handles payment verification when matching order does not exist', () => {
      monitoringService.payments.push({
        id: 'PAY-ORPHAN',
        orderId: 'ORD-NON-EXISTENT',
        customer: 'Ghost',
        status: 'Perlu verifikasi'
      });
      const res = monitoringService.verifyPayment('PAY-ORPHAN', true);
      expect(res.status).toBe('Terverifikasi');
    });
  });

  describe('getUsers and getApprovals', () => {
    it('filters users by query and role', () => {
      const admin = monitoringService.getUsers('admin');
      expect(admin).toHaveLength(1);

      const byEmail = monitoringService.getUsers('javafestival.com');
      expect(byEmail).toHaveLength(1);

      const organizers = monitoringService.getUsers('', 'Organizer');
      expect(organizers).toHaveLength(1);
    });

    it('returns approvals list copy', () => {
      const approvals = monitoringService.getApprovals();
      expect(Array.isArray(approvals)).toBe(true);
      expect(approvals).toHaveLength(0);
    });
  });
});
