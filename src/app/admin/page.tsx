'use client';

import React from 'react';
import { NTD_TOKEN_ADDRESS, isuncoin } from '@/lib/viem-public';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500">Overview of the TideBit-DeFi RWA Smart Contract System.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Network
          </h3>
          <div className="flex items-center gap-2">
            <div className="size-3 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-xl font-bold text-gray-900">{isuncoin.name}</span>
          </div>
          <p className="mt-2 font-mono text-sm text-gray-500">ID: {isuncoin.id}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Token Contract
          </h3>
          <div className="text-xl font-bold text-gray-900">NTD Token</div>
          <p className="mt-2 truncate font-mono text-xs text-blue-600" title={NTD_TOKEN_ADDRESS}>
            {NTD_TOKEN_ADDRESS || 'Not Configured'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            System Status
          </h3>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Operational
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">All systems nominal.</p>
        </div>
      </div>
    </div>
  );
}
