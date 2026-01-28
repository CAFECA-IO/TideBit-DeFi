'use client';

import React from 'react';
import AdminTokenOperations from '@/components/admin/token_operations';

export default function TokenOperationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">Token Operations</h1>
                <p className="text-slate-400">Mint, burn, and manage tokens.</p>
            </div>

            <AdminTokenOperations />
        </div>
    );
}
