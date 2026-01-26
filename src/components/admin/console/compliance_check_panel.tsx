'use client';

import React, { useState, useEffect } from 'react';
import { publicClient } from '@/lib/viem'; 
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts'; 
import { parseAbi } from 'viem'; // 引入 parseAbi 用於臨時定義 Compliance 介面

interface IProps {
  defaultAddress?: string;
}

// Info: (20260126 - Tzuhan) 定義 Compliance 合約的進階查詢介面
const COMPLIANCE_ABI = parseAbi([
  'function modules() external view returns (address[])',
  'function getTokenBound() external view returns (address)',
]);

export default function ComplianceCheckPanel({ defaultAddress = '' }: IProps) {
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [checkAddr, setCheckAddr] = useState(defaultAddress);
  
  // 基礎合規狀態
  const [complianceAddr, setComplianceAddr] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  
  // 進階合規診斷 (New)
  const [boundToken, setBoundToken] = useState<string>('');
  const [installedModules, setInstalledModules] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultAddress) setCheckAddr(defaultAddress);
  }, [defaultAddress]);

  // 功能 1: 檢查交易 Hash 狀態
  const checkTransaction = async () => {
    if (!txHash) return;
    setLoading(true);
    setTxStatus('查詢中...');
    try {
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash as `0x${string}` 
      });
      
      if (receipt.status === 'success') {
        setTxStatus(`✅ 交易成功 (Block: ${receipt.blockNumber})`);
      } else {
        setTxStatus('❌ 交易失敗 (Reverted)');
      }
    } catch (err) {
      console.error(err);
      setTxStatus('⚠️ 查無此交易或網路錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 功能 2 & 3 & 4: 完整合規性檢查 (Token -> Compliance -> Modules)
  const checkComplianceStatus = async () => {
    setLoading(true);
    setBoundToken('');
    setInstalledModules([]);
    
    try {
      // A. 查詢 Token 目前綁定的 Compliance 合約
      const compAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.NTD_TOKEN,
        abi: ABIS.NTD_TOKEN, // 確保 config/contracts.ts 裡有 compliance()
        functionName: 'compliance',
      }) as string;
      setComplianceAddr(compAddress);

      // B. 查詢用戶是否通過驗證
      if (checkAddr) {
        const verified = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
          abi: ABIS.IDENTITY_REGISTRY,
          functionName: 'isVerified',
          args: [checkAddr as `0x${string}`],
        }) as boolean;
        setIsVerified(verified);
      }

      // C. (新功能) 進階診斷：反查 Compliance 合約詳情
      if (compAddress && compAddress !== '0x0000000000000000000000000000000000000000') {
        // C-1. 反向確認：Compliance 認為它綁定的是哪個 Token?
        const tokenBound = await publicClient.readContract({
          address: compAddress as `0x${string}`,
          abi: COMPLIANCE_ABI,
          functionName: 'getTokenBound',
        });
        setBoundToken(tokenBound);

        // C-2. 查詢模組：目前安裝了哪些規則模組 (Modules)?
        const modules = await publicClient.readContract({
          address: compAddress as `0x${string}`,
          abi: COMPLIANCE_ABI,
          functionName: 'modules',
        });
        setInstalledModules([...modules]);
      }

    } catch (err) {
      console.error(err);
      alert('讀取合約失敗，請確認 ABI 設定與網路連線');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
        🔍 合規與交易檢測 (Compliance Debugger)
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 左側：交易狀態查詢 */}
        <div className="rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-700">1. 交易狀態 (Tx Status)</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="貼上 Tx Hash (0x...)"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="flex-1 rounded border p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={checkTransaction}
              disabled={loading || !txHash}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              檢查
            </button>
          </div>
          {txStatus && (
            <div className={`mt-3 rounded border p-2 text-sm font-medium ${txStatus.includes('成功') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {txStatus}
            </div>
          )}
        </div>

        {/* 右側：合規性檢查 (包含新功能) */}
        <div className="rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 flex justify-between font-semibold text-gray-700">
            <span>2. 鏈上合規診斷 (On-Chain)</span>
            <button
              onClick={checkComplianceStatus}
              disabled={loading}
              className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
            >
              {loading ? '讀取中...' : '⟳ 刷新狀態'}
            </button>
          </h3>
          
          <div className="mb-3 flex gap-2">
             <input 
               value={checkAddr} 
               onChange={(e) => setCheckAddr(e.target.value)}
               className="w-full rounded border p-2 text-sm focus:border-indigo-500 focus:outline-none"
               placeholder="目標用戶地址 (SCW) 0x..."
             />
          </div>

          <div className="space-y-3 text-sm">
            {/* 基礎檢查 */}
            <div className="border-b pb-2">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Identity Verified:</span>
                <span className={`font-bold ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {isVerified === null ? '---' : (isVerified ? '✅ 通過 (Verified)' : '❌ 未通過')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Token Compliance:</span>
                <span className="font-mono text-xs text-gray-800" title={complianceAddr}>
                  {complianceAddr ? `${complianceAddr.slice(0, 6)}...${complianceAddr.slice(-4)}` : '尚未讀取'}
                </span>
              </div>
            </div>

            {/* 新功能：進階合規檢查 */}
            {complianceAddr && (
              <div className="rounded bg-indigo-50 p-2">
                <div className="mb-1 text-xs font-bold text-indigo-800">Compliance Contract Details:</div>
                
                {/* 1. 雙向綁定檢查 */}
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Reverse Bind (Token):</span>
                  <span className={`font-mono text-xs ${boundToken === CONTRACT_ADDRESSES.NTD_TOKEN ? 'text-green-600' : 'text-red-600'}`}>
                    {boundToken 
                      ? (boundToken === CONTRACT_ADDRESSES.NTD_TOKEN ? '✅ Match' : '❌ Mismatch') 
                      : 'Checking...'}
                  </span>
                </div>

                {/* 2. 安裝模組列表 */}
                <div className="mt-1">
                  <div className="text-gray-600">Active Modules ({installedModules.length}):</div>
                  {installedModules.length > 0 ? (
                    <ul className="mt-1 list-disc pl-4 font-mono text-xs text-gray-700">
                      {installedModules.map((mod, idx) => (
                        <li key={idx}>{mod}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs italic text-gray-400">No modules installed (Allow All?)</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}