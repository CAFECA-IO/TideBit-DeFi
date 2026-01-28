'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminTokenOperations from '@/components/admin/token_operations';

function TokenOperationsContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // If token param exists, use it; otherwise AdminTokenOperations defaults to NTD
    // passing undefined tells the component to use its default if defined so
    // The component prop is optional: initialTokenAddress?: string
    // Defaults in component: initialTokenAddress = CONTRACT_ADDRESSES.NTD_TOKEN

    return <AdminTokenOperations initialTokenAddress={token || undefined} />;
}

export default function TokenOperationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">Token Operations</h1>
                <p className="text-slate-400">Mint, burn, and manage tokens.</p>
            </div>

            <Suspense fallback={<div className="text-slate-500">Loading parameters...</div>}>
                <TokenOperationsContent />
            </Suspense>
        </div>
    );
}
