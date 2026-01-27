'use client';

import React, { useState } from 'react';
import UserDiagnosisPanel, {
  DiagnosisStatus,
} from '@/components/admin/console/user_diagnosis_panel';
import IdentityActionPanel from '@/components/admin/console/identity_action_panel';
import AssetMintingPanel from '@/components/admin/console/asset_minting_panel';
import RelayerPermissionPanel from '@/components/admin/console/relayer_permission_panel';
import ComplianceCheckPanel from '@/components/admin/console/compliance_check_panel';

export default function AdminConsolePage() {
  const [status, setStatus] = useState<DiagnosisStatus>('IDLE');
  const [targetAddress, setTargetAddress] = useState('');
  const [identityAddress, setIdentityAddress] = useState('');

  const handleStatusChange = (newStatus: DiagnosisStatus, addr: string, idAddr?: string) => {
    setStatus(newStatus);
    setTargetAddress(addr);
    if (idAddr) setIdentityAddress(idAddr);
  };

  const refreshDiagnosis = () => {
    // Info: (20260123 - Tzuhan) 觸發重新診斷的邏輯，這裡簡單重置狀態讓 UserDiagnosisPanel 可以再次點擊
    // Info: (20260123 - Tzuhan) 實務上可以將 trigger 傳入 Panel
    alert('操作完成，請重新點擊診斷以更新狀態。');
    setStatus('IDLE');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Lifecycle Console</h1>
        <p className="text-gray-500">一站式管理用戶合規身分與資產發行</p>
      </div>

      {/* Info: (20260123 - Tzuhan) 區域一：診斷 */}
      <UserDiagnosisPanel onStatusChange={handleStatusChange} />

      {/* Info: (20260123 - Tzuhan) 區域二：合規行動 (僅在紅燈/黃燈時顯示) */}
      {(status === 'UNLINKED' || status === 'MISSING_CLAIMS') && (
        <div className="animate-fade-in-down">
          <IdentityActionPanel
            status={status}
            userAddress={targetAddress}
            identityAddress={identityAddress}
            onRefresh={refreshDiagnosis}
          />
        </div>
      )}

      {/* 👇 2. 新增區域：合規檢測面板 (常駐顯示，方便隨時貼 Hash 檢查) */}
      <ComplianceCheckPanel defaultAddress={targetAddress} />

      {/* Info: (20260123 - Tzuhan) 區域三：資產鑄造 (僅在綠燈時顯示) */}
      {status === 'VERIFIED' && (
        <div className="animate-fade-in-up">
          <AssetMintingPanel targetAddress={targetAddress} />
        </div>
      )}

      {/* Info: (20260123 - Tzuhan) 區域四：Relayer 權限診斷 (常駐顯示) */}
      <RelayerPermissionPanel />

      {/* Info: (20260123 - Tzuhan) 狀態指示標籤 (Debug 用或 UX 輔助) */}
      <div className="fixed bottom-4 right-4 rounded-full bg-slate-800 px-4 py-2 text-xs text-white opacity-50 shadow-lg hover:opacity-100">
        Current State: {status}
      </div>
    </div>
  );
}
