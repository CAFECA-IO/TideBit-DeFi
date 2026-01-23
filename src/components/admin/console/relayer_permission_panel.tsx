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
  const [claimTopic, setClaimTopic] = useState('1010100010000');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ isTrusted: boolean; hasTopic: boolean } | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    try {
      // 1. 從 Identity Registry 獲取目前的 TrustedIssuersRegistry 地址
      const tirAddress = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: ABIS.IDENTITY_REGISTRY,
        functionName: 'trustedIssuersRegistry',
      })) as Address;

      // 2. 檢查權限
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
      alert('查詢失敗，請檢查網路或合約地址。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Relayer 權限診斷</h2>
        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
          系統工具
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Relayer Address</label>
            <input
              value={relayerAddress}
              onChange={(e) => setRelayerAddress(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Claim Topic</label>
            <input
              value={claimTopic}
              onChange={(e) => setClaimTopic(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>

        <Button onClick={handleCheck} disabled={loading} className="w-full py-2">
          {loading ? '查詢中...' : '執行權限檢查'}
        </Button>

        {data && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div
              className={`rounded-lg p-3 text-center ${data.isTrusted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              <div className="text-xs uppercase">Trusted Issuer</div>
              <div className="text-lg font-bold">{data.isTrusted ? 'PASS' : 'FAIL'}</div>
            </div>
            <div
              className={`rounded-lg p-3 text-center ${data.hasTopic ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              <div className="text-xs uppercase">Topic Auth</div>
              <div className="text-lg font-bold">{data.hasTopic ? 'PASS' : 'FAIL'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelayerPermissionPanel;
