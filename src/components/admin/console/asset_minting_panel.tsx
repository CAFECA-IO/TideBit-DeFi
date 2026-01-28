'use client';

import React, { useState } from 'react';
import { parseUnits, encodeFunctionData, Address } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { usePasskeySign, IPartialUserOp } from '@/lib/hooks/use_passkey_sign';
import { publicClient } from '@/lib/viem_public';
import { Button } from '@/components/common/button';

interface IProps {
  targetAddress: string;
}

const TOKEN_ABI = ABIS.NTD_TOKEN || [];
const SCW_ABI = ABIS.SCW || [];

import ConfirmModal from '@/components/common/confirm_modal';

export default function AssetMintingPanel({ targetAddress }: IProps) {
  const { user: adminUser } = useAuth();
  const { signAndSendUserOp, isSigning, status } = usePasskeySign();

  const [amount, setAmount] = useState('');
  const [refNo, setRefNo] = useState('');

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

  const handleMint = async () => {
    if (!adminUser || !amount || !targetAddress) return;

    try {
      // Info: (20260123 - Tzuhan) 1. Prepare Mint Call
      const decimals = 18;
      const amountBI = parseUnits(amount, decimals);
      const mintData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [targetAddress as Address, amountBI],
      });

      // Info: (20260123 - Tzuhan) 2. Prepare UserOp (SCW execute -> Token mint)
      const executeData = encodeFunctionData({
        abi: SCW_ABI,
        functionName: 'execute',
        args: [CONTRACT_ADDRESSES.NTD_TOKEN, BigInt(0), mintData],
      });

      // Info: (20260123 - Tzuhan) 3. Get Nonce
      const nonce = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ENTRY_POINT,
        abi: ABIS.ENTRY_POINT,
        functionName: 'getNonce',
        args: [adminUser.address as Address, BigInt(0)],
      });

      // Info: (20260123 - Tzuhan) 4. Build UserOp
      const op: IPartialUserOp = {
        sender: adminUser.address as `0x${string}`,
        nonce,
        initCode: '0x',
        callData: executeData,
        callGasLimit: BigInt(200_000),
        verificationGasLimit: BigInt(500_000),
        preVerificationGas: BigInt(100_000),
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: BigInt(0),
        paymasterAndData: '0x',
        signature: '0x',
      };

      // Info: (20260123 - Tzuhan) 5. Sign with Passkey
      await signAndSendUserOp(op, {
        x: BigInt(adminUser.pubKeyX),
        y: BigInt(adminUser.pubKeyY),
      });

      showAlert('成功', `鑄造成功！金額: ${amount}, 單號: ${refNo}`);
      setAmount('');
      setRefNo('');
    } catch (e) {
      console.error(e);
      showAlert('錯誤', `鑄造失敗: ${(e as Error).message}`);
    }
  };

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm transition-all">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-green-800">
        <span>3. 資產鑄造 (Minting Zone)</span>
        <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs text-green-800">Active</span>
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="targetAddress" className="mb-1 block text-xs font-bold text-green-800">
              接收方地址 (Target)
            </label>
            <input
              id="targetAddress"
              aria-label="Target Address"
              value={targetAddress}
              disabled
              className="w-full rounded border border-green-200 bg-white/50 p-2 text-sm text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="refNo" className="mb-1 block text-xs font-bold text-green-800">
              法幣入金單號 (Ref No.)
            </label>
            <input
              id="refNo"
              aria-label="Reference Number"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              placeholder="Ex: FIAT-20240101-001"
              className="w-full rounded border border-green-200 bg-white p-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <label htmlFor="amount" className="mb-1 block text-xs font-bold text-green-800">
              鑄造金額 (Amount)
            </label>
            <input
              id="amount"
              aria-label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded border border-green-200 bg-white p-2 text-2xl font-bold text-green-900 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <Button
              onClick={handleMint}
              disabled={isSigning || !amount}
              className="w-full bg-green-600 py-3 text-lg hover:bg-green-700"
            >
              {isSigning ? '請進行生物辨識簽章...' : '確認鑄造 (Mint)'}
            </Button>
            {status && (
              <p className="mt-2 animate-pulse text-center text-xs text-green-600">{status}</p>
            )}
          </div>
        </div>
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
}
