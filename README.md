# ☕ BrewLoop — Multi-Tenant Cafe Retention & Loyalty SaaS

> **Turn every cafe visitor into a returning customer.**

BrewLoop is a complete, production-oriented customer loyalty and retention platform tailored for independent cafes, coffee shops, bakeries, and restaurants.

---

## 🌟 Key Features

1. **Zero-Friction QR Ordering & Table Check-in** (`/cafe/[slug]?table=T01`)
   - Unique QR codes per table.
   - Mobile-first web app (no app download required).
   - Real-time cart, dish customizations, preparation time estimates.
   - Seamless phone capture with explicit WhatsApp marketing consent.

2. **Digital Loyalty Stamp Card Pass** (`/cafe/[slug]/loyalty`)
   - Buy 5 coffees, get 1 free (configurable per cafe).
   - Automated stamp award upon completed order.
   - Dynamic voucher generation with barista redemption codes.
   - Neutral Google Reviews CTA.

3. **Barista & Kitchen Display System (KDS)** (`/staff`)
   - Live order columns: *New Orders*, *Preparing*, *Ready*, *Completed*.
   - One-tap status updates with audio-visual notifications.
   - Counter Fast-Stamp tool for walk-in counter sales.

4. **Automated WhatsApp Retention Engine** (`/dashboard/marketing`)
   - Detects guests with no visit in **21+ days** (inactive) or **45+ days** (lost).
   - Pre-approved Meta WhatsApp Business Cloud API template integration.
   - Interactive live phone message preview.
   - Track delivery, read rates, and footfall recovery.

5. **Owner CRM & Analytics Dashboard** (`/dashboard`)
   - Real-time revenue, order volume, and repeat customer percentage.
   - Full customer database with visit frequency, total spend, and CSV export.
   - Table management and printable QR table stand generator (`/dashboard/tables`).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 (Warm Coffee & Cream Palette) |
| **Icons & UI** | Lucide React |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **QR Engine** | Node `qrcode` library |
| **Messaging** | Meta WhatsApp Business Cloud API |
| **Deployment** | Vercel |

---

## 🚀 Quick Start Guide

### 1. Install & Run
```bash
cd "/Users/vikaspandey/Documents/Personal Projects/brewloop"
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Available Routes to Test
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Customer Table Menu**: [http://localhost:3000/cafe/roasted-bean?table=T01](http://localhost:3000/cafe/roasted-bean?table=T01)
- **Customer Digital Pass**: [http://localhost:3000/cafe/roasted-bean/loyalty](http://localhost:3000/cafe/roasted-bean/loyalty)
- **Barista Kitchen Screen**: [http://localhost:3000/staff](http://localhost:3000/staff)
- **Owner Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Customer CRM**: [http://localhost:3000/dashboard/customers](http://localhost:3000/dashboard/customers)
- **WhatsApp Win-Back**: [http://localhost:3000/dashboard/marketing](http://localhost:3000/dashboard/marketing)
- **Printable QR Codes**: [http://localhost:3000/dashboard/tables](http://localhost:3000/dashboard/tables)

---

## 🗄️ Database Migrations

Database schema and seed files are ready in:
- `supabase/migrations/20250101000000_initial_schema.sql`
- `supabase/seed.sql`

Includes multi-tenant tables (`cafes`, `tables`, `categories`, `products`, `orders`, `customers`, `loyalty_programs`, `campaigns`) with strict Row Level Security (RLS) policies.
