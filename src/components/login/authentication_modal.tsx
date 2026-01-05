'use client';

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { useAuth } from '@/contexts/auth_context';
import { fido2ClientService, getLoginChallenge, verifyLogin } from '@/lib/auth/fido2-client';
import { useRouter } from 'next/navigation';
import { ApiCode } from '@/lib/utils/status';

const AuthenticationModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  const {
    isAuthenticationModalVisible: isModalVisible,
    authenticationModalVisibilityHandler: onClose,
  } = useModalCtx();

  const { login } = useAuth();
  const router = useRouter();

  // Info: (20260105 - Tzuhan) 快速登入 (Discoverable)
  const handleQuickLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Info: (20260105 - Tzuhan) 1. 取得 Stateless Challenge
      const res = await fetch('/api/v1/auth/nonce');
      const data = await res.json();
      if (data.code !== ApiCode.SUCCESS) throw new Error(data.message);

      const { challenge, token } = data.payload;

      // Info: (20260105 - Tzuhan) 2. 喚起 Passkey (不指定 user，讓瀏覽器探索)
      const authentication = await fido2ClientService.startLogin({
        challenge: challenge,
        userVerification: 'required',
        timeout: 60000,
        // Info: (20260105 - Tzuhan) 關鍵：不傳 allowCredentials
      });

      // Info: (20260105 - Tzuhan) 3. 驗證並登入
      const resLogin = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authentication,
          challengeToken: token, // Info: (20260105 - Tzuhan) 傳回 token 讓後端驗證 challenge
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
      setErrorMsg('Login failed. Try manual input if you are using a new device.');
      // Info: (20260105 - Tzuhan) 失敗時顯示手動輸入框
      setShowManualInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Info: (20260105 - Tzuhan) 原有的 handleLogin (手動輸入地址)
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

  return (
    isModalVisible && (
      <div className="fixed inset-0 z-[999] flex size-full items-center justify-center bg-surface-neutral-mask-subtle backdrop-blur-lg">
        <div className="flex w-400px flex-col overflow-hidden rounded-radius-m bg-modal-surface-background p-6 shadow-xl">
          <div className="flex justify-end">
            <button onClick={onClose}>
              <RxCross2 size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="rounded-full bg-surface-neutral-container-lv2 p-4 text-icon-brand-primary">
              <LiaFingerprintSolid size={64} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-neutral-primary">Welcome Back</h3>
              <p className="text-sm text-text-neutral-tertiary">Sign in with your Passkey</p>
            </div>

            {/* 大按鈕：直接登入 */}
            {!showManualInput && (
              <Button
                className="h-12 w-full text-lg"
                onClick={handleQuickLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Scanning...' : 'Tap to Login'}
              </Button>
            )}

            {/* 錯誤訊息 */}
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

            {showManualInput && (
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="wallet-address-input" className="sr-only">
                  Wallet Address
                </label>
                <input
                  id="wallet-address-input"
                  className="w-full rounded border bg-transparent p-2"
                  placeholder="Or enter wallet address..."
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  aria-label="Wallet Address"
                />
                <Button onClick={handleLogin}>Login with Address</Button>
              </div>
            )}

            {!showManualInput && (
              <button
                onClick={() => setShowManualInput(true)}
                className="text-sm text-gray-500 hover:underline"
              >
                I want to type my address
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default AuthenticationModal;
