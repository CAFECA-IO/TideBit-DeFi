import { NextRequest } from 'next/server';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { getIdentityFromDeWT } from '@/lib/auth/dewt';
import { prisma } from '@/lib/prisma';
import { submitTeamSchema } from '@/validators/team';
import { AppError } from '@/lib/utils/error';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const authHeader = req.headers.get('Authorization');
    const user = await getIdentityFromDeWT(authHeader);
    if (!user) return jsonFail(ApiCode.UNAUTHORIZED, 'Unauthorized');

    const body = await req.json();
    const { companyId, ...formData } = body;

    if (!companyId) {
      throw new AppError(ApiCode.VALIDATION_ERROR, 'Company ID is required for submission');
    }

    // 2. Validate Full Schema (所有欄位必填)
    const parseResult = submitTeamSchema.safeParse(formData);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      throw new AppError(ApiCode.VALIDATION_ERROR, `Validation failed: ${errorMsg}`);
    }

    const validData = parseResult.data;

    // 3. Update & Set Status
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { owners: true },
    });

    if (!company || !company.owners.some((o) => o.id === user.id)) {
      throw new AppError(ApiCode.FORBIDDEN, 'Access denied');
    }

    await prisma.company.update({
      where: { id: companyId },
      data: {
        ...validData,
        currentStep: 5,
        status: 'PENDING', // Info: (20260108 - Tzuhan) 狀態設為 Pending，等待 Admin 審核
      },
    });

    return jsonOk({ message: 'Application submitted successfully', companyId });
  } catch (error) {
    if (error instanceof AppError) return jsonFail(error.code, error.message);
    console.error(error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Failed to submit application');
  }
}
