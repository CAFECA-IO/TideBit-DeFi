import { NextRequest } from 'next/server';
import { webAuthnService } from '@/services/webauthn.service';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { AppError } from '@/lib/utils/error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (address) {
      // Info: (20260105 - Tzuhan) 原有邏輯：有地址 -> 查鏈 -> 存 DB
      const challenge = await webAuthnService.generateLoginOptions(address);
      return jsonOk({ challenge });
    } else {
      // Info: (20260105 - Tzuhan) [New] 無地址 -> Stateless Challenge
      const { challenge, token } = await webAuthnService.generateStatelessLoginOptions();
      return jsonOk({ challenge, token });
    }
  } catch (error) {
    if (error instanceof AppError) {
      return jsonFail(error.code, error.message);
    }
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Failed to generate nonce');
  }
}
