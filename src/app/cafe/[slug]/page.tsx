'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Coffee,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Gift,
  X,
  Share2
} from 'lucide-react';
import { BrewStorage } from '@/lib/storage';
import { formatINR } from '@/lib/utils';
import { Product, Order } from '@/types';
import Link from 'next/link';

export default function CafeCustomerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table') || 'T01';

  const [cafe, setCafe] = useState(BrewStorage.getCafe());
  const [categories, setCategories] = useState(BrewStorage.getCategories());
  const [products, setProducts] = useState(BrewStorage.getProducts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart State: { [productId]: quantity }
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [specialNotes, setSpecialNotes] = useState('');
  const [tableNumber, setTableNumber] = useState(tableParam);

  // Placed Order Tracking
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Stamp card state preview
  const [customerStamps, setCustomerStamps] = useState<number>(0);

  useEffect(() => {
    if (customerPhone) {
      const customers = BrewStorage.getCustomers();
      const match = customers.find(c => c.phone.replace(/\s+/g, '') === customerPhone.replace(/\s+/g, ''));
      if (match) {
        setCustomerStamps(match.stamps_balance);
        if (!customerName) setCustomerName(match.full_name);
      }
    }
  }, [customerPhone]);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const count = (prev[productId] || 0) - 1;
      if (count <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: count };
    });
  };

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return { product, quantity };
  }).filter(item => item.product !== undefined) as { product: Product; quantity: number }[];

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(cartSubtotal * 0.05);
  const cartTotal = cartSubtotal + tax;
  const totalItemCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 10) {
      alert('Please enter a valid mobile number for your order and loyalty stamps.');
      return;
    }
    if (cartItems.length === 0) return;

    const newOrder = BrewStorage.createOrder({
      cafe_id: cafe.id,
      customer_name: customerName || 'Cafe Guest',
      customer_phone: customerPhone,
      table_number: tableNumber,
      subtotal: cartSubtotal,
      tax: tax,
      discount: 0,
      total: cartTotal,
      payment_method: 'COUNTER_PAY',
      payment_status: 'PENDING',
      special_instructions: specialNotes,
      items: cartItems.map(item => ({
        id: `item-${Date.now()}-${item.product.id}`,
        order_id: '',
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      })),
    });

    setActiveOrder(newOrder);
    setCart({});
    setIsCartOpen(false);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FBF8F4] pb-28 text-[#2B1E16]">
      {/* Top Banner / Cafe Header */}
      <header className="sticky top-0 z-20 border-b border-[#EFE8DE] bg-[#FBF8F4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#493326] text-white shadow-sm">
              <Coffee className="h-6 w-6 text-[#F5EFE5]" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#2B1E16]">{cafe.name}</h1>
              <div className="flex items-center gap-2 text-xs text-[#6D4C3D]">
                <span className="inline-flex items-center rounded-full bg-[#EFE8DE] px-2 py-0.5 font-medium text-[#493326]">
                  Table {tableNumber}
                </span>
                <span>•</span>
                <span>Bandra West</span>
              </div>
            </div>
          </div>

          <Link
            href={`/cafe/${params.slug}/loyalty`}
            className="flex items-center gap-1.5 rounded-full border border-[#D5C9BD] bg-white px-3 py-1.5 text-xs font-semibold text-[#493326] shadow-sm hover:bg-[#F5EFE5]"
          >
            <Gift className="h-4 w-4 text-[#D97706]" />
            <span>Pass</span>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-[#493326] text-white shadow-sm'
                : 'bg-white text-[#6D4C3D] border border-[#EFE8DE] hover:bg-[#F5EFE5]'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#493326] text-white shadow-sm'
                  : 'bg-white text-[#6D4C3D] border border-[#EFE8DE] hover:bg-[#F5EFE5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-xl px-4 pt-4">
        {/* Loyalty Reward Teaser Card */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#EADBCE] bg-gradient-to-r from-[#F5EFE5] to-[#FBF8F4] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#493326] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                <Sparkles className="h-3 w-3 text-amber-300" /> BrewLoop Pass
              </span>
              <h2 className="text-sm font-bold text-[#2B1E16]">
                Buy 5 Coffees, Get 1 Free Drink!
              </h2>
              <p className="text-xs text-[#6D4C3D]">
                Enter your mobile number at checkout to earn stamps automatically.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
              <span className="text-xl">☕</span>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-3">
          {filteredProducts.map(product => {
            const qty = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                className="flex items-start justify-between rounded-2xl border border-[#EFE8DE] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:border-[#D5C9BD]"
              >
                <div className="max-w-[70%] space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        product.is_veg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                      title={product.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                    />
                    <h3 className="text-sm font-semibold text-[#2B1E16]">{product.name}</h3>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-[#6D4C3D]">
                    {product.description}
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <span className="text-sm font-bold text-[#2B1E16]">
                      {formatINR(product.price)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8C6D58]">
                      <Clock className="h-3 w-3" /> {product.preparation_time_minutes}m
                    </span>
                  </div>
                </div>

                {/* Add / Quantity Controls */}
                <div className="flex flex-col items-end">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex items-center gap-1 rounded-xl border border-[#493326] bg-[#FBF8F4] px-4 py-2 text-xs font-bold text-[#493326] transition active:scale-95 hover:bg-[#493326] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" /> ADD
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-[#493326] px-2 py-1.5 text-white shadow-sm">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="rounded p-1 hover:bg-[#6D4C3D]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[16px] text-center text-xs font-bold">{qty}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="rounded p-1 hover:bg-[#6D4C3D]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
          <div className="mx-auto flex max-w-xl items-center justify-between rounded-2xl bg-[#493326] p-4 text-white shadow-xl">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#D5C9BD]">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </p>
              <p className="text-base font-bold">{formatINR(cartTotal)}</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#F5EFE5] px-5 py-2.5 text-xs font-bold text-[#493326] transition active:scale-95 hover:bg-white"
            >
              <span>View Cart</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2B1E16]">Your Table Order</h3>
                <p className="text-xs text-[#6D4C3D]">Table {tableNumber} • {cafe.name}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Itemized Cart List */}
            <div className="divide-y divide-[#EFE8DE] py-4">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#2B1E16]">{product.name}</h4>
                    <p className="text-xs text-[#8C6D58]">{formatINR(product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-[#F5EFE5] px-2 py-1">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#493326]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold text-[#493326]">{quantity}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="text-[#493326]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="w-16 text-right text-sm font-bold text-[#2B1E16]">
                      {formatINR(product.price * quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 rounded-2xl bg-[#FBF8F4] p-3 text-xs">
              <div className="flex justify-between text-[#6D4C3D]">
                <span>Item Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6D4C3D]">
                <span>GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-[#EADBCE] pt-1.5 text-sm font-bold text-[#2B1E16]">
                <span>To Pay</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#493326]">
                  Mobile Number <span className="text-amber-700">* (for Loyalty Pass & Receipts)</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2.5 text-sm text-[#2B1E16] focus:border-[#493326] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#493326]">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2.5 text-sm text-[#2B1E16] focus:border-[#493326] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#493326]">
                  Table Number
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2.5 text-sm text-[#2B1E16] focus:border-[#493326] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#493326]">
                  Special Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less sugar, extra hot..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5C9BD] bg-[#FBF8F4] px-3.5 py-2.5 text-sm text-[#2B1E16] focus:border-[#493326] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="consent"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#493326] focus:ring-[#493326]"
                />
                <label htmlFor="consent" className="text-[11px] leading-tight text-[#6D4C3D]">
                  Yes, notify me via WhatsApp for loyalty stamps, free coffee rewards, and exclusive cafe offers.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#493326] py-3 text-center text-sm font-bold text-white shadow-lg transition active:scale-98 hover:bg-[#362419]"
                >
                  Confirm & Place Order ({formatINR(cartTotal)})
                </button>
                <p className="mt-2 text-center text-[11px] text-[#8C6D58]">
                  Pay at counter via Cash or UPI after ordering.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed Success Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#2B1E16]">Order Sent to Kitchen!</h3>
              <p className="text-xs text-[#6D4C3D]">Order #{activeOrder.order_number} • Table {activeOrder.table_number}</p>
            </div>

            <div className="my-5 rounded-2xl border border-[#EADBCE] bg-[#F5EFE5] p-4 text-center">
              <span className="text-xs font-semibold text-[#6D4C3D]">Status</span>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </span>
                <span className="text-base font-bold text-[#493326]">Preparing in Barista Bar</span>
              </div>
              <p className="mt-2 text-[11px] text-[#6D4C3D]">
                Your barista is grinding beans and preparing your fresh order.
              </p>
            </div>

            {/* Stamp Card Progress Banner */}
            <div className="rounded-2xl border border-[#D5C9BD] bg-[#FBF8F4] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[#D97706]" />
                  <span className="text-xs font-bold text-[#493326]">BrewLoop Stamp Added</span>
                </div>
                <span className="rounded-full bg-[#EADBCE] px-2.5 py-0.5 text-xs font-bold text-[#493326]">
                  Pass Active
                </span>
              </div>
              <p className="mt-1 text-xs text-[#6D4C3D]">
                This order will award you +1 loyalty stamp upon completion at the counter!
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <Link
                href={`/cafe/${params.slug}/loyalty?phone=${encodeURIComponent(activeOrder.customer_phone || '')}`}
                className="block w-full rounded-2xl bg-[#493326] py-3 text-center text-xs font-bold text-white shadow hover:bg-[#362419]"
              >
                View My Digital Stamp Card
              </Link>
              <button
                onClick={() => setActiveOrder(null)}
                className="block w-full rounded-2xl border border-[#D5C9BD] bg-white py-2.5 text-center text-xs font-semibold text-[#493326] hover:bg-[#F5EFE5]"
              >
                Back to Cafe Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
