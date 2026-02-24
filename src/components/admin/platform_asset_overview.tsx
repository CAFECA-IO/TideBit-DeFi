'use client';

import { useState, useEffect } from 'react';
import { getPlatformAddress } from '@/services/admin.service';
import UserPortfolio from '@/components/admin/user_portfolio';

export default function PlatformAssetOverview() {
    const [platformAddress, setPlatformAddress] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadAddress() {
            try {
                const addr = await getPlatformAddress();
                setPlatformAddress(addr);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setIsLoading(false);
            }
        }
        loadAddress();
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
                Loading Platform Treasury...
            </div>
        );
    }

    if (error || !platformAddress) {
        return (
            <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-6 text-center text-red-500">
                Error loading treasury: {error || 'Address not found'}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Platform Treasury</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Official Platform Asset & Liability Overview
                    </p>
                </div>
                <div className="rounded-full bg-slate-800 px-3 py-1 font-mono text-xs text-slate-300">
                    {platformAddress}
                </div>
            </div>

            <UserPortfolio
                initialAddress={platformAddress}
                enableSearch={false}
            />
        </div>
    );
}
