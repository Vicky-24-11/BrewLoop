// BrewLoop TypeScript Domain Types

export type Role = 'SUPER_ADMIN' | 'CAFE_OWNER' | 'CAFE_MANAGER' | 'CAFE_STAFF' | 'CUSTOMER';

export interface Cafe {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  brand_color: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  google_review_url?: string;
  currency: string;
  tax_percentage: number;
  is_active: boolean;
  created_at: string;
}

export interface TableItem {
  id: string;
  cafe_id: string;
  table_number: string;
  capacity: number;
  qr_code_url?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  cafe_id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  cafe_id: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_veg: boolean;
  loyalty_stamps_reward: number;
  preparation_time_minutes: number;
}

export type CustomerStatus = 'NEW' | 'REGULAR' | 'VIP' | 'INACTIVE' | 'LOST';

export interface Customer {
  id: string;
  cafe_id: string;
  full_name: string;
  phone: string;
  email?: string;
  first_visit: string;
  last_visit: string;
  total_visits: number;
  total_spent: number;
  stamps_balance: number;
  marketing_consent: boolean;
  marketing_consent_at?: string;
  status: CustomerStatus;
  notes?: string;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface Order {
  id: string;
  cafe_id: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  table_number: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: 'COUNTER_PAY' | 'UPI_COUNTER' | 'CASH';
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  special_instructions?: string;
  items: OrderItem[];
  created_at: string;
}

export interface LoyaltyProgram {
  id: string;
  cafe_id: string;
  name: string;
  stamps_required: number;
  reward_description: string;
  min_spend_per_stamp: number;
  reward_expiry_days: number;
  is_active: boolean;
}

export interface Reward {
  id: string;
  cafe_id: string;
  name: string;
  description: string;
  stamps_cost: number;
  is_active: boolean;
}

export interface RewardRedemption {
  id: string;
  cafe_id: string;
  reward_name: string;
  customer_phone: string;
  redemption_code: string;
  status: 'UNUSED' | 'REDEEMED' | 'EXPIRED';
  expires_at: string;
}

export interface Campaign {
  id: string;
  cafe_id: string;
  name: string;
  template_name: string;
  target_segment: 'ALL' | 'INACTIVE_21_DAYS' | 'LOST_45_DAYS' | 'VIP';
  offer_text: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED';
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  created_at: string;
}
