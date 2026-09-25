import { create } from 'zustand';
import festivalService from '@/services/festivalService';

export const useFestivalStore = create((set, get) => ({
  festivals: [],
  festival: null,
  filteredFestivals: [],
  isLoading: false,
  error: null,

  fetchFestivals: async () => {
    set({ isLoading: true, error: null });
    try {
      const festivals = await festivalService.getPublishedFestivals();
      set({ festivals, filteredFestivals: festivals, isLoading: false });
      return festivals;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  fetchFestivalById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const festival = await festivalService.getFestivalById(id);
      set({ festival, isLoading: false });
      return festival;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  applyFilters: ({ query = '', genre = '', city = '', sort = 'newest', priceRange = null }) => {
    const { festivals } = get();
    let results = [...festivals];

    const q = String(query).trim().toLowerCase();
    if (q) {
      results = results.filter((f) =>
        [f.title, f.artist, f.venue, f.city].some((field) =>
          String(field || '').toLowerCase().includes(q)
        )
      );
    }
    if (genre) {
      results = results.filter((f) => f.genre === genre);
    }
    if (city) {
      results = results.filter((f) => f.city.toLowerCase() === city.toLowerCase());
    }
    if (priceRange) {
      results = results.filter(
        (f) => f.priceStart >= priceRange.min && f.priceStart <= priceRange.max
      );
    }

    switch (sort) {
      case 'cheapest':
        results.sort((a, b) => a.priceStart - b.priceStart);
        break;
      case 'expensive':
        results.sort((a, b) => b.priceStart - a.priceStart);
        break;
      case 'popular':
        results.sort((a, b) => b.views - a.views);
        break;
      case 'nearest':
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    set({ filteredFestivals: results });
    return results;
  },
}));

export default useFestivalStore;