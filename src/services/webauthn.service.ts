import { publicClient } from '@/lib/viem';
import { parseAbiItem } from 'viem';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import type {
  RegistrationJSON,
  AuthenticationJSON,
  CredentialInfo,
} from '@passwordless-id/webauthn/dist/esm/types';
import { verifyAuthentication, verifyRegistration } from '@/lib/auth/fido2-server';
import { signDeWT } from '@/lib/auth/dewt';
import type { IWebAuthnRepository } from '@/repositories/webauthn.repo';
import { webAuthnRepo } from '@/repositories/webauthn.repo';
import { AppError } from '@/lib/utils/error';
import { ApiCode } from '@/lib/utils/status';
import { extractXYFromSPKI } from '@/lib/auth/fido2-parse';
import { randomBytes } from 'crypto';

interface ILoginResult {
  dewt: string;
  user: {
    address: string;
    name: string | null;
    role: string;
  };
}

interface IParsedPublicKey {
  x: string;
  y: string;
  credentialID: string;
}

class WebAuthnService {
  constructor(private readonly repo: IWebAuthnRepository) {}

  public async generateLoginOptions(address: string): Promise<string> {
    const user = await this.ensureUserSynced(address);

    if (!user) {
      throw new AppError(ApiCode.NOT_FOUND, 'User not found on chain. Please register first.');
    }

    const challenge = randomBytes(32).toString('base64url');
    await this.repo.updateChallenge(address, challenge);

    return challenge;
  }

  /**
   * Info: (20251224 - Tzuhan)
   * [Step 2] 驗證登入
   */
  public async loginWithAddress(
    address: string,
    authenticationData: AuthenticationJSON
  ): Promise<ILoginResult> {
    const user = await this.repo.findUserByAddress(address);

    if (!user || !user.pubKeyX || !user.pubKeyY || !user.currentChallenge) {
      throw new AppError(ApiCode.NOT_FOUND, 'User data incomplete. Please retry login flow.');
    }

    const credentialPublicKey = this.reconstructKeyFromXY(user.pubKeyX, user.pubKeyY);

    // Info: (20251223 - Tzuhan) 建構符合 CredentialInfo 定義的物件
    // Info: (20251223 - Tzuhan) P-256 對應的演算法名稱通常是 'ES256'
    const credential: CredentialInfo = {
      id: authenticationData.id,
      publicKey: credentialPublicKey,
      algorithm: 'ES256',
      transports: [], // Info: (20251223 - Tzuhan) 資料庫未存 transports，給空陣列以符合型別
    };

    try {
      await verifyAuthentication(authenticationData, credential, user.currentChallenge);
    } catch (error) {
      console.error('Login verification failed:', error);
      throw new AppError(ApiCode.UNAUTHORIZED, 'Invalid signature');
    }

    // Info: (20251223 - Tzuhan) 驗證通過，簽發 Token
    const dewt = await signDeWT(user);

    await this.repo.updateChallenge(address, '');

    return {
      dewt,
      user: {
        address: user.address,
        name: user.name,
        role: user.role,
      },
    };
  }

  public async parseRegistrationCredential(
    registrationData: RegistrationJSON,
    expectedChallenge: string
  ): Promise<IParsedPublicKey> {
    const verification = await verifyRegistration(registrationData, expectedChallenge);
    const { x, y } = extractXYFromSPKI(verification.credential.publicKey);
    return {
      x: x.toString(),
      y: y.toString(),
      credentialID: verification.credential.id,
    };
  }

  private async ensureUserSynced(address: string) {
    const user = await this.repo.findUserByAddress(address);
    if (user) return user;

    console.log(`[Sync] Fetching ${address} from chain...`);
    try {
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.FACTORY as `0x${string}`,
        event: parseAbiItem(
          'event AccountCreated(address indexed scw, uint256 pubKeyX, uint256 pubKeyY, uint256 salt)'
        ),
        args: { scw: address as `0x${string}` },
        fromBlock: 'earliest',
      });

      if (logs.length === 0) return null;

      const { pubKeyX, pubKeyY } = logs[0].args;
      if (!pubKeyX || !pubKeyY) return null;

      return await this.repo.upsertUser({
        address: address,
        pubKeyX: pubKeyX.toString(),
        pubKeyY: pubKeyY.toString(),
      });
    } catch (error) {
      console.error('[Sync] Chain fetch failed:', error);
      return null;
    }
  }

  private reconstructKeyFromXY(xStr: string, yStr: string): string {
    const toBuffer32 = (numStr: string) => {
      let hex = BigInt(numStr).toString(16);
      if (hex.length % 2 !== 0) hex = '0' + hex;
      const buf = Buffer.from(hex, 'hex');
      const padded = Buffer.alloc(32);
      buf.copy(padded, 32 - buf.length);
      return padded;
    };

    const x = toBuffer32(xStr);
    const y = toBuffer32(yStr);

    const prefix = Buffer.from([0xa5, 0x01, 0x02, 0x03, 0x26, 0x20, 0x01, 0x21, 0x58, 0x20]);
    const mid = Buffer.from([0x22, 0x58, 0x20]);

    const coseKeyBuffer = Buffer.concat([prefix, x, mid, y]);
    return coseKeyBuffer.toString('base64url');
  }
}

export const webAuthnService = new WebAuthnService(webAuthnRepo);
