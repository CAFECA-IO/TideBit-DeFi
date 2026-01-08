import { NextRequest } from 'next/server';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { AppError } from '@/lib/utils/error';
import { loggerFromRequest } from '@/lib/utils/logger';
import { getIdentityFromDeWT } from '@/lib/auth/dewt'; // Info: (20260108 - Tzuhan) 確保只有登入用戶能上傳

// Info: (20260108 - Tzuhan) 設定 Storage Service 的環境變數
const STORAGE_DOMAIN = process.env.STORAGE_DOMAIN;
if (!STORAGE_DOMAIN) {
  console.error('FATAL: STORAGE_DOMAIN environment variable is not set.');
}
const STORAGE_API_UPLOAD_URL = `${STORAGE_DOMAIN}/api/v1/file`;
const STORAGE_API_GET_BASE_URL = `${STORAGE_DOMAIN}/api/v1/file`;

export async function POST(req: NextRequest) {
  const log = loggerFromRequest(req);

  try {
    // Info: (20260108 - Tzuhan) 1. 身分驗證 (只有登入者能上傳)
    const authHeader = req.headers.get('Authorization');
    const user = await getIdentityFromDeWT(authHeader);
    if (!user) {
      throw new AppError(ApiCode.UNAUTHORIZED, 'Unauthorized');
    }

    // Info: (20260108 - Tzuhan) 2. 處理 FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new AppError(
        ApiCode.VALIDATION_ERROR,
        'No file uploaded or incorrect field name (expected "file")'
      );
    }

    log.info('[Upload] Received file', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      user: user.id,
    });

    // Info: (20260108 - Tzuhan) 3. 轉發給內部 Storage Service
    const storageFormData = new FormData();
    storageFormData.append('file', file, file.name);

    // Info: (20260108 - Tzuhan) 若 Storage Service 需要 API Key 驗證，可在此加入 headers
    const storageRes = await fetch(STORAGE_API_UPLOAD_URL, {
      method: 'POST',
      body: storageFormData,
    });

    const storageData = await storageRes.json();

    if (!storageRes.ok || !storageData.success) {
      log.error('[Upload] Storage API returned error', {
        status: storageRes.status,
        response: storageData,
      });
      throw new AppError(
        ApiCode.INTERNAL_SERVER_ERROR,
        `Storage service error: ${storageData.message || 'Failed to upload file'}`
      );
    }

    // Info: (20260108 - Tzuhan) 4. 解析回應並回傳 URL
    const { hash, name, size } = storageData.payload;
    if (!hash) {
      log.error('[Upload] Storage API response missing hash', { response: storageData });
      throw new AppError(
        ApiCode.INTERNAL_SERVER_ERROR,
        'Storage service returned invalid response'
      );
    }

    // Info: (20260108 - Tzuhan) 組合可訪問的 URL (View URL)
    const viewUrl = `${STORAGE_API_GET_BASE_URL}/${hash}`;

    return jsonOk({
      name,
      size,
      url: viewUrl, // Info: (20260108 - Tzuhan) 前端拿到這個 URL 後，填入表單欄位 (e.g. tokenLogoId)
      hash, // 保留 Hash 以備不時之需
    });
  } catch (err) {
    log.error('[Upload] API failed', {
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
    });

    if (err instanceof AppError) {
      return jsonFail(err.code, err.message);
    }
    return jsonFail(
      ApiCode.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : 'Unexpected server error'
    );
  }
}
