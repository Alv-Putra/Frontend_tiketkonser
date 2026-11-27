import defaultMonitoringService, { monitoringService } from '../monitoringService';
import { concertFixtures } from './fixtures/monitoringConcerts';

describe('MonitoringService', () => {
  it('exports both default and named monitoringService instances', () => {
    expect(defaultMonitoringService).toBe(monitoringService);
  });
  beforeEach(() => {
    monitoringService.reset();
    monitoringService.concerts = structuredClone(concertFixtures);
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
      monitoringService.concerts = [{ id: 'test1', name: 'Test', salesOpen: true }];
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

      // Default arguments
      expect(monitoringService.getArtists().length).toBeGreaterThan(0);
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

      // Default arguments
      expect(monitoringService.getOrders().length).toBeGreaterThan(0);
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

      // Default arguments
      expect(monitoringService.getPayments().length).toBeGreaterThan(0);
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

  describe('Backend API Integration', () => {
    let originalFetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('fetches admin dashboard from API and updates metrics and orders', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            totals: {
              users: 150,
              organizers: 10,
              events: 25,
              pending_events: 3,
              paid_orders: 1200,
              paid_revenue: 2500000000,
            },
            recent_orders: [
              {
                id: 1,
                order_number: 'ORD-999',
                total: 500000,
                status: 'paid',
                created_at: '2026-05-01T12:00:00Z',
                user: { email: 'user@test.com' },
              },
              {
                id: 2,
                total: 250000,
                status: 'pending',
                created_at: '2026-05-02T12:00:00Z',
              },
              {
                id: 3,
                total: 100000,
                status: 'cancelled',
                created_at: '2026-05-03T12:00:00Z',
              },
            ],
          },
        }),
      });

      const metrics = await monitoringService.fetchAdminDashboardFromApi();
      expect(metrics.tiketTerjual.value).toBe('1.200');
      expect(metrics.totalPendapatan.value).toContain('miliar');
      expect(metrics.pendingApprovalsCount).toBe(3);
      expect(monitoringService.orders[0].id).toBe('ORD-999');
      expect(monitoringService.orders[0].status).toBe('Lunas');
      expect(monitoringService.orders[1].status).toBe('Tertunda');
      expect(monitoringService.orders[2].status).toBe('Dibatalkan');
    });

    it('formats admin revenue under 1 billion correctly', async () => {
      monitoringService.reset();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            totals: {
              users: 50,
              organizers: 5,
              events: 5,
              pending_events: 1,
              paid_orders: 10,
              paid_revenue: 50000000,
            },
            recent_orders: [],
          },
        }),
      });

      const metrics = await monitoringService.fetchAdminDashboardFromApi();
      expect(metrics.totalPendapatan.value).toBe('Rp50.000.000');
    });

    it('handles fetchAdminDashboardFromApi network failure gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const metrics = await monitoringService.fetchAdminDashboardFromApi();
      expect(metrics).toBeDefined();

      // Empty totals branch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: {} }),
      });
      await monitoringService.fetchAdminDashboardFromApi();

      // Missing recent_orders
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            totals: { users: 1, organizers: 1, events: 1, pending_events: 1, paid_orders: 1, paid_revenue: 100 },
          },
        }),
      });
      await monitoringService.fetchAdminDashboardFromApi();
    });

    it('fetches users from API with and without filters', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: [
            {
              id: 10,
              public_id: 'pub-10',
              email: 'john@example.com',
              is_active: true,
              created_at: '2026-01-15T00:00:00Z',
              role: { name: 'buyer' },
              userProfiles: [{ full_name: 'John Doe' }],
            },
            {
              id: 11,
              public_id: 'pub-11',
              email: 'jane@example.com',
              is_active: false,
              created_at: '2026-02-15T00:00:00Z',
              role: { name: 'organizer' },
              userProfiles: [],
            },
          ],
        }),
      });

      const users = await monitoringService.fetchUsersFromApi({ search: 'john', role: 'Customer' });
      expect(users.length).toBeGreaterThan(0);
      expect(monitoringService.users[0].name).toBe('John Doe');
      expect(monitoringService.users[0].role).toBe('Customer');
      expect(monitoringService.users[1].role).toBe('Organizer');
      expect(monitoringService.users[1].status).toBe('Nonaktif');

      // Test when res is directly an array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          { id: 12, email: 'direct@test.com', is_active: true, created_at: '2026-01-01', role: { name: 'buyer' } }
        ],
      });
      await monitoringService.fetchUsersFromApi({ role: 'Semua' });

      // User without role
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          { id: 13, email: 'norole@test.com', is_active: true, created_at: '2026-01-01' }
        ],
      });
      await monitoringService.fetchUsersFromApi();

      // Test when res is an object containing data (res.data branch)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            data: [
              { id: 14, email: 'resdata@test.com', is_active: true, created_at: '2026-01-01', role: { name: 'admin' } }
            ]
          }
        }),
      });
      const resDataUsers = await monitoringService.fetchUsersFromApi();
      expect(resDataUsers.length).toBeGreaterThan(0);
    });

    it('handles fetchUsersFromApi network failure gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
      const users = await monitoringService.fetchUsersFromApi();
      expect(users).toBeDefined();

      // Empty users response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [] }),
      });
      await monitoringService.fetchUsersFromApi();
    });

    it('updates user status via API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { ok: true } }),
      });

      monitoringService.users = [
        { id: '99', public_id: 'pub-99', name: 'Test', status: 'Aktif' },
        { id: '100', public_id: 'pub-100', name: 'Test 2', status: 'Aktif' },
      ];
      const success = await monitoringService.updateUserStatusApi('99', false);
      expect(success).toBe(true);
      expect(monitoringService.users[0].status).toBe('Nonaktif');

      // Update to active
      const activateSuccess = await monitoringService.updateUserStatusApi('99', true);
      expect(activateSuccess).toBe(true);
      expect(monitoringService.users[0].status).toBe('Aktif');

      // Update by public_id and not found
      await monitoringService.updateUserStatusApi('pub-100', false);
      expect(monitoringService.users[1].status).toBe('Nonaktif');
      await monitoringService.updateUserStatusApi('not-found', false);

      // Failure path
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed'));
      const failure = await monitoringService.updateUserStatusApi('99', true);
      expect(failure).toBe(false);
    });

    it('fetches organizers from API and updates organizer status', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [{ id: 1, name: 'Org 1' }] }),
      });

      const orgs = await monitoringService.fetchOrganizersFromApi({ search: 'org', status: 'verified' });
      expect(orgs).toBeDefined();

      const updated = await monitoringService.updateOrganizerStatusApi(1, 'verified');
      expect(updated).toBeDefined();

      // Catch paths
      global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
      expect(await monitoringService.fetchOrganizersFromApi()).toBeNull();
      expect(await monitoringService.updateOrganizerStatusApi(1, 'rejected')).toBeNull();
    });

    it('approves event via API and removes from approvals queue', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { status: 'published' } }),
      });

      monitoringService.approvals = [{ id: '10' }];
      const res = await monitoringService.approveEventApi('10');
      expect(res.status).toBe('published');
      expect(monitoringService.approvals).toHaveLength(0);

      // Catch path
      global.fetch = jest.fn().mockRejectedValue(new Error('Approve error'));
      expect(await monitoringService.approveEventApi('10')).toBeNull();
    });

    it('fetches transaction logs from API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [] }),
      });

      const resWithStatus = await monitoringService.fetchTransactionLogsFromApi({ status: 'paid' });
      expect(resWithStatus).toBeDefined();

      // Catch path
      global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
      expect(await monitoringService.fetchTransactionLogsFromApi()).toBeNull();
    });

    it('fetches organizer events and event sales from API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: [
            {
              id: 201,
              title: 'Festival Musik Kita',
              summary: 'Summary fest',
              start_at: '2026-08-01T15:00:00Z',
              status: 'published',
              is_published: true,
              venue: { name: 'JIExpo', city: { name: 'Jakarta' } },
              category: { name: 'Jazz' },
              ticketTypes: [
                { id: 1, name: 'VIP', price: 1000000, sold: 100, quota: 100, status: 'sold_out' },
                { id: 2, name: 'General', price: 300000, sold: 200, quota: 500, status: 'active' },
              ],
            },
          ],
        }),
      });

      const concerts = await monitoringService.fetchOrganizerEventsApi();
      expect(concerts.length).toBe(1);
      expect(concerts[0].name).toBe('Festival Musik Kita');
      expect(concerts[0].priceFrom).toBe('Rp300.000');
      expect(concerts[0].categories[0].status).toBe('Habis');
      expect(concerts[0].categories[1].status).toBe('Tersedia');

      const sales = await monitoringService.fetchOrganizerEventSalesApi(201);
      expect(sales).toBeDefined();

      // Direct array and missing venue/tickets
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          {
            id: 202,
            title: 'No Venue Fest',
            start_at: '2026-08-01T15:00:00Z',
            status: 'draft',
            ticketTypes: [],
          },
        ],
      });
      const directConcerts = await monitoringService.fetchOrganizerEventsApi();
      expect(directConcerts[0].location).toBe('Venue');
      expect(directConcerts[0].priceFrom).toBe('Rp0');

      // Empty events response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [] }),
      });
      await monitoringService.fetchOrganizerEventsApi();

      // Test when res is an object containing data (res.data branch)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            data: [
              {
                id: 206,
                title: 'ResData Fest',
                start_at: '2026-08-01T15:00:00Z',
                status: 'published',
                ticketTypes: [],
              },
            ],
          },
        }),
      });
      const resDataConcerts = await monitoringService.fetchOrganizerEventsApi();
      expect(resDataConcerts.length).toBeGreaterThan(0);

      // Venue with name but without city name
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          {
            id: 203,
            title: 'No City Fest',
            start_at: '2026-08-01T15:00:00Z',
            status: 'draft',
            venue: { name: 'Only Venue', city: null },
            ticketTypes: [
              { id: 1, name: 'T1', price: 100, quota: 10, sold: 0 },
              { id: 2, name: 'T2', price: 50 },
            ],
          },
        ],
      });
      const noCityConcerts = await monitoringService.fetchOrganizerEventsApi();
      expect(noCityConcerts[0].location).toContain('Only Venue');

      // Event with undefined ticketTypes
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          {
            id: 204,
            title: 'No Tickets Event',
            start_at: '2026-08-01T15:00:00Z',
            status: 'published',
            is_published: true,
          },
        ],
      });
      await monitoringService.fetchOrganizerEventsApi();

      // Catch path
      global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
      expect(await monitoringService.fetchOrganizerEventsApi()).toBeDefined();
      expect(await monitoringService.fetchOrganizerEventSalesApi(201)).toBeNull();
    });

    it('calls organizer mutation APIs', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { ok: true } }),
      });

      await monitoringService.createOrganizerEventApi({ title: 'New' });
      await monitoringService.createOrganizerTicketApi({ name: 'T1' });
      await monitoringService.updateOrganizerTicketApi(1, { price: 100 });
      await monitoringService.deleteOrganizerTicketApi(1);
    });

    it('fetches events and transaction logs from API with all branches', async () => {
      // 1. fetchEventsFromApi: array response with all variations
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          {
            id: 101,
            public_id: 'pub-101',
            title: 'Live Rock Fest',
            summary: 'Rock Band',
            start_at: '2026-09-01T15:00:00Z',
            venue: { name: 'GBK Stadium', city: { name: 'Jakarta' } },
            category: { name: 'Rock' },
            organizer: { company_name: 'Rock Org' },
            banner: 'banner.png',
            description: 'Awesome fest',
            ticketTypes: [
              { id: 1, name: 'VIP', price: 500000, quota: 100, sold: 10, status: 'active' },
              { id: 2, name: 'CAT1', price: 200000, status: 'sold_out' },
            ],
          },
          {
            id: 102,
            title: 'Acoustic Fest',
            start_at: '2026-09-02T15:00:00Z',
            venue: { name: 'Garden Hall', city: null },
            category: null,
            organizer: null,
            thumbnail: 'thumb.png',
            ticketTypes: [],
          },
          {
            id: 103,
            title: 'Empty Fest',
            start_at: '2026-09-03T15:00:00Z',
            venue: null,
          },
        ],
      });
      const events1 = await monitoringService.fetchEventsFromApi();
      expect(events1.length).toBeGreaterThanOrEqual(3);

      // 2. fetchEventsFromApi: object response with data property and empty array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            data: [
              {
                id: 104,
                title: 'Data Object Fest',
                start_at: '2026-09-04T15:00:00Z',
              },
            ],
          },
        }),
      });
      const events2 = await monitoringService.fetchEventsFromApi();
      expect(events2.some((e) => e.name === 'Data Object Fest')).toBe(true);

      // 3. fetchEventsFromApi: empty array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [],
      });
      await monitoringService.fetchEventsFromApi();

      // 4. fetchEventsFromApi: catch path
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const fallbackEvents = await monitoringService.fetchEventsFromApi();
      expect(fallbackEvents).toBeDefined();

      // 5. fetchTransactionLogsFromApi: with status filter and nested data with payments
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          data: {
            data: [
              {
                id: 301,
                order_number: 'ORD-LIVE-1',
                total: 250000,
                status: 'paid',
                created_at: '2026-04-12T10:00:00Z',
                user: { userProfiles: [{ full_name: 'Budi Live' }] },
                payments: [
                  {
                    public_id: 'PAY-L1',
                    payment_method: 'QRIS',
                    gross_amount: 250000,
                    status: 'success',
                    paid_at: '2026-04-12T10:05:00Z',
                  },
                ],
              },
              {
                id: 302,
                order_number: 'ORD-LIVE-2',
                total: 100000,
                status: 'pending',
                created_at: '2026-04-12T11:00:00Z',
                user: { userProfiles: [], email: 'user2@live.com' },
                payments: [
                  {
                    public_id: 'PAY-L2',
                    payment_method: null,
                    gross_amount: 100000,
                    status: 'pending',
                    paid_at: null,
                  },
                ],
              },
              {
                id: 303,
                order_number: 'ORD-LIVE-3',
                total: 50000,
                status: 'cancelled',
                created_at: '2026-04-12T12:00:00Z',
                user: null,
                payments: [
                  {
                    public_id: 'PAY-L3',
                    payment_method: 'Manual',
                    gross_amount: 50000,
                    status: 'failed',
                    paid_at: null,
                  },
                ],
              },
              {
                id: 304,
                order_number: 'ORD-LIVE-4',
                total: 75000,
                status: 'cancelled',
                created_at: '2026-04-12T13:00:00Z',
                user: null,
              },
            ],
          },
        }),
      });
      const logsRes = await monitoringService.fetchTransactionLogsFromApi({ status: 'paid' });
      expect(logsRes).toBeDefined();
      expect(monitoringService.orders.some((o) => o.id === 'ORD-LIVE-1')).toBe(true);
      expect(monitoringService.payments.some((p) => p.id === 'PAY-L1')).toBe(true);

      // 6. fetchTransactionLogsFromApi: without filter, array response without payments
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [
          {
            id: 305,
            order_number: 'ORD-LIVE-5',
            total: 150000,
            status: 'cancelled',
            created_at: '2026-04-12T12:00:00Z',
            payments: [],
          },
        ],
      });
      await monitoringService.fetchTransactionLogsFromApi();
      expect(monitoringService.orders.some((o) => o.id === 'ORD-LIVE-5')).toBe(true);

      // 7. fetchTransactionLogsFromApi: empty array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [],
      });
      await monitoringService.fetchTransactionLogsFromApi();

      // 8. fetchTransactionLogsFromApi: catch path
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const catchLogs = await monitoringService.fetchTransactionLogsFromApi();
      expect(catchLogs).toBeNull();
    });
  });
  it('mengosongkan konser bila respons event tanpa data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    });
    await monitoringService.fetchEventsFromApi();
    expect(monitoringService.concerts).toEqual([]);
    monitoringService.concerts = structuredClone(concertFixtures);
    await monitoringService.fetchOrganizerEventsApi();
    expect(monitoringService.concerts).toEqual([]);
  });
});
