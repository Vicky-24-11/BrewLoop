'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Coffee,
  Edit,
  Trash2
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';

export default function MenuManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState(BrewStorage.getCategories());

  useEffect(() => {
    setProducts(BrewStorage.getProducts());
  }, []);

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">
            Menu & Catalog Management
          </h1>
          <p className="text-xs text-[#6D4C3D]">
            Manage items, pricing, categories and live 86 (out-of-stock) toggles
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition ${
              item.is_available
                ? 'border-[#EFE8DE] bg-white'
                : 'border-red-200 bg-red-50/40 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    item.is_veg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                  title={item.is_veg ? 'Vegetarian' : 'Non-Veg'}
                />
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.is_available
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.is_available ? 'Available' : 'Out of Stock (86)'}
                </button>
              </div>

              <h4 className="mt-2 text-sm font-bold text-[#2B1E16]">{item.name}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-[#6D4C3D]">{item.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#EFE8DE] pt-3">
              <span className="text-sm font-black text-[#493326]">{formatINR(item.price)}</span>
              <div className="flex items-center gap-1 text-[11px] text-[#8C6D58]">
                <Clock className="h-3.5 w-3.5" />
                <span>{item.preparation_time_minutes}m</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
