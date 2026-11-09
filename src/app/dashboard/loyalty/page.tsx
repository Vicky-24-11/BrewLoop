'use client';

import React, { useState } from 'react';
import { Gift, Sparkles, Coffee, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BrewStorage } from '@/lib/storage';

export default function LoyaltyRulesPage() {
  const [program, setProgram] = useState(BrewStorage.getLoyaltyProgram());
  const [stampsRequired, setStampsRequired] = useState(program.stamps_required);
  const [rewardTitle, setRewardTitle] = useState(program.reward_description);
  const [minSpend, setMinSpend] = useState(program.min_spend_per_stamp);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">
          Digital Loyalty Program Configuration
        </h1>
        <p className="text-xs text-[#6D4C3D]">
          Configure your digital coffee stamp card mechanics and milestone rewards
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Loyalty rules saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-xs lg:col-span-7 space-y-4">
          <div className="border-b border-[#EFE8DE] pb-3">
            <h3 className="text-sm font-bold text-[#2B1E16]">Stamp Card Mechanics</h3>
            <p className="text-xs text-[#8C6D58]">Design your high-retention loyalty card</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#493326]">Program Name</label>
            <input
              type="text"
              value={program.name}
              readOnly
              className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#493326]">
              Stamps Required to Unlock Reward
            </label>
            <select
              value={stampsRequired}
              onChange={(e) => setStampsRequired(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
            >
              <option value={4}>4 Stamps (Fastest initial reward)</option>
              <option value={5}>5 Stamps (Recommended industry standard)</option>
              <option value={6}>6 Stamps</option>
              <option value={8}>8 Stamps (High ticket cafes)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#493326]">Free Milestone Reward</label>
            <input
              type="text"
              value={rewardTitle}
              onChange={(e) => setRewardTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#493326]">
              Minimum Spend to Earn 1 Stamp (₹)
            </label>
            <input
              type="number"
              value={minSpend}
              onChange={(e) => setMinSpend(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2 text-xs text-[#2B1E16] focus:border-[#493326] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#493326] py-3 text-xs font-bold text-white shadow-md hover:bg-[#362419]"
          >
            Save Loyalty Rules
          </button>
        </form>

        {/* Live Card Preview */}
        <div className="rounded-3xl border border-[#EFE8DE] bg-[#F5EFE5] p-6 shadow-xs lg:col-span-5 flex flex-col justify-center">
          <p className="mb-3 text-xs font-bold text-[#6D4C3D]">Live Customer Pass Preview</p>
          <div className="rounded-3xl border border-[#362419] bg-[#493326] p-5 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200">
                  Digital Pass
                </span>
                <h4 className="mt-1 text-sm font-bold">The Roasted Bean</h4>
              </div>
              <Coffee className="h-5 w-5 text-amber-300" />
            </div>

            <div className="my-4 rounded-xl bg-black/20 p-3">
              <p className="text-[11px] text-amber-200 font-medium">Reward: {rewardTitle}</p>
              <div className="mt-3 flex gap-1.5">
                {Array.from({ length: stampsRequired }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${
                      i < 2 ? 'border-amber-400 bg-amber-400/20 text-amber-300' : 'border-white/20 text-white/40'
                    }`}
                  >
                    {i < 2 ? '☕' : i + 1}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-white/70">
              Spend min ₹{minSpend} to earn a stamp automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
