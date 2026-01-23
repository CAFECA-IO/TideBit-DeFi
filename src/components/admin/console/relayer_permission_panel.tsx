'use client';

import React, { useState } from 'react';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { Button } from '@/components/common/button';
import { Address } from 'viem';

const RelayerPermissionPanel: React.FC = () => {
  const [relayerAddress, setRelayerAddress] = useState<Address>(
    '0x5eBeE3dbDCED95DC901e2936B1476b961C32Fa92'
  );
  const [claimTopic, setClaimTopic] = useState(101);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ isTrusted: boolean; hasTopic: boolean } | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    try {
      // 直接從配置讀取，不再呼叫 IDENTITY_REGISTRY.trustedIssuersRegistry()
      const tirAddress = CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY;

      const [isTrusted, hasTopic] = await Promise.all([
        publicClient.readContract({
          address: tirAddress,
          abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
          functionName: 'isTrustedIssuer',
          args: [relayerAddress],
        }),
        publicClient.readContract({
          address: tirAddress,
          abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
          functionName: 'hasClaimTopic',
          args: [relayerAddress, BigInt(claimTopic)],
        }),
      ]);

      setData({ isTrusted: isTrusted as boolean, hasTopic: hasTopic as boolean });
    } catch (error) {
      console.error('Check Permission Error:', error);
      alert('檢查失敗，請確認 TrustedIssuersRegistry 地址是否正確。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Relayer 權限診斷</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="relayerAddress" className="text-sm font-medium text-gray-500">
              Relayer Address
            </label>
            <input
              id="relayerAddress"
              aria-label="Relayer Address"
              value={relayerAddress}
              onChange={(e) => setRelayerAddress(e.target.value as Address)}
              className="w-full rounded border p-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="claimTopic" className="text-sm font-medium text-gray-500">
              Claim Topic
            </label>
            <input
              id="claimTopic"
              aria-label="Claim Topic"
              type="number"
              value={claimTopic}
              onChange={(e) => setClaimTopic(Number(e.target.value))}
              className="w-full rounded border p-2 text-sm"
            />
          </div>
        </div>
        <Button onClick={handleCheck} disabled={loading} className="w-full">
          {loading ? '檢查中...' : '執行權限檢查'}
        </Button>
        {data && (
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`rounded p-3 text-center ${data.isTrusted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              <div className="text-xs">Trusted Issuer</div>
              <div className="text-lg font-bold">{data.isTrusted ? 'PASS' : 'FAIL'}</div>
            </div>
            <div
              className={`rounded p-3 text-center ${data.hasTopic ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              <div className="text-xs">Topic Auth</div>
              <div className="text-lg font-bold">{data.hasTopic ? 'PASS' : 'FAIL'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelayerPermissionPanel;
