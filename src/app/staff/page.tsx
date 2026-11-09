'use client';

import React, { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle,
  Clock,
  Play,
  Check,
  X,
  AlertCircle,
  Gift,
  Search,
  Bell,
  RefreshCw
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { Order, OrderStatus } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function StaffKitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'>('ALL');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickMessage, setQuickMessage] = useState('');

  const loadOrders = () => {
    setOrders(BrewStorage.getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleStorageUpdate = () => loadOrders();
    window.addEventListener('brewloop_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('brewloop_storage_update', handleStorageUpdate);
  }, []);

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = BrewStorage.updateOrderStatus(orderId, nextStatus);
    setOrders(updated);
  };

  const handleQuickStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone) return;
    BrewStorage.awardStamp(quickPhone);
    setQuickMessage(`+1 Stamp successfully awarded to ${quickPhone}!`);
    setTimeout(() => setQuickMessage(''), 3000);
    setQuickPhone('');
  };

  const filteredOrders = activeTab === 'ALL'
    ? orders
    : orders.filter(o => o.status === activeTab);

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const preparingCount = orders.filter(o => o.status === 'PREPARING').length;
  const readyCount = orders.filter(o => o.status === 'READY').length;

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2B1E16]">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-[#D5C9BD] bg-[#493326] px-6 py-3.5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#362419]">
              <Coffee className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold">Barista & Kitchen Display</h1>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#EADBCE]">The Roasted Bean Cafe • Bandra West</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadOrders}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <Link
              href="/dashboard"
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Owner Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Quick Barista Loyalty Stamp Tool */}
        <div className="mb-6 rounded-2xl border border-[#D5C9BD] bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#D97706]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#493326]">
                  Counter Fast-Stamp Tool
                </h3>
                <p className="text-xs text-[#6D4C3D]">
                  Award an authorized loyalty stamp for in-person counter coffee purchases.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickStamp} className="flex gap-2">
              <input
                type="tel"
                placeholder="Customer Phone..."
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                className="rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3 py-1.5 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#493326] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#362419]"
              >
                +1 Stamp
              </button>
            </form>
          </div>
          {quickMessage && (
            <p className="mt-2 text-xs font-semibold text-emerald-700">{quickMessage}</p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[#D5C9BD] pb-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'ALL'
                ? 'bg-[#493326] text-white shadow'
                : 'bg-white text-[#6D4C3D] hover:bg-[#EFE8DE]'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-white text-amber-800 hover:bg-[#EFE8DE]'
            }`}
          >
            <span>New Orders</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('PREPARING')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'PREPARING'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-blue-800 hover:bg-[#EFE8DE]'
            }`}
          >
            <span>Preparing</span>
            {preparingCount > 0 && (
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px]">
                {preparingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('READY')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'READY'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-purple-800 hover:bg-[#EFE8DE]'
            }`}
          >
            <span>Ready for Pickup</span>
            {readyCount > 0 && (
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px]">
                {readyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-white text-emerald-800 hover:bg-[#EFE8DE]'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-[#D5C9BD] p-12 text-center">
              <Coffee className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-bold text-[#2B1E16]">No Orders in This Category</h3>
              <p className="mt-1 text-xs text-[#6D4C3D]">
                Orders placed from customer tables will pop up here in real time.
              </p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const isPending = order.status === 'PENDING';
              const isPreparing = order.status === 'PREPARING';
              const isReady = order.status === 'READY';
              const isCompleted = order.status === 'COMPLETED';

              return (
                <div
                  key={order.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#D5C9BD] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    {/* Header: Order Number, Table, Status */}
                    <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
                      <div>
                        <span className="text-xs font-extrabold tracking-wide text-[#493326]">
                          #{order.order_number}
                        </span>
                        <h4 className="text-sm font-bold text-[#2B1E16]">
                          Table {order.table_number}
                        </h4>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isPreparing
                            ? 'bg-blue-100 text-blue-800'
                            : isReady
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Customer & Time */}
                    <div className="mt-3 flex items-center justify-between text-xs text-[#6D4C3D]">
                      <span>{order.customer_name || 'Guest'}</span>
                      <span className="font-mono">{order.customer_phone}</span>
                    </div>

                    {/* Items List */}
                    <div className="my-4 divide-y divide-[#F5EFE5] rounded-2xl bg-[#FBF8F4] p-3 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 first:pt-0 last:pb-0">
                          <div>
                            <span className="font-bold text-[#493326]">{item.quantity}x</span>{' '}
                            <span className="font-medium text-[#2B1E16]">{item.product_name}</span>
                          </div>
                          <span className="font-mono text-[#6D4C3D]">{formatINR(item.total_price)}</span>
                        </div>
                      ))}
                    </div>

                    {order.special_instructions && (
                      <div className="mb-3 rounded-xl bg-amber-50 p-2 text-xs text-amber-800">
                        <span className="font-bold">Note:</span> {order.special_instructions}
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Bill & Payment */}
                    <div className="mb-4 flex items-center justify-between border-t border-[#EFE8DE] pt-3 text-xs">
                      <div>
                        <span className="text-[#6D4C3D]">Total Bill: </span>
                        <span className="font-bold text-[#2B1E16]">{formatINR(order.total)}</span>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          order.payment_status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.payment_status === 'PAID' ? 'PAID' : 'PAY AT COUNTER'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 active:scale-98"
                        >
                          <Play className="h-3.5 w-3.5" /> Start Preparing
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 active:scale-98"
                        >
                          <Check className="h-3.5 w-3.5" /> Mark Ready
                        </button>
                      )}

                      {isReady && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 active:scale-98"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Complete & Award Stamp
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                          title="Cancel Order"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
