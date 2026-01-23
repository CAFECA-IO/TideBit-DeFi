'use client';

import React, { useEffect, useState } from 'react';
import { parseAbi, isAddress } from 'viem';
import { NTD_TOKEN_ADDRESS, publicClient } from '@/lib/viem-public';

// ABIs
const TOKEN_ABI = parseAbi(['function identityRegistry() view returns (address)']);
const IR_ABI = parseAbi([
  'function topicsRegistry() view returns (address)',
  'function trustedIssuersRegistry() view returns (address)',
  'function isVerified(address) view returns (bool)',
  'function identity(address) view returns (address)',
]);
const CTR_ABI = parseAbi(['function getClaimTopics() view returns (uint256[])']);
const TIR_ABI = parseAbi(['function getTrustedIssuers() view returns (address[])']);

export default function AdminIdentityPage() {
  // Read State
  const [registryAddr, setRegistryAddr] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [issuers, setIssuers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Check State
  const [checkAddr, setCheckAddr] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);

  // Approval State
  const [approveAddr, setApproveAddr] = useState('');
  const [approveType, setApproveType] = useState<'USER' | 'COMPANY'>('USER');
  const [approveLoading, setApproveLoading] = useState(false);

  const init = React.useCallback(async () => {
    if (!NTD_TOKEN_ADDRESS) return;
    try {
      const irAddress = await publicClient.readContract({
        address: NTD_TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'identityRegistry',
      });
      setRegistryAddr(irAddress);
      await fetchData(irAddress);
    } catch (e) {
      console.error('Error init:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  async function fetchData(irAddress: string) {
    try {
      const [ctrAddress, tirAddress] = await Promise.all([
        publicClient.readContract({
          address: irAddress as `0x${string}`,
          abi: IR_ABI,
          functionName: 'topicsRegistry',
        }),
        publicClient.readContract({
          address: irAddress as `0x${string}`,
          abi: IR_ABI,
          functionName: 'trustedIssuersRegistry',
        }),
      ]);

      const [claimTopics, trustedIssuers] = await Promise.all([
        publicClient.readContract({
          address: ctrAddress,
          abi: CTR_ABI,
          functionName: 'getClaimTopics',
        }),
        publicClient.readContract({
          address: tirAddress,
          abi: TIR_ABI,
          functionName: 'getTrustedIssuers',
        }),
      ]);

      setTopics(claimTopics.map((t) => t.toString()));
      setIssuers(trustedIssuers as string[]);
    } catch (e) {
      console.error('Fetch data failed', e);
    }
  }

  // --- Actions ---

  const handleCheckIdentity = async () => {
    if (!isAddress(checkAddr) || !registryAddr) return;
    setCheckLoading(true);
    setVerificationStatus('Checking...');
    try {
      const [isVerified, identityContract] = await Promise.all([
        publicClient.readContract({
          address: registryAddr as `0x${string}`,
          abi: IR_ABI,
          functionName: 'isVerified',
          args: [checkAddr],
        }),
        publicClient.readContract({
          address: registryAddr as `0x${string}`,
          abi: IR_ABI,
          functionName: 'identity',
          args: [checkAddr],
        }),
      ]);
      setVerificationStatus(
        isVerified ? `✅ Active & Verified (Identity: ${identityContract})` : `❌ Not Verified`
      );
    } catch {
      setVerificationStatus('Error checking status');
    } finally {
      setCheckLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!isAddress(approveAddr)) return alert('Invalid Address');
    setApproveLoading(true);
    try {
      const res = await fetch('/api/v1/kyc/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAddress: approveAddr,
          tokenAddress: NTD_TOKEN_ADDRESS,
          type: approveType,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(`Success! Identity Created.`);
        setCheckAddr(approveAddr);
      } else {
        alert(`Failed: ${result.message}`);
      }
    } catch (e) {
      alert(`Error: ${(e as Error).message}`);
    } finally {
      setApproveLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Registry Data...</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">Identity Registry</h2>
        <div className="mt-4 flex gap-4 font-mono text-sm text-gray-500">
          <div>
            Registry: <span className="text-blue-600">{registryAddr}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-indigo-900">🛂 KYC/KYB Approval</h3>
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="approveAddr" className="mb-1 block text-xs font-medium text-indigo-800">
              User SCW Address
            </label>
            <input
              id="approveAddr"
              aria-labelledby="approveAddrLabel"
              type="text"
              placeholder="0x..."
              value={approveAddr}
              onChange={(e) => setApproveAddr(e.target.value)}
              className="w-full rounded-md border border-indigo-300 p-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="approveType" className="mb-1 block text-xs font-medium text-indigo-800">
              Type
            </label>
            <select
              value={approveType}
              onChange={(e) => setApproveType(e.target.value as 'USER' | 'COMPANY')}
              className="w-full rounded-md border border-indigo-300 bg-white p-2.5 text-sm"
            >
              <option value="USER">User (101)</option>
              <option value="COMPANY">Company (102)</option>
            </select>
          </div>
          <button
            onClick={handleApprove}
            disabled={approveLoading}
            className="h-10 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {approveLoading ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Active Topics</h3>
          <div className="flex flex-wrap gap-2">
            {topics.length > 0 ? (
              topics.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  Topic #{t}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No topics found</span>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Trusted Issuers</h3>
          <ul className="space-y-2">
            {issuers.length > 0 ? (
              issuers.map((i) => (
                <li key={i} className="flex items-center gap-2 font-mono text-sm text-gray-600">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  {i}
                </li>
              ))
            ) : (
              <span className="text-gray-400">No issuers found</span>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Status Checker</h3>
        <div className="flex gap-4">
          <label htmlFor="checkAddr" className="sr-only">
            Address to check
          </label>
          <input
            id="checkAddr"
            aria-labelledby="checkAddrLabel"
            type="text"
            placeholder="0x..."
            className="flex-1 rounded-lg border border-gray-300 p-2"
            value={checkAddr}
            onChange={(e) => setCheckAddr(e.target.value)}
          />
          <button
            onClick={handleCheckIdentity}
            disabled={checkLoading}
            className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Verify
          </button>
        </div>
        {verificationStatus && (
          <div
            className={`mt-4 rounded-lg p-4 text-sm font-medium ${verificationStatus.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {verificationStatus}
          </div>
        )}
      </div>
    </div>
  );
}
