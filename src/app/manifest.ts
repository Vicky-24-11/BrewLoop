import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BrewLoop — Cafe Ordering & Loyalty Pass',
    short_name: 'BrewLoop',
    description: 'Instant QR table ordering, digital coffee stamp cards, and loyalty rewards.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FBF8F4',
    theme_color: '#493326',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
