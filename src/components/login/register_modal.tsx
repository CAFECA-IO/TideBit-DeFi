'use client';

import React from 'react';
import Image from 'next/image';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { LiaDiceSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';

const RegisterModal: React.FC = () => {
  const {
    isRegisterModalVisible: isModalVisible,
    registerModalVisibilityHandler: onClose,
    termsOfServiceModalVisibilityHandler,
  } = useModalCtx();

  // ToDo: (20251217 - Julian) 從 Global Context 取得使用者是否已閱讀並同意條款
  const isReadTerms = false;

  const DEFAULT_IMAGE = '/elements/default_pic.png';

  const displayedAgreeTerms = isReadTerms ? (
    <div className="flex items-center gap-spacing-lv-2 py-spacing-lv-6 font-bold text-button-state-outline-on-success-default">
      <FaRegCircleCheck size={24} />
      <p>Before You Register, Please Review the Agreement</p>
    </div>
  ) : (
    <button
      type="button"
      onClick={termsOfServiceModalVisibilityHandler}
      className="flex items-center gap-spacing-lv-2 py-spacing-lv-6 font-bold text-button-state-outline-on-info-default hover:text-button-state-outline-on-info-hover"
    >
      <FaRegCircle size={24} />
      <p>Before You Register, Please Review the Agreement</p>
    </button>
  );

  const isDisplayedModal = isModalVisible && (
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
                <Button type="button" variant="outline">
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
            <div className="bg-text-field-surface-placeholder rounded-radius-s border border-text-field-outline-default px-spacing-lv-6 py-spacing-lv-4">
              <input
                type="text"
                className="w-full bg-transparent outline-none placeholder:text-text-field-text-placeholder"
                placeholder="Search"
              />
            </div>
          </div>
          {displayedAgreeTerms}
        </div>
        {/* Info: (20251217 - Julian) Modal Actions */}
        <div className="ml-auto flex items-center gap-spacing-lv-3 px-spacing-lv-8 pb-spacing-lv-8 pt-spacing-lv-6">
          <Button type="button" variant="infoBorderless" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button">Sign Up</Button>
        </div>
      </div>
    </div>
  );

  return isDisplayedModal;
};

export default RegisterModal;
