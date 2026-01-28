import React, { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { publicClient } from '@/lib/viem_public';
import SystemStatusCard from '@/components/admin/system_status_card';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalSupply: 'Loading...',
    totalUsers: 'Unknown', // Info: (20260127 - Tzuhan) IRS doesn't exposure total users easily without events, mock for now or count events
    tokenName: '',
    tokenSymbol: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalSupply, name, symbol] = await Promise.all([
          publicClient.readContract({
            address: CONTRACT_ADDRESSES.NTD_TOKEN,
            abi: ABIS.NTD_TOKEN,
            functionName: 'totalSupply',
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESSES.NTD_TOKEN,
            abi: ABIS.NTD_TOKEN,
            functionName: 'name',
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESSES.NTD_TOKEN,
            abi: ABIS.NTD_TOKEN,
            functionName: 'symbol',
          }),
        ]);

        setStats({
          totalSupply: formatUnits(totalSupply, 18),
          totalUsers: 'N/A', // Info: (20260127 - Tzuhan) Requires event indexing
          tokenName: name,
          tokenSymbol: symbol,
        });
      } catch (e) {
        console.error('Failed to fetch dashboard stats', e);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-medium text-slate-400">Token Name</h3>
        <p className="text-2xl font-bold text-white">{stats.tokenName || '...'}</p>
        <span className="text-xs text-slate-500">{stats.tokenSymbol}</span>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-medium text-slate-400">Total Supply</h3>
        <p className="text-2xl font-bold text-blue-400">{stats.totalSupply}</p>
        <span className="text-xs text-slate-500">NTD</span>
      </div>

      <SystemStatusCard />

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-medium text-slate-400">Contract Address</h3>
        <p className="break-all font-mono text-sm text-slate-300">{CONTRACT_ADDRESSES.NTD_TOKEN}</p>
        <span className="text-xs text-slate-500">Token Contract</span>
      </div>
    </div>
  );
}
