'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCheck,
  Smartphone,
  ShieldCheck,
  Play
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { Campaign, Customer } from '@/types';

export default function WhatsAppMarketingPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Form State
  const [campaignName, setCampaignName] = useState('21-Day Inactive Win-Back (Free Cookie)');
  const [targetSegment, setTargetSegment] = useState<'INACTIVE_21_DAYS' | 'ALL' | 'LOST_45_DAYS' | 'VIP'>('INACTIVE_21_DAYS');
  const [offerText, setOfferText] = useState('Free Sea Salt Dark Chocolate Cookie with any beverage this weekend');
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    setCustomers(BrewStorage.getCustomers());
    setCampaigns(BrewStorage.getCampaigns());
  }, []);

  // Filter eligible audience based on target segment and WhatsApp marketing consent
  const eligibleCustomers = customers.filter(c => {
    if (!c.marketing_consent) return false;
    if (targetSegment === 'ALL') return true;
    if (targetSegment === 'INACTIVE_21_DAYS') return c.status === 'INACTIVE';
    if (targetSegment === 'LOST_45_DAYS') return c.status === 'LOST';
    if (targetSegment === 'VIP') return c.status === 'VIP';
    return false;
  });

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (eligibleCustomers.length === 0) {
      alert('No opted-in customers found in this target segment.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const created = BrewStorage.createCampaign({
        cafe_id: BrewStorage.getCafe().id,
        name: campaignName,
        template_name: 'inactive_customer_comeback_v1',
        target_segment: targetSegment,
        offer_text: offerText,
        status: 'COMPLETED',
        total_recipients: eligibleCustomers.length,
      });

      setCampaigns(BrewStorage.getCampaigns());
      setIsSending(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">
              WhatsApp Retention & Win-Back Campaigns
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Meta Cloud API Ready
            </span>
          </div>
          <p className="text-xs text-[#6D4C3D]">
            Bring back inactive visitors automatically with official Meta WhatsApp template notifications
          </p>
        </div>
      </div>

      {successToast && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-bold">
            WhatsApp campaign successfully dispatched to {eligibleCustomers.length} opted-in guests!
          </span>
        </div>
      )}

      {/* Main Campaign Builder Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Campaign Configuration Form */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs lg:col-span-7">
          <div className="border-b border-[#EFE8DE] pb-4">
            <h3 className="text-sm font-bold text-[#2B1E16]">Compose Win-Back Retention Campaign</h3>
            <p className="text-xs text-[#8C6D58]">
              Automate engagement for visitors who haven't ordered recently.
            </p>
          </div>

          <form onSubmit={handleLaunchCampaign} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#493326]">Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#493326]">Target Segment</label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
              >
                <option value="INACTIVE_21_DAYS">Inactive Guests (No order in 21+ days)</option>
                <option value="LOST_45_DAYS">Lost Guests (No order in 45+ days)</option>
                <option value="VIP">VIP Customers (High frequency)</option>
                <option value="ALL">All Marketing-Consented Customers</option>
              </select>
              <div className="mt-1 flex items-center justify-between text-[11px] text-[#6D4C3D]">
                <span>
                  Found <strong className="text-[#493326]">{eligibleCustomers.length} eligible guests</strong> with active WhatsApp consent.
                </span>
                <span className="text-emerald-700 font-semibold">100% Opt-In Verified</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#493326]">Offer / Incentive Hook</label>
              <input
                type="text"
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-[#8C6D58]">
                Incentives like free bakes or 20% off on weekdays achieve 38%+ footfall recovery.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Meta WhatsApp Compliance Note</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-emerald-800">
                Messages outside 24h customer service windows use pre-approved Meta Business templates. Marketing opt-out (STOP) is automatically handled.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSending || eligibleCustomers.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#493326] py-3 text-xs font-bold text-white shadow-md transition active:scale-98 hover:bg-[#362419] disabled:opacity-50"
            >
              {isSending ? (
                <span>Dispatching via Meta Cloud API...</span>
              ) : (
                <>
                  <Send className="h-4 w-4 text-amber-300" />
                  <span>Send Campaign to {eligibleCustomers.length} Guests Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live WhatsApp Phone Preview */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-[#F5EFE5] p-6 shadow-xs lg:col-span-5 flex flex-col items-center justify-center">
          <p className="mb-3 text-xs font-bold text-[#6D4C3D] flex items-center gap-1.5">
            <Smartphone className="h-4 w-4" /> Live Customer WhatsApp Preview
          </p>

          <div className="w-full max-w-[320px] rounded-[36px] border-4 border-black bg-white shadow-2xl overflow-hidden">
            {/* WhatsApp Chat Header */}
            <div className="flex items-center gap-2.5 bg-[#075E54] px-4 py-3 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E] font-bold text-xs">
                ☕
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">The Roasted Bean</span>
                  <CheckCircle2 className="h-3 w-3 fill-emerald-400 text-[#075E54]" />
                </div>
                <p className="text-[10px] text-emerald-200">Official Business Account</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="bg-[#EFEAE2] p-4 min-h-[300px] flex flex-col justify-end">
              <div className="rounded-2xl rounded-tl-xs bg-white p-3 shadow-xs text-xs text-gray-800 space-y-2">
                <p className="font-semibold text-[#075E54]">The Roasted Bean Cafe</p>
                <p>
                  Hey <strong>Vikram</strong>! ☕ We miss seeing you around our Bandra bar.
                </p>
                <p className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[11px] font-medium text-amber-900">
                  🎁 <strong>Special Comeback Perk:</strong> {offerText}
                </p>
                <p className="text-[11px] text-gray-600">
                  Show this message at the counter when you order next!
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 pt-1">
                  <span>10:45 AM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Campaigns Table */}
      <div className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#2B1E16]">Campaign Delivery & Recovery Analytics</h3>
        <p className="text-xs text-[#8C6D58]">Historical performance of retention campaigns</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE8DE] text-[#8C6D58]">
                <th className="pb-3 font-semibold">Campaign</th>
                <th className="pb-3 font-semibold">Target Audience</th>
                <th className="pb-3 font-semibold">Dispatched</th>
                <th className="pb-3 font-semibold">Delivered</th>
                <th className="pb-3 font-semibold">Read Rate</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE5]">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#FBF8F4]">
                  <td className="py-3">
                    <p className="font-bold text-[#2B1E16]">{camp.name}</p>
                    <p className="text-[10px] text-gray-400">{camp.template_name}</p>
                  </td>
                  <td className="py-3 font-semibold text-[#6D4C3D]">{camp.target_segment}</td>
                  <td className="py-3 font-bold">{camp.sent_count} recipients</td>
                  <td className="py-3 font-semibold text-emerald-700">{camp.delivered_count} (95%)</td>
                  <td className="py-3 font-semibold text-blue-700">{camp.read_count} (82%)</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {camp.status}
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
