import { apiFetch } from '@/lib/api';
import type {
  AdminDashboardData,
  OrganizerChartData,
  OrganizerDashboardEvents,
  OrganizerDashboardSales,
  OrganizerEventDetail,
  OrganizerTicket,
  TicketCheckIn,
  WorkspaceNotificationList,
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

export function checkInTicket(eventId: string, qrToken: string): Promise<TicketCheckIn> {
  return apiFetch('/api/v1/check-in', {
    method: 'POST',
    body: { event_id: eventId, qr_token: qrToken },
  });
}

export function fetchOrganizerCharts(params?: {
  event_id?: string;
  interval?: 'day' | 'week' | 'month';
  start_date?: string;
  end_date?: string;
}): Promise<OrganizerChartData> {
  const q = new URLSearchParams();
  if (params?.event_id) q.set('event_id', params.event_id);
  if (params?.interval) q.set('interval', params.interval);
  if (params?.start_date) q.set('start_date', params.start_date);
  if (params?.end_date) q.set('end_date', params.end_date);
  const qs = q.toString();
  return apiFetch(`/api/v1/organizer/dashboard/charts${qs ? `?${qs}` : ''}`);
}

export function fetchOrganizerEventDetail(eventId: string): Promise<OrganizerEventDetail> {
  return apiFetch(`/api/v1/organizer/event/${encodeURIComponent(eventId)}`);
}

export interface EventCreateInput {
  category_id: string;
  venue_id: string;
  title: string;
  slug: string;
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
