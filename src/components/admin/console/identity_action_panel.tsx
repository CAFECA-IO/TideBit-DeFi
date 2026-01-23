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
  const [countryCode, setCountryCode] = useState('42');
  const [topic, setTopic] = useState('1010100010000');

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/kyc/deploy_identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, countryCode }),
      });
      const data = await res.json();
      if (data.success) {
        alert('身分合約已部署並連結！');
        onRefresh();
      } else {
        alert('失敗: ' + data.message);
      }
    } catch (e) {
      alert('請求錯誤: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

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
        alert('憑證核發成功！');
        onRefresh();
      } else {
        alert('失敗: ' + data.message);
        console.error(data.details);
      }
    } catch (e) {
      alert('請求錯誤: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'IDLE' || status === 'ANALYZING' || status === 'VERIFIED') return null;

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${
        status === 'MISSING_CLAIMS' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <h2
        className={`mb-2 text-xl font-bold ${
          status === 'MISSING_CLAIMS' ? 'text-yellow-800' : 'text-red-800'
        }`}
      >
        2. 合規修復行動
      </h2>

      {/* Info: (20260123 - Tzuhan) 情況 A: 從未部署 */}
      {status === 'UNLINKED' && (
        <div>
          <p className="mb-4 text-sm text-red-700">
            此地址尚未連結 ERC-3643 身分合約。請執行部署。
          </p>
          <div className="flex items-end gap-4">
            <div className="w-32">
              <label htmlFor="countryCode" className="mb-1 block text-xs font-bold text-red-800">
                國碼 (ISO)
              </label>
              <input
                id="countryCode"
                aria-label="Country Code (ISO)"
                type="number"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded border border-red-200 p-2 text-sm"
              />
            </div>
            <Button onClick={handleDeploy} disabled={loading} variant="default">
              {loading ? '部署中...' : '部署並註冊身分'}
            </Button>
          </div>
        </div>
      )}

      {/* Info: (20260123 - Tzuhan) 情況 B: 合約壞掉 (無權限) -> 強制重新部署 */}
      {status === 'BROKEN_IDENTITY' && (
        <div>
          <div className="mb-4 rounded-md bg-red-100 p-3">
            <p className="font-bold text-red-900">⚠️ 身分合約權限異常 (Zombie Contract)</p>
            <p className="text-sm text-red-700">
              偵測到合約 <span className="font-mono">{identityAddress}</span> 存在，但 Admin
              沒有管理權限（可能是部署參數錯誤導致）。
              <br />
              建議：<b>強制重新部署</b>一個新的 Identity 合約來覆蓋舊的連結。
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div className="w-32">
              <label htmlFor="countryCode" className="mb-1 block text-xs font-bold text-red-800">
                國碼 (ISO)
              </label>
              <input
                id="countryCode"
                aria-label="Country Code (ISO)"
                type="number"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded border border-red-200 p-2 text-sm"
              />
            </div>
            <Button
              onClick={handleDeploy}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? '修復中...' : '強制重新部署 (Repair)'}
            </Button>
          </div>
        </div>
      )}

      {/* Info: (20260123 - Tzuhan) 情況 C: 缺 Claims */}
      {status === 'MISSING_CLAIMS' && (
        <div>
          <p className="mb-4 text-sm text-yellow-800">
            身分合約運作正常 (<span className="font-mono text-xs">{identityAddress}</span>
            )，但缺少必要憑證。
          </p>
          <div className="flex items-end gap-4">
            <div className="w-48">
              <label
                htmlFor="claimTopicId"
                className="mb-1 block text-xs font-bold text-yellow-800"
              >
                Claim Topic ID
              </label>
              <select
                id="claimTopicId"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded border border-yellow-200 bg-white p-2 text-sm"
              >
                <option value="1010100010000">KYC_PASSED (101...)</option>
                <option value="1010100020000">ACCREDITED (101...2)</option>
              </select>
            </div>
            <Button
              onClick={handleIssueClaim}
              disabled={loading}
              className="bg-yellow-600 text-white hover:bg-yellow-700"
            >
              {loading ? '簽署中...' : '核發憑證 (Sign Claim)'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
