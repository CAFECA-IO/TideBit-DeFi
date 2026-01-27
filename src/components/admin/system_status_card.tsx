'use client';

import React, { useState, useEffect } from 'react';
import { publicClient } from '@/lib/viem-public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { pause, unpause } from '@/services/token.service';

export default function SystemStatusCard() {
    const { user: adminUser } = useAuth();
    const [isPaused, setIsPaused] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const status = await publicClient.readContract({
                address: CONTRACT_ADDRESSES.NTD_TOKEN,
                abi: ABIS.NTD_TOKEN,
                functionName: 'paused',
            });
            setIsPaused(status);
        } catch (e) {
            console.error('Failed to fetch system status:', e);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Optional: Poll every 10 seconds to keep status fresh
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleTogglePause = async () => {
        if (!adminUser) return alert('请先登入 Admin 钱包');
        if (isPaused === null) return;

        setIsLoading(true);
        try {
            const action = isPaused ? unpause : pause;
            const res = await action(CONTRACT_ADDRESSES.NTD_TOKEN);

            if (res.success) {
                alert(res.message);
                fetchStatus(); // Refresh immediately
            } else {
                alert('操作失败: ' + res.message);
            }
        } catch (e) {
            console.error(e);
            alert('Error: ' + (e as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-400">System Status</h3>
                {adminUser && isPaused !== null && (
                    <button
                        onClick={handleTogglePause}
                        disabled={isLoading}
                        className={`rounded px-2 py-1 text-xs font-bold transition-colors ${isPaused
                            ? 'bg-green-600 text-white hover:bg-green-500'
                            : 'bg-red-600 text-white hover:bg-red-500'
                            } disabled:opacity-50`}
                    >
                        {isLoading ? 'Processing...' : isPaused ? 'UNPAUSE' : 'PAUSE'}
                    </button>
                )}
            </div>

            <div className="mt-2 flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
                    {isPaused === null ? 'Loading...' : isPaused ? 'PAUSED' : 'ACTIVE'}
                </p>
            </div>

            <span className="text-xs text-slate-500">
                {isPaused ? 'Transfer Restrictions Active' : 'System Operational'}
            </span>
        </div>
    );
}
