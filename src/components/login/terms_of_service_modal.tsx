'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useModalCtx } from '@/contexts/modal_context';
import { Button } from '@/components/common/button';

const TERM_OF_SERVICE_TEXT = `
# CAFECA Digital Identity Standard Form Contract
##### v1.0.0 2025/11/12

Party A and Party B, for the purpose of using the “CAFECA Digital Identity Card Service” provided by Party A (hereinafter referred to as “the Service”), hereby agree to enter into this contract with the following terms for mutual compliance. When Party B clicks “Agree,” it shall be deemed that Party B has consented to the contents of this standard form contract:

### Definitions
1. The Service: Refers to the hardware and software systems and services provided by Party A that allow Party B, after completing the identity verification procedures, to register, activate, manage, and use the digital identity card, and to generate digital signatures.
2. Digital Identity Card: Refers to the digital certificate or identifier issued after Party B’s identity is verified by Party A, and bound to Party B’s hardware device that complies with the FIDO2 standard, used to represent Party B’s identity in digital environments.
3. Digital Signature: Refers to the digital signature generated through Party B’s use of the Service together with the private key security mechanism held by Party B, which is difficult to forge and verifiable for digital documents.
4. Identity Verification: Refers to the procedures conducted by Party A to confirm the authenticity of Party B’s identity, which may include but are not limited to national ID verification, bank account verification, citizen digital certificate verification, mobile phone number verification, and real-time photo capture.
5. Certificate: Refers to the electronic data issued by Party A or a cooperating certificate authority, used to link Party B’s identity with their public key.

### Governing Law and Jurisdiction
1. The interpretation, supplementation, and application of this contract shall be governed by the laws of the Republic of China.
2. For any disputes arising from this contract, both parties agree that the Taipei District Court of Taiwan shall be the court of first instance.
`;

const TermsOfServiceModal: React.FC = () => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isAgreedDisabled, setIsAgreedDisabled] = useState<boolean>(true);

  const {
    isTermsOfServiceModalVisible: isModalVisible,
    termsOfServiceModalVisibilityHandler: onClose,
  } = useModalCtx();

  // ToDo: (20251216 - Julian) 處理同意條款的邏輯
  const handleAgree = async () => {
    onClose();
  };

  // Info: (20251216 - Julian) 監聽 textContainerRef 的滾動事件，以更新閱讀進度
  const handleScroll = () => {
    if (textContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = textContainerRef.current;

      // Info: (20251216 - Julian) 計算全高度
      const totalScrollableHeight = scrollHeight - clientHeight;

      // Info: (20251216 - Julian) 計算閱讀百分比
      const progress = (scrollTop / totalScrollableHeight) * 100;

      // Info: (20251216 - Julian) 限制進度只會增加，不會減少
      setReadingProgress((prev) => Math.max(prev, progress));
    }
  };

  useEffect(() => {
    // Info: (20251216 - Julian) 當閱讀進度達到 100% 時，啟用同意按鈕
    setIsAgreedDisabled(readingProgress < 100);
  }, [readingProgress]);

  useEffect(() => {
    // Info: (20251216 - Julian) 每次打開 Modal 時，重置閱讀進度和按鈕狀態
    setReadingProgress(0);
    setIsAgreedDisabled(true);

    // Info: (20251216 - Julian) 重置滾動位置到頂部
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = 0;
    }
  }, [isModalVisible]);

  const progress = (
    <div className="relative my-spacing-lv-3 h-4px w-full overflow-hidden rounded-radius-rounded bg-loading-indicator-surface-base">
      <span
        style={{ width: `${readingProgress}%` }}
        className="absolute left-0 h-full rounded-radius-rounded bg-loading-indicator-surface-primary transition-all duration-300 ease-in-out"
      ></span>
    </div>
  );

  const textContainer = (
    <div
      ref={textContainerRef}
      onScroll={handleScroll}
      className="size-400px overflow-y-auto bg-surface-neutral-background p-spacing-lv-6 text-text-neutral-secondary"
    >
      {/* ToDo: (20251216 - Julian) Markdown to HTML Parsing */}
      <p className="whitespace-pre-wrap">{TERM_OF_SERVICE_TEXT}</p>
    </div>
  );

  const isDisplayedModal = isModalVisible && (
    <div className="fixed z-masking-2 flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        {/* Info: (20251216 - Julian) Modal Header */}
        <div className="p-spacing-lv-4 font-semibold text-modal-text-title">
          Please Read and Agree with the Terms
        </div>
        {/* Info: (20251216 - Julian) Modal Content */}
        <div className="flex flex-col px-spacing-lv-6 py-spacing-lv-4">
          {progress}
          {textContainer}
        </div>
        {/* Info: (20251216 - Julian) Modal Actions */}
        <div className="grid grid-cols-2 gap-spacing-lv-3 px-spacing-lv-6 py-spacing-lv-4">
          <Button type="button" variant="errorOutline" onClick={onClose} className="w-full">
            Decline
          </Button>
          <Button
            type="button"
            disabled={isAgreedDisabled}
            onClick={handleAgree}
            className="w-full"
          >
            Agree
          </Button>
        </div>
      </div>
    </div>
  );

  return isDisplayedModal;
};

export default TermsOfServiceModal;
