import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrewLoop — Turn Every Cafe Visitor Into a Returning Customer',
  description: 'Multi-tenant Cafe Ordering, Digital Stamp Cards, and WhatsApp Retention SaaS for Cafes & Restaurants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FBF8F4] text-[#2B1E16] antialiased">
        {children}
      </body>
    </html>
  );
}
