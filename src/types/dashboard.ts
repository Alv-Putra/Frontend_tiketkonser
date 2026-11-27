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

export interface DashboardChartSeries {
  key: string;
  name: string;
  unit: 'IDR' | 'count';
  data: number[];
}

export interface DashboardChart {
  type: 'line' | 'bar' | 'donut';
  labels: string[];
  series: DashboardChartSeries[];
}

export interface DashboardChartKpi {
  value: number;
  previous: number;
  change_pct: number | null;
}

export type DashboardChartInterval = 'day' | 'week' | 'month';

export interface DashboardChartData {
  meta: {
    start_date: string;
    end_date: string;
    interval: DashboardChartInterval;
  };
  summary: {
    gross_sales: DashboardChartKpi;
    tickets_sold: DashboardChartKpi;
    paid_orders: DashboardChartKpi;
  };
  charts: {
    sales_trend: DashboardChart;
    order_status: DashboardChart;
    top_events: DashboardChart;
    event_status: DashboardChart;
  };
}

export interface OrganizerChartData extends DashboardChartData {
  meta: DashboardChartData['meta'] & { event_id: string | null };
  charts: DashboardChartData['charts'] & {
    ticket_type_sales: DashboardChart;
    check_in: DashboardChart;
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
  color: string | null;
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
  approved_at: string | null;
  updated_at: string | null;
  category_id: string;
  venue_id: string;
  category: { id: string; name: string; slug: string } | null;
  venue: { id: string; name: string; address: string | null; city_id: string } | null;
  ticketTypes: OrganizerTicket[];
}

export interface WorkspaceNotification {
  id: string;
  title: string;
  message: string | null;
  type: 'order' | 'payment' | 'event' | 'system' | null;
  is_read: boolean;
  created_at: string;
}

export interface WorkspaceNotificationPage {
  data: WorkspaceNotification[];
  total: number;
  unread: number;
  totalPages: number;
}

export type SeatStatus = 'available' | 'held' | 'sold' | 'blocked';

export interface SeatSection {
  id: string;
  label: string;
  ticket_type_id: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  sort_order: number;
}

export interface Seat {
  id: string;
  section_id: string | null;
  ticket_type_id: string | null;
  label: string;
  row_label: string | null;
  seat_number: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
  status: SeatStatus;
}

export type SeatShapeType = 'stage' | 'standing' | 'entrance' | 'exit' | 'booth' | 'toilet' | 'bar' | 'text' | 'rect' | 'circle';

export interface SeatShape {
  id: string;
  type: SeatShapeType;
  label: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string | null;
}

export interface SeatMapTicketType {
  id: string;
  name: string;
  color: string | null;
}

export interface SeatMap {
  id: string;
  event_id?: string;
  width: number;
  height: number;
  version: number;
  sections: SeatSection[];
  seats: Seat[];
  shapes?: SeatShape[];
  event?: { ticketTypes: SeatMapTicketType[] };
}

/** Payload PUT /organizer/event/:id/seat-map; area dikaitkan ke kursi lewat label. */
export interface SeatMapPayload {
  width: number;
  height: number;
  sections: { label: string; ticket_type_id?: string; x: number; y: number; width: number; height: number; sort_order: number }[];
  seats: {
    label: string;
    section_label?: string;
    ticket_type_id?: string;
    row_label?: string;
    seat_number?: number;
    x: number;
    y: number;
    width: number;
    height: number;
    status: 'available' | 'blocked';
  }[];
  shapes: { type: SeatShapeType; label?: string; x: number; y: number; width: number; height: number; rotation: number; color?: string }[];
}

/** Event socket seat:status-changed: hanya kursi yang berubah. */
export interface SeatStatusDelta {
  seat_map_id: string;
  seats: { id: string; status: SeatStatus }[];
}

export type EventDocumentType = 'cooperation_agreement' | 'venue_permit' | 'crowd_permit' | 'artist_confirmation' | 'liability_statement';

export interface EventDocument {
  type: EventDocumentType;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  url: string;
}

export interface EventCategoryOption {
  id: string;
  name: string;
}

export interface CityOption {
  id: string;
  name: string;
  province: { name: string } | null;
}

export interface OrganizerProfile {
  public_id: string;
  company_name: string;
  slug: string;
  logo: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  verified_at: string | null;
  created_at: string;
  account_email: string;
  documents: { type: 'business_entity' | 'nib' | 'npwp' | 'pic_ktp'; uploaded: boolean }[];
}
