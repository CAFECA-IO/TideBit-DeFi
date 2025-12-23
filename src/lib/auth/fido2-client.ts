'use client';

import { client } from '@passwordless-id/webauthn';
import type {
  RegisterOptions,
  AuthenticateOptions,
  RegistrationJSON,
  AuthenticationJSON,
} from '@passwordless-id/webauthn/dist/esm/types';
import { ApiCode } from '@/lib/utils/status';
import { AppError } from '@/lib/utils/error';

// Info: (20251223 - Tzuhan) 定義登入回傳結果介面
export interface ILoginResult {
  dewt: string;
  user: {
    address: string;
    name: string | null;
    role: string;
  };
}

/**
 * Info: (20251001-tzuhan)
 * 封裝 FIDO2 WebAuthn 客戶端邏輯的單例服務。
 */
class Fido2ClientService {
  private client: typeof client | null;

  constructor() {
    this.client = client ?? null;
  }

  public isAvailable(): boolean {
    return this.client !== null;
  }

  private getClientOrThrow(): typeof client {
    if (!this.client) {
      throw new Error(
        'WebAuthn is not available in this browser or context (e.g., non-secure origin).'
      );
    }
    return this.client;
  }

  public async startRegistration(options: RegisterOptions): Promise<RegistrationJSON> {
    const client = this.getClientOrThrow();
    try {
      const registration = await client.register(options);
      console.log('FIDO2 Registration successful:', registration);
      return registration;
    } catch (error) {
      console.error('FIDO2 Registration failed:', error);
      throw error;
    }
  }

  public async startLogin(options: AuthenticateOptions): Promise<AuthenticationJSON> {
    const client = this.getClientOrThrow();
    try {
      const authentication = await client.authenticate(options);
      return authentication;
    } catch (error) {
      console.error('FIDO2 Authentication failed:', error);
      throw error;
    }
  }
}

export const fido2ClientService = new Fido2ClientService();

// --- Info: (20251223 - Tzuhan) 新增：與後端 API 溝通的輔助函式 ---

/**
 * Info: (20251223 - Tzuhan)
 * 取得登入用的 Challenge (Nonce)
 * 後端會在此時執行 Lazy Sync (查鏈 -> 同步 DB)
 */
export async function getLoginChallenge(address: string): Promise<string> {
  const res = await fetch(`/api/v1/auth/nonce?address=${address}`);
  const data = await res.json();

  if (data.code !== ApiCode.SUCCESS) {
    throw new AppError(data.code, data.message || 'Failed to get login challenge');
  }

  return data.data.challenge;
}

/**
 * Info: (20251223 - Tzuhan)
 * 驗證登入簽名並獲取 DeWT (JWT)
 */
export async function verifyLogin(
  address: string,
  authentication: AuthenticationJSON
): Promise<ILoginResult> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, authentication }),
  });

  const data = await res.json();

  if (data.code !== ApiCode.SUCCESS) {
    throw new AppError(data.code, data.message || 'Login verification failed');
  }

  return data.data;
}
