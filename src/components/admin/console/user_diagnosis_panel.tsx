'use client';

import React, { useState } from 'react';
import { isAddress, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { publicClient } from '@/lib/viem-public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth_context';

export type DiagnosisStatus =
  | 'IDLE'
  | 'ANALYZING'
  | 'UNLINKED'
  | 'BROKEN_IDENTITY'
  | 'MISSING_CLAIMS'
  | 'VERIFIED';

interface IProps {
  onStatusChange: (status: DiagnosisStatus, address: string, identity?: string) => void;
}

export default function UserDiagnosisPanel({ onStatusChange }: IProps) {
  const { user: adminUser } = useAuth();
  const [inputAddress, setInputAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async () => {
    if (!isAddress(inputAddress)) {
      setError('無效的錢包地址');
      return;
    }
    if (!adminUser?.address) {
      setError('請先登入 Admin 錢包');
      return;
    }

    setError('');
    setLoading(true);
    onStatusChange('ANALYZING', inputAddress);

    try {
      // 1. 檢查 Registry 中是否有紀錄
      const identityAddr = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: ABIS.IDENTITY_REGISTRY,
        functionName: 'identity',
        args: [inputAddress],
      })) as `0x${string}`;

      const isLinked =
        identityAddr && identityAddr !== '0x0000000000000000000000000000000000000000';

      // [關鍵修正點]：如果是新用戶 (0x0 地址)，必須立刻中斷，不能執行後續的合約呼叫
      if (!isLinked) {
        console.log('偵測到新用戶，尚未連結身分合約');
        onStatusChange('UNLINKED', inputAddress);
        setLoading(false);
        return;
      }

      // 2. 檢查 Relayer 是否受信任 (針對 Topic 101)
      const relayerAddr = '0x5eBeE3dbDCED95DC901e2936B1476b961C32Fa92';
      const topic = BigInt(101); // 已校正為 101

      // 3. 檢查 Admin 對該 Identity 的管理權限 (避免 Zombie Contract)
      const relayerKey = keccak256(
        encodeAbiParameters(parseAbiParameters('address'), [relayerAddr as `0x${string}`])
      );
      const hasPermission = (await publicClient.readContract({
        address: identityAddr, // 此時 identityAddr 確定不是 0x0
        abi: ABIS.IDENTITY,
        functionName: 'keyHasPurpose',
        args: [relayerKey, BigInt(1)], // Purpose 1 = MANAGEMENT
      })) as boolean;

      if (!hasPermission) {
        onStatusChange('BROKEN_IDENTITY', inputAddress, identityAddr);
        setLoading(false);
        return;
      }

      const [isTrusted, hasTopicAuth] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY,
          abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
          functionName: 'isTrustedIssuer',
          args: [relayerAddr],
        }),
        publicClient.readContract({
          address: CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY,
          abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
          functionName: 'hasClaimTopic',
          args: [relayerAddr, topic],
        }),
      ]);

      if (!isTrusted || !hasTopicAuth) {
        setError(
          `系統配置錯誤：發行者或主題未授權 (Trusted=${isTrusted}, TopicAuth=${hasTopicAuth})`
        );
        onStatusChange('MISSING_CLAIMS', inputAddress, identityAddr);
        setLoading(false);
        return;
      }

      // 4. 檢查最終驗證狀態
      const isVerified = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: ABIS.IDENTITY_REGISTRY,
        functionName: 'isVerified',
        args: [inputAddress],
      })) as boolean;

      onStatusChange(isVerified ? 'VERIFIED' : 'MISSING_CLAIMS', inputAddress, identityAddr);
    } catch (e) {
      console.error('Diagnosis Error:', e);
      setError('診斷失敗：' + (e as Error).message);
      onStatusChange('IDLE', inputAddress);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">1. 用戶診斷 (Diagnosis)</h2>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label htmlFor="addr" className="mb-1 block text-xs font-medium text-gray-500">
            目標用戶地址 (User SCW)
          </label>
          <input
            id="addr"
            aria-label="User Smart Contract Wallet Address"
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
            placeholder="0x..."
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex items-end">
          <Button onClick={handleDiagnose} disabled={loading} className="h-[46px] min-w-120px">
            {loading ? '分析中...' : '開始診斷'}
          </Button>
        </div>
      </div>
    </div>
  );
}
