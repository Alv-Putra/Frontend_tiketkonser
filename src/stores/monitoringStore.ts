import { create } from 'zustand';
import monitoringService from '@/services/monitoringService';
import type {
  AdminMetrics,
  Approval,
  ApiRecord,
  Artist,
  Concert,
  MonitoringOrder,
  MonitoringUser,
  OrganizerMetrics,
  Payment,
} from '@/types';

export type Workspace = 'admin' | 'organizer' | string;

export interface MonitoringState {
  workspace: Workspace;
  activeConcertId: string;
  searchQuery: string;
  concerts: Concert[];
  artists: Artist[];
  orders: MonitoringOrder[];
  payments: Payment[];
  users: MonitoringUser[];
  approvals: Approval[];
  adminMetrics: AdminMetrics;
  organizerMetrics: OrganizerMetrics;
  setWorkspace: (workspace: Workspace) => void;
  setActiveConcert: (concertId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleConcertSales: (concertId: string) => void;
  verifyPayment: (paymentId: string, isApproved: boolean) => void;
  addConcert: (concertData: ApiRecord) => void;
  createAndPublishConcert: (concertData: ApiRecord) => Promise<void>;
  addArtist: (artistData: ApiRecord) => Artist;
  addCategory: (concertId: string, categoryData: ApiRecord) => void;
  refreshMetrics: () => void;
  fetchAdminData: () => Promise<void>;
  fetchUserData: (filters?: ApiRecord) => Promise<void>;
  fetchOrganizerData: () => Promise<void>;
  approveEvent: (eventId: string | number) => Promise<void>;
  updateUserStatus: (userId: string | number, isActive: boolean) => Promise<void>;
}

export const useMonitoringStore = create<MonitoringState>()((set, get) => ({
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

  createAndPublishConcert: async (concertData) => {
    await monitoringService.createAndPublishConcertApi(concertData as any);
    set({
      concerts: monitoringService.getConcerts(),
      adminMetrics: monitoringService.getAdminMetrics()
    });
  },

  addArtist: (artistData) => {
    const created = monitoringService.addArtist(artistData);
    set({
      artists: monitoringService.getArtists()
    });
    return created;
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
