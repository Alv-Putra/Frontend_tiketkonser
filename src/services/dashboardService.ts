import { ApiError, apiFetch } from '@/lib/api';
import type {
  AdminDashboardData,
  CityOption,
  DashboardChartData,
  DashboardChartInterval,
  EventDocument,
  EventCategoryOption,
  EventDocumentType,
  OrganizerChartData,
  OrganizerDashboardEvents,
  OrganizerDashboardSales,
  OrganizerProfile,
  OrganizerEventDetail,
  OrganizerTicket,
  SeatMap,
  SeatMapPayload,
  TicketCheckIn,
  WorkspaceNotification,
  WorkspaceNotificationList,
  WorkspaceNotificationPage,
} from '@/types/dashboard';

export function fetchAdminDashboard(): Promise<AdminDashboardData> {
  return apiFetch('/api/v1/admin/dashboard');
}

export function fetchOrganizerDashboardEvents(page: number): Promise<OrganizerDashboardEvents> {
  return apiFetch(`/api/v1/organizer/event?page=${page}`);
}

export function fetchOrganizerDashboardSales(eventId: string): Promise<OrganizerDashboardSales> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/sales`);
}

export function fetchWorkspaceNotifications(): Promise<WorkspaceNotificationList> {
  return apiFetch('/api/v1/notifications?limit=5');
}

export function fetchNotifications(page: number): Promise<WorkspaceNotificationPage> {
  return apiFetch(`/api/v1/notifications?page=${page}&limit=10`);
}

export function markNotificationRead(id: string): Promise<WorkspaceNotification> {
  return apiFetch(`/api/v1/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
}

export function fetchOrganizerSeatMap(eventId: string): Promise<SeatMap> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/seat-map`);
}

/** Denah organizer, atau null bila belum dibuat (404). */
export function findOrganizerSeatMap(eventId: string): Promise<SeatMap | null> {
  return fetchOrganizerSeatMap(eventId).catch((error) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  });
}

export function saveOrganizerSeatMap(eventId: string, map: SeatMapPayload): Promise<SeatMap> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/seat-map`, { method: 'PUT', body: map });
}

/** Denah publik event; viewport opsional agar server hanya mengirim kursi yang terlihat. */
export function fetchPublicSeatMap(eventId: string, viewport?: { x: number; y: number; width: number; height: number }): Promise<SeatMap> {
  const query = viewport ? `?${new URLSearchParams(Object.entries(viewport).map(([key, value]) => [key, String(Math.round(value))]))}` : '';
  return apiFetch(`/api/v1/events/${encodeURIComponent(eventId)}/seat-map${query}`, { auth: false });
}

export function checkInTicket(eventId: string, qrToken: string): Promise<TicketCheckIn> {
  return apiFetch('/api/v1/check-in', {
    method: 'POST',
    body: { event_id: eventId, qr_token: qrToken },
  });
}

export interface DashboardChartQuery {
  interval?: DashboardChartInterval;
  start_date?: string;
  end_date?: string;
}

type OrganizerChartQuery = DashboardChartQuery & { event_id?: string };

function fetchDashboardCharts(role: 'admin' | 'organizer', params?: OrganizerChartQuery) {
  const q = new URLSearchParams();
  if (params?.event_id) q.set('event_id', params.event_id);
  if (params?.interval) q.set('interval', params.interval);
  if (params?.start_date) q.set('start_date', params.start_date);
  if (params?.end_date) q.set('end_date', params.end_date);
  const qs = q.toString();
  return apiFetch(`/api/v1/${role}/dashboard/charts${qs ? `?${qs}` : ''}`);
}

export function fetchAdminCharts(params?: DashboardChartQuery): Promise<DashboardChartData> {
  return fetchDashboardCharts('admin', params);
}

export function fetchOrganizerCharts(params?: OrganizerChartQuery): Promise<OrganizerChartData> {
  return fetchDashboardCharts('organizer', params);
}

export function fetchOrganizerEventDetail(eventId: string): Promise<OrganizerEventDetail> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}`);
}

export interface EventVenueInput {
  name: string;
  address?: string;
  city_id: string;
}

export interface EventCreateInput {
  category_id: string;
  venue: EventVenueInput;
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  banner?: string;
  thumbnail?: string;
  poster?: string;
  minimum_age?: number;
  dress_code?: string;
  gate_open_at?: string;
  start_at: string;
  end_at: string;
  sales_start_at?: string;
  sales_end_at?: string;
}

export function createOrganizerEvent(data: EventCreateInput): Promise<OrganizerEventDetail> {
  return apiFetch('/api/v1/organizer/event', { method: 'POST', body: data });
}

export function updateOrganizerEvent(
  eventId: string,
  data: Partial<EventCreateInput>,
): Promise<OrganizerEventDetail> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    body: data,
  });
}

export function deleteOrganizerEvent(eventId: string): Promise<void> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}`, { method: 'DELETE' });
}

export function submitOrganizerEvent(eventId: string): Promise<OrganizerEventDetail> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/submit`, {
    method: 'POST',
  });
}

export function fetchOrganizerTickets(eventId: string): Promise<OrganizerTicket[]> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/tickets`);
}

export interface TicketCreateInput {
  event_id: string;
  name: string;
  description?: string;
  price: number;
  quota: number;
  max_purchase?: number;
  wave?: number;
  sale_start_at?: string;
  sale_end_at?: string;
  status?: 'active' | 'sold_out' | 'inactive';
  color?: string;
}

export function createOrganizerTicket(data: TicketCreateInput): Promise<OrganizerTicket> {
  return apiFetch('/api/v1/organizer/tickets', { method: 'POST', body: data });
}

export function updateOrganizerTicket(
  ticketId: string,
  data: Partial<Omit<TicketCreateInput, 'event_id'>>,
): Promise<OrganizerTicket> {
  return apiFetch(`/api/v1/organizer/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: data,
  });
}

export function deleteOrganizerTicket(ticketId: string): Promise<void> {
  return apiFetch(`/api/v1/organizer/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'DELETE',
  });
}

export function fetchOrganizerEventDocuments(eventId: string): Promise<EventDocument[]> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/documents`);
}

export function uploadOrganizerEventDocument(eventId: string, type: EventDocumentType, file: File): Promise<EventDocument> {
  const body = new FormData();
  body.append('file', file);
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}/documents/${type}`, { method: 'PUT', body });
}

export function fetchOrganizerCategories(): Promise<EventCategoryOption[]> {
  return apiFetch('/api/v1/organizer/categories');
}

export function fetchOrganizerCities(): Promise<CityOption[]> {
  return apiFetch('/api/v1/organizer/cities');
}

export function fetchOrganizerProfile(): Promise<OrganizerProfile> {
  return apiFetch('/api/v1/organizer/profile');
}
