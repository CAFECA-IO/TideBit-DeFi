'use client';

import { useState } from 'react';
import { IUserProfile, useAuth } from '@/contexts/auth_context';
import { Button } from '@/components/common/button';
import { encodeFunctionData, type Hex } from 'viem';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { usePasskeySign } from '@/lib/hooks/use_passkey_sign';
import { RxCross2 } from 'react-icons/rx';
import { useModalCtx } from '@/contexts/modal_context';

const CreateCompanyModal = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  // Todo: (20251230 - Tzuhan) 支援上傳圖片並取得 URL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageUrl, setImageUrl] = useState('/elements/default_pic.png');
  const {
    isCreateCompanyModalVisible: isModalVisible,
    createCompanyModalVisibilityHandler: onClose,
  } = useModalCtx();

  const { signAndSendUserOp, status, isSigning } = usePasskeySign();

  const handleCreate = async () => {
    if (!user) return;

    const currentUser = user as IUserProfile;
    if (!currentUser.pubKeyX || !currentUser.pubKeyY) {
      alert('User public key not found. Please re-login.');
      return;
    }

    try {
      const pubKeyX = BigInt(currentUser.pubKeyX);
      const pubKeyY = BigInt(currentUser.pubKeyY);
      const owners = [[pubKeyX, pubKeyY]];
      const threshold = BigInt(1);
      const salt = BigInt(Math.floor(Math.random() * 1000000));

      // Info: (20251230 - Tzuhan) 1. 預測 Company Address
      const companyAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.FACTORY,
        abi: ABIS.FACTORY,
        functionName: 'getCompanyAddress',
        args: [owners, threshold, salt],
      });

      // Info: (20251230 - Tzuhan) 2. 組裝 UserOp
      const factoryCallData = encodeFunctionData({
        abi: ABIS.FACTORY,
        functionName: 'createCompanyAccount',
        args: [owners, threshold, salt, companyName, imageUrl],
      });

      const initCode = `${CONTRACT_ADDRESSES.FACTORY}${factoryCallData.slice(2)}` as Hex;

      const partialUserOp = {
        sender: companyAddress,
        nonce: BigInt(0),
        initCode: initCode,
        callData: '0x' as Hex,
        callGasLimit: BigInt(500_000), // Info: (20251230 - Tzuhan) 部署合約給多一點
        verificationGasLimit: BigInt(5_000_000), // Info: (20251230 - Tzuhan) 多簽驗證較貴
        preVerificationGas: BigInt(100_000),
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: BigInt(0),
        paymasterAndData: '0x' as Hex,
        signature: '0x' as Hex,
      };

      // Info: (20251230 - Tzuhan) 3. 簽名並發送 (使用 isMultiSig = true)
      await signAndSendUserOp(partialUserOp, { x: pubKeyX, y: pubKeyY }, true);

      alert(`Company Created! Address: ${companyAddress}`);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to create company: ' + (e as Error).message);
    }
  };

  return (
    isModalVisible && (
      <div className="fixed inset-0 z-[999] flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
        <div className="flex w-400px flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background shadow-lg">
          <div className="flex items-center justify-between p-spacing-lv-4">
            <h3 className="text-lg font-bold text-text-neutral-primary">Create Company</h3>
            <button
              onClick={onClose}
              className="p-spacing-lv-0 text-button-neutral-outline-on-neutral-default hover:opacity-70"
            >
              <RxCross2 size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-spacing-lv-4 px-spacing-lv-6 py-spacing-lv-4">
            <div className="flex flex-col gap-spacing-lv-2">
              <label
                htmlFor="company-name-input"
                className="text-sm font-semibold text-text-field-text-label"
              >
                Company Name
              </label>
              <div className="rounded-radius-s border border-text-field-outline-default bg-gray-100 px-spacing-lv-4 py-spacing-lv-3">
                <input
                  id="company-name-input"
                  className="w-full bg-transparent text-black outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  aria-label="Company Name"
                />
              </div>
            </div>

            <Button onClick={handleCreate} disabled={isSigning || !companyName}>
              {isSigning ? status : 'Create Company'}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateCompanyModal;
