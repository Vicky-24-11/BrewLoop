import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

export const viewport: Viewport = {
  themeColor: '#493326',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'BrewLoop — Turn Every Cafe Visitor Into a Returning Customer',
  description: 'Multi-tenant Cafe Ordering, Digital Stamp Cards, and WhatsApp Retention SaaS for Cafes & Restaurants.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BrewLoop',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
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
        <PwaRegister />
      </body>
    </html>
  );
}
