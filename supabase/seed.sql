-- Seed Data for BrewLoop Demo Cafe: The Roasted Bean
-- Slug: roasted-bean

INSERT INTO cafes (
    id, slug, name, tagline, description, brand_color, address, city, phone, email, google_review_url, tax_percentage
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'roasted-bean',
    'The Roasted Bean Cafe',
    'Artisanal Coffee & Fresh Bakes',
    'Specialty coffee, sourdough sandwiches, and a warm community vibe.',
    '#493326',
    '12 Bandra West, Pali Hill Road',
    'Mumbai',
    '+91 98200 12345',
    'contact@roastedbean.com',
    'https://g.page/r/roastedbean/review',
    5.00
) ON CONFLICT (slug) DO NOTHING;

-- Tables
INSERT INTO tables (cafe_id, table_number, capacity) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'T01', 2),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'T02', 4),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'T03', 4),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'T04', 6),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'T05', 2)
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, cafe_id, name, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Hot Brews & Espresso', 1),
('c1000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Iced & Cold Brews', 2),
('c1000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Artisanal Bakery & Desserts', 3),
('c1000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Gourmet Toast & Bites', 4)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (cafe_id, category_id, name, description, price, is_available, is_veg, loyalty_stamps_reward, preparation_time_minutes) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000001', 'Double Shot Cappuccino', 'Single-origin Arabica, velvety steamed microfoam and dark cocoa dusting.', 220.00, true, true, 1, 5),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000001', 'Classic Flat White', 'Smooth double ristretto poured with steamed whole milk.', 240.00, true, true, 1, 5),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000001', 'Spanish Latte (Condensed Milk)', 'Rich espresso with condensed milk and warm cinnamon finish.', 260.00, true, true, 1, 6),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000002', '18-Hour Cold Brew', 'Steeped overnight for an ultra-smooth, low-acidity chocolate note.', 250.00, true, true, 1, 3),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000002', 'Iced Caramel Macchiato', 'Layered vanilla milk, robust espresso, topped with rich caramel drizzle.', 280.00, true, true, 1, 6),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000003', 'Butter Croissant', 'Flaky, golden French butter pastry baked fresh daily.', 180.00, true, true, 1, 3),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000003', 'Dark Chocolate Sea Salt Cookie', 'Warm gooey Callebaut dark chocolate with Maldon sea salt flakes.', 160.00, true, true, 1, 2),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000004', 'Avocado Sourdough Toast', 'Creamy smashed avocado, cherry tomatoes, feta crumble, chilli oil.', 320.00, true, true, 1, 10),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c1000000-0000-0000-0000-000000000004', 'Truffle Mushroom Panini', 'Wild sauteed mushrooms, mozzarella and truffle mayo on toasted focaccia.', 340.00, true, true, 1, 12)
ON CONFLICT DO NOTHING;

-- Loyalty Program
INSERT INTO loyalty_programs (cafe_id, name, stamps_required, reward_description, min_spend_per_stamp) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'BrewLoop 5-Cup Pass', 5, 'Free Beverage of your choice', 180.00)
ON CONFLICT DO NOTHING;

-- Sample Customers & Segmentation
INSERT INTO customers (cafe_id, full_name, phone, email, total_visits, total_spent, stamps_balance, marketing_consent, status, last_visit) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Aarav Sharma', '+91 98201 11223', 'aarav@gmail.com', 8, 2450.00, 3, true, 'VIP', NOW() - INTERVAL '2 days'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Rohan Mehta', '+91 98199 44556', 'rohan@yahoo.com', 4, 1180.00, 4, true, 'REGULAR', NOW() - INTERVAL '5 days'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Priya Kapoor', '+91 98333 77889', 'priya.k@gmail.com', 2, 540.00, 2, false, 'NEW', NOW() - INTERVAL '1 day'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Vikram Desai', '+91 97690 99881', 'vikram.d@outlook.com', 5, 1420.00, 1, true, 'INACTIVE', NOW() - INTERVAL '24 days'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Sneha Iyer', '+91 98211 33445', 'sneha.iyer@gmail.com', 3, 910.00, 0, true, 'LOST', NOW() - INTERVAL '48 days')
ON CONFLICT DO NOTHING;
