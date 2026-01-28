'use client';

import React, { useState } from 'react';
import AdminUserInfo from '@/components/admin/admin_user_info';
import AdminDashboardOverview from '@/components/admin/dashboard_overview';
import AdminUserManagement from '@/components/admin/user_management';
import UserCompanyManagement from '@/components/admin/user_company_management'; // Info: (20260127) New Component
import AdminTokenOperations from '@/components/admin/token_operations';
import RegistrySettings from '@/components/admin/registry_settings';
import { useRouter } from 'next/navigation';

enum Tab {
  DASHBOARD = 'DASHBOARD',
  USERS = 'USERS',
  TOKEN = 'TOKEN',
  SETTINGS = 'SETTINGS',
}

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Info: (20260127 - Tzuhan) Header with Navigation */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent">
              Admin Console
            </h1>
            <p className="mt-1 text-slate-400">ERC-3643 Token Management System</p>
          </div>
          <button
            onClick={() => router.push('/funding')}
            className="w-full rounded bg-slate-800 px-4 py-2 text-center text-sm font-bold text-slate-300 transition hover:bg-slate-700 md:w-auto"
          >
            ← Back to App
          </button>
        </div>

        <AdminUserInfo />

        <AdminDashboardOverview />

        {/* Info: (20260127 - Tzuhan) Tab Navigation */}
        <div className="mb-8 inline-flex space-x-1 rounded-lg bg-slate-900/50 p-1">
          {[
            { id: 'DASHBOARD', label: 'Overview' },
            { id: 'USERS', label: 'User Management' },
            { id: 'TOKEN', label: 'Token Operations' },
            { id: 'SETTINGS', label: 'Registry Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info: (20260127 - Tzuhan) Content Area */}
        <div className="min-h-500px">
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AdminTokenOperations />
                <AdminUserManagement />
              </div>
            </div>
          )}
          {activeTab === 'USERS' && <UserCompanyManagement />}
          {activeTab === 'TOKEN' && <AdminTokenOperations />}
          {activeTab === 'SETTINGS' && <RegistrySettings />}
        </div>
      </div>
    </div>
  );
}
