// Tipe domain bersama untuk store, service, dan komponen.
// Bentuk data dari backend belum seragam, jadi field opsional diberi `?`
// dan objek mentah dari API memakai `ApiRecord`.

export type ApiRecord = Record<string, any>;

export type Role = 'ADMIN' | 'ORGANIZER' | 'CUSTOMER' | string;

export interface User {
  id?: string | number;
  public_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: Role;
  avatar?: string | null;
  [key: string]: any;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  user?: User;
  order?: Order;
  data?: T;
  [key: string]: any;
}

export interface Festival {
  id: string | number;
  title: string;
  artist?: string;
  venue?: string;
  city?: string;
  genre?: string;
  date?: string;
  priceStart?: number;
  views?: number;
  [key: string]: any;
}

export interface FestivalFilters {
  query?: string;
  genre?: string;
  city?: string;
  sort?: 'newest' | 'cheapest' | 'expensive' | 'popular' | 'nearest' | string;
  priceRange?: { min: number; max: number } | null;
}

export interface CartItem {
  ticketTypeId: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface Voucher {
  code: string;
  [key: string]: any;
}

export interface Order {
  id: string | number;
  status?: string;
  total?: number;
  [key: string]: any;
}

export interface Ticket {
  id: string | number;
  [key: string]: any;
}

export interface Concert {
  id: string;
  name: string;
  artist?: string;
  location?: string;
  schedule?: string;
  sold?: number;
  quota?: number;
  salesOpen?: boolean;
  status?: string;
  categories?: ApiRecord[];
  [key: string]: any;
}

export type Artist = ApiRecord;
export type Payment = ApiRecord;
export type Approval = ApiRecord;
export type MonitoringOrder = ApiRecord;
export type MonitoringUser = ApiRecord;
export type AdminMetrics = ApiRecord | null;
export type OrganizerMetrics = ApiRecord | null;

export type FormErrors = Record<string, string>;
