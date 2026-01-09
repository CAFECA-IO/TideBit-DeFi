import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ZodTypeAny } from 'zod';
import { teamService } from '@/services/team.service';
import {
  teamStep1Schema,
  teamStep2Schema,
  teamStep3Schema,
  teamStep5Schema,
  submitTeamSchema,
  type SubmitTeamInput,
} from '@/validators/team';

// Info: (20260108 - Tzuhan) 定義總步驟數
const TOTAL_STEPS = 5;

// Info: (20260108 - Tzuhan) 定義表單初始狀態
const initialFormData: Partial<SubmitTeamInput> = {
  // Info: (20260108 - Tzuhan) Step 1
  tokenName: '',
  tokenSymbol: '',
  tokenLogoId: '',
  // Info: (20260108 - Tzuhan) Step 2
  legalName: '',
  country: 'Taiwan',
  representative: '',
  contactPerson: '',
  phone: '+886',
  email: '',
  name: '',
  website: '',
  // Info: (20260108 - Tzuhan) Step 3
  legalStructure: 'Company Limited by Shares',
  registrationNum: '',
  industry: '',
  // Info: (20260108 - Tzuhan) Step 5
  docIdType: 'National ID', // Info: (20260108 - Tzuhan) Zod Enum 預設值
  docIdFile: '',
  docRegFile: '',
  docUboFile: '',
};

// Info: (20260109 - Tzuhan) [Fix] 清理 FormData，移除空字串，避免 Draft 驗證失敗
function cleanFormData(data: Partial<SubmitTeamInput>) {
  const cleaned: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    // Info: (20260109 - Tzuhan) 只保留非空字串、非 null、非 undefined 的值
    // 注意：如果是數字 0 或布林值 false 應該保留，但目前的欄位都是 string/date
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

export function useCreateTeam() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Info: (20260108 - Tzuhan) 使用 Partial<SubmitTeamInput>，因為填寫過程中欄位可能為 undefined
  const [formData, setFormData] = useState<Partial<SubmitTeamInput>>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Info: (20260108 - Tzuhan) [Strict] 使用泛型 K 確保 value 的型別正確對應 field
  // K extends keyof SubmitTeamInput: 限制 field 必須是表單欄位名稱
  // value: SubmitTeamInput[K]: 限制 value 必須是該欄位定義的型別 (string | number | Date | ...)
  const updateField = useCallback(
    <K extends keyof SubmitTeamInput>(field: K, value: SubmitTeamInput[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Info: (20260108 - Tzuhan) 清除該欄位的錯誤訊息
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    []
  );

  // Info: (20260108 - Tzuhan) 檔案上傳處理
  const handleUpload = useCallback(
    async (file: File, fieldName: keyof SubmitTeamInput) => {
      setIsUploading(true);
      try {
        const result = await teamService.uploadFile(file);
        // Info: (20260108 - Tzuhan) uploadFile 回傳 url 為字串，這裡強制斷言 fieldName 對應的欄位接受 string
        // 在我們的 Schema 中，所有 File 欄位都是 string (存 URL/ID)
        updateField(fieldName, result.url as SubmitTeamInput[typeof fieldName]);
        return result;
      } catch (error) {
        console.error(error);
        const msg = error instanceof Error ? error.message : 'Unknown upload error';
        alert(`Upload failed: ${msg}`);
      } finally {
        setIsUploading(false);
      }
    },
    [updateField]
  );

  // Info: (20260108 - Tzuhan) 驗證當前步驟資料
  const validateCurrentStep = useCallback((): boolean => {
    // Info: (20260108 - Tzuhan) 使用 ZodTypeAny 替代 any，這在 Zod 中是合法的基礎型別
    let schema: ZodTypeAny;

    switch (currentStep) {
      case 1:
        schema = teamStep1Schema;
        break;
      case 2:
        schema = teamStep2Schema;
        break;
      case 3:
        schema = teamStep3Schema;
        break;
      case 4:
        return true;
      case 5:
        schema = teamStep5Schema;
        break;
      default:
        return true;
    }

    // Info: (20260108 - Tzuhan) safeParse 接受 unknown，所以可以直接傳入 formData
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        // Info: (20260108 - Tzuhan) issue.path 是 (string | number)[]
        const key = issue.path[0];
        if (typeof key === 'string') {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [currentStep, formData]);

  // Info: (20260108 - Tzuhan) 下一步 (Save & Next)
  const handleNext = useCallback(async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      const nextStepIndex = currentStep < TOTAL_STEPS ? currentStep + 1 : currentStep;

      // Info: (20260109 - Tzuhan) [Fix] 使用 cleanFormData 過濾空值
      const cleanedData = cleanFormData(formData);

      const result = await teamService.saveDraft(companyId, {
        currentStep: nextStepIndex,
        data: cleanedData,
      });

      if (!companyId && result.companyId) {
        setCompanyId(result.companyId);
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, currentStep, formData, validateCurrentStep]);

  // Info: (20260108 - Tzuhan) 上一步
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  }, [currentStep]);

  // Info: (20260108 - Tzuhan) 最終送出 (Step 5)
  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) return;
    if (!companyId) {
      alert('Error: Missing Company ID. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullValidation = submitTeamSchema.safeParse(formData);
      if (!fullValidation.success) {
        alert('Please ensure all fields are filled correctly.');
        return;
      }

      await teamService.submitApplication(companyId, fullValidation.data);

      alert('Application submitted successfully!');
      router.push('/funding'); // Info: (20260108 - Tzuhan) 成功後跳轉
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Submission failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, formData, router, validateCurrentStep]);

  // Info: (20260108 - Tzuhan) 暫存並離開 (Save & Leave)
  const handleSaveAndLeave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Info: (20260109 - Tzuhan) [Fix] 同樣使用 cleanFormData
      const cleanedData = cleanFormData(formData);

      await teamService.saveDraft(companyId, {
        currentStep,
        data: cleanedData,
      });
      router.push('/funding');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, currentStep, formData, router]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    formData,
    errors,
    isSubmitting,
    isUploading,
    updateField,
    handleUpload,
    handleNext,
    handleBack,
    handleSubmit,
    handleSaveAndLeave,
  };
}
