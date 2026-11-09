'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  LayoutDashboard,
  Users,
  MessageSquare,
  QrCode,
  UtensilsCrossed,
  Gift,
  ChefHat,
  ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Customer CRM', href: '/dashboard/customers', icon: Users },
  { label: 'WhatsApp Marketing', href: '/dashboard/marketing', icon: MessageSquare },
  { label: 'Tables & QR Codes', href: '/dashboard/tables', icon: QrCode },
  { label: 'Loyalty Pass Rules', href: '/dashboard/loyalty', icon: Gift },
  { label: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FBF8F4] text-[#2B1E16]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col justify-between border-r border-[#EFE8DE] bg-white p-5 md:flex">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#493326] text-white shadow-sm">
              <Coffee className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#493326]">BrewLoop</span>
              <p className="text-[11px] font-semibold text-[#8C6D58]">Cafe Retention OS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#493326] text-white shadow-xs'
                      : 'text-[#6D4C3D] hover:bg-[#F5EFE5] hover:text-[#2B1E16]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-300' : 'text-[#8C6D58]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#EFE8DE]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8C6D58]">
              Live Operations
            </p>
            <div className="mt-2 space-y-1">
              <Link
                href="/staff"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[#493326] hover:bg-[#F5EFE5]"
              >
                <ChefHat className="h-4 w-4 text-[#D97706]" />
                <span>Barista Kitchen Display</span>
              </Link>
              <Link
                href="/cafe/roasted-bean"
                target="_blank"
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#493326] hover:bg-[#F5EFE5]"
              >
                <div className="flex items-center gap-3">
                  <Coffee className="h-4 w-4 text-emerald-600" />
                  <span>Live Customer Menu</span>
                </div>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Current Tenant / Cafe Card */}
        <div className="rounded-2xl border border-[#EADBCE] bg-[#FBF8F4] p-3 text-xs">
          <p className="font-bold text-[#2B1E16]">The Roasted Bean</p>
          <p className="text-[11px] text-[#6D4C3D]">Bandra West, Mumbai</p>
          <div className="mt-2 flex items-center justify-between border-t border-[#EADBCE] pt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Pro Active
            </span>
            <span className="text-[10px] text-gray-500">₹999/mo</span>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-[#EFE8DE] bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#493326] text-white">
              <Coffee className="h-4 w-4 text-amber-200" />
            </div>
            <span className="text-sm font-bold text-[#493326]">BrewLoop</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/staff"
              className="rounded-lg bg-[#493326] px-3 py-1.5 text-xs font-bold text-white"
            >
              Barista
            </Link>
            <Link
              href="/cafe/roasted-bean"
              className="rounded-lg border border-[#D5C9BD] px-3 py-1.5 text-xs font-bold text-[#493326]"
            >
              Menu
            </Link>
          </div>
        </div>

        {/* Mobile Submenu Pills */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[#EFE8DE] bg-[#FBF8F4] px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                pathname === item.href
                  ? 'bg-[#493326] text-white'
                  : 'bg-white text-[#6D4C3D] border border-[#EFE8DE]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
