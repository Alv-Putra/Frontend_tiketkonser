import { act } from '@testing-library/react';
import defaultUseMonitoringStore, { useMonitoringStore } from '../monitoringStore';
import monitoringService from '@/services/monitoringService';
import { concertFixtures } from '@/services/__tests__/fixtures/monitoringConcerts';

describe('useMonitoringStore', () => {
  it('exports both default and named useMonitoringStore hooks', () => {
    expect(defaultUseMonitoringStore).toBe(useMonitoringStore);
  });
  beforeEach(() => {
    monitoringService.reset();
    monitoringService.concerts = structuredClone(concertFixtures);
    act(() => {
      useMonitoringStore.getState().refreshMetrics();
      useMonitoringStore.getState().setWorkspace('admin');
      useMonitoringStore.getState().setActiveConcert('c1');
      useMonitoringStore.getState().setSearchQuery('');
    });
  });

  it('initializes with default workspace and data', () => {
    const state = useMonitoringStore.getState();
    expect(state.workspace).toBe('admin');
    expect(state.activeConcertId).toBe('c1');
    expect(state.concerts.length).toBeGreaterThan(0);
    expect(state.artists.length).toBeGreaterThan(0);
    expect(state.adminMetrics).toBeDefined();
    expect(state.organizerMetrics).toBeDefined();
  });

  it('updates workspace and active concert', () => {
    act(() => {
      useMonitoringStore.getState().setWorkspace('organizer');
      useMonitoringStore.getState().setActiveConcert('c2');
      useMonitoringStore.getState().setSearchQuery('test');
    });

    const state = useMonitoringStore.getState();
    expect(state.workspace).toBe('organizer');
    expect(state.activeConcertId).toBe('c2');
    expect(state.searchQuery).toBe('test');
  });

  it('toggles concert sales and updates state', () => {
    const initialSalesOpen = useMonitoringStore.getState().concerts.find((c) => c.id === 'c1').salesOpen;
    act(() => {
      useMonitoringStore.getState().toggleConcertSales('c1');
    });

    const updatedConcert = useMonitoringStore.getState().concerts.find((c) => c.id === 'c1');
    expect(updatedConcert.salesOpen).toBe(!initialSalesOpen);
  });

  it('verifies payment and updates state', () => {
    act(() => {
      useMonitoringStore.getState().verifyPayment('PAY-002', true);
    });

    const pay = useMonitoringStore.getState().payments.find((p) => p.id === 'PAY-002');
    expect(pay.status).toBe('Terverifikasi');
  });

  it('adds concert, artist, and category', () => {
    act(() => {
      useMonitoringStore.getState().addConcert({
        name: 'New Festival',
        artist: 'Band X',
        schedule: '1 Mei 2027',
        location: 'Jakarta',
        quota: 1000
      });
      useMonitoringStore.getState().addArtist({
        name: 'New Artist',
        genre: 'Pop',
        country: 'Indonesia'
      });
      useMonitoringStore.getState().addCategory('c1', {
        name: 'Special Pass',
        price: 999000,
        quota: 50
      });
    });

    const state = useMonitoringStore.getState();
    expect(state.concerts.some((c) => c.name === 'New Festival')).toBe(true);
    expect(state.artists.some((a) => a.name === 'New Artist')).toBe(true);
  });

  it('executes refreshMetrics to refresh all state', () => {
    act(() => {
      useMonitoringStore.getState().refreshMetrics();
    });
    const state = useMonitoringStore.getState();
    expect(state.adminMetrics).toBeDefined();
    expect(state.organizerMetrics).toBeDefined();
  });

  it('calls fetchAdminData, fetchUserData, fetchOrganizerData, approveEvent, and updateUserStatus', async () => {
    jest.spyOn(monitoringService, 'fetchAdminDashboardFromApi').mockResolvedValue(monitoringService.getAdminMetrics());
    jest.spyOn(monitoringService, 'fetchUsersFromApi').mockResolvedValue(monitoringService.getUsers());
    jest.spyOn(monitoringService, 'fetchEventsFromApi').mockResolvedValue(monitoringService.getConcerts());
    jest.spyOn(monitoringService, 'fetchTransactionLogsFromApi').mockResolvedValue({ total: 1, data: [] });
    jest.spyOn(monitoringService, 'fetchOrganizerEventsApi').mockResolvedValue(monitoringService.getConcerts());
    jest.spyOn(monitoringService, 'approveEventApi').mockResolvedValue({ success: true });
    jest.spyOn(monitoringService, 'updateUserStatusApi').mockResolvedValue(true);

    await act(async () => {
      await useMonitoringStore.getState().fetchAdminData();
      await useMonitoringStore.getState().fetchUserData({ search: 'admin' });
      await useMonitoringStore.getState().fetchOrganizerData();
      await useMonitoringStore.getState().approveEvent('1');
      await useMonitoringStore.getState().updateUserStatus('usr1', false);
    });

    const state = useMonitoringStore.getState();
    expect(state.adminMetrics).toBeDefined();
    expect(state.users).toBeDefined();
    expect(state.concerts).toBeDefined();
  });
});
