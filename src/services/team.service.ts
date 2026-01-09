import { ApiCode } from '@/lib/utils/status';
import { IApiResponse } from '@/lib/utils/response';
import { SaveDraftInput, SubmitTeamInput } from '@/validators/team';

const BASE_URL = '/api/v1/team';

export interface IUploadResult {
  name: string;
  size: number;
  url: string;
  hash?: string;
}

// Info: (20260108 - Tzuhan) 定義 Draft API 的回傳 payload 結構
interface IDraftResult {
  companyId: string;
  currentStep: number;
}

// Info: (20260109 - Tzuhan) Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('dewt');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const teamService = {
  // Info: (20260108 - Tzuhan) 1. 上傳文件/圖片
  async uploadFile(file: File): Promise<IUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      } as HeadersInit,
      body: formData,
    });

    // Info: (20260108 - Tzuhan) 強制轉型為 IApiResponse，避免 implicit any
    const data = (await res.json()) as IApiResponse<IUploadResult>;

    if (data.code !== ApiCode.SUCCESS || !data.payload) {
      throw new Error(data.message || 'File upload failed');
    }

    return data.payload;
  },

  // Info: (20260108 - Tzuhan) 2. 儲存草稿 (Save & Leave / Save & Next)
  async saveDraft(companyId: string | null, payload: SaveDraftInput) {
    const body = companyId ? { companyId, ...payload } : payload;

    const res = await fetch(`${BASE_URL}/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as IApiResponse<IDraftResult>;

    if (data.code !== ApiCode.SUCCESS || !data.payload) {
      throw new Error(data.message || 'Failed to save draft');
    }

    return data.payload;
  },

  // Info: (20260108 - Tzuhan) 3. 最終送出
  // Info: (20260108 - Tzuhan) SubmitTeamInput 已經由 Zod 定義，確保型別安全
  async submitApplication(companyId: string, formData: SubmitTeamInput): Promise<void> {
    const res = await fetch(`${BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ companyId, ...formData }),
    });

    const data = (await res.json()) as IApiResponse<null>;

    if (data.code !== ApiCode.SUCCESS) {
      throw new Error(data.message || 'Submission failed');
    }
  },
};
