'use client';

import {
  DEMO_CAFE,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_TABLES,
  DEMO_CUSTOMERS,
  DEMO_ORDERS,
  DEMO_LOYALTY_PROGRAM,
  DEMO_CAMPAIGNS,
} from './demo-data';
import { Customer, Order, OrderStatus, Product, Campaign } from '@/types';

const STORAGE_KEYS = {
  ORDERS: 'brewloop_orders',
  CUSTOMERS: 'brewloop_customers',
  PRODUCTS: 'brewloop_products',
  CAMPAIGNS: 'brewloop_campaigns',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('brewloop_storage_update'));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const BrewStorage = {
  getCafe: () => DEMO_CAFE,
  getCategories: () => DEMO_CATEGORIES,
  getTables: () => DEMO_TABLES,
  getLoyaltyProgram: () => DEMO_LOYALTY_PROGRAM,

  getProducts: (): Product[] => {
    return getFromStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
  },

  getOrders: (): Order[] => {
    return getFromStorage(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  },

  getCustomers: (): Customer[] => {
    return getFromStorage(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
  },

  getCampaigns: (): Campaign[] => {
    return getFromStorage(STORAGE_KEYS.CAMPAIGNS, DEMO_CAMPAIGNS);
  },

  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status'>): Order => {
    const orders = BrewStorage.getOrders();
    const orderNumber = `BL-${100 + orders.length + 1}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);

    // Update or link customer
    if (orderData.customer_phone) {
      BrewStorage.recordCustomerVisit(
        orderData.customer_phone,
        orderData.customer_name || 'Guest',
        orderData.total
      );
    }

    return newOrder;
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): Order[] => {
    const orders = BrewStorage.getOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        // If transitioning to completed, award stamp
        if (status === 'COMPLETED' && o.status !== 'COMPLETED' && o.customer_phone) {
          BrewStorage.awardStamp(o.customer_phone);
        }
        return { ...o, status };
      }
      return o;
    });
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
    return updated;
  },

  recordCustomerVisit: (phone: string, name: string, spend: number) => {
    const customers = BrewStorage.getCustomers();
    const existing = customers.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));

    if (existing) {
      existing.total_visits += 1;
      existing.total_spent += spend;
      existing.last_visit = new Date().toISOString();
      if (existing.total_visits >= 6) existing.status = 'VIP';
      else if (existing.total_visits >= 3) existing.status = 'REGULAR';
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        cafe_id: DEMO_CAFE.id,
        full_name: name,
        phone,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        total_visits: 1,
        total_spent: spend,
        stamps_balance: 1,
        marketing_consent: true,
        status: 'NEW',
      };
      customers.push(newCust);
    }
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
  },

  awardStamp: (phone: string) => {
    const customers = BrewStorage.getCustomers();
    const customer = customers.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (customer) {
      customer.stamps_balance += 1;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }
  },

  redeemReward: (phone: string, stampsRequired: number = 5): boolean => {
    const customers = BrewStorage.getCustomers();
    const customer = customers.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (customer && customer.stamps_balance >= stampsRequired) {
      customer.stamps_balance -= stampsRequired;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return true;
    }
    return false;
  },

  createCampaign: (campaign: Omit<Campaign, 'id' | 'created_at' | 'sent_count' | 'delivered_count' | 'read_count'>) => {
    const campaigns = BrewStorage.getCampaigns();
    const newCamp: Campaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      sent_count: campaign.total_recipients,
      delivered_count: Math.floor(campaign.total_recipients * 0.95),
      read_count: Math.floor(campaign.total_recipients * 0.8),
      created_at: new Date().toISOString(),
    };
    campaigns.unshift(newCamp);
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
    return newCamp;
  },
};
