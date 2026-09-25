import { storageDB, persistFestivals, getStorageSnapshot } from './storageService';
import { FESTIVAL_STATUS } from '@/lib/constants';

const LATENCY = 350;

function wait(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFestivals() {
  return getStorageSnapshot().festivals;
}

function getFestivalById(id) {
  return getFestivals().find((f) => f.id === id) || null;
}

function toFestivalCard(festival) {
  const activeTypes = (festival.ticketTypes || []).filter(
    (t) => t.sold < t.quota
  );
  const cheapest = activeTypes.length
    ? Math.min(...activeTypes.map((t) => t.price))
    : festival.priceStart;
  return {
    ...festival,
    priceStart: cheapest,
    availableTickets: activeTypes.length,
  };
}

export class FestivalService {
  async getPublishedFestivals() {
    await wait();
    return getFestivals()
      .filter((f) => f.status === FESTIVAL_STATUS.PUBLISHED)
      .map(toFestivalCard);
  }

  async getAllFestivals() {
    await wait();
    return getFestivals();
  }

  async getCreatedFestivals() {
    await wait();
    return getFestivals().filter((f) => f.organizerId);
  }

  async getFestivalById(id) {
    await wait(250);
    return getFestivalById(id);
  }

  async searchFestivals({ query = '', genre = '', city = '', sort = 'newest' } = {}) {
    await wait(300);
    let results = getFestivals().filter(
      (f) => f.status === FESTIVAL_STATUS.PUBLISHED
    );

    const q = String(query || '').trim().toLowerCase();
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
      results = results.filter(
        (f) => f.city.toLowerCase() === city.toLowerCase()
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

    return results.map(toFestivalCard);
  }

  async createFestival(payload) {
    await wait();
    const festivals = getFestivals();
    const newFestival = {
      ...payload,
      id: `f${Date.now()}`,
      status: FESTIVAL_STATUS.PENDING_APPROVAL,
      ticketStatus: 'available',
      featured: false,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    storageDB.festivals = [...festivals, newFestival];
    persistFestivals(storageDB.festivals);
    return newFestival;
  }

  async updateFestival(id, updates) {
    await wait();
    const festivals = getFestivals();
    const index = festivals.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Festival tidak ditemukan');
    const updated = { ...festivals[index], ...updates };
    festivals[index] = updated;
    storageDB.festivals = [...festivals];
    persistFestivals(storageDB.festivals);
    return updated;
  }

  async deleteFestival(id) {
    await wait();
    storageDB.festivals = getFestivals().filter((f) => f.id !== id);
    persistFestivals(storageDB.festivals);
    return true;
  }

  async approveFestival(id) {
    return this.updateFestival(id, {
      status: FESTIVAL_STATUS.PUBLISHED,
      approvedAt: new Date().toISOString(),
    });
  }

  async rejectFestival(id) {
    return this.updateFestival(id, {
      status: FESTIVAL_STATUS.REJECTED,
      rejectedAt: new Date().toISOString(),
    });
  }

  getFestivalStats(id) {
    const festival = getFestivalById(id);
    if (!festival) return null;
    const totalSold = (festival.ticketTypes || []).reduce(
      (sum, t) => sum + t.sold,
      0
    );
    const totalQuota = (festival.ticketTypes || []).reduce(
      (sum, t) => sum + t.quota,
      0
    );
    return {
      totalSold,
      totalQuota,
      soldPercentage: totalQuota ? Math.round((totalSold / totalQuota) * 100) : 0,
    };
  }
}

export const festivalService = new FestivalService();
export default festivalService;