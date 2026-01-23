'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { parseAbi, isAddress, parseUnits, formatEther, encodeFunctionData, Address } from 'viem';
import { publicClient } from '@/lib/viem-public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { usePasskeySign, IPartialUserOp } from '@/lib/hooks/use_passkey_sign';
import { Button } from '@/components/common/button';
import { numberWithCommas } from '@/lib/utils/common';

// --- ABIs ---
const TOKEN_ABI = parseAbi([
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function mint(address to, uint256 amount) external',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

const SCW_ABI = parseAbi(['function execute(address dest, uint256 value, bytes func) external']);

const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';

const CentralBankConsole: React.FC = () => {
  // 1. 取得目前登入的 Admin SCW 資訊
  const { user: adminUser, isAuthenticated } = useAuth();

  // 2. Passkey 簽名工具
  const { signAndSendUserOp, isSigning, status: signStatus } = usePasskeySign();

  // State
  const [isAdminMinter, setIsAdminMinter] = useState<boolean>(false);
  const [isPromoting, setIsPromoting] = useState<boolean>(false);
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [adminBalance, setAdminBalance] = useState<string>('0');

  // 初始化：檢查自己 (Admin SCW) 是否有權限
  const checkAdminStatus = useCallback(async () => {
    if (!adminUser?.address || !CONTRACT_ADDRESSES.NTD_TOKEN) return;
    try {
      const [hasRole, balance] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESSES.NTD_TOKEN as Address,
          abi: TOKEN_ABI,
          functionName: 'hasRole',
          args: [MINTER_ROLE, adminUser.address as `0x${string}`],
        }),
        publicClient.readContract({
          address: CONTRACT_ADDRESSES.NTD_TOKEN as Address,
          abi: TOKEN_ABI,
          functionName: 'balanceOf',
          args: [adminUser.address as `0x${string}`],
        }),
      ]);
      setIsAdminMinter(hasRole);
      setAdminBalance(formatEther(balance));
    } catch (e) {
      console.error('Check failed:', e);
    }
  }, [adminUser]);

  useEffect(() => {
    if (isAuthenticated) checkAdminStatus();
  }, [isAuthenticated, checkAdminStatus]);

  // Action 1: 自我授權 (呼叫我們剛寫的 API)
  const handleClaimAdminRole = async () => {
    if (!adminUser) return;
    setIsPromoting(true);
    try {
      const res = await fetch('/api/v1/admin/grant-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAddress: adminUser.address }),
      });
      const data = await res.json();
      if (data.code === 'SUCCESS') {
        alert('Role Granted! You are now a Minter.');
        checkAdminStatus(); // Refresh
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (e) {
      alert('Error: ' + (e as Error).message);
    } finally {
      setIsPromoting(false);
    }
  };

  // Action 2: 鑄造代幣 (使用 Passkey 簽名 UserOp)
  const handleMint = async () => {
    if (!adminUser || !mintAmount || !isAddress(targetAddress)) return;

    try {
      // A. 準備 Token.mint 的 CallData
      const decimals = 18;
      const amountBigInt = parseUnits(mintAmount, decimals);
      const mintCallData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [targetAddress as `0x${string}`, amountBigInt],
      });

      // B. 準備 UserOp 的 CallData (SCW.execute -> Token.mint)
      // 這一步非常關鍵：因為是 SCW，必須透過 execute 呼叫外部合約
      const userOpCallData = encodeFunctionData({
        abi: SCW_ABI,
        functionName: 'execute',
        args: [CONTRACT_ADDRESSES.NTD_TOKEN as Address, BigInt(0), mintCallData],
      });

      // C. 取得 Nonce
      const nonce = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ENTRY_POINT,
        abi: ABIS.ENTRY_POINT,
        functionName: 'getNonce',
        args: [adminUser.address as `0x${string}`, BigInt(0)],
      });

      // D. 組裝 UserOp
      const partialUserOp: IPartialUserOp = {
        sender: adminUser.address as `0x${string}`,
        nonce: nonce,
        initCode: '0x', // Admin 已經部署，不需要 initCode
        callData: userOpCallData,
        callGasLimit: BigInt(200_000),
        verificationGasLimit: BigInt(500_000),
        preVerificationGas: BigInt(100_000),
        maxFeePerGas: BigInt(0), // POC 階段由 Relayer 全額代付
        maxPriorityFeePerGas: BigInt(0),
        paymasterAndData: '0x',
        signature: '0x', // 簽名後會被填入
      };

      // E. 喚起 Passkey
      // 注意：必須將 string 公鑰轉回 BigInt
      const pubKeyX = BigInt(adminUser.pubKeyX);
      const pubKeyY = BigInt(adminUser.pubKeyY);

      await signAndSendUserOp(partialUserOp, { x: pubKeyX, y: pubKeyY });

      alert(`Minting Request Sent! Amount: ${mintAmount}`);
      setMintAmount('');
      checkAdminStatus(); // Refresh balance
    } catch (e) {
      console.error(e);
      alert(`Minting Failed: ${(e as Error).message}`);
    }
  };

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Please login first.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 1. Header Card */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Central Bank Console</h1>
            <p className="mt-1 text-sm text-slate-400">
              Admin SCW: <span className="font-mono text-green-400">{adminUser?.address}</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Current NTD Balance:{' '}
              <span className="font-mono text-green-400">{numberWithCommas(adminBalance)} NTD</span>
            </p>
          </div>
          <div>
            {isAdminMinter ? (
              <span className="rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white">
                ✅ Authorized Minter
              </span>
            ) : (
              <Button
                variant="neutral"
                size="sm"
                onClick={handleClaimAdminRole}
                disabled={isPromoting}
              >
                {isPromoting ? 'Authorizing...' : '⚠️ Click to Claim Minter Role'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Minting Console */}
      <div
        className={`rounded-xl border-2 p-8 shadow-md transition-all ${
          isAdminMinter ? 'border-green-500 bg-white' : 'border-gray-200 bg-gray-50 opacity-50'
        }`}
      >
        <h3 className="mb-6 text-xl font-bold text-slate-800">Mint Tokens</h3>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="recipient-address"
              className="mb-2 block text-sm font-semibold text-slate-600"
            >
              Recipient Address
            </label>
            <input
              id="recipient-address"
              type="text"
              aria-label="Recipient Address"
              placeholder="0x..."
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              disabled={!isAdminMinter}
            />
          </div>

          <div>
            <label
              htmlFor="mint-amount"
              className="mb-2 block text-sm font-semibold text-slate-600"
            >
              Amount
            </label>
            <input
              id="mint-amount"
              type="number"
              aria-label="Mint Amount"
              placeholder="1000"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              disabled={!isAdminMinter}
            />
          </div>

          <Button
            className="w-full py-4 text-lg"
            disabled={!isAdminMinter || isSigning || !targetAddress || !mintAmount}
            onClick={handleMint}
          >
            {isSigning ? 'Scanning FaceID/TouchID...' : 'CONFIRM MINT'}
          </Button>

          {signStatus && (
            <p className="animate-pulse text-center text-sm text-slate-500">{signStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CentralBankConsole;
