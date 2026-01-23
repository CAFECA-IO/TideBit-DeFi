'use client';

import React, { useState } from 'react';
import { isAddress, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { publicClient } from '@/lib/viem-public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth_context';

// Info: (20260123 - Tzuhan) 新增 BROKEN 狀態
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
  const { user: adminUser } = useAuth(); // Info: (20260123 - Tzuhan) 取得當前登入的 Admin 地址
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
      if (!CONTRACT_ADDRESSES.IDENTITY_REGISTRY) throw new Error('Registry Config Missing');

      // Info: (20260123 - Tzuhan) 1. 檢查 Registry 中是否有紀錄
      const identityAddr = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: ABIS.IDENTITY_REGISTRY,
        functionName: 'identity',
        args: [inputAddress],
      });

      const hasIdentity =
        identityAddr && identityAddr !== '0x0000000000000000000000000000000000000000';

      if (!hasIdentity) {
        onStatusChange('UNLINKED', inputAddress);
        setLoading(false);
        return;
      }

      // Info: (20260123 - Tzuhan) 2. [關鍵修正] 檢查 Identity 合約是否「壞掉」(Admin 是否有 Management Key)
      // Info: (20260123 - Tzuhan) Key 的計算方式通常是 keccak256(abi.encode(address))
      const adminKey = keccak256(
        encodeAbiParameters(parseAbiParameters('address'), [adminUser.address as `0x${string}`])
      );

      const hasPermission = await publicClient.readContract({
        address: identityAddr,
        abi: ABIS.IDENTITY,
        functionName: 'keyHasPurpose',
        args: [adminKey, BigInt(1)], // Info: (20260123 - Tzuhan) Purpose 1 = MANAGEMENT
      });

      if (!hasPermission) {
        console.warn('Identity exists but Admin has no permission. Contract might be broken.');
        onStatusChange('BROKEN_IDENTITY', inputAddress, identityAddr);
        setLoading(false);
        return;
      }

      // Info: (20260123 - Tzuhan) 3. 檢查是否通過驗證 (有無 Claim)
      const isVerified = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: ABIS.IDENTITY_REGISTRY,
        functionName: 'isVerified',
        args: [inputAddress],
      });

      if (!isVerified) {
        onStatusChange('MISSING_CLAIMS', inputAddress, identityAddr);
      } else {
        onStatusChange('VERIFIED', inputAddress, identityAddr);
      }
    } catch (e) {
      console.error(e);
      setError('診斷過程發生錯誤: ' + (e as Error).message);
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
            type="text"
            aria-label="User Smart Contract Wallet Address"
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
