import useFestivalStore, { useFestivalStore as namedFestivalStore } from '@/stores/festivalStore';
import festivalService from '@/services/festivalService';
import { storageDB } from '@/services/storageService';
import { mockFestivals } from '@/services/mockData';

describe('useFestivalStore', () => {
  beforeEach(() => {
    localStorage.clear();
    storageDB.festivals = JSON.parse(JSON.stringify(mockFestivals));
    useFestivalStore.setState({
      festivals: [],
      festival: null,
      filteredFestivals: [],
      isLoading: false,
      error: null,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('default export resolves to the same store', () => {
    expect(useFestivalStore).toBe(namedFestivalStore);
  });

  it('fetches published festivals', async () => {
    const promise = useFestivalStore.getState().fetchFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBeGreaterThan(0);
    expect(useFestivalStore.getState().festivals.length).toBeGreaterThan(0);
    expect(useFestivalStore.getState().isLoading).toBe(false);
  });

  it('returns empty array on fetch failure', async () => {
    jest.spyOn(festivalService, 'getPublishedFestivals').mockRejectedValue(new Error('Gagal mengambil data'));
    const promise = useFestivalStore.getState().fetchFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result).toEqual([]);
    expect(useFestivalStore.getState().error).toBe('Gagal mengambil data');
    expect(useFestivalStore.getState().isLoading).toBe(false);
  });

  it('falls back to mock data when storage is empty', async () => {
    storageDB.festivals = null;
    const promise = useFestivalStore.getState().fetchFestivals();
    jest.runAllTimers();
    const result = await promise;
    expect(result.length).toBeGreaterThan(0);
    expect(useFestivalStore.getState().error).toBeNull();
  });

  it('fetches a single festival', async () => {
    const promise = useFestivalStore.getState().fetchFestivalById('f1');
    jest.runAllTimers();
    const result = await promise;
    expect(result.id).toBe('f1');
    expect(useFestivalStore.getState().festival.title).toBeDefined();
  });

  it('returns null when festival not found', async () => {
    const promise = useFestivalStore.getState().fetchFestivalById('missing');
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBeNull();
  });

  it('returns null and sets error when fetching a festival fails', async () => {
    jest.spyOn(festivalService, 'getFestivalById').mockRejectedValue(new Error('Gagal mengambil data'));
    const promise = useFestivalStore.getState().fetchFestivalById('f1');
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBeNull();
    expect(useFestivalStore.getState().error).toBe('Gagal mengambil data');
    expect(useFestivalStore.getState().isLoading).toBe(false);
  });

  it('filters by query', () => {
    useFestivalStore.setState({
      festivals: mockFestivals,
    });
    const result = useFestivalStore.getState().applyFilters({ query: 'jakarta' });
    expect(result.length).toBeGreaterThan(0);
    expect(useFestivalStore.getState().filteredFestivals).toEqual(result);
  });

  it('filters by genre', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ genre: 'Rock' });
    expect(result.every((f) => f.genre === 'Rock')).toBe(true);
  });

  it('filters by city', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ city: 'Bandung' });
    expect(result.length).toBe(1);
  });

  it('filters by price range', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({
      priceRange: { min: 0, max: 200000 },
    });
    expect(result.every((f) => f.priceStart <= 200000)).toBe(true);
  });

  it('sorts by cheapest', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ sort: 'cheapest' });
    expect(result[0].priceStart).toBeLessThanOrEqual(result[1].priceStart);
  });

  it('sorts by most expensive', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ sort: 'expensive' });
    expect(result[0].priceStart).toBeGreaterThanOrEqual(result[1].priceStart);
  });

  it('sorts by popularity', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ sort: 'popular' });
    expect(result[0].views).toBeGreaterThanOrEqual(result[1].views);
  });

  it('sorts by nearest', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ sort: 'nearest' });
    expect(new Date(result[0].date).getTime()).toBeLessThanOrEqual(new Date(result[1].date).getTime());
  });

  it('sorts newest by default', () => {
    useFestivalStore.setState({ festivals: [ ...mockFestivals ].reverse() });
    const result = useFestivalStore.getState().applyFilters({ sort: 'newest' });
    expect(new Date(result[0].date).getTime()).toBeGreaterThanOrEqual(new Date(result[1].date).getTime());
  });

  it('combines query and genre filters', () => {
    useFestivalStore.setState({ festivals: mockFestivals });
    const result = useFestivalStore.getState().applyFilters({ query: 'rock', genre: 'Rock' });
    expect(result.every((f) => f.genre === 'Rock')).toBe(true);
  });

  it('tolerates null fields while filtering by query', () => {
    const nullFields = { ...mockFestivals[0], artist: null, venue: undefined, city: null };
    const normal = { ...mockFestivals[1] };
    useFestivalStore.setState({ festivals: [nullFields, normal] });
    const result = useFestivalStore.getState().applyFilters({ query: 'jakarta' });
    expect(result.length).toBeGreaterThan(0);
  });
});