'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[BrewLoop PWA] Service worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[BrewLoop PWA] Service worker registration failed:', err);
        });
    }

    // 2. Listen for PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[BrewLoop PWA] Install outcome:', outcome);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-in rounded-2xl border border-[#D5C9BD] bg-[#493326] p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
            ☕
          </div>
          <div>
            <h4 className="text-xs font-bold">Install BrewLoop App</h4>
            <p className="text-[11px] text-[#EADBCE]">Fast offline access & instant stamp tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 rounded-xl bg-[#F5EFE5] px-3 py-1.5 text-xs font-bold text-[#493326] shadow-sm hover:bg-white active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="rounded-lg p-1 text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
