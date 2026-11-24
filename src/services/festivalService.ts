import { storageDB, persistFestivals, getStorageSnapshot } from './storageService';
import { FESTIVAL_STATUS } from '@/lib/constants';
import { apiFetch } from '@/lib/api';

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

export function transformBackendEventToFestival(event) {
  if (!event) return null;
  const rawTickets = event.ticketTypes || [];
  const ticketTypes = rawTickets.map((t) => ({
    id: String(t.id != null ? t.id : t.public_id),
    name: t.name,
    price: t.price != null ? Number(t.price) : 0,
    quota: t.quota != null ? Number(t.quota) : 0,
    sold: t.sold != null ? Number(t.sold) : 0,
    status: t.status,
  }));
  const activeTickets = ticketTypes.filter((t) => t.sold < t.quota);
  const priceStart = activeTickets.length > 0
    ? Math.min(...activeTickets.map((t) => t.price))
    : (ticketTypes.length > 0 ? Math.min(...ticketTypes.map((t) => t.price)) : 0);

  const venue = event.venue;
  const city = venue?.city;
  const province = city?.province;

  return {
    id: String(event.id != null ? event.id : event.public_id),
    public_id: event.public_id,
    title: event.title,
    slug: event.slug,
    artist: event.summary || event.title,
    lineup: [event.title],
    genre: event.category?.name || 'Festival',
    date: event.start_at,
    endDate: event.end_at,
    venue: venue ? venue.name : 'Venue',
    city: city ? city.name : 'Jakarta',
    province: province ? province.name : '',
    priceStart,
    image: event.banner || event.thumbnail || event.poster || 'https://dynamicmedia.livenationinternational.com/e/m/k/4f5826ee-8f2d-4d6c-b64f-3c642549e385.png',
    status: event.status === 'published' ? FESTIVAL_STATUS.PUBLISHED : event.status,
    ticketStatus: activeTickets.length > 0 ? 'available' : 'sold_out',
    featured: Boolean(event.is_featured),
    organizerId: event.organizer_id ? String(event.organizer_id) : undefined,
    description: event.description || event.summary || '',
    ticketTypes,
    views: 0,
  };
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
  async getPublishedFestivals(options: Record<string, any> = {}) {
    if (options.useApi) {
      try {
        const res = await apiFetch('/api/v1/events');
        const items = res?.data || (Array.isArray(res) ? res : []);
        return items.map(transformBackendEventToFestival).map(toFestivalCard);
      } catch {
        return [];
      }
    }
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

  async getFestivalById(id, options: Record<string, any> = {}) {
    if (options.useApi && /^\d+$/.test(String(id))) {
      try {
        const data = await apiFetch(`/api/v1/events/${id}`);
        if (data) {
          return transformBackendEventToFestival(data);
        }
      } catch {
        // Fallback
      }
    }
    await wait(250);
    return getFestivalById(id);
  }

  async fetchApiEvents(filters: Record<string, any> = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiFetch(`/api/v1/events${qs}`);
    return res;
  }

  async fetchApiEventById(id) {
    return apiFetch(`/api/v1/events/${id}`);
  }

  async createApiEvent(payload) {
    return apiFetch('/api/v1/organizer/event', {
      method: 'POST',
      body: payload,
    });
  }

  async approveApiEvent(id) {
    return apiFetch(`/api/v1/admin/event/${id}/approve`, {
      method: 'PUT',
    });
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
        results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default:
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return results.map(toFestivalCard);
  }

  async createFestival(payload) {
    await wait();
    const festivals = getFestivals();
    const newFestival = {
      ...payload,
      id: `f${Date.now()}`,
      status: FESTIVAL_STATUS.PENDING_REVIEW,
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