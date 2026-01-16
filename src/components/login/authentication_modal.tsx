'use client';

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth_context';
import { fido2ClientService, getLoginOptions } from '@/lib/auth/fido2_client';
import { useRouter } from 'next/navigation';
import { ApiCode } from '@/lib/utils/status';

const AuthenticationModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const {
    isAuthenticationModalVisible: isModalVisible,
    authenticationModalVisibilityHandler: onClose,
  } = useModalCtx();

  const { login } = useAuth();
  const router = useRouter();

  // Info: (20260105 - Tzuhan) 快速登入 (Discoverable)
  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // 1. 取得 Stateless Challenge
      const { challenge, token } = await getLoginOptions();

      // Info: (20260105 - Tzuhan) 2. 喚起 Passkey
      const authentication = await fido2ClientService.startLogin({
        challenge: challenge,
        userVerification: 'required',
        timeout: 60000,
        // Info: (20260105 - Tzuhan) 不傳 allowCredentials，啟用探索模式
      });

      // Info: (20260105 - Tzuhan) 3. 驗證並登入
      const resLogin = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authentication,
          challengeToken: token,
        }),
      });

      const loginData = await resLogin.json();
      if (loginData.code !== ApiCode.SUCCESS) throw new Error(loginData.message);

      // Info: (20260105 - Tzuhan) 4. 成功
      login(loginData.payload.dewt);
      onClose();
      router.push('/funding');
    } catch (error) {
      console.error(error);
      setErrorMsg('Login failed. Please verify your identity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isModalVisible && (
      <div className="fixed inset-0 z-[999] flex size-full items-center justify-center bg-surface-neutral-mask-subtle backdrop-blur-lg">
        <div className="flex w-400px flex-col overflow-hidden rounded-radius-m bg-modal-surface-background p-6 shadow-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-text-neutral-tertiary hover:text-text-neutral-primary"
            >
              <RxCross2 size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="rounded-full bg-surface-neutral-container-lv2 p-4 text-icon-brand-primary">
              <LiaFingerprintSolid size={64} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-neutral-primary">Welcome Back</h3>
              <p className="text-sm text-text-neutral-tertiary">
                Log in with your biometric passkey
              </p>
            </div>

            <Button className="h-12 w-full text-lg" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? 'Scanning...' : 'Login with Passkey'}
            </Button>

            {errorMsg && <p className="text-center text-sm text-red-500">{errorMsg}</p>}
          </div>
        </div>
      </div>
    )
  );
};

export default AuthenticationModal;
