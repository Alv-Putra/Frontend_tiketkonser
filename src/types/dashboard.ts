export interface AdminDashboardData {
  totals: {
    users: number;
    organizers: number;
    events: number;
    pending_events: number;
    paid_orders: number;
    paid_revenue: number | string;
  };
  recent_orders: {
    id: string;
    order_number: string;
    total: number | string;
    status: string;
    created_at: string;
    user: { email: string };
  }[];
}

export interface OrganizerDashboardEvent {
  id: string;
  title: string;
  start_at: string;
  status: string;
  venue: { name: string } | null;
}

export interface OrganizerDashboardEvents {
  data: OrganizerDashboardEvent[];
  totalPages: number;
}

export interface OrganizerDashboardSales {
  summary: {
    paid_orders: number;
    paid_tickets: number;
    revenue: number;
    quota: number;
    sold: number;
  };
  ticket_types: {
    id: string;
    name: string;
    quota: number;
    available: number;
    paid_tickets: number;
    revenue: number;
  }[];
}

export interface WorkspaceNotificationList {
  data: { id: string; title: string; message: string | null }[];
}

export interface TicketCheckIn {
  ticket_code: string;
  ticket_type: string;
  checked_in_at: string;
}
