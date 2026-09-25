import festivalService, {
  FestivalService,
  festivalService as namedFestivalService,
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
      { ...mockFestivals[0], id: 'pending1', status: FESTIVAL_STATUS.PENDING_APPROVAL },
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
    expect(result.status).toBe(FESTIVAL_STATUS.PENDING_APPROVAL);
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
});