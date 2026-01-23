// src/components/admin/console/identity_action_panel.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/button';
import { DiagnosisStatus } from './user_diagnosis_panel';

interface IProps {
  status: DiagnosisStatus;
  userAddress: string;
  identityAddress?: string;
  onRefresh: () => void;
}

export default function IdentityActionPanel({
  status,
  userAddress,
  identityAddress,
  onRefresh,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('886'); // 預設台灣國碼
  const [topic, setTopic] = useState('101'); // 根據 deploy.ts 預設為 101

  // 執行：部署身分合約 + registerIdentity
  const handleDeployAndLink = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/kyc/deploy_identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, countryCode }),
      });
      const data = await res.json();
      if (data.success) {
        alert('身分合約已部署並成功連結至 Registry！');
        onRefresh(); // 觸發重新診斷
      } else {
        alert('部署失敗: ' + data.message);
      }
    } catch  {
      alert('請求錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 執行：核發 Topic 101 憑證
  const handleIssueClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/kyc/add_claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityAddress, topic }),
      });
      const data = await res.json();
      if (data.success) {
        alert('KYC 憑證 (Topic 101) 核發成功！');
        onRefresh(); // 觸發重新診斷
      } else {
        alert('核發失敗: ' + data.message);
      }
    } catch {
      alert('請求錯誤');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'IDLE' || status === 'ANALYZING' || status === 'VERIFIED') return null;

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${
      status === 'MISSING_CLAIMS' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
    }`}>
      <h2 className={`mb-4 text-xl font-bold ${
        status === 'MISSING_CLAIMS' ? 'text-yellow-800' : 'text-red-800'
      }`}>
        2. 合規修復行動 (分步操作)
      </h2>

      {/* 情況 A: 尚未註冊 (UNLINKED) */}
      {status === 'UNLINKED' && (
        <div className="space-y-4">
          <p className="text-sm text-red-700">此地址尚未連結身分合約。請執行「部署並註冊」流程。</p>
          <div className="flex items-end gap-4">
            <div className="w-32">
              <label htmlFor="countryCode" className="mb-1 block text-xs font-bold text-red-800">國碼 (ISO)</label>
              <input
                id="countryCode"
                aria-label='Country Code'
                type="number"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded border border-red-200 p-2 text-sm"
              />
            </div>
            <Button onClick={handleDeployAndLink} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700">
              {loading ? '執行中...' : '部署並註冊身分 (Deploy & Link)'}
            </Button>
          </div>
        </div>
      )}

      {/* 情況 B: 缺少憑證 (MISSING_CLAIMS) */}
      {status === 'MISSING_CLAIMS' && (
        <div className="space-y-4">
          <p className="text-sm text-yellow-800">
            身分連結已建立，但缺少必要憑證。請執行「核發憑證」流程。
          </p>
          <div className="flex items-end gap-4">
            <div className="w-48">
              <label htmlFor="claimTopicId" className="mb-1 block text-xs font-bold text-yellow-800">Claim Topic ID</label>
              <select
                id="claimTopicId"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded border border-yellow-200 bg-white p-2 text-sm"
              >
                <option value="101">KYC_PASSED (101)</option>
                <option value="102">ACCREDITED (102)</option>
              </select>
            </div>
            <Button onClick={handleIssueClaim} disabled={loading} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
              {loading ? '簽署中...' : '核發憑證 (Issue Claim 101)'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}