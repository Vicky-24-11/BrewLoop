'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Repeat,
  AlertTriangle,
  ArrowRight,
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { formatINR, formatDate } from '@/lib/utils';
import { Order, Customer } from '@/types';

// Mock 7-day revenue trend for chart representation
const REVENUE_DATA = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5100 },
  { day: 'Wed', revenue: 4800 },
  { day: 'Thu', revenue: 6400 },
  { day: 'Fri', revenue: 8900 },
  { day: 'Sat', revenue: 11200 },
  { day: 'Sun', revenue: 9800 },
];

export default function DashboardOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setOrders(BrewStorage.getOrders());
    setCustomers(BrewStorage.getCustomers());
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'PAID' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalCustomersCount = customers.length;
  
  // Calculate repeat customer percentage
  const repeatCustomers = customers.filter(c => c.total_visits > 1).length;
  const repeatRate = totalCustomersCount > 0 ? Math.round((repeatCustomers / totalCustomersCount) * 100) : 0;

  // Inactive customers (> 21 days)
  const inactiveCustomers = customers.filter(c => c.status === 'INACTIVE' || c.status === 'LOST');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">Cafe Performance Overview</h1>
          <p className="text-xs text-[#6D4C3D]">
            Real-time analytics for The Roasted Bean Cafe • Bandra West
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/marketing"
            className="flex items-center gap-2 rounded-xl bg-[#493326] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#362419]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Automate Retention</span>
          </Link>
        </div>
      </div>

      {/* Retention Callout Alert: 21-Day Inactive Customers */}
      {inactiveCustomers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-300 bg-amber-50/80 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-200 text-amber-900">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                {inactiveCustomers.length} Customer{inactiveCustomers.length > 1 ? 's' : ''} Haven't Visited in 21+ Days
              </h3>
              <p className="text-xs text-amber-800">
                They are at risk of churning. Send a targeted WhatsApp comeback offer (e.g. Free Cookie) to bring them back.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/marketing"
            className="flex items-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-900 active:scale-98"
          >
            <span>Launch Comeback Campaign</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D58]">Today's Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#2B1E16]">{formatINR(totalRevenue || 1323)}</p>
          <p className="mt-1 text-[11px] font-semibold text-emerald-700">
            +18% from last Monday
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D58]">Today's Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#2B1E16]">{totalOrders}</p>
          <p className="mt-1 text-[11px] text-[#6D4C3D]">
            Average ticket: {formatINR(Math.round(totalRevenue / (totalOrders || 1)))}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D58]">Cafe Customer Base</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#2B1E16]">{totalCustomersCount}</p>
          <p className="mt-1 text-[11px] text-blue-700">
            {customers.filter(c => c.marketing_consent).length} opted in to WhatsApp
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D58]">Repeat Customer Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Repeat className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#2B1E16]">{repeatRate}%</p>
          <p className="mt-1 text-[11px] text-purple-700">
            Industry average for cafes: ~24%
          </p>
        </div>
      </div>

      {/* Middle Section: Revenue Chart & Customer Segments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Bars */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2B1E16]">Weekly Revenue Trend</h3>
              <p className="text-xs text-[#8C6D58]">Total sales across all tables and takeaway</p>
            </div>
            <span className="rounded-full bg-[#F5EFE5] px-3 py-1 text-xs font-bold text-[#493326]">
              Last 7 Days
            </span>
          </div>

          <div className="mt-6 flex h-48 items-end justify-between gap-3 px-2">
            {REVENUE_DATA.map((item) => {
              const max = 12000;
              const heightPct = Math.round((item.revenue / max) * 100);
              return (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-[#8C6D58]">{formatINR(item.revenue)}</span>
                  <div className="w-full rounded-t-xl bg-[#F5EFE5] transition-all hover:bg-[#493326] relative group h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-xl bg-[#493326] transition-all group-hover:bg-[#D97706]"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#6D4C3D]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Segmentation Box */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#2B1E16]">Customer Health Segments</h3>
          <p className="text-xs text-[#8C6D58]">Retention pipeline based on visit recency</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#FBF8F4] p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                <span className="font-semibold text-[#2B1E16]">VIP (6+ visits)</span>
              </div>
              <span className="font-bold text-[#493326]">
                {customers.filter(c => c.status === 'VIP').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#FBF8F4] p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-[#2B1E16]">Regular (3-5 visits)</span>
              </div>
              <span className="font-bold text-[#493326]">
                {customers.filter(c => c.status === 'REGULAR').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#FBF8F4] p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-[#2B1E16]">New (1 visit)</span>
              </div>
              <span className="font-bold text-[#493326]">
                {customers.filter(c => c.status === 'NEW').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                <span className="font-semibold">Inactive (21d+ no visit)</span>
              </div>
              <span className="font-bold">
                {customers.filter(c => c.status === 'INACTIVE').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-red-50 p-3 text-xs text-red-900">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="font-semibold">Lost (45d+ no visit)</span>
              </div>
              <span className="font-bold">
                {customers.filter(c => c.status === 'LOST').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2B1E16]">Recent Table & Barista Orders</h3>
            <p className="text-xs text-[#8C6D58]">Latest orders placed across all tables</p>
          </div>
          <Link
            href="/staff"
            className="text-xs font-bold text-[#493326] hover:underline"
          >
            Open Barista KDS Screen →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[#EFE8DE] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#8C6D58]">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Table</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE5]">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-[#FBF8F4]">
                  <td className="py-3 font-bold text-[#493326]">#{o.order_number}</td>
                  <td className="py-3 font-semibold">Table {o.table_number}</td>
                  <td className="py-3">
                    <p className="font-medium text-[#2B1E16]">{o.customer_name || 'Guest'}</p>
                    <p className="font-mono text-[10px] text-gray-400">{o.customer_phone}</p>
                  </td>
                  <td className="py-3 text-[#6D4C3D]">
                    {o.items.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                  </td>
                  <td className="py-3 font-bold text-[#2B1E16]">{formatINR(o.total)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'PREPARING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
