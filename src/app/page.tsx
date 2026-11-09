'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  QrCode,
  Smartphone,
  Repeat,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChefHat,
  ExternalLink,
  MessageSquare,
  Gift
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#2B1E16]">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#EFE8DE] bg-[#FBF8F4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#493326] text-white shadow-sm">
              <Coffee className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#493326]">BrewLoop</span>
              <span className="ml-2 rounded-full bg-[#EADBCE] px-2 py-0.5 text-[10px] font-bold text-[#493326]">
                SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/staff"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#6D4C3D] hover:text-[#493326]"
            >
              <ChefHat className="h-4 w-4" /> Barista KDS
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#493326] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#362419]"
            >
              Owner Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D5C9BD] bg-[#F5EFE5] px-3.5 py-1 text-xs font-bold text-[#493326] shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Multi-Tenant Customer Retention Platform for Modern Cafes</span>
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-[#2B1E16] sm:text-6xl sm:leading-[1.15]">
          Turn Every Cafe Visitor Into a{' '}
          <span className="text-[#493326] underline decoration-amber-500 underline-offset-8">
            Returning Customer
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6D4C3D] sm:text-lg">
          No app download required. Diners scan table QR codes, order artisanal coffee, collect digital loyalty stamps, and get automated WhatsApp comeback offers when they haven't visited in 21 days.
        </p>

        {/* Live Interactive CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/cafe/roasted-bean?table=T01"
            className="flex items-center gap-2 rounded-2xl bg-[#493326] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition active:scale-98 hover:bg-[#362419]"
          >
            <QrCode className="h-5 w-5 text-amber-300" />
            <span>Launch Customer QR Menu</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-2xl border border-[#D5C9BD] bg-white px-6 py-3.5 text-sm font-bold text-[#493326] shadow-xs transition hover:bg-[#F5EFE5]"
          >
            <TrendingUp className="h-5 w-5 text-[#D97706]" />
            <span>Open Cafe Analytics & CRM</span>
          </Link>

          <Link
            href="/staff"
            className="flex items-center gap-2 rounded-2xl border border-[#D5C9BD] bg-white px-6 py-3.5 text-sm font-bold text-[#6D4C3D] shadow-xs transition hover:bg-[#F5EFE5]"
          >
            <ChefHat className="h-5 w-5 text-[#8C6D58]" />
            <span>Barista Kitchen Display</span>
          </Link>
        </div>

        {/* Live Badge Proof */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#8C6D58]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Zero App Downloads
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> WhatsApp Cloud API
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Multi-Tenant Supabase
          </span>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-[#EFE8DE] bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#2B1E16] sm:text-3xl">
              Engineered Specifically for Hospitality Retention
            </h2>
            <p className="mt-2 text-xs text-[#6D4C3D]">
              Solving the 70% one-time visitor problem for local cafes and restaurants
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-[#FBF8F4] p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#493326] text-amber-300">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#2B1E16]">Instant QR Menu & Ordering</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6D4C3D]">
                Unique QR codes for every cafe table. Diners browse real-time items, order from mobile web, and consent to WhatsApp retention with zero friction.
              </p>
              <Link
                href="/cafe/roasted-bean?table=T02"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#493326] hover:underline"
              >
                Try Customer Menu →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-[#FBF8F4] p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#2B1E16]">Digital Stamp Cards</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6D4C3D]">
                No physical cards lost in wallets. Completed orders automatically increment virtual coffee stamps and unlock free drinks with barista verification codes.
              </p>
              <Link
                href="/cafe/roasted-bean/loyalty"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline"
              >
                Inspect Pass Screen →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-[#FBF8F4] p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075E54] text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#2B1E16]">WhatsApp Comeback Automation</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6D4C3D]">
                Automatically segments guests who haven't ordered in 21 days. Dispatches targeted comeback offers through official Meta WhatsApp Business Cloud API.
              </p>
              <Link
                href="/dashboard/marketing"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#075E54] hover:underline"
              >
                Simulate Campaign →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Commercial SaaS Pricing
            </span>
            <h2 className="mt-1 text-3xl font-black text-[#2B1E16]">
              Simple Monthly Plans for Cafes in India
            </h2>
            <p className="mt-2 text-xs text-[#6D4C3D]">
              One platform. Strict tenant database isolation. High ROI.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#2B1E16]">Starter</h3>
              <p className="text-xs text-[#8C6D58]">For new kiosk or single-counter cafes</p>
              <div className="my-4">
                <span className="text-3xl font-black text-[#493326]">₹499</span>
                <span className="text-xs text-[#8C6D58]"> /month</span>
              </div>
              <ul className="space-y-2 text-xs text-[#6D4C3D]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Digital Stamp Cards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> QR Menu (Up to 5 Tables)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Customer Contact CRM
                </li>
              </ul>
            </div>

            {/* Growth */}
            <div className="relative rounded-3xl border-2 border-[#493326] bg-white p-6 shadow-md">
              <span className="absolute -top-3 right-6 rounded-full bg-[#493326] px-3 py-0.5 text-[10px] font-bold text-white">
                Most Popular
              </span>
              <h3 className="text-base font-bold text-[#2B1E16]">Growth</h3>
              <p className="text-xs text-[#8C6D58]">For established coffee shops & diners</p>
              <div className="my-4">
                <span className="text-3xl font-black text-[#493326]">₹999</span>
                <span className="text-xs text-[#8C6D58]"> /month</span>
              </div>
              <ul className="space-y-2 text-xs text-[#6D4C3D]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Unlimited Table QR Stands
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Barista Kitchen Display (KDS)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 21-Day WhatsApp Comeback Campaigns
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Full CRM & CSV Export
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#2B1E16]">Premium Multi-Branch</h3>
              <p className="text-xs text-[#8C6D58]">For multi-location cafe brands</p>
              <div className="my-4">
                <span className="text-3xl font-black text-[#493326]">₹1,499</span>
                <span className="text-xs text-[#8C6D58]"> /month</span>
              </div>
              <ul className="space-y-2 text-xs text-[#6D4C3D]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Multi-Branch Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Dedicated Meta WhatsApp WABA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Custom Domain & Branding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EFE8DE] bg-[#F5EFE5] py-8 text-center text-xs text-[#8C6D58]">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-[#493326]" />
            <span className="font-bold text-[#493326]">BrewLoop SaaS</span>
            <span>• Built for Indian Cafes & Restaurants</span>
          </div>
          <p>© {new Date().getFullYear()} BrewLoop Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
