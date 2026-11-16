import { create } from 'zustand';
import monitoringService from '@/services/monitoringService';

export const useMonitoringStore = create((set, get) => ({
  workspace: 'admin',
  activeConcertId: 'c1',
  searchQuery: '',
  concerts: monitoringService.getConcerts(),
  artists: monitoringService.getArtists(),
  orders: monitoringService.getOrders(),
  payments: monitoringService.getPayments(),
  users: monitoringService.getUsers(),
  approvals: monitoringService.getApprovals(),
  adminMetrics: monitoringService.getAdminMetrics(),
  organizerMetrics: monitoringService.getOrganizerMetrics('c1'),

  setWorkspace: (workspace) => {
    set({ workspace });
  },

  setActiveConcert: (activeConcertId) => {
    set({
      activeConcertId,
      organizerMetrics: monitoringService.getOrganizerMetrics(activeConcertId)
    });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
  },

  toggleConcertSales: (concertId) => {
    monitoringService.toggleConcertSales(concertId);
    set({
      concerts: monitoringService.getConcerts(),
      adminMetrics: monitoringService.getAdminMetrics(),
      organizerMetrics: monitoringService.getOrganizerMetrics(get().activeConcertId)
    });
  },

  verifyPayment: (paymentId, isApproved) => {
    monitoringService.verifyPayment(paymentId, isApproved);
    set({
      payments: monitoringService.getPayments(),
      orders: monitoringService.getOrders(),
      adminMetrics: monitoringService.getAdminMetrics()
    });
  },

  addConcert: (concertData) => {
    monitoringService.addConcert(concertData);
    set({
      concerts: monitoringService.getConcerts(),
      adminMetrics: monitoringService.getAdminMetrics()
    });
  },

  addArtist: (artistData) => {
    monitoringService.addArtist(artistData);
    set({
      artists: monitoringService.getArtists()
    });
  },

  addCategory: (concertId, categoryData) => {
    monitoringService.addCategory(concertId, categoryData);
    set({
      concerts: monitoringService.getConcerts(),
      organizerMetrics: monitoringService.getOrganizerMetrics(get().activeConcertId)
    });
  },

  refreshMetrics: () => {
    set({
      concerts: monitoringService.getConcerts(),
      artists: monitoringService.getArtists(),
      orders: monitoringService.getOrders(),
      payments: monitoringService.getPayments(),
      users: monitoringService.getUsers(),
      approvals: monitoringService.getApprovals(),
      adminMetrics: monitoringService.getAdminMetrics(),
      organizerMetrics: monitoringService.getOrganizerMetrics(get().activeConcertId)
    });
  },

  fetchAdminData: async () => {
    await Promise.all([
      monitoringService.fetchAdminDashboardFromApi(),
      monitoringService.fetchUsersFromApi(),
      monitoringService.fetchEventsFromApi(),
      monitoringService.fetchTransactionLogsFromApi(),
    ]);
    set({
      adminMetrics: monitoringService.getAdminMetrics(),
      users: monitoringService.getUsers(),
      orders: monitoringService.getOrders(),
      payments: monitoringService.getPayments(),
      concerts: monitoringService.getConcerts(),
      approvals: monitoringService.getApprovals(),
    });
  },

  fetchUserData: async (filters) => {
    await monitoringService.fetchUsersFromApi(filters);
    set({
      users: monitoringService.getUsers(),
    });
  },

  fetchOrganizerData: async () => {
    await monitoringService.fetchOrganizerEventsApi();
    const activeId = get().activeConcertId;
    set({
      concerts: monitoringService.getConcerts(),
      organizerMetrics: monitoringService.getOrganizerMetrics(activeId),
    });
  },

  approveEvent: async (eventId) => {
    await monitoringService.approveEventApi(eventId);
    set({
      approvals: monitoringService.getApprovals(),
      adminMetrics: monitoringService.getAdminMetrics(),
    });
  },

  updateUserStatus: async (userId, isActive) => {
    await monitoringService.updateUserStatusApi(userId, isActive);
    set({
      users: monitoringService.getUsers(),
    });
  }
}));

export default useMonitoringStore;
