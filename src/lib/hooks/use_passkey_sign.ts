import { useState } from 'react';
import { type Hex, encodeAbiParameters, parseAbiParameters } from 'viem';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { fido2ClientService, sendUserOpToBundler } from '@/lib/auth/fido2_client';
import {
  hexToBase64Url,
  encodeWebAuthnSignature,
  getWebAuthnSignatureStruct,
} from '@/lib/auth/crypto_utils';

export interface IPartialUserOp {
  sender: Hex;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
}

export function usePasskeySign() {
  const [status, setStatus] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);

  const signAndSendUserOp = async (
    partialUserOp: IPartialUserOp,
    signerPubKey: { x: bigint; y: bigint },
    isMultiSig: boolean = false
  ) => {
    setIsSigning(true);
    setStatus('Calculating UserOp Hash...');

    try {
      if (!CONTRACT_ADDRESSES.ENTRY_POINT) throw new Error('EntryPoint Address not set');

      // Info: (20251230 - Tzuhan) 1. 計算 UserOp Hash
      const userOpHash = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ENTRY_POINT,
        abi: ABIS.ENTRY_POINT,
        functionName: 'getUserOpHash',
        args: [partialUserOp],
      });

      // Info: (20251230 - Tzuhan) 2. 喚起 Passkey 簽名
      setStatus('Please sign with your Passkey...');
      const challengeBase64 = hexToBase64Url(userOpHash);

      const authentication = await fido2ClientService.startLogin({
        challenge: challengeBase64,
        userVerification: 'required',
        timeout: 60000,
      });

      // Info: (20251230 - Tzuhan) 3. 處理簽章編碼
      setStatus('Encoding signature...');
      let finalSignature: Hex;

      if (isMultiSig) {
        // Info: (20251230 - Tzuhan) [Fix] 取得結構物件
        const sigStruct = getWebAuthnSignatureStruct(
          authentication,
          signerPubKey.x,
          signerPubKey.y
        );

        // Info: (20251230 - Tzuhan) MultiSigSCW 使用陣列結構編碼
        finalSignature = encodeAbiParameters(
          parseAbiParameters(
            '(bytes authenticatorData, bytes clientDataJSON, uint256 challengeLocation, uint256 responseTypeLocation, uint256 r, uint256 s, uint256 pubKeyX, uint256 pubKeyY)[]'
          ),
          [[sigStruct]]
        );
      } else {
        // Info: (20251230 - Tzuhan) PersonalSCW 使用原本的單一結構編碼
        finalSignature = encodeWebAuthnSignature(authentication, signerPubKey.x, signerPubKey.y);
      }

      // Info: (20251230 - Tzuhan) 4. 組合最終 UserOp
      const finalUserOp = {
        ...partialUserOp,
        nonce: `0x${partialUserOp.nonce.toString(16)}`,
        callGasLimit: `0x${partialUserOp.callGasLimit.toString(16)}`,
        verificationGasLimit: `0x${partialUserOp.verificationGasLimit.toString(16)}`,
        preVerificationGas: `0x${partialUserOp.preVerificationGas.toString(16)}`,
        maxFeePerGas: `0x${partialUserOp.maxFeePerGas.toString(16)}`,
        maxPriorityFeePerGas: `0x${partialUserOp.maxPriorityFeePerGas.toString(16)}`,
        paymasterAndData: partialUserOp.paymasterAndData,
        signature: finalSignature,
      };

      // Info: (20251230 - Tzuhan) 5. 發送
      setStatus('Sending transaction...');
      const result = await sendUserOpToBundler(finalUserOp, CONTRACT_ADDRESSES.ENTRY_POINT);

      if (result.code === 'SUCCESS' || result.success === true) {
        setStatus('Success!');
        return result;
      } else {
        throw new Error(result.message || 'Bundler Error');
      }
    } catch (error) {
      console.error(error);
      setStatus('Failed');
      throw error;
    } finally {
      setIsSigning(false);
    }
  };

  return {
    signAndSendUserOp,
    status,
    isSigning,
  };
}
