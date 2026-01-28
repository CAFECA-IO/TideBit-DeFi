'use client';

import React from 'react';
import UserCompanyManagement from '@/components/admin/user_company_management';

export default function CompaniesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">Company Management</h1>
                <p className="text-slate-400">Manage registered companies and their tokens.</p>
            </div>

            <UserCompanyManagement />
        </div>
    );
}
