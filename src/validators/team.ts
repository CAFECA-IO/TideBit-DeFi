import { z } from 'zod';

// Info: (20260108 - Tzuhan) Step 1: Token Information
export const teamStep1Schema = z.object({
  tokenName: z.string().min(1, 'Token Name is required').max(50, 'Token Name too long'),
  tokenSymbol: z
    .string()
    .min(1, 'Token Symbol is required')
    .max(10, 'Symbol is too long (max 10 characters)')
    .regex(/^[A-Z0-9]+$/, 'Symbol must be uppercase letters or numbers'),
  tokenLogoId: z.string().min(1, 'Token Logo is required'), // Info: (20260108 - Tzuhan) 前端上傳後取得的 File ID
});

// Info: (20260108 - Tzuhan) Step 2: Basic Information
export const teamStep2Schema = z.object({
  legalName: z.string().min(1, 'Legal Company Name is required'),
  country: z.string().min(1, 'Registered Location is required'),
  representative: z.string().min(1, 'Representative Name is required'),
  contactPerson: z.string().optional(),
  contactNumber: z.string().min(1, 'Contact Number is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(), // Info: (20260108 - Tzuhan) Display Name, 若未填可由後端預設為 Legal Name
  website: z.string().url().optional().or(z.literal('')), // Info: (20260108 - Tzuhan) Optional URL
});

// Info: (20260108 - Tzuhan) Step 3: Registration Information
export const teamStep3Schema = z.object({
  legalStructure: z.string().min(1, 'Legal Structure is required'),
  registrationNum: z.string().min(1, 'Registration Number is required'),
  // Info: (20260108 - Tzuhan) 接收日期字串或 Date 物件
  registrationDate: z.coerce.date({
    required_error: 'Registration Date is required',
    invalid_type_error: 'That is not a date',
  }),
  industry: z.string().min(1, 'Industry is required'),
});

// Info: (20260108 - Tzuhan) Step 4: Review (目前僅供檢視，若有 Checkbox 可在此驗證)
export const teamStep4Schema = z.object({});

// Info: (20260108 - Tzuhan) Step 5: Upload Documents
export const teamStep5Schema = z.object({
  docIdType: z.enum(['Passport', 'National ID', 'Driving License'], {
    errorMap: () => ({ message: 'Please select an ID Type' }),
  }),
  docIdFile: z.string().min(1, 'ID Document is required'),
  docRegFile: z.string().min(1, 'Registration Certificate is required'),
  docUboFile: z.string().min(1, 'UBO Declaration is required'),
});

// Info: (20260108 - Tzuhan) API: 儲存草稿 (Save & Leave)
// 允許欄位為空 (Partial)，但必須帶有 currentStep
export const saveDraftSchema = z.object({
  currentStep: z.number().int().min(1).max(5),
  data: z.object({
    ...teamStep1Schema.partial().shape,
    ...teamStep2Schema.partial().shape,
    ...teamStep3Schema.partial().shape,
    // Info: (20260108 - Tzuhan) Step 4 無欄位
    ...teamStep5Schema.partial().shape,
  }),
});

// Info: (20260108 - Tzuhan) API: 最終送出 (Submit)
// Info: (20260108 - Tzuhan) 必須通過所有步驟的必填驗證
export const submitTeamSchema = teamStep1Schema
  .merge(teamStep2Schema)
  .merge(teamStep3Schema)
  .merge(teamStep5Schema);

// Info: (20260108 - Tzuhan) Export Types
export type TeamStep1Input = z.infer<typeof teamStep1Schema>;
export type TeamStep2Input = z.infer<typeof teamStep2Schema>;
export type TeamStep3Input = z.infer<typeof teamStep3Schema>;
export type TeamStep5Input = z.infer<typeof teamStep5Schema>;
export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
export type SubmitTeamInput = z.infer<typeof submitTeamSchema>;
