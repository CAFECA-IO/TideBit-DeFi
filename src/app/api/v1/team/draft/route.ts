import { NextRequest } from 'next/server';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { getIdentityFromDeWT } from '@/lib/auth/dewt';
import { prisma } from '@/lib/prisma';
import { saveDraftSchema } from '@/validators/team';
import { AppError } from '@/lib/utils/error';

export async function POST(req: NextRequest) {
  try {
    // Info: (20260108 - Tzuhan) 1. Auth
    const authHeader = req.headers.get('Authorization');
    const user = await getIdentityFromDeWT(authHeader);
    if (!user) return jsonFail(ApiCode.UNAUTHORIZED, 'Unauthorized');

    const body = await req.json();

    // Info: (20260108 - Tzuhan) 檢查是否有 companyId (更新現有草稿 vs 建立新草稿)
    const { companyId, ...payload } = body;

    // Info: (20260108 - Tzuhan) 2. Validate Partial Input
    const parseResult = saveDraftSchema.safeParse(payload);
    if (!parseResult.success) {
      throw new AppError(ApiCode.VALIDATION_ERROR, parseResult.error.message);
    }

    const { currentStep, data } = parseResult.data;

    let company;

    if (companyId) {
      // Info: (20260108 - Tzuhan) Update existing draft
      // Info: (20260108 - Tzuhan) 確保該 Company 屬於當前 User
      const existing = await prisma.company.findUnique({
        where: { id: companyId },
        include: { owners: true },
      });

      if (!existing || !existing.owners.some((o) => o.id === user.id)) {
        throw new AppError(ApiCode.FORBIDDEN, 'Company not found or access denied');
      }

      if (existing.status !== 'PENDING' && existing.status !== 'REJECTED') {
        // Info: (20260108 - Tzuhan) 若已是 APPROVED，通常不允許隨意改草稿，視業務邏輯而定
        // Info: (20260108 - Tzuhan) 這裡假設只能改 Pending/Rejected
      }

      company = await prisma.company.update({
        where: { id: companyId },
        data: {
          ...data,
          currentStep,
        },
      });
    } else {
      // Info: (20260108 - Tzuhan) Create new draft
      company = await prisma.company.create({
        data: {
          ...data,
          name: data.name || data.legalName || 'New Company', // Info: (20260108 - Tzuhan) 必填欄位給預設值
          currentStep,
          owners: {
            connect: { id: user.id }, // Info: (20260108 - Tzuhan) 綁定當前用戶為 Owner
          },
        },
      });
    }

    return jsonOk({ companyId: company.id, currentStep: company.currentStep });
  } catch (error) {
    if (error instanceof AppError) return jsonFail(error.code, error.message);
    console.error(error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Failed to save draft');
  }
}
