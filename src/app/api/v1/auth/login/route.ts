import { NextRequest } from 'next/server';
import { webAuthnService } from '@/services/webauthn.service';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { AppError } from '@/lib/utils/error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, authentication } = body;

    if (!address || !authentication) {
      throw new AppError(ApiCode.VALIDATION_ERROR, 'Address and authentication data are required');
    }

    // Info: (20251223 - Tzuhan) 驗證簽名並登入
    const result = await webAuthnService.loginWithAddress(address, authentication);

    // Info: (20251223 - Tzuhan) result 包含 { dewt, user }
    return jsonOk(result);
  } catch (error) {
    console.error('[API] Login error:', error);
    if (error instanceof AppError) {
      return jsonFail(error.code, error.message);
    }
    return jsonFail(ApiCode.UNAUTHORIZED, 'Login failed');
  }
}
