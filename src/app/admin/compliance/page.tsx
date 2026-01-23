'use client';

import React, { useEffect, useState } from 'react';
import { parseAbi, isAddress, parseEther } from 'viem';
import { NTD_TOKEN_ADDRESS, publicClient } from '@/lib/viem-public';

// Extended ABI to include canTransfer check
const TOKEN_ABI = parseAbi(['function compliance() view returns (address)']);
const COMPLIANCE_ABI = parseAbi([
  'function getModules() view returns (address[])',
  'function canTransfer(address from, address to, uint256 amount) view returns (bool)',
]);

export default function AdminCompliancePage() {
  const [complianceAddr, setComplianceAddr] = useState<string>('');
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [simFrom, setSimFrom] = useState('');
  const [simTo, setSimTo] = useState('');
  const [simAmount, setSimAmount] = useState('100');
  const [simResult, setSimResult] = useState<boolean | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    async function init() {
      if (!NTD_TOKEN_ADDRESS) return;
      try {
        // 1. Get Compliance Address from Token
        const addr = await publicClient.readContract({
          address: NTD_TOKEN_ADDRESS,
          abi: TOKEN_ABI,
          functionName: 'compliance',
        });
        setComplianceAddr(addr);

        // 2. Get Bound Modules
        const mods = await publicClient.readContract({
          address: addr,
          abi: COMPLIANCE_ABI,
          functionName: 'getModules',
        });
        setModules(mods as string[]);
      } catch (e) {
        console.error('Error fetching compliance data', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSimulate = async () => {
    if (!complianceAddr || !isAddress(simFrom) || !isAddress(simTo)) {
      alert('Please enter valid addresses');
      return;
    }
    setSimLoading(true);
    setSimResult(null);
    try {
      const result = await publicClient.readContract({
        address: complianceAddr as `0x${string}`,
        abi: COMPLIANCE_ABI,
        functionName: 'canTransfer',
        args: [simFrom, simTo, parseEther(simAmount)],
      });
      setSimResult(result);
    } catch (e) {
      console.error(e);
      alert('Simulation failed');
    } finally {
      setSimLoading(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading Compliance Data...</div>;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Compliance Engine</h2>
            <p className="mt-1 font-mono text-sm text-gray-500">{complianceAddr}</p>
            <p className="mt-2 inline-block rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600">
              Type: ModularCompliance (ERC-3643 Standard)
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Status
            </div>
            <div className="flex items-center justify-end gap-2 font-bold text-green-600">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
              </span>
              Active
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Simulator Card (New Feature for SimpleCompliance) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-900">Transfer Simulator</h3>
          <p className="mb-4 text-sm text-gray-500">
            Test if a transfer would be allowed by the current compliance rules.
            <br />
            (Checks against all bound modules).
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="simFrom" className="mb-1 block text-xs font-medium text-gray-700">
                From (Sender)
              </label>
              <input
                id="simFrom"
                aria-labelledby="simFromLabel"
                type="text"
                value={simFrom}
                onChange={(e) => setSimFrom(e.target.value)}
                placeholder="0x00...00 (Try 0x000... for Mint check)"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="simTo" className="mb-1 block text-xs font-medium text-gray-700">
                To (Receiver)
              </label>
              <input
                id="simTo"
                aria-labelledby="simToLabel"
                type="text"
                value={simTo}
                onChange={(e) => setSimTo(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="simAmount" className="mb-1 block text-xs font-medium text-gray-700">
                Amount
              </label>
              <input
                id="simAmount"
                aria-labelledby="simAmountLabel"
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSimulate}
              disabled={simLoading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {simLoading ? 'Checking...' : 'Check Compliance Rule'}
            </button>

            {simResult !== null && (
              <div
                className={`mt-4 rounded-lg border p-4 text-center ${simResult ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}
              >
                <div className="mb-1 text-2xl font-bold">{simResult ? 'ALLOWED' : 'REJECTED'}</div>
                <div className="text-xs opacity-80">
                  SimpleCompliance checks returned {simResult.toString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modules List */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-900">Bound Modules</h3>
          {modules.length > 0 ? (
            <div className="space-y-3">
              {modules.map((mod, idx) => (
                <div
                  key={mod}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {idx + 1}
                  </div>
                  <div className="break-all font-mono text-xs text-gray-600">{mod}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-400">
              <span className="mb-2 text-4xl">🛡️</span>
              <p className="text-sm">No external modules bound.</p>
              <p className="mt-1 text-xs text-gray-400">(No restrictions applied)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
