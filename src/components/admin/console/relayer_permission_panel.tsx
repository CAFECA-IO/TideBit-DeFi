'use client';

import React, { useState } from 'react';
import { Address } from 'viem';
import { account } from '@/lib/viem';
import { KYC_TOPIC_ID, publicClient } from '@/lib/viem_public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { Button } from '@/components/common/button';
import ConfirmModal from '@/components/common/confirm_modal';

const RelayerPermissionPanel: React.FC = () => {
  const [relayerAddress, setRelayerAddress] = useState<Address>(account?.address as Address);
  const [claimTopic, setClaimTopic] = useState(KYC_TOPIC_ID);
  const [fixing, setFixing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ isTrusted: boolean; hasTopic: boolean } | null>(null);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    isAlert: true,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showAlert = (title: string, message: string) => {
    setModal({
      isOpen: true,
      title,
      message,
      isAlert: true,
    });
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      // Info: (20260128 - Tzuhan) 直接從配置讀取，不再呼叫 IDENTITY_REGISTRY.trustedIssuersRegistry()
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
      showAlert('檢查失敗', '請確認 TrustedIssuersRegistry 地址是否正確。');
    } finally {
      setLoading(false);
    }
  };

  const handleFixPermission = async () => {
    setFixing(true);
    try {
      const res = await fetch('/api/v1/admin/grant_issuer_role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relayerAddress, topic: claimTopic }),
      });
      const result = await res.json();
      if (result.success) {
        showAlert('成功', '權限補足成功！');
        // Info: (20260128 - Tzuhan) 重新執行檢查以更新 UI 狀態
        // handleCheck();
      } else {
        showAlert('修復失敗', result.message);
      }
    } catch {
      showAlert('錯誤', '請求出錯');
    } finally {
      setFixing(false);
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
              value={claimTopic.toString()}
              onChange={(e) => setClaimTopic(BigInt(e.target.value))}
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
        {data && (!data.isTrusted || !data.hasTopic) && (
          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="mb-3 text-sm font-medium text-orange-800">
              ⚠️ 偵測到 Relayer 權限不足，這將導致 isVerified 永遠回傳 false。
            </p>
            <Button
              onClick={handleFixPermission}
              disabled={fixing}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {fixing ? '權限授權中...' : '立即補足 Relayer 鏈上權限'}
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={closeModal}
        onCancel={closeModal}
        confirmText="OK"
        isAlert={modal.isAlert}
      />
    </div>
  );
};
export default RelayerPermissionPanel;
