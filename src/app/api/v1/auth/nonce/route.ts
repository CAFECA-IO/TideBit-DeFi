import { NextRequest } from 'next/server';
import { webAuthnService } from '@/services/webauthn.service';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { AppError } from '@/lib/utils/error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      throw new AppError(ApiCode.VALIDATION_ERROR, 'Address is required');
    }

    // Info: (20251223 - Tzuhan) 呼叫 Service，這裡會自動觸發 Lazy Sync (查鏈 -> 寫 DB)
    const challenge = await webAuthnService.generateLoginOptions(address);

    return jsonOk({ challenge });
  } catch (error) {
    if (error instanceof AppError) {
      return jsonFail(error.code, error.message);
    }
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Failed to generate nonce');
  }
}
