'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth_context';
import UserPortfolio from '@/components/admin/user_portfolio';

export default function MyAssetOverview() {
    const { user } = useAuth();

    if (!user?.address) {
        return (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
                Please connect your wallet to view assets.
            </div>
        );
    }

    return (
        <UserPortfolio
            initialAddress={user.address}
            enableSearch={false}
        />
    );
}
