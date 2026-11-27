import festivalService, {
  FestivalService,
  festivalService as namedFestivalService,
  transformBackendEventToFestival,
} from '@/services/festivalService';
import { storageDB } from '@/services/storageService';
import { mockFestivals } from '@/services/mockData';
import { FESTIVAL_STATUS } from '@/lib/constants';

describe('festivalService', () => {
  beforeEach(() => {
    localStorage.clear();
    storageDB.festivals = [...mockFestivals];
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('exposes the service instance and class', () => {
    expect(namedFestivalService).toBe(festivalService);
    expect(festivalService).toBeInstanceOf(FestivalService);
  });

  it('returns only published festivals', async () => {
    storageDB.festivals = [
      ...mockFestivals.slice(0, 2),
      { ...mockFestivals[0], id: 'pending1', status: FESTIVAL_STATUS.PENDING_REVIEW },
    ];
    const promise = festivalService.getPublishedFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.every((f) => f.status === FESTIVAL_STATUS.PUBLISHED)).toBe(true);
  });

  it('computes priceStart from available tickets', async () => {
    const promise = festivalService.getPublishedFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result[0].priceStart).toBeGreaterThan(0);
    expect(result[0].availableTickets).toBeDefined();
  });

  it('gets a festival by id', async () => {
    const promise = festivalService.getFestivalById('f1');
    jest.runAllTimers();
    const result = await promise;
    expect(result.id).toBe('f1');
    expect(result.title).toBe('Java Jazz Festival 2026');
  });

  it('returns null when festival not found', async () => {
    const promise = festivalService.getFestivalById('missing');
    jest.runAllTimers();
    expect(await promise).toBeNull();
  });

  it('searches festivals by title, artist, venue and city', async () => {
    const promise = festivalService.searchFestivals({ query: 'jakarta' });
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBeGreaterThan(0);
  });

  it('works without any search arguments', async () => {
    const promise = festivalService.searchFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBeGreaterThan(0);
  });

  it('tolerates missing festival fields while searching', async () => {
    storageDB.festivals = [
      {
        id: 'minimal',
        title: 'Minimal Fest',
        artist: null,
        venue: undefined,
        city: null,
        genre: 'Pop',
        status: FESTIVAL_STATUS.PUBLISHED,
        date: '2026-08-01T10:00:00Z',
        views: 5,
        priceStart: 100000,
        ticketTypes: [],
      },
      ...mockFestivals.slice(0, 2),
    ];
    const promise = festivalService.searchFestivals({ query: 'jakarta' });
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles festivals without ticket types', async () => {
    storageDB.festivals = [
      {
        id: 'no-ticket',
        title: 'No Ticket Fest',
        status: FESTIVAL_STATUS.PUBLISHED,
        date: '2026-08-01T10:00:00Z',
        views: 1,
        priceStart: 50000,
        ticketTypes: undefined,
      },
    ];
    const promise = festivalService.getPublishedFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result[0].availableTickets).toBe(0);
    expect(result[0].priceStart).toBe(50000);
  });

  it('filters by genre', async () => {
    const promise = festivalService.searchFestivals({ genre: 'Rock' });
    jest.runAllTimers();
    const result = await promise;
    expect(result.every((f) => f.genre === 'Rock')).toBe(true);
  });

  it('filters by city', async () => {
    const promise = festivalService.searchFestivals({ city: 'Bandung' });
    jest.runAllTimers();
    const result = await promise;
    expect(result.every((f) => f.city === 'Bandung')).toBe(true);
  });

  it('sorts cheapest first', async () => {
    const promise = festivalService.searchFestivals({ sort: 'cheapest' });
    jest.runAllTimers();
    const result = await promise;
    expect(result[0].priceStart).toBeLessThanOrEqual(result[1].priceStart);
  });

  it('sorts most expensive first', async () => {
    const promise = festivalService.searchFestivals({ sort: 'expensive' });
    jest.runAllTimers();
    const result = await promise;
    expect(result[0].priceStart).toBeGreaterThanOrEqual(result[1].priceStart);
  });

  it('sorts most popular first', async () => {
    const promise = festivalService.searchFestivals({ sort: 'popular' });
    jest.runAllTimers();
    const result = await promise;
    expect(result[0].views).toBeGreaterThanOrEqual(result[1].views);
  });

  it('sorts nearest date first', async () => {
    const promise = festivalService.searchFestivals({ sort: 'nearest' });
    jest.runAllTimers();
    const result = await promise;
    expect(new Date(result[0].date).getTime()).toBeLessThanOrEqual(new Date(result[1].date).getTime());
  });

  it('sorts newest by default', async () => {
    const promise = festivalService.searchFestivals({});
    jest.runAllTimers();
    const result = await promise;
    expect(new Date(result[0].date).getTime()).toBeGreaterThanOrEqual(new Date(result[1].date).getTime());
  });

  it('creates a festival with pending approval', async () => {
    const payload = {
      title: 'New Fest',
      artist: 'Artist',
      venue: 'Venue',
      city: 'Jakarta',
      ticketTypes: [],
    };
    const promise = festivalService.createFestival(payload);
    jest.runAllTimers();
    const result = await promise;
    expect(result.status).toBe(FESTIVAL_STATUS.PENDING_REVIEW);
    expect(result.id).toBeDefined();
    expect(storageDB.festivals.length).toBe(mockFestivals.length + 1);
  });

  it('throws when updating a missing festival', async () => {
    const promise = festivalService.updateFestival('missing', {});
    jest.runAllTimers();
    await expect(promise).rejects.toThrow('Festival tidak ditemukan');
  });

  it('updates a festival', async () => {
    const promise = festivalService.updateFestival('f1', { title: 'Updated' });
    jest.runAllTimers();
    const result = await promise;
    expect(result.title).toBe('Updated');
  });

  it('deletes a festival', async () => {
    const promise = festivalService.deleteFestival('f1');
    jest.runAllTimers();
    const result = await promise;
    jest.runAllTimers();
    expect(result).toBe(true);
    expect(storageDB.festivals.find((f) => f.id === 'f1')).toBeUndefined();
  });

  it('approves a festival', async () => {
    const promise = festivalService.approveFestival('f1');
    jest.runAllTimers();
    const result = await promise;
    expect(result.status).toBe(FESTIVAL_STATUS.PUBLISHED);
    expect(result.approvedAt).toBeDefined();
  });

  it('rejects a festival', async () => {
    const promise = festivalService.rejectFestival('f1');
    jest.runAllTimers();
    const result = await promise;
    expect(result.status).toBe(FESTIVAL_STATUS.REJECTED);
    expect(result.rejectedAt).toBeDefined();
  });

  it('computes festival stats', () => {
    const stats = festivalService.getFestivalStats('f1');
    expect(stats.totalSold).toBeGreaterThan(0);
    expect(stats.totalQuota).toBeGreaterThan(0);
    expect(stats.soldPercentage).toBeGreaterThan(0);
  });

  it('computes stats for festivals without ticket types', () => {
    storageDB.festivals = [
      { id: 'no-ticket', title: 'X', status: FESTIVAL_STATUS.PUBLISHED, ticketTypes: undefined },
    ];
    expect(festivalService.getFestivalStats('no-ticket')).toEqual({
      totalSold: 0,
      totalQuota: 0,
      soldPercentage: 0,
    });
  });

  it('gets created festivals that belong to an organizer', async () => {
    const promise = festivalService.getCreatedFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.every((f) => Boolean(f.organizerId))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns null stats for missing festival', () => {
    expect(festivalService.getFestivalStats('missing')).toBeNull();
  });

  it('gets all festivals', async () => {
    const promise = festivalService.getAllFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBe(mockFestivals.length);
  });

  describe('transformBackendEventToFestival and backend API integration', () => {
    it('handles null or undefined input', () => {
      expect(transformBackendEventToFestival(null)).toBeNull();
      expect(transformBackendEventToFestival(undefined)).toBeNull();
    });

    it('transforms full backend event with tickets', () => {
      const beEvent = {
        id: 101,
        public_id: 'pub-101',
        title: 'Konser Hebat',
        slug: 'konser-hebat',
        summary: 'Ringkasan konser',
        description: 'Deskripsi lengkap',
        banner: 'https://example.com/banner.jpg',
        thumbnail: 'https://example.com/thumb.jpg',
        poster: 'https://example.com/poster.jpg',
        start_at: '2026-06-01T10:00:00Z',
        end_at: '2026-06-01T23:00:00Z',
        is_featured: true,
        status: 'published',
        organizer_id: 12,
        category: { name: 'Rock' },
        venue: {
          name: 'Stadion Utama',
          city: { name: 'Bandung', province: { name: 'Jawa Barat' } },
        },
        ticketTypes: [
          { id: 1, name: 'VIP', price: 500000, quota: 100, sold: 20, status: 'active' },
          { id: 2, name: 'Regular', price: 250000, quota: 200, sold: 50, status: 'active' },
        ],
      };
      const result = transformBackendEventToFestival(beEvent);
      expect(result.id).toBe('101');
      expect(result.title).toBe('Konser Hebat');
      expect(result.priceStart).toBe(250000);
      expect(result.ticketStatus).toBe('available');
      expect(result.genre).toBe('Rock');
      expect(result.venue).toBe('Stadion Utama');
      expect(result.city).toBe('Bandung');
      expect(result.province).toBe('Jawa Barat');
    });

    it('transforms event with sold out tickets and fallback venue', () => {
      const beEvent = {
        id: 102,
        title: 'Konser Habis',
        start_at: '2026-06-01T10:00:00Z',
        end_at: '2026-06-01T23:00:00Z',
        status: 'draft',
        ticketTypes: [
          { id: 1, name: 'VIP', price: 500000, quota: 10, sold: 10, status: 'sold_out' },
        ],
      };
      const result = transformBackendEventToFestival(beEvent);
      expect(result.ticketStatus).toBe('sold_out');
      expect(result.priceStart).toBe(500000);
      expect(result.venue).toBe('Venue');
      expect(result.city).toBe('Jakarta');
      expect(result.province).toBe('');
    });

    it('transforms event without tickets', () => {
      const beEvent = {
        id: 103,
        title: 'Tanpa Tiket',
        start_at: '2026-06-01T10:00:00Z',
        end_at: '2026-06-01T23:00:00Z',
        ticketTypes: [],
      };
      const result = transformBackendEventToFestival(beEvent);
      expect(result.priceStart).toBe(0);
      expect(result.ticketStatus).toBe('sold_out');
    });

    it('transforms event with public_id and tickets without explicit price or quota', () => {
      const beEvent = {
        public_id: 'pub-only-1',
        title: 'Pub Only Event',
        start_at: '2026-06-01T10:00:00Z',
        end_at: '2026-06-01T23:00:00Z',
        ticketTypes: [{ public_id: 't-pub' }],
      };
      const result = transformBackendEventToFestival(beEvent);
      expect(result.id).toBe('pub-only-1');
      expect(result.ticketTypes[0].id).toBe('t-pub');
      expect(result.ticketTypes[0].price).toBe(0);
      expect(result.ticketTypes[0].quota).toBe(0);
    });

    it('fetches published festivals from API when useApi is true', async () => {
      jest.useRealTimers();
      const mockEvent = {
        id: 1,
        title: 'Api Fest',
        start_at: '2026-07-01T00:00:00Z',
        end_at: '2026-07-02T00:00:00Z',
        status: 'published',
        ticketTypes: [{ id: 1, price: 100000, quota: 10, sold: 0 }],
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [mockEvent] }),
      });

      const res = await festivalService.getPublishedFestivals({ useApi: true });
      expect(res.length).toBe(1);
      expect(res[0].title).toBe('Api Fest');

      // Direct array response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => [mockEvent],
      });
      const directArrayRes = await festivalService.getPublishedFestivals({ useApi: true });
      expect(directArrayRes.length).toBe(1);

      // API kosong tidak lagi jatuh ke data mock
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: [] }),
      });
      const fallbackRes = await festivalService.getPublishedFestivals({ useApi: true });
      expect(fallbackRes).toEqual([]);

      // API gagal mengembalikan daftar kosong
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const errorFallbackRes = await festivalService.getPublishedFestivals({ useApi: true });
      expect(errorFallbackRes).toEqual([]);

      // Null data response from API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: null }),
      });
      await festivalService.getPublishedFestivals({ useApi: true });
    });

    it('fetches festival by id from API when numeric and useApi is true', async () => {
      jest.useRealTimers();
      const mockEvent = {
        id: 99,
        title: 'Single Api Fest',
        start_at: '2026-07-01T00:00:00Z',
        end_at: '2026-07-02T00:00:00Z',
        status: 'published',
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: mockEvent }),
      });

      const res = await festivalService.getFestivalById('99', { useApi: true });
      expect(res.title).toBe('Single Api Fest');

      // Non-numeric ID with useApi: true
      const nonNumRes = await festivalService.getFestivalById('f1', { useApi: true });
      expect(nonNumRes.id).toBe('f1');

      // Null data response from API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: null }),
      });
      await festivalService.getFestivalById('99', { useApi: true });

      // API failure fallback
      global.fetch = jest.fn().mockRejectedValue(new Error('Not found'));
      const fallbackRes = await festivalService.getFestivalById('f1', { useApi: true });
      expect(fallbackRes.title).toBe('Java Jazz Festival 2026');
    });

    it('calls fetchApiEvents, fetchApiEventById, createApiEvent, and approveApiEvent', async () => {
      jest.useRealTimers();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { ok: true } }),
      });

      await festivalService.fetchApiEvents({ search: 'rock', category: 'music', location: 'Jakarta', page: 1, limit: 10 });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=rock'),
        expect.anything()
      );

      await festivalService.fetchApiEvents();
      await festivalService.fetchApiEvents({});
      await festivalService.fetchApiEventById(123);
      await festivalService.createApiEvent({ title: 'New Event' });
      await festivalService.approveApiEvent(123);
    });
  });
});