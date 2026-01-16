'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { LiaDiceSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalCtx } from '@/contexts/global_context';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';
import { registrationService, RegistrationStep } from '@/services/registration.service';

const RegisterModal: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('IDLE');

  const stepTextMap: Record<RegistrationStep, string> = {
    IDLE: 'Sign Up',
    FETCHING_CHALLENGE: 'Getting secure challenge...',
    CREATING_PASSKEY: 'Creating your biometric key...',
    PARSING_PASSKEY: 'Parsing credentials...',
    PREDICTING_ADDRESS: 'Predicting your wallet address...',
    CALCULATING_HASH: 'Preparing deployment data...',
    AWAITING_SIGNATURE: 'Please sign to authorize account creation...',
    DEPLOYING: 'Submitting to blockchain...',
    SUCCESS: 'Account Created!',
    FAILED: 'Registration failed',
  };

  const {
    isRegisterModalVisible: isModalVisible,
    registerModalVisibilityHandler: onClose,
    termsOfServiceModalVisibilityHandler,
  } = useModalCtx();

  // Info: (20251218 - Julian) 從 Global Context 取得使用者是否已閱讀並同意條款
  const { isReviewedTerms } = useGlobalCtx();

  const DEFAULT_IMAGE = '/elements/default_pic.png'; // ToDo: (20251218 - Julian) Replace with actual default image path

  // Info: (20251218 - Julian) 需要同意條款；輸入框不為空才能提交
  const isSubmitDisabled = !isReviewedTerms || inputValue.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateRandomImage = async () => {
    // ToDo: (20251218 - Julian) Implement random image generation logic
  };

  // Info: (20251223 - Tzuhan) 核心註冊邏輯
  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      const result = await registrationService.signUp(
        inputValue.trim(),
        (step) => setCurrentStep(step) // 更新 UI 狀態
      );
      alert(`Successfully Deployed! Address: ${result.scwAddress}`);
      onClose();
    } catch (error) {
      console.error('Sign up failed:', error);
      alert(`Sign up failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setCurrentStep('IDLE');
    }
  };

  const displayedAgreeTerms = (
    <button
      type="button"
      onClick={termsOfServiceModalVisibilityHandler}
      className={`${
        isReviewedTerms
          ? 'text-button-state-outline-on-success-default hover:text-button-state-outline-on-success-hover'
          : 'text-button-state-outline-on-info-default hover:text-button-state-outline-on-info-hover'
      } flex items-center gap-spacing-lv-2 py-spacing-lv-6 font-bold`}
    >
      {isReviewedTerms ? <FaRegCircleCheck size={24} /> : <FaRegCircle size={24} />}
      <p>Before You Register, Please Review the Agreement</p>
    </button>
  );

  if (!isModalVisible) return null;

  return (
    <div className="fixed z-masking flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        {/* Info: (20251217 - Julian) Modal Header */}
        <div className="ml-auto p-spacing-lv-4">
          <button
            type="button"
            onClick={onClose}
            className="p-spacing-lv-0 text-button-neutral-outline-on-neutral-default"
          >
            <RxCross2 size={24} />
          </button>
        </div>
        {/* Info: (20251217 - Julian) Modal Content */}
        <div className="flex flex-col items-stretch gap-spacing-lv-6 px-spacing-lv-8 py-spacing-lv-4">
          <div className="flex flex-col gap-spacing-lv-3">
            <div className="flex flex-col items-center gap-spacing-lv-4 px-spacing-lv-5 py-spacing-lv-4">
              <div className="relative size-120px overflow-hidden rounded-full">
                <Image src={DEFAULT_IMAGE} alt="Profile Picture" fill objectFit="cover" />
              </div>
              <div className="flex flex-col items-center gap-spacing-lv-0">
                <Button type="button" variant="outline" onClick={generateRandomImage}>
                  <LiaDiceSolid size={24} />
                  <p>Generate New Picture</p>
                </Button>
                <p className="text-xs font-normal text-text-neutral-tertiary">
                  *You can change it later
                </p>
              </div>
            </div>
            <p className="font-semibold text-text-field-text-label">
              <span className="text-text-field-text-error">*</span> What do you want us to call you?
            </p>
            <div className="rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-6 py-spacing-lv-4">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none placeholder:text-text-field-text-placeholder"
                placeholder="Enter your nickname"
                aria-label="Nickname entry"
              />
            </div>
          </div>
          {displayedAgreeTerms}
        </div>
        {/* Info: (20251217 - Julian) Modal Actions */}
        <div className="ml-auto flex items-center gap-spacing-lv-3 px-spacing-lv-8 pb-spacing-lv-8 pt-spacing-lv-6">
          <Button type="button" variant="infoBorderless" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" disabled={isSubmitDisabled || isLoading} onClick={handleSignUp}>
            {isLoading ? stepTextMap[currentStep] : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
