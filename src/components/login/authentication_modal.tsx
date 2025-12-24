'use client';

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth_context';
import { fido2ClientService, getLoginChallenge, verifyLogin } from '@/lib/auth/fido2-client';
import { useRouter } from 'next/navigation';

const AuthenticationModal: React.FC = () => {
  const [addressInput, setAddressInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const {
    isAuthenticationModalVisible: isModalVisible,
    authenticationModalVisibilityHandler: onClose,
  } = useModalCtx();

  const { login } = useAuth();
  const router = useRouter();

  // Info: (20251223 - Tzuhan) 核心登入邏輯
  const handleLogin = async () => {
    // Info: (20251223 - Tzuhan) 簡單驗證地址格式 (0x 開頭 + 40 hex char = 42 char)
    if (!addressInput.startsWith('0x') || addressInput.length !== 42) {
      setErrorMsg('Invalid wallet address format');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Info: (20251223 - Tzuhan) 1. 取得 Challenge (同時觸發後端 Lazy Sync)
      const challenge = await getLoginChallenge(addressInput);
      console.log('Got challenge:', challenge);

      // Info: (20251223 - Tzuhan) 2. 喚起 Passkey 簽名
      const authentication = await fido2ClientService.startLogin({
        challenge: challenge,
        userVerification: 'required',
        timeout: 60000,
      });

      console.log('Passkey signed:', authentication);

      // Info: (20251223 - Tzuhan) 3. 驗證簽名並取得 JWT
      const { dewt, user } = await verifyLogin(addressInput, authentication);
      console.log('Login success:', user);

      // Info: (20251223 - Tzuhan) 4. 寫入 Context 並跳轉
      login(dewt);
      onClose();
      router.push('/funding'); // Info: (20251223 - Tzuhan) 登入後導向募資頁
    } catch (error) {
      console.error('Login failed:', error);
      // Info: (20251223 - Tzuhan) 顯示較友善的錯誤訊息
      const msg = (error as Error).message || 'Authentication failed';
      if (msg.includes('User not found')) {
        setErrorMsg('User not found. Please register first.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value);
    if (errorMsg) setErrorMsg('');
  };

  const isDisplayedModal = isModalVisible && (
    <div className="fixed z-masking flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex w-400px flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        {/* Info: (20251223 - Tzuhan) Header */}
        <div className="ml-auto p-spacing-lv-4">
          <button
            type="button"
            onClick={onClose}
            className="p-spacing-lv-0 text-button-neutral-outline-on-neutral-default"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Info: (20251223 - Tzuhan) Content */}
        <div className="flex flex-col gap-spacing-lv-6 px-spacing-lv-8 pb-spacing-lv-8 pt-spacing-lv-2">
          <div className="flex flex-col items-center gap-spacing-lv-4 text-center">
            <div className="rounded-full bg-surface-neutral-container-lv2 p-4 text-icon-brand-primary">
              <LiaFingerprintSolid size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-neutral-primary">Welcome Back</h3>
              <p className="text-sm text-text-neutral-tertiary">
                Enter your wallet address to sign in with Passkey
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-spacing-lv-2">
            <p className="text-sm font-semibold text-text-field-text-label">Wallet Address</p>
            <div className="bg-text-field-surface-placeholder rounded-radius-s border border-text-field-outline-default px-spacing-lv-4 py-spacing-lv-3">
              <input
                type="text"
                value={addressInput}
                onChange={handleInputChange}
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-field-text-placeholder"
                placeholder="0x..."
                disabled={isLoading}
              />
            </div>
            {errorMsg && <p className="text-xs text-text-state-error">{errorMsg}</p>}
          </div>

          <Button type="button" onClick={handleLogin} disabled={isLoading || !addressInput}>
            {isLoading ? 'Verifying...' : 'Sign In with Passkey'}
          </Button>
        </div>
      </div>
    </div>
  );

  return isDisplayedModal;
};

export default AuthenticationModal;
