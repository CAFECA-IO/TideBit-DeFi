'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Token', href: '/admin/token' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-xl transition-transform duration-300 ease-in-out">
        <div className="flex h-16 items-center justify-center border-b border-slate-800 bg-slate-950 px-6 shadow-md">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">
            TideBit<span className="text-white">Admin</span>
          </h1>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'scale-105 bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-gray-400 hover:bg-slate-800 hover:pl-5 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6 text-center">
          <p className="text-xs text-slate-600">v2.0.0 - CAFECA IO</p>
        </div>
      </aside>

      <main className="ml-64 min-h-screen w-full p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
