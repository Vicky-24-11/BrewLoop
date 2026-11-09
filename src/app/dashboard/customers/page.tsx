'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Coffee
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { Customer, CustomerStatus } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CustomersCRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    setCustomers(BrewStorage.getCustomers());
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Full Name', 'Phone', 'Email', 'Visits', 'Total Spent', 'Stamps', 'Status', 'WhatsApp Consent', 'Last Visit'];
    const rows = filteredCustomers.map(c => [
      `"${c.full_name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      c.total_visits,
      c.total_spent,
      c.stamps_balance,
      c.status,
      c.marketing_consent ? 'YES' : 'NO',
      `"${c.last_visit}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brewloop_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">Customer CRM & Retention</h1>
          <p className="text-xs text-[#6D4C3D]">
            Manage your cafe's proprietary customer contact list and visit history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-[#D5C9BD] bg-white px-4 py-2 text-xs font-bold text-[#493326] shadow-xs hover:bg-[#F5EFE5]"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/dashboard/marketing"
            className="flex items-center gap-2 rounded-xl bg-[#493326] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#362419]"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Engage Inactive Guests</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EFE8DE] bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8C6D58]" />
          <input
            type="text"
            placeholder="Search by customer name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] pl-10 pr-4 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'VIP', 'REGULAR', 'NEW', 'INACTIVE', 'LOST'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === status
                  ? 'bg-[#493326] text-white shadow-xs'
                  : 'bg-[#F5EFE5] text-[#6D4C3D] hover:bg-[#EADBCE]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE8DE] text-[#8C6D58]">
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Total Visits</th>
                <th className="pb-3 font-semibold">Total Spent</th>
                <th className="pb-3 font-semibold">Stamps</th>
                <th className="pb-3 font-semibold">WhatsApp Consent</th>
                <th className="pb-3 font-semibold">Last Visit</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE5]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#8C6D58]">
                    No customers found matching filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isInactive = c.status === 'INACTIVE' || c.status === 'LOST';
                  return (
                    <tr key={c.id} className="hover:bg-[#FBF8F4]">
                      <td className="py-3">
                        <div className="font-bold text-[#2B1E16]">{c.full_name}</div>
                        <div className="font-mono text-[11px] text-[#8C6D58]">{c.phone}</div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            c.status === 'VIP'
                              ? 'bg-purple-100 text-purple-800'
                              : c.status === 'REGULAR'
                              ? 'bg-blue-100 text-blue-800'
                              : c.status === 'NEW'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'INACTIVE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-[#2B1E16]">{c.total_visits} orders</td>
                      <td className="py-3 font-bold text-[#493326]">{formatINR(c.total_spent)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 font-semibold text-[#2B1E16]">
                          <Coffee className="h-3.5 w-3.5 text-[#D97706]" />
                          <span>{c.stamps_balance} / 5</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {c.marketing_consent ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Opted In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <XCircle className="h-3.5 w-3.5" /> No Consent
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-[#6D4C3D]">{formatDate(c.last_visit)}</td>
                      <td className="py-3 text-right">
                        {isInactive && c.marketing_consent ? (
                          <Link
                            href={`/dashboard/marketing?target=${c.id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700"
                          >
                            <span>Win-Back</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/cafe/roasted-bean/loyalty?phone=${encodeURIComponent(c.phone)}`}
                            className="text-[11px] font-semibold text-[#493326] hover:underline"
                          >
                            Pass
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
