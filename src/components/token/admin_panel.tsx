'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deploySystem, mintToAddress, registerUser } from '@/services/token.service';
import ConfirmModal from '@/components/common/confirm_modal';

// Info: (20260126 - Luphia) 管理面板元件：提供部署與鑄造介面
export default function AdminPanel({ currentTokenAddress }: { currentTokenAddress: string }) {
  const router = useRouter();
  const [deployStatus, setDeployStatus] = useState('');
  const [mintStatus, setMintStatus] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('1000');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [newTokenInfo, setNewTokenInfo] = useState<{
    token: string;
    registry: string;
    compliance: string;
    claimTopicsRegistry?: string;
    trustedIssuersRegistry?: string;
    identityRegistryStorage?: string;
    issuerIdentity?: string;
  } | null>(null);

  // Info: (20260126 - Luphia) Confirmation Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeModal();
      }
    });
  };

  const handleDeploy = async () => {
    showConfirm('Confirm Deployment', '確定要部署全新的 TWD 系統嗎？這將會產生新的合約地址。', async () => {
      setIsDeploying(true);
      setDeployStatus('部署中... (這可能需要幾分鐘)');

      try {
        const result = await deploySystem('New Taiwan Dollar', 'TWD', 18);
        if (result.success) {
          // Info: (20260127 - Luphia) Cast unknown data to expected type
          const data = result.data as { token: string };
          setDeployStatus(`✅ 部署成功! Token: ${data.token}`);
          setNewTokenInfo(result.data as unknown as { token: string; registry: string; compliance: string }); // Info: (20260127 - Luphia) Specific cast
          // Info: (20260126 - Luphia) 部署成功後更新 URL 以重整頁面
          router.push(`?address=${data.token}`);
        } else {
          setDeployStatus(`❌ 失敗: ${result.message}`);
        }
      } catch (e) {
        setDeployStatus(`❌ 錯誤: ${String(e)}`);
      } finally {
        setIsDeploying(false);
      }
    });
  };

  const handleMint = async () => {
    if (!targetAddress || !mintAmount) return;

    const executeMint = async () => {
      setIsMinting(true);
      setMintStatus('鑄造中...');

      try {
        // Info: (20260127 - Luphia) 優先使用新部署的 Token 地址，否則使用傳入的當前地址
        const token = newTokenInfo?.token || currentTokenAddress;

        const result = await mintToAddress(token, targetAddress, parseInt(mintAmount));
        if (result.success) {
          setMintStatus(`✅ ${result.message}`);
        } else {
          // Info: (20260127 - Luphia) 如果失敗，嘗試提示註冊
          if (result.message.includes('Identity')) {
            setIsMinting(false); // Stop loading to show modal
            showConfirm('Identity Required', '鑄造失敗，該用戶可能尚未註冊 Identity。是否嘗試立即註冊該用戶？', async () => {
              setIsMinting(true); // Restart loading
              setMintStatus('正在嘗試註冊用戶...');
              const regResult = await registerUser(token, targetAddress);
              if (regResult.success) {
                setMintStatus('✅ 用戶註冊成功！正在重試鑄造...');
                // Info: (20260127 - Luphia) 重試 mint
                const retryResult = await mintToAddress(token, targetAddress, parseInt(mintAmount));
                setMintStatus(retryResult.success ? `✅ ${retryResult.message}` : `❌ 重試失敗: ${retryResult.message}`);
              } else {
                setMintStatus(`❌ 註冊失敗: ${regResult.message}`);
              }
              setIsMinting(false);
            });
            return;
          } else {
            setMintStatus(`❌ 失敗: ${result.message}`);
          }
        }
      } catch (e) {
        setMintStatus(`❌ 錯誤: ${String(e)}`);
      } finally {
        // Only stop if we didn't show the modal (which handles its own state)
        if (!mintStatus.includes('尚未註冊')) {
          setIsMinting(false);
        }
      }
    };

    executeMint();
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-pink-400">
        Admin Panel
        <span className="rounded bg-slate-800 px-2 py-1 text-xs font-normal text-slate-500">Deployment & Minting</span>
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Info: (20260127 - Luphia) 部署區塊 */}
        <div className="rounded border border-slate-700 bg-slate-800/30 p-4">
          <h3 className="mb-2 text-lg font-medium text-slate-200">System Deployment</h3>
          <p className="mb-4 text-xs text-slate-400">
            部署全套 ERC-3643 合約 (Registry, Compliance, Token)。
          </p>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full rounded bg-pink-600 px-4 py-2 font-bold text-white transition hover:bg-pink-500 disabled:opacity-50"
          >
            {isDeploying ? 'Deploying...' : 'Deploy New System'}
          </button>
          {deployStatus && (
            <div className="mt-4 break-all rounded border border-slate-700 bg-black/50 p-2 font-mono text-xs">
              {deployStatus}
              {newTokenInfo && (
                <div className="mt-2 text-emerald-400">
                  <div>Token: {newTokenInfo.token}</div>
                  <div>Registry: {newTokenInfo.registry}</div>
                  <div>Compliance: {newTokenInfo.compliance}</div>
                  {newTokenInfo.claimTopicsRegistry && <div>CTR: {newTokenInfo.claimTopicsRegistry}</div>}
                  {newTokenInfo.trustedIssuersRegistry && <div>TIR: {newTokenInfo.trustedIssuersRegistry}</div>}
                  {newTokenInfo.identityRegistryStorage && <div>IRS: {newTokenInfo.identityRegistryStorage}</div>}
                  {newTokenInfo.issuerIdentity && <div>Issuer ID: {newTokenInfo.issuerIdentity}</div>}
                  <div className="mt-1 text-yellow-500">請記得更新您的 .env 設定!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info: (20260127 - Luphia) 鑄幣區塊 */}
        <div className="rounded border border-slate-700 bg-slate-800/30 p-4">
          <h3 className="mb-2 text-lg font-medium text-slate-200">Mint to Address</h3>
          <p className="mb-4 text-xs text-slate-400">
            鑄造 TWD 給指定地址。若用戶未註冊，將嘗試自動註冊。
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              aria-label="Recipient Address"
            />
            <input
              type="number"
              placeholder="Amount (TWD)"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              aria-label="Mint Amount"
            />
            <button
              onClick={handleMint}
              disabled={isMinting || !targetAddress}
              className="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isMinting ? 'Minting...' : 'Mint Tokens'}
            </button>
          </div>
          {mintStatus && (
            <div className="mt-4 break-all rounded border border-slate-700 bg-black/50 p-2 font-mono text-xs">
              {mintStatus}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
