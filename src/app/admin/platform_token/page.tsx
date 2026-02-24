'use client';

import AdminDashboardOverview from '@/components/admin/dashboard_overview';
import AdminUserManagement from '@/components/admin/user_management';
import PlatformTokenUserList from '@/components/admin/platform_token_user_list';
import DebtTokenUserList from '@/components/admin/debt_token_user_list';

export default function PlatformTokenPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">Platform Token Management</h1>
                <p className="text-slate-400">Manage the system platform token (NTD) and view user holdings.</p>
            </div>

            <AdminDashboardOverview />

            <AdminUserManagement />

            <PlatformTokenUserList />

            <hr className="border-slate-800" />

            <DebtTokenUserList />
        </div>
    );
}
