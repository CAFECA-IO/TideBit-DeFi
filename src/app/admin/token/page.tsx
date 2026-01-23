'use client';

import React, { useEffect, useState } from 'react';
import { formatUnits, parseAbi } from 'viem';
import { NTD_TOKEN_ADDRESS, publicClient } from '@/lib/viem-public';

import {
  adminMint,
  adminPause,
  adminUnpause,
  adminForcedTransfer,
  adminSetFrozen,
} from './actions';

const READ_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function paused() view returns (bool)',
  'function identityRegistry() view returns (address)',
  'function compliance() view returns (address)',
]);

interface ITokenState {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  paused: boolean;
  registry: string;
  compliance: string;
}

export default function AdminTokenPage() {
  const [data, setData] = useState<ITokenState | null>(null);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [forceFrom, setForceFrom] = useState('');
  const [forceTo, setForceTo] = useState('');
  const [forceAmount, setForceAmount] = useState('');
  const [freezeTarget, setFreezeTarget] = useState('');
  const [freezeAmount, setFreezeAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!NTD_TOKEN_ADDRESS) return;
    try {
      const [name, symbol, decimals, totalSupply, paused, registry, compliance] = await Promise.all(
        [
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'name',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'symbol',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'totalSupply',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'paused',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'identityRegistry',
          }),
          publicClient.readContract({
            address: NTD_TOKEN_ADDRESS,
            abi: READ_ABI,
            functionName: 'compliance',
          }),
        ]
      );

      setData({
        name: name as string,
        symbol: symbol as string,
        decimals: decimals as number,
        totalSupply: formatUnits(totalSupply as bigint, decimals as number),
        paused: paused as boolean,
        registry: registry as string,
        compliance: compliance as string,
      });
    } catch (e) {
      console.error('Failed to fetch token data', e);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (actionName: string, actionFn: () => Promise<string>) => {
    setOpLoading(true);
    setTxHash(null);
    try {
      const hash = await actionFn();
      setTxHash(hash);

      await publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });

      alert(`${actionName} Successful!`);
      fetchData();
    } catch (e) {
      console.error(e);
      alert(`${actionName} Failed: ${(e as Error).message}`);
    } finally {
      setOpLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Token Data...</div>;
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load data. Is the token address configured?
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {data.name} ({data.symbol})
            </h2>
            <p className="text-gray-500">Admin Console (Relayer Mode)</p>
          </div>
          <div className="text-right">
            <div
              className={`mb-2 inline-block rounded-full px-4 py-1 text-sm font-bold ${data.paused ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {data.paused ? '🛑 PAUSED' : '🟢 ACTIVE'}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Number(data.totalSupply).toLocaleString()}{' '}
              <span className="text-sm text-gray-400">Supply</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
          <span>🏦 Mint Tokens (Admin Only)</span>
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="mint-to-address"
              className="mb-1 block text-xs font-medium text-blue-800"
            >
              User SCW Address
            </label>
            <input
              id="mint-to-address"
              aria-labelledby="mint-to-label"
              type="text"
              placeholder="0x..."
              className="w-full rounded border border-blue-300 p-2 text-sm"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
            />
          </div>
          <div className="w-48">
            <label htmlFor="mint-amount" className="mb-1 block text-xs font-medium text-blue-800">
              Amount
            </label>
            <input
              id="mint-amount"
              aria-labelledby="mint-amount-label"
              type="number"
              placeholder="1000"
              className="w-full rounded border border-blue-300 p-2 text-sm"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>
          <button
            disabled={opLoading}
            onClick={() => handleAction('Mint', () => adminMint(mintTo, mintAmount, data.decimals))}
            className="h-10 rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Mint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">
            Forced Transfer (Recovery)
          </h3>
          <div className="space-y-3">
            <label
              htmlFor="force-from-address"
              className="mb-1 block text-xs font-medium text-gray-800"
            >
              From (Lost/Target SCW)
            </label>
            <input
              id="force-from-address"
              aria-label="From (Lost/Target SCW)"
              type="text"
              placeholder="From (Lost/Target SCW)"
              className="w-full rounded border p-2 text-sm"
              value={forceFrom}
              onChange={(e) => setForceFrom(e.target.value)}
            />
            <div className="flex gap-2">
              <label htmlFor="force-to-address" className="sr-only">
                To (New Owner)
              </label>
              <input
                id="force-to-address"
                aria-label="To (New Owner)"
                type="text"
                placeholder="To (New Owner)"
                className="flex-1 rounded border p-2 text-sm"
                value={forceTo}
                onChange={(e) => setForceTo(e.target.value)}
              />
              <label htmlFor="force-amount" className="sr-only">
                Amount
              </label>
              <input
                id="force-amount"
                aria-label="Amount"
                type="number"
                placeholder="Amount"
                className="w-32 rounded border p-2 text-sm"
                value={forceAmount}
                onChange={(e) => setForceAmount(e.target.value)}
              />
            </div>
            <button
              disabled={opLoading}
              onClick={() =>
                handleAction('Forced Transfer', () =>
                  adminForcedTransfer(forceFrom, forceTo, forceAmount, data.decimals)
                )
              }
              className="mt-2 w-full rounded bg-slate-800 py-2 text-sm text-white hover:bg-slate-900 disabled:opacity-50"
            >
              Execute Forced Transfer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 border-b pb-2 text-lg font-bold text-gray-800">
              Asset Seizure (Freeze)
            </h3>
            <div className="mt-4 flex gap-2">
              <label htmlFor="freeze-target" className="sr-only">
                Target SCW
              </label>
              <input
                id="freeze-target"
                aria-label="Target SCW"
                type="text"
                placeholder="Target SCW"
                className="flex-1 rounded border p-2 text-sm"
                value={freezeTarget}
                onChange={(e) => setFreezeTarget(e.target.value)}
              />
              <label htmlFor="freeze-amount" className="sr-only">
                Amount
              </label>
              <input
                id="freeze-amount"
                aria-label="Amount"
                type="number"
                placeholder="Amt"
                className="w-24 rounded border p-2 text-sm"
                value={freezeAmount}
                onChange={(e) => setFreezeAmount(e.target.value)}
              />
              <button
                disabled={opLoading}
                onClick={() =>
                  handleAction('Freeze', () =>
                    adminSetFrozen(freezeTarget, freezeAmount, data.decimals)
                  )
                }
                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Set
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-6 shadow-sm">
            <div>
              <h3 className="font-bold text-red-800">Emergency Stop</h3>
              <p className="text-xs text-red-600">Pause all token transfers.</p>
            </div>
            {data.paused ? (
              <button
                disabled={opLoading}
                onClick={() => handleAction('Unpause', () => adminUnpause())}
                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                ▶️ Unpause
              </button>
            ) : (
              <button
                disabled={opLoading}
                onClick={() => handleAction('Pause', () => adminPause())}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                ⏸️ Pause
              </button>
            )}
          </div>
        </div>
      </div>

      {txHash && (
        <div className="animate-pulse rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-blue-800">
          🚀 Transaction Sent! Hash: <span className="font-mono">{txHash}</span>
        </div>
      )}
    </div>
  );
}
