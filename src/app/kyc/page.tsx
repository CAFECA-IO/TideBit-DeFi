'use client';

import React, { useState } from 'react';
import { isAddress } from 'viem';
// Info: Import safe public config for Read-Only operations
import { publicClient } from '@/lib/viem_public';

export default function KycPage() {
  const [identityAddress, setIdentityAddress] = useState('');
  const [claimTopic, setClaimTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Info: (20260127 - Tzuhan) 1. Check Identity Contract (Read via RPC)
  const checkIdentity = async () => {
    if (!isAddress(identityAddress)) {
      setFeedback('Invalid Identity Address');
      return;
    }
    setLoading(true);
    try {
      // Info: (20260127 - Tzuhan) Simple check: get code to ensure contract exists
      const code = await publicClient.getCode({ address: identityAddress });
      if (!code || code === '0x') {
        setFeedback(`No contract found at ${identityAddress}`);
      } else {
        setFeedback(`Identity Contract Found (Code Size: ${code.length} bytes)`);
      }
    } catch (e) {
      setFeedback(`Error reading contract: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Info: (20260127 - Tzuhan) 2. Add Claim (Write via Relayer API)
  const handleAddClaim = async () => {
    if (!isAddress(identityAddress)) {
      setFeedback('Invalid Identity Contract Address.');
      return;
    }
    if (!claimTopic) {
      setFeedback('Please enter a Claim Topic.');
      return;
    }

    setLoading(true);
    setFeedback('Submitting claim request to Agent...');

    try {
      const response = await fetch('/api/v1/agent/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityAddress,
          topic: claimTopic,
          data: 'Approved via GUI',
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        setFeedback(`Success! Claim Added. Tx: ${result.payload.transactionHash}`);
      } else {
        setFeedback(`Failed: ${result.message}`);
      }
    } catch (e) {
      console.error(e);
      setFeedback(`Request Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Info: (20260127 - Tzuhan) Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance & KYC Management</h1>
            <p className="mt-2 text-sm text-gray-500">
              Interact with OnchainID Identity contracts via Agent Relayer.
            </p>
          </div>
        </div>

        {/* Info: (20260127 - Tzuhan) Connector Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Identity Status Check</h2>
          <div className="flex gap-4">
            <label htmlFor="identityAddress" className="sr-only">
              Identity Contract Address
            </label>
            <input
              id="identityAddress"
              aria-labelledby="identityAddressLabel"
              type="text"
              placeholder="0x... (Identity Contract Address)"
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              value={identityAddress}
              onChange={(e) => setIdentityAddress(e.target.value)}
            />
            <button
              onClick={checkIdentity}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
          {feedback && (
            <div
              className={`mt-4 rounded-lg border p-3 text-sm ${feedback.includes('Error') || feedback.includes('Failed') ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Info: (20260127 - Tzuhan) Claim Management Section */}
        {identityAddress && isAddress(identityAddress) && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Info: (20260127 - Tzuhan) Add Claim */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Add Claim (Agent)</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="mb-1 block text-xs font-medium text-gray-500">
                    Topic ID
                  </label>
                  <input
                    id="topic"
                    aria-labelledby="topicLabel"
                    type="text"
                    placeholder="e.g. 101 (KYC)"
                    value={claimTopic}
                    onChange={(e) => setClaimTopic(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
                  <strong>Mode:</strong> Server-Side Signing. The configured Relayer will sign and
                  add this claim.
                </div>
                <button
                  onClick={handleAddClaim}
                  disabled={loading}
                  className="w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Add Claim via Relayer'}
                </button>
              </div>
            </div>

            {/* Info: (20260127 - Tzuhan) Inspect Identity */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Contract Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-500">Contract</span>
                  <span className="font-mono">
                    {identityAddress.slice(0, 6)}...{identityAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-500">Node</span>
                  <span className="text-gray-400">Mainnet (RPC)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
