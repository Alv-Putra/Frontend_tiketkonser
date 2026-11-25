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

export interface OrganizerChartSeries {
  key: string;
  name: string;
  unit: 'IDR' | 'count';
  data: number[];
}

export interface OrganizerChart {
  type: 'line' | 'bar' | 'donut';
  labels: string[];
  series: OrganizerChartSeries[];
}

export interface OrganizerChartKpi {
  value: number;
  previous: number;
  change_pct: number | null;
}

export interface OrganizerChartData {
  meta: {
    start_date: string;
    end_date: string;
    interval: string;
    event_id: string | null;
  };
  summary: {
    gross_sales: OrganizerChartKpi;
    tickets_sold: OrganizerChartKpi;
    paid_orders: OrganizerChartKpi;
  };
  charts: {
    sales_trend: OrganizerChart;
    order_status: OrganizerChart;
    top_events: OrganizerChart;
    ticket_type_sales: OrganizerChart;
    check_in: OrganizerChart;
    event_status: OrganizerChart;
  };
}

export interface OrganizerTicket {
  id: string;
  public_id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number | string;
  quota: number;
  sold: number;
  max_purchase: number | null;
  wave: number | null;
  sale_start_at: string | null;
  sale_end_at: string | null;
  status: 'active' | 'sold_out' | 'inactive';
}

export interface OrganizerEventDetail {
  id: string;
  public_id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  banner: string | null;
  thumbnail: string | null;
  poster: string | null;
  minimum_age: number | null;
  dress_code: string | null;
  gate_open_at: string | null;
  start_at: string;
  end_at: string;
  sales_start_at: string | null;
  sales_end_at: string | null;
  status: string;
  rejected_reason: string | null;
  category_id: string;
  venue_id: string;
  category: { id: string; name: string; slug: string } | null;
  venue: { id: string; name: string } | null;
  ticketTypes: OrganizerTicket[];
}
