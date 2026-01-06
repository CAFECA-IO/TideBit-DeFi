import { encodeAbiParameters, parseAbiParameters, type Hex } from 'viem';
import { AuthenticationJSON } from '@passwordless-id/webauthn/dist/esm/types';

// Info: (20251230 - Tzuhan) 瀏覽器端 Hex 轉 Base64URL
export function hexToBase64Url(hex: string): string {
  const hexStr = hex.startsWith('0x') ? hex.slice(2) : hex;
  const match = hexStr.match(/.{1,2}/g);
  if (!match) return '';
  const bytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Info: (20251230 - Tzuhan) Base64 轉 Hex (含 Padding 修正)
export function base64ToHex(base64: string): string {
  let padded = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }

  const binary = atob(padded);
  let hex = '';
  for (let i = 0; i < binary.length; i++) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

// Info: (20251230 - Tzuhan) 僅回傳結構物件，不編碼
export function getWebAuthnSignatureStruct(
  authentication: AuthenticationJSON,
  pubKeyX: bigint,
  pubKeyY: bigint
) {
  const { authenticatorData, clientDataJSON, signature } = authentication.response;

  // Info: (20251230 - Tzuhan) 1. 解析 DER 簽名 (提取 r, s)
  const sigHex = base64ToHex(signature);
  let p = 0;

  if (sigHex.substring(p, p + 2) !== '30') throw new Error('Invalid DER signature header');
  p += 2;

  const lenByte = parseInt(sigHex.substring(p, p + 2), 16);
  p += 2;
  if (lenByte & 0x80) {
    const lenBytesCount = lenByte & 0x7f;
    p += lenBytesCount * 2;
  }

  if (sigHex.substring(p, p + 2) !== '02') throw new Error('Invalid DER r tag');
  p += 2;
  const rLen = parseInt(sigHex.substring(p, p + 2), 16);
  p += 2;
  const rHex = sigHex.substring(p, p + rLen * 2);
  const r = BigInt('0x' + rHex);
  p += rLen * 2;

  if (sigHex.substring(p, p + 2) !== '02') throw new Error('Invalid DER s tag');
  p += 2;
  const sLen = parseInt(sigHex.substring(p, p + 2), 16);
  p += 2;
  const sHex = sigHex.substring(p, p + sLen * 2);
  const s = BigInt('0x' + sHex);
  p += sLen * 2;

  // Info: (20251230 - Tzuhan) 2. 定位 challenge 和 type
  let clientDataBase64 = clientDataJSON.replace(/-/g, '+').replace(/_/g, '/');
  while (clientDataBase64.length % 4) {
    clientDataBase64 += '=';
  }
  const clientDataStr = atob(clientDataBase64);

  const challengePos = clientDataStr.indexOf('"challenge"');
  const challengeValStart = clientDataStr.indexOf('"', challengePos + 11) + 1;
  const typePos = clientDataStr.indexOf('"type"');
  const typeValStart = clientDataStr.indexOf('"', typePos + 6) + 1;

  // Info: (20251230 - Tzuhan) 回傳物件
  return {
    authenticatorData: `0x${base64ToHex(authenticatorData)}` as Hex,
    clientDataJSON: `0x${base64ToHex(clientDataJSON)}` as Hex,
    challengeLocation: BigInt(challengeValStart),
    responseTypeLocation: BigInt(typeValStart),
    r,
    s,
    pubKeyX,
    pubKeyY,
  };
}

// Info: (20251230 - Tzuhan) [Wrapper] 用於 PersonalSCW (單一結構編碼)
export function encodeWebAuthnSignature(
  authentication: AuthenticationJSON,
  pubKeyX: bigint,
  pubKeyY: bigint
): Hex {
  const struct = getWebAuthnSignatureStruct(authentication, pubKeyX, pubKeyY);
  return encodeAbiParameters(
    parseAbiParameters(
      '(bytes authenticatorData, bytes clientDataJSON, uint256 challengeLocation, uint256 responseTypeLocation, uint256 r, uint256 s, uint256 pubKeyX, uint256 pubKeyY)'
    ),
    [struct]
  );
}
