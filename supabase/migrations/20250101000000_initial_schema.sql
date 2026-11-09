-- BrewLoop: Multi-Tenant Cafe Ordering, Loyalty & Customer Retention Platform
-- Migration: 20250101000000_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Cafes (Tenants)
CREATE TABLE IF NOT EXISTS cafes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    brand_color VARCHAR(20) DEFAULT '#493326',
    address TEXT,
    city VARCHAR(100) DEFAULT 'Mumbai',
    phone VARCHAR(20),
    email VARCHAR(255),
    google_review_url TEXT,
    currency VARCHAR(10) DEFAULT 'INR',
    tax_percentage NUMERIC(5,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'CAFE_OWNER', -- SUPER_ADMIN, CAFE_OWNER, CAFE_MANAGER, CAFE_STAFF
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cafe Members (Multi-tenancy RBAC)
CREATE TABLE IF NOT EXISTS cafe_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'CAFE_STAFF', -- OWNER, MANAGER, STAFF
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cafe_id, user_id)
);

-- 4. Tables
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 4,
    qr_code_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cafe_id, table_number)
);

-- 5. Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_veg BOOLEAN DEFAULT true,
    loyalty_stamps_reward INT DEFAULT 1,
    preparation_time_minutes INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Customers (Scoped to each cafe)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    first_visit TIMESTAMPTZ DEFAULT NOW(),
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    total_visits INT DEFAULT 1,
    total_spent NUMERIC(12,2) DEFAULT 0.00,
    stamps_balance INT DEFAULT 0,
    marketing_consent BOOLEAN DEFAULT false,
    marketing_consent_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, REGULAR, VIP, INACTIVE, LOST
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cafe_id, phone)
);

-- 8. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    order_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10,2) DEFAULT 0.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'COUNTER_PAY', -- COUNTER_PAY, UPI_COUNTER, CASH
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, REFUNDED
    special_instructions TEXT,
    loyalty_stamps_awarded INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Loyalty Programs
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT 'Coffee Stamp Card',
    stamps_required INT DEFAULT 5,
    reward_description VARCHAR(255) DEFAULT '1 Free Beverage of choice',
    min_spend_per_stamp NUMERIC(10,2) DEFAULT 150.00,
    reward_expiry_days INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Loyalty Transactions (Immutable Ledger)
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL, -- EARNED, REDEEMED, ADJUSTMENT
    stamps INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Rewards & Redemptions
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stamps_cost INT DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    redemption_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'UNUSED', -- UNUSED, REDEEMED, EXPIRED
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    redeemed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WhatsApp Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    target_segment VARCHAR(50) NOT NULL, -- ALL, INACTIVE_21_DAYS, LOST_45_DAYS, VIP
    offer_text TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, SENDING, COMPLETED, FAILED
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'QUEUED', -- QUEUED, SENT, DELIVERED, READ, FAILED
    error_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Indexes for Performance
CREATE INDEX idx_products_cafe ON products(cafe_id);
CREATE INDEX idx_orders_cafe_status ON orders(cafe_id, status);
CREATE INDEX idx_customers_cafe_phone ON customers(cafe_id, phone);
CREATE INDEX idx_customers_cafe_status ON customers(cafe_id, status);
CREATE INDEX idx_loyalty_ledger ON loyalty_transactions(cafe_id, customer_id);

-- 15. Row Level Security (RLS)
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Public can view active cafe details and products (for QR menu)
CREATE POLICY "Public can view active cafes" ON cafes FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view available products" ON products FOR SELECT USING (is_available = true);

-- Cafe Members can manage their own cafe data
CREATE POLICY "Cafe members can view their cafe orders" ON orders 
    FOR ALL USING (
        cafe_id IN (
            SELECT cafe_id FROM cafe_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Cafe members can view their cafe customers" ON customers 
    FOR ALL USING (
        cafe_id IN (
            SELECT cafe_id FROM cafe_members WHERE user_id = auth.uid()
        )
    );
