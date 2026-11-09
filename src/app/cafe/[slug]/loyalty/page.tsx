'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Coffee,
  Sparkles,
  Gift,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  QrCode,
  Star,
  Search
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { Customer, LoyaltyProgram } from '@/types';
import Link from 'next/link';

export default function LoyaltyCardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get('phone') || '';

  const [cafe] = useState(BrewStorage.getCafe());
  const [loyaltyProgram] = useState(BrewStorage.getLoyaltyProgram());
  const [phone, setPhone] = useState(phoneParam);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const lookupCustomer = (searchPhone: string) => {
    const customers = BrewStorage.getCustomers();
    const cleanSearch = searchPhone.replace(/\D/g, '');
    const found = customers.find(c => c.phone.replace(/\D/g, '').includes(cleanSearch) || cleanSearch.includes(c.phone.replace(/\D/g, '')));
    if (found) {
      setCustomer(found);
    } else {
      setCustomer(null);
    }
  };

  useEffect(() => {
    if (phoneParam) {
      lookupCustomer(phoneParam);
    } else {
      // Default to demo customer for immediate visual pleasure
      const customers = BrewStorage.getCustomers();
      if (customers.length > 0) {
        setCustomer(customers[0]);
        setPhone(customers[0].phone);
      }
    }
  }, [phoneParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCustomer(phone);
  };

  const handleClaimReward = () => {
    if (!customer) return;
    const success = BrewStorage.redeemReward(customer.phone, loyaltyProgram.stamps_required);
    if (success) {
      const code = `BREW-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemedCode(code);
      lookupCustomer(customer.phone);
    }
  };

  const stampsRequired = loyaltyProgram.stamps_required; // e.g. 5
  const currentStamps = customer ? customer.stamps_balance % stampsRequired : 0;
  const isRewardUnlocked = customer ? customer.stamps_balance >= stampsRequired : false;

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#2B1E16] pb-16">
      {/* Top Header */}
      <header className="border-b border-[#EFE8DE] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link
            href={`/cafe/${params.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#6D4C3D] hover:text-[#493326]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Menu</span>
          </Link>
          <span className="text-xs font-bold text-[#493326]">BrewLoop Pass</span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-6">
        {/* Search / Lookup Customer Box */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <label className="mb-1 block text-xs font-semibold text-[#6D4C3D]">
            Look up your card by phone number:
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="+91 98200 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 rounded-xl border border-[#D5C9BD] bg-white px-3.5 py-2 text-sm text-[#2B1E16] focus:border-[#493326] focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-[#493326] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#362419]"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Lookup</span>
            </button>
          </div>
        </form>

        {customer ? (
          <div className="space-y-6">
            {/* The Digital Stamp Card */}
            <div className="overflow-hidden rounded-3xl border border-[#D5C9BD] bg-gradient-to-br from-[#362419] to-[#493326] p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-200">
                    VIP Digital Stamp Card
                  </span>
                  <h2 className="mt-1 text-lg font-bold">{cafe.name}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs">
                  <Coffee className="h-5 w-5 text-amber-300" />
                </div>
              </div>

              <div className="my-6">
                <p className="text-xs text-[#EADBCE]">Customer: <span className="font-semibold text-white">{customer.full_name}</span></p>
                <p className="text-xs text-[#EADBCE]">Phone: <span className="font-mono text-white">{customer.phone}</span></p>
              </div>

              {/* Stamp Grid */}
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-200">
                    {currentStamps} of {stampsRequired} Stamps Collected
                  </span>
                  <span className="text-xs font-semibold text-white/80">
                    {stampsRequired - currentStamps === 0 ? 'Reward Ready!' : `${stampsRequired - currentStamps} to free coffee`}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  {Array.from({ length: stampsRequired }).map((_, index) => {
                    const isStamped = index < currentStamps || isRewardUnlocked;
                    return (
                      <div
                        key={index}
                        className={`flex h-12 w-12 flex-col items-center justify-center rounded-2xl border transition-all ${
                          isStamped
                            ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-sm'
                            : 'border-white/20 bg-white/5 text-white/40'
                        }`}
                      >
                        {isStamped ? (
                          <Coffee className="h-6 w-6 fill-amber-300" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Footer */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-[#EADBCE]">
                <span>Total Cafe Visits: {customer.total_visits}</span>
                <span>Total Spent: ₹{customer.total_spent}</span>
              </div>
            </div>

            {/* Unlocked Reward Claim Section */}
            {isRewardUnlocked ? (
              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="mt-2 text-base font-bold text-emerald-900">
                  🎉 Reward Unlocked!
                </h3>
                <p className="mt-1 text-xs text-emerald-800">
                  You have completed 5 stamps! Claim your <strong>1 Free Beverage of choice</strong> today.
                </p>

                {redeemedCode ? (
                  <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-3">
                    <p className="text-xs text-gray-500">Show this code to your barista:</p>
                    <p className="mt-1 font-mono text-xl font-black tracking-widest text-[#493326]">
                      {redeemedCode}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleClaimReward}
                    className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98"
                  >
                    Generate Barista Redemption Code
                  </button>
                )}
              </div>
            ) : null}

            {/* Google Reviews CTA (Neutral Feedback) */}
            <div className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2B1E16]">Enjoyed your coffee at {cafe.name}?</h4>
                  <p className="text-xs text-[#6D4C3D]">Your honest feedback helps our local baristas grow.</p>
                </div>
              </div>

              <a
                href={cafe.google_review_url || 'https://google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] py-2 text-xs font-bold text-[#493326] transition hover:bg-[#F5EFE5]"
              >
                <span>Leave a Review on Google</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D5C9BD] p-8 text-center">
            <Coffee className="mx-auto h-8 w-8 text-[#8C6D58]" />
            <p className="mt-2 text-sm font-semibold text-[#2B1E16]">No Customer Found</p>
            <p className="mt-1 text-xs text-[#6D4C3D]">
              Place an order on the menu with your phone number to automatically start your BrewLoop Pass!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
