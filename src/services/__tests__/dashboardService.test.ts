import { apiFetch } from '@/lib/api';
import { checkInTicket, fetchAdminDashboard, fetchOrganizerDashboardEvents, fetchOrganizerDashboardSales, fetchWorkspaceNotifications } from '../dashboardService';

jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

test('menggunakan endpoint dashboard dan check-in sesuai kontrak backend', async () => {
  const response = { sample: true };
  jest.mocked(apiFetch).mockResolvedValue(response);

  await expect(fetchAdminDashboard()).resolves.toEqual(response);
  await expect(fetchOrganizerDashboardEvents(2)).resolves.toEqual(response);
  await expect(fetchOrganizerDashboardSales('23')).resolves.toEqual(response);
  await expect(checkInTicket('23', 'qr-token')).resolves.toEqual(response);
  await expect(fetchWorkspaceNotifications()).resolves.toEqual(response);
  expect(apiFetch).toHaveBeenNthCalledWith(5, '/api/v1/notifications?limit=5');

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/admin/dashboard');
  expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/v1/organizer/event?page=2');
  expect(apiFetch).toHaveBeenNthCalledWith(3, '/api/v1/organizer/event/23/sales');
  expect(apiFetch).toHaveBeenNthCalledWith(4, '/api/v1/check-in', {
    method: 'POST', body: { event_id: '23', qr_token: 'qr-token' },
  });
});
