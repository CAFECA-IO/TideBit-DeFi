'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { LiaDiceSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalCtx } from '@/contexts/global_context';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { encodeFunctionData, type Hex } from 'viem';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { fido2ClientService, parsePasskey, sendUserOpToBundler } from '@/lib/auth/fido2_client';
import { encodeWebAuthnSignature, hexToBase64Url } from '@/lib/auth/passkey_encoding';

const RegisterModal: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stepInfo, setStepInfo] = useState<string>('Sign Up');

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

  // Info: (20251223 - Tzuhan) 核心註冊邏輯
  const handleSignUp = async () => {
    setIsLoading(true);
    setStepInfo('Creating Passkey...');

    try {
      const username = inputValue.trim();
      const imageUrl = 'default_avatar_url';

      // Info: (20251223 - Tzuhan) --- 步驟 1: 註冊 Passkey (獲取公鑰) ---
      // Info: (20251223 - Tzuhan) ★★★ 關鍵修正：使用瀏覽器原生 API 產生 Challenge (避開 Buffer) ★★★
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      // Info: (20251223 - Tzuhan) 將 bytes 轉為 base64 並手動替換為 base64url 格式
      const regChallenge = btoa(String.fromCharCode(...Array.from(randomBytes)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const registration = await fido2ClientService.startRegistration({
        user: username,
        challenge: regChallenge,
        userVerification: 'required',
        discoverable: 'preferred',
      });

      // Info: (20251223 - Tzuhan) 3. 呼叫後端解析，取得 P-256 公鑰座標 (X, Y)
      const { x, y, credentialID } = await parsePasskey(registration, regChallenge);
      console.log('Parsed Key:', { x, y, credentialID });

      // Info: (20251223 - Tzuhan) 4. 準備合約部署參數
      const salt = BigInt(0); // Info: (20251223 - Tzuhan) 這裡先用 0，實務上可用隨機數
      const pubKeyX = BigInt(x);
      const pubKeyY = BigInt(y);

      if (!CONTRACT_ADDRESSES.FACTORY) throw new Error('Factory Address not set');

      // Info: (20251223 - Tzuhan) 5. 預測未來的 SCW 地址 (呼叫 Factory 的 view function)
      const scwAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.FACTORY,
        abi: ABIS.FACTORY,
        functionName: 'getAddress',
        args: [pubKeyX, pubKeyY, salt],
      });
      console.log('Predicted SCW Address:', scwAddress);

      // Info: (20251223 - Tzuhan) 6. 組裝 UserOp 的 initCode (Factory Address + createAccount encoded data)
      // Info: (20251226 - Tzuhan) Update: 這裡加入 username 和 imageUrl
      const factoryCallData = encodeFunctionData({
        abi: ABIS.FACTORY,
        functionName: 'createAccount',
        args: [pubKeyX, pubKeyY, salt, credentialID, username, imageUrl],
      });
      const initCode = `${CONTRACT_ADDRESSES.FACTORY}${factoryCallData.slice(2)}` as Hex;

      const partialUserOp = {
        sender: scwAddress,
        nonce: BigInt(0),
        initCode: initCode, // Info: (20251223 - Tzuhan) 部署時 nonce 通常為 0
        callData: '0x' as Hex, // Info: (20251223 - Tzuhan) 部署時不執行其他函式
        // Info: (20251226 - Tzuhan) Gas 設定 (部署合約需要較多 Gas)
        callGasLimit: BigInt(200_000),
        verificationGasLimit: BigInt(3_500_000),
        preVerificationGas: BigInt(100_000),
        maxFeePerGas: BigInt(0), // Info: (20251223 - Tzuhan) 0 Gas 費由 Relayer 買單
        maxPriorityFeePerGas: BigInt(0),
        paymasterAndData: '0x' as Hex,
        signature: '0x' as Hex,
      };

      // Info: (20251226 - Tzuhan) --- 步驟 4: 計算 Hash ---
      if (!CONTRACT_ADDRESSES.ENTRY_POINT) throw new Error('EntryPoint Address not set');

      const userOpHash = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ENTRY_POINT,
        abi: ABIS.ENTRY_POINT,
        functionName: 'getUserOpHash',
        args: [partialUserOp],
      });

      // Info: (20251226 - Tzuhan) --- 步驟 5: 簽名 (Login 動作) ---
      setStepInfo('Please Sign to Deploy...');

      // Info: (20251226 - Tzuhan) ★★★ 關鍵：使用自定義函數將 Hex Hash 轉為 Base64URL (避開 Buffer) ★★★
      const challengeBase64 = hexToBase64Url(userOpHash);

      const authentication = await fido2ClientService.startLogin({
        challenge: challengeBase64,
        userVerification: 'required',
        timeout: 60000,
      });

      // Info: (20251226 - Tzuhan) --- 步驟 6: 打包簽名並發送 ---
      setStepInfo('Deploying...');
      const encodedSignature = encodeWebAuthnSignature(authentication, pubKeyX, pubKeyY);

      const finalUserOp = {
        sender: partialUserOp.sender,
        nonce: `0x${partialUserOp.nonce.toString(16)}`,
        initCode: partialUserOp.initCode,
        callData: partialUserOp.callData,
        callGasLimit: `0x${partialUserOp.callGasLimit.toString(16)}`,
        verificationGasLimit: `0x${partialUserOp.verificationGasLimit.toString(16)}`,
        preVerificationGas: `0x${partialUserOp.preVerificationGas.toString(16)}`,
        maxFeePerGas: `0x${partialUserOp.maxFeePerGas.toString(16)}`,
        maxPriorityFeePerGas: `0x${partialUserOp.maxPriorityFeePerGas.toString(16)}`,
        paymasterAndData: partialUserOp.paymasterAndData,
        signature: encodedSignature,
      };

      const result = await sendUserOpToBundler(finalUserOp, CONTRACT_ADDRESSES.ENTRY_POINT);

      if (result.code === 'SUCCESS' || result.success === true) {
        alert(`Successfully Deployed! Address: ${scwAddress}`);
        onClose();
      } else {
        throw new Error(
          result.message || JSON.stringify(result.payload?.error) || 'Deployment failed'
        );
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      alert(`Sign up failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setStepInfo('Sign Up');
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

  if (!isModalVisible) return null;

  return (
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
            <div className="rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-6 py-spacing-lv-4">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none placeholder:text-text-field-text-placeholder"
                placeholder="Enter your nickname"
                aria-label="Nickname entry"
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
          <Button type="button" disabled={isSubmitDisabled || isLoading} onClick={handleSignUp}>
            {isLoading ? stepInfo : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
