'use client';

import React from 'react';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import { FaRegFilePdf, FaRegImage, FaCloudUploadAlt } from 'react-icons/fa';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import DropdownMenu from '@/components/common/dropdown_menu';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';
import { useCreateTeam } from '@/lib/hooks/use_create_team'; // Info: (20260108 - Tzuhan) 引入我們剛寫好的 Hook

// Info: (20260108 - Tzuhan) 定義下拉選單選項
const LEGAL_STRUCTURE_OPTIONS = [
  'Company Limited by Shares',
  'Limited Company',
  'Sole Proprietorship',
];
const INDUSTRY_OPTIONS = [
  'Technology',
  'Finance',
  'Manufacturing',
  'Healthcare',
  'Retail',
  'Other',
];
const ID_TYPE_OPTIONS = ['Passport', 'National ID', 'Driving License'];
const LOCATION_OPTIONS = ['Taiwan', 'United States', 'Japan', 'Singapore', 'Other'];
const PHONE_PREFIX_OPTIONS = ['+886', '+1', '+81', '+65'];

const CreateCompanyModal = () => {
  const {
    isCreateCompanyModalVisible: isModalVisible,
    createCompanyModalVisibilityHandler: onClose,
  } = useModalCtx();

  // Info: (20260108 - Tzuhan) 使用 Hook 管理狀態與邏輯
  const {
    currentStep,
    totalSteps,
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
  } = useCreateTeam();

  if (!isModalVisible) return null;

  // Info: (20260108 - Tzuhan) 進度條百分比計算
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Info: (20260108 - Tzuhan) 通用輸入框樣式
  const inputContainerStyle = (hasError: boolean) =>
    `flex items-center rounded-radius-s border ${hasError ? 'border-text-state-error' : 'border-text-field-outline-default'
    } bg-text-field-surface-default px-spacing-lv-4 py-spacing-lv-3`;

  const inputStyle =
    'w-full bg-transparent text-text-field-text-active outline-none placeholder:text-text-field-text-placeholder';
  const labelStyle = 'text-sm font-semibold text-text-field-text-label mb-2 block';
  const errorStyle = 'text-xs text-text-state-error mt-1';

  // Info: (20260109 - Tzuhan) --- Step 1: Token Info ---
  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-neutral-primary">Create Team</h3>
        <p className="text-text-neutral-tertiary">Step 1: Token Information</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Info: (20260108 - Tzuhan) Logo Upload */}
        <div className="relative size-100px overflow-hidden rounded-full border border-dashed border-border-neutral-strong bg-surface-neutral-container-lv1">
          {formData.tokenLogoId ? (
            // ToDo: (20260109 - Tzuhan) 若是 File ID 需轉換為完整 URL，這邊假設 Hook 已處理或後端回傳完整 URL
            <Image src={formData.tokenLogoId} alt="Token Logo" className="object-cover" fill />
          ) : (
            <div className="flex size-full flex-col items-center justify-center text-text-neutral-tertiary">
              <FaRegImage size={24} />
              <span className="text-xs">Upload</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Upload Token Logo"
            onClick={(e) => (e.currentTarget.value = '')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, 'tokenLogoId');
            }}
          />
        </div>
        {isUploading && <p className="text-xs text-text-brand-primary">Uploading...</p>}
        {errors.tokenLogoId && <p className={errorStyle}>{errors.tokenLogoId}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="tokenName">
          Token Name (English) *
        </label>
        <div className={inputContainerStyle(!!errors.tokenName)}>
          <input
            id="tokenName"
            className={inputStyle}
            placeholder="e.g. iSunCloud Token"
            value={formData.tokenName}
            onChange={(e) => updateField('tokenName', e.target.value)}
            aria-label="Token Name (English)"
          />
        </div>
        {errors.tokenName && <p className={errorStyle}>{errors.tokenName}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="tokenSymbol">
          Symbol *
        </label>
        <div className={inputContainerStyle(!!errors.tokenSymbol)}>
          <input
            id="tokenSymbol"
            className={inputStyle}
            placeholder="e.g. ISC"
            value={formData.tokenSymbol}
            onChange={(e) => updateField('tokenSymbol', e.target.value)}
            aria-label="Token Symbol"
          />
        </div>
        {errors.tokenSymbol && <p className={errorStyle}>{errors.tokenSymbol}</p>}
      </div>
    </div>
  );

  // Info: (20260109 - Tzuhan) --- Step 2: Basic Info ---
  const renderStep2 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-neutral-primary">Basic Info</h3>
        <p className="text-text-neutral-tertiary">Step 2: Company Details</p>
      </div>

      <div>
        <label className={labelStyle} htmlFor="legalName">
          Legal Company Name *
        </label>
        <div className={inputContainerStyle(!!errors.legalName)}>
          <input
            id="legalName"
            className={inputStyle}
            value={formData.legalName}
            onChange={(e) => updateField('legalName', e.target.value)}
            aria-label="Legal Company Name"
          />
        </div>
        {errors.legalName && <p className={errorStyle}>{errors.legalName}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="country">
          Registered Location *
        </label>
        <DropdownMenu
          options={LOCATION_OPTIONS}
          activeOption={formData.country || 'Taiwan'}
          selectOption={(val) => updateField('country', val)}
        />
      </div>

      <div>
        <label className={labelStyle} htmlFor="representative">
          Key Representative *
        </label>
        <div className={inputContainerStyle(!!errors.representative)}>
          <input
            className={inputStyle}
            value={formData.representative}
            onChange={(e) => updateField('representative', e.target.value)}
            aria-label="Key Representative"
          />
        </div>
        {errors.representative && <p className={errorStyle}>{errors.representative}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className={labelStyle} htmlFor="phonePrefix">
            Prefix
          </label>
          <DropdownMenu
            options={PHONE_PREFIX_OPTIONS}
            activeOption={'+886'}
            selectOption={() => { }} // Info: (20260108 - Tzuhan) 簡化：暫不處理 prefix 狀態
            aria-label="Phone Prefix"
          />
        </div>
        <div className="col-span-2">
          <label className={labelStyle} htmlFor="phone">
            Contact Number *
          </label>
          <div className={inputContainerStyle(!!errors.phone)}>
            <input
              id="phone"
              className={inputStyle}
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              aria-label="Contact Number"
            />
          </div>
          {errors.phone && <p className={errorStyle}>{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className={labelStyle} htmlFor="email">
          Email Address *
        </label>
        <div className={inputContainerStyle(!!errors.email)}>
          <input
            className={inputStyle}
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-label="Email Address"
          />
        </div>
        {errors.email && <p className={errorStyle}>{errors.email}</p>}
      </div>
    </div>
  );

  // Info: (20260109 - Tzuhan) --- Step 3: Registration Info ---
  const renderStep3 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-neutral-primary">Registration Info</h3>
        <p className="text-text-neutral-tertiary">Step 3: Legal Details</p>
      </div>

      <div>
        <label className={labelStyle} htmlFor="legalStructure">
          Legal Structure *
        </label>
        <DropdownMenu
          options={LEGAL_STRUCTURE_OPTIONS}
          activeOption={formData.legalStructure || LEGAL_STRUCTURE_OPTIONS[0]}
          selectOption={(val) => updateField('legalStructure', val)}
        />
        {errors.legalStructure && <p className={errorStyle}>{errors.legalStructure}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="registrationNum">
          Business Registration Number *
        </label>
        <div className={inputContainerStyle(!!errors.registrationNum)}>
          <input
            className={inputStyle}
            value={formData.registrationNum}
            onChange={(e) => updateField('registrationNum', e.target.value)}
            aria-label="Business Registration Number"
          />
        </div>
        {errors.registrationNum && <p className={errorStyle}>{errors.registrationNum}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="registrationDate">
          Registration Date *
        </label>
        <div className={inputContainerStyle(!!errors.registrationDate)}>
          <input
            type="date"
            className={inputStyle}
            // Info: (20260109 - Tzuhan) Zod coerce date 會轉成 Date 物件，這裡需轉回 string yyyy-MM-dd
            value={
              formData.registrationDate instanceof Date
                ? formData.registrationDate.toISOString().split('T')[0]
                : formData.registrationDate
            }
            onChange={(e) => updateField('registrationDate', new Date(e.target.value))}
            aria-label="Registration Date"
          />
        </div>
        {errors.registrationDate && <p className={errorStyle}>{errors.registrationDate}</p>}
      </div>

      <div>
        <label className={labelStyle} htmlFor="industry">
          Industry *
        </label>
        <DropdownMenu
          options={INDUSTRY_OPTIONS}
          activeOption={formData.industry || INDUSTRY_OPTIONS[0]}
          selectOption={(val) => updateField('industry', val)}
        />
        {errors.industry && <p className={errorStyle}>{errors.industry}</p>}
      </div>
    </div>
  );

  // Info: (20260109 - Tzuhan) --- Step 4: Review ---
  const renderStep4 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-neutral-primary">Review Information</h3>
        <p className="text-text-neutral-tertiary">Step 4: Please confirm details</p>
      </div>

      <div className="rounded-radius-s bg-surface-neutral-container-lv1 p-4 text-sm">
        <p className="mb-2 font-bold text-text-neutral-primary">Token Info</p>
        <p>Name: {formData.tokenName}</p>
        <p>Symbol: {formData.tokenSymbol}</p>

        <div className="my-3 border-t border-border-neutral-subtle"></div>

        <p className="mb-2 font-bold text-text-neutral-primary">Company Info</p>
        <p>Name: {formData.legalName}</p>
        <p>Rep: {formData.representative}</p>
        <p>Email: {formData.email}</p>
      </div>

      <div className="flex items-start gap-2 rounded-radius-s bg-surface-state-info-container p-3">
        <div className="mt-1 text-icon-state-info">ℹ️</div>
        <p className="text-sm text-text-state-info">
          Please verify all information is correct. Once submitted, some fields cannot be changed.
        </p>
      </div>
    </div>
  );

  // Info: (20260109 - Tzuhan) --- Step 5: Upload Documents ---
  const FileUploadField = ({ label, field }: { label: string; field: keyof typeof formData }) => (
    <div>
      <label className={labelStyle}>{label} *</label>
      <div
        className={`relative flex items-center justify-between rounded-radius-s border border-dashed ${errors[field] ? 'border-text-state-error bg-surface-state-error-container' : 'border-border-neutral-strong bg-surface-neutral-container-lv1'} p-4`}
      >
        <div className="flex items-center gap-3">
          <FaRegFilePdf className="text-text-neutral-tertiary" size={24} />
          <span className="max-w-200px truncate text-sm text-text-neutral-secondary">
            {formData[field] ? 'File Uploaded' : 'Upload PDF/JPG'}
          </span>
        </div>
        <div className="cursor-pointer rounded-radius-xs bg-button-neutral-filled-neutral-default px-3 py-1 text-sm font-semibold text-text-neutral-primary hover:bg-button-neutral-filled-neutral-hover">
          Choose
        </div>
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file, field);
          }}
          aria-label={label}
        />
      </div>
      {errors[field] && <p className={errorStyle}>{errors[field]}</p>}
    </div>
  );

  const renderStep5 = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-neutral-primary">Upload Documents</h3>
        <p className="text-text-neutral-tertiary">Step 5: KYC Verification</p>
      </div>

      <div>
        <label className={labelStyle} htmlFor="docIdType">
          ID Type *
        </label>
        <DropdownMenu
          options={ID_TYPE_OPTIONS}
          activeOption={formData.docIdType || ID_TYPE_OPTIONS[0]}
          selectOption={(val) =>
            updateField('docIdType', val as 'Passport' | 'National ID' | 'Driving License')
          }
        />
      </div>

      <FileUploadField label="ID of Legal Representative" field="docIdFile" />
      <FileUploadField label="Company Registration Certificate" field="docRegFile" />
      <FileUploadField label="UBO Declaration Form" field="docUboFile" />

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-text-brand-primary">
          <FaCloudUploadAlt className="animate-bounce" />
          <span className="text-sm font-bold">Uploading file...</span>
        </div>
      )}
    </div>
  );

  // Info: (20260108 - Tzuhan) 根據步驟切換內容
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex w-500px flex-col overflow-hidden rounded-radius-m bg-modal-surface-background shadow-xl">
        {/* Info: (20260109 - Tzuhan) Header with Progress */}
        <div className="relative bg-surface-neutral-container-lv1 pt-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-button-neutral-outline-on-neutral-default hover:opacity-70"
          >
            <RxCross2 size={24} />
          </button>
          <div className="px-8 pb-4">
            <ProgressBar
              percentage={progressPercentage}
              color={ProgressBarColor.GRADIENT}
              size={ProgressBarSize.SM}
              notPadding
            />
            <div className="mt-2 flex justify-between text-xs text-text-neutral-tertiary">
              <span>Basic Info</span>
              <span>Registration</span>
              <span>Upload</span>
            </div>
          </div>
        </div>

        {/* Info: (20260109 - Tzuhan) Content Body */}
        <div className="max-h-[60vh] overflow-y-auto px-8 py-6">{renderContent()}</div>

        {/* Info: (20260109 - Tzuhan) Footer Actions */}
        <div className="border-t border-border-neutral-subtle bg-surface-neutral-background px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
            ) : (
              <div /> // Info: (20260109 - Tzuhan) Spacer
            )}

            <div className="flex gap-3">
              <Button variant="neutral" onClick={handleSaveAndLeave} disabled={isSubmitting}>
                Save & Leave
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={isSubmitting || isUploading}>
                  {isSubmitting ? 'Saving...' : 'Save & Next'}
                </Button>
              ) : (
                <Button onClick={() => handleSubmit(onClose)} disabled={isSubmitting || isUploading}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyModal;
