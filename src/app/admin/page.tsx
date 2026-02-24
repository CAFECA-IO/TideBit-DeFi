'use client';

import AdminUserInfo from '@/components/admin/admin_user_info';
import MyAssetOverview from '@/components/admin/my_asset_overview';
import PlatformAssetOverview from '@/components/admin/platform_asset_overview';
import { useRouter } from 'next/navigation';

export default function AdminConsolePage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Info: (20260128 - Tzuhan) Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
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

      {/* Info: (20260128 - Tzuhan) Admin User Info (Address, Identity, Companies) */}
      <AdminUserInfo />

      {/* Info: (20260128 - Tzuhan) My Assets (Portfolio View for Admin) */}
      <h2 className="text-xl font-bold text-white">Admin Personal Assets</h2>
      <MyAssetOverview />

      <hr className="border-slate-800" />

      {/* Info: (20260224 - Tzuhan) Platform Official Treasury */}
      <PlatformAssetOverview />
    </div>
  );
}
