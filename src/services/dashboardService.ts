import { apiFetch } from '@/lib/api';
import type { AdminDashboardData, OrganizerDashboardEvents, OrganizerDashboardSales, TicketCheckIn, WorkspaceNotificationList } from '@/types/dashboard';

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
