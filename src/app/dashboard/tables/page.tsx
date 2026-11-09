'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Printer,
  Plus,
  Coffee,
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { BrewStorage } from '@/lib/storage';
import { TableItem } from '@/types';
import Link from 'next/link';

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [qrImages, setQrImages] = useState<{ [tableNumber: string]: string }>({});
  const [cafe] = useState(BrewStorage.getCafe());

  useEffect(() => {
    const list = BrewStorage.getTables();
    setTables(list);

    // Generate QR Data URLs
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    list.forEach(async (t) => {
      const url = `${origin}/cafe/${cafe.slug}?table=${t.table_number}`;
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 280,
          margin: 2,
          color: {
            dark: '#493326',
            light: '#FFFFFF',
          },
        });
        setQrImages((prev) => ({ ...prev, [t.table_number]: dataUrl }));
      } catch (err) {
        console.error(err);
      }
    });
  }, [cafe.slug]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#2B1E16]">
            Tables & Printable QR Codes
          </h1>
          <p className="text-xs text-[#6D4C3D]">
            Each table QR code directs diners to your instant digital menu and loyalty pass
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-[#493326] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#362419]"
        >
          <Printer className="h-4 w-4 text-amber-300" />
          <span>Print All Table Stands</span>
        </button>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => {
          const qrSrc = qrImages[table.table_number];
          return (
            <div
              key={table.id}
              className="flex flex-col items-center justify-between rounded-3xl border border-[#EFE8DE] bg-white p-6 text-center shadow-xs transition hover:border-[#D5C9BD]"
            >
              <div>
                <span className="rounded-full bg-[#F5EFE5] px-3 py-1 text-xs font-bold text-[#493326]">
                  Table {table.table_number}
                </span>
                <p className="mt-1 text-xs text-[#8C6D58]">Capacity: {table.capacity} Guests</p>
              </div>

              {/* QR Code Container */}
              <div className="my-5 flex flex-col items-center rounded-2xl border border-[#EADBCE] bg-[#FBF8F4] p-4">
                {qrSrc ? (
                  <img
                    src={qrSrc}
                    alt={`QR Code Table ${table.table_number}`}
                    className="h-44 w-44 rounded-xl shadow-xs"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center text-xs text-gray-400">
                    Generating QR...
                  </div>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#493326]">
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Scan to Order & Collect Stamps</span>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <Link
                  href={`/cafe/${cafe.slug}?table=${table.table_number}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#D5C9BD] py-2 text-xs font-bold text-[#493326] hover:bg-[#F5EFE5]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Test Link</span>
                </Link>
                {qrSrc && (
                  <a
                    href={qrSrc}
                    download={`QR_Table_${table.table_number}.png`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#493326] py-2 text-xs font-bold text-white hover:bg-[#362419]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
