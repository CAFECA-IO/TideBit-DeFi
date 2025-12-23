'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { LiaDiceSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalCtx } from '@/contexts/global_context';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { encodeFunctionData } from 'viem';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { fido2ClientService, parsePasskey, sendUserOpToBundler } from '@/lib/auth/fido2-client';

const RegisterModal: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // 新增 Loading 狀態

  const {
    isRegisterModalVisible: isModalVisible,
    registerModalVisibilityHandler: onClose,
    termsOfServiceModalVisibilityHandler,
  } = useModalCtx();

  // Info: (20251218 - Julian) 從 Global Context 取得使用者是否已閱讀並同意條款
  const { isReviewedTerms } = useGlobalCtx();

  const DEFAULT_IMAGE = '/elements/default_pic.png'; // ToDo: (20251218 - Julian) Replace with actual default image path

  // Info: (20251218 - Julian) 需要同意條款；輸入框不為空才能提交
  const isSubmitDisabled = !isReviewedTerms || inputValue.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateRandomImage = async () => {
    // ToDo: (20251218 - Julian) Implement random image generation logic
  };

  // Info: (20251223 - Update) 核心註冊邏輯
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const username = inputValue.trim();
      // Info: (20251223 - Update) 1. 在前端產生隨機 Challenge (註冊時通常只需確保不可預測性)
      const challenge = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
        'base64url'
      );

      // Info: (20251223 - Update) 2. 喚起瀏覽器/手機 Passkey 註冊
      const registration = await fido2ClientService.startRegistration({
        user: username,
        challenge: challenge,
        userVerification: 'required',
        discoverable: 'preferred',
      });

      // Info: (20251223 - Update) 3. 呼叫後端解析，取得 P-256 公鑰座標 (X, Y)
      const { x, y, credentialID } = await parsePasskey(registration, challenge);
      console.log('Parsed Key:', { x, y, credentialID });

      // Info: (20251223 - Update) 4. 準備合約部署參數
      const salt = BigInt(0); // Info: (20251223 - Update) 這裡先用 0，實務上可用隨機數
      const pubKeyX = BigInt(x);
      const pubKeyY = BigInt(y);

      // Info: (20251223 - Update) 5. 預測未來的 SCW 地址 (呼叫 Factory 的 view function)
      const scwAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.FACTORY,
        abi: ABIS.FACTORY,
        functionName: 'getAddress',
        args: [pubKeyX, pubKeyY, salt],
      });
      console.log('Predicted SCW Address:', scwAddress);

      // Info: (20251223 - Update) 6. 組裝 UserOp 的 initCode (Factory Address + createAccount encoded data)
      const factoryCallData = encodeFunctionData({
        abi: ABIS.FACTORY,
        functionName: 'createAccount',
        args: [pubKeyX, pubKeyY, salt],
      });
      const initCode = `${CONTRACT_ADDRESSES.FACTORY}${factoryCallData.slice(2)}`;

      // Info: (20251223 - Update) 7. 組裝 UserOp
      const userOp = {
        sender: scwAddress,
        nonce: '0x0', // Info: (20251223 - Update) 部署時 nonce 通常為 0
        initCode: initCode,
        callData: '0x', // Info: (20251223 - Update) 部署時不執行其他函式
        callGasLimit: '0x100000', // Info: (20251223 - Update) 估算值，可調高
        verificationGasLimit: '0x100000', // Info: (20251223 - Update) 部署需要較多 Gas
        preVerificationGas: '0x186a0', // Info: (20251223 - Update) 100000
        maxFeePerGas: '0x0', // Info: (20251223 - Update) 0 Gas 費由 Relayer 買單
        maxPriorityFeePerGas: '0x0',
        paymasterAndData: '0x',
        signature: '0x', // Info: (20251223 - Update) 部署 UserOp 在 EntryPoint 0.6 若有 initCode 且無 paymaster，簽名可為空或任意值，視 Factory 實作而定
      };

      // Info: (20251223 - Update) 8. 發送給後端 Bundler
      const result = await sendUserOpToBundler(userOp, CONTRACT_ADDRESSES.ENTRY_POINT);

      const { message, transactionHash, status } = result;

      console.log('Bundler message:', message);
      console.log('Transaction Hash:', transactionHash);
      console.log('Deployment Status:', status);

      if (result.code === 'SUCCESS') {
        alert(`Account created! Address: ${scwAddress}`);
        onClose();
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayedAgreeTerms = (
    <button
      type="button"
      onClick={termsOfServiceModalVisibilityHandler}
      className={`${
        isReviewedTerms
          ? 'text-button-state-outline-on-success-default hover:text-button-state-outline-on-success-hover'
          : 'text-button-state-outline-on-info-default hover:text-button-state-outline-on-info-hover'
      } flex items-center gap-spacing-lv-2 py-spacing-lv-6 font-bold`}
    >
      {isReviewedTerms ? <FaRegCircleCheck size={24} /> : <FaRegCircle size={24} />}
      <p>Before You Register, Please Review the Agreement</p>
    </button>
  );

  const isDisplayedModal = isModalVisible && (
    <div className="fixed z-masking flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        {/* Info: (20251217 - Julian) Modal Header */}
        <div className="ml-auto p-spacing-lv-4">
          <button
            type="button"
            onClick={onClose}
            className="p-spacing-lv-0 text-button-neutral-outline-on-neutral-default"
          >
            <RxCross2 size={24} />
          </button>
        </div>
        {/* Info: (20251217 - Julian) Modal Content */}
        <div className="flex flex-col items-stretch gap-spacing-lv-6 px-spacing-lv-8 py-spacing-lv-4">
          <div className="flex flex-col gap-spacing-lv-3">
            <div className="flex flex-col items-center gap-spacing-lv-4 px-spacing-lv-5 py-spacing-lv-4">
              <div className="relative size-120px overflow-hidden rounded-full">
                <Image src={DEFAULT_IMAGE} alt="Profile Picture" fill objectFit="cover" />
              </div>
              <div className="flex flex-col items-center gap-spacing-lv-0">
                <Button type="button" variant="outline" onClick={generateRandomImage}>
                  <LiaDiceSolid size={24} />
                  <p>Generate New Picture</p>
                </Button>
                <p className="text-xs font-normal text-text-neutral-tertiary">
                  *You can change it later
                </p>
              </div>
            </div>
            <p className="font-semibold text-text-field-text-label">
              <span className="text-text-field-text-error">*</span> What do you want us to call you?
            </p>
            <div className="bg-text-field-surface-placeholder rounded-radius-s border border-text-field-outline-default px-spacing-lv-6 py-spacing-lv-4">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none placeholder:text-text-field-text-placeholder"
                placeholder="Enter your nickname"
              />
            </div>
          </div>
          {displayedAgreeTerms}
        </div>
        {/* Info: (20251217 - Julian) Modal Actions */}
        <div className="ml-auto flex items-center gap-spacing-lv-3 px-spacing-lv-8 pb-spacing-lv-8 pt-spacing-lv-6">
          <Button type="button" variant="infoBorderless" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" disabled={isSubmitDisabled} onClick={handleSignUp}>
            {isLoading ? 'Processing...' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );

  return isDisplayedModal;
};

export default RegisterModal;
