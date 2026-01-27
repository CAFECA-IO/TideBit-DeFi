'use client';

import { useState } from 'react';
import { createPublicClient, http, parseAbi, formatUnits, isAddress } from 'viem';
import { mainnet } from 'viem/chains';

const RPC_URL = 'https://mainnet.isuncoin.com';

export default function BalanceChecker({ tokenAddress }: { tokenAddress: string }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Info: (20260126 - Luphia) Check balance for custom address
  const checkBalance = async () => {
    if (!address) return;
    if (!isAddress(address)) {
      setError('Invalid address format');
      setBalance(null);
      return;
    }

    setLoading(true);
    setError('');
    setBalance(null);

    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(RPC_URL),
      });

      const bal = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });

      setBalance(formatUnits(bal, 18));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
        Balance Checker
        <span className="rounded bg-slate-800 px-2 py-1 text-xs font-normal text-slate-500">Tool</span>
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            placeholder="Enter Wallet Address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 rounded border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            aria-label="Wallet Address"
          />
          <button
            onClick={checkBalance}
            disabled={loading}
            className="rounded bg-cyan-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-cyan-500 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Balance'}
          </button>
        </div>

        {error && (
          <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {balance !== null && (
          <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="text-sm text-emerald-400/80">Balance for {address.slice(0, 6)}...{address.slice(-4)}</div>
            <div className="font-mono text-2xl font-bold text-emerald-300">
              {balance} <span className="text-sm text-emerald-500">TWD</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
