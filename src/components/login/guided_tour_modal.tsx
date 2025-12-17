'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa6';
import { Button } from '@/components/common/button';

// ToDo: (20251217 - Julian) Replace with actual guided tour steps content
const GUIDED_TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome to Join TideBit De-Fi',
    description: "Thank you for joining TideBit De-Fi! We're excited to have you here.",
    imageSrc: '/elements/default_pic.png',
  },
  {
    step: 2,
    title: 'Explore De-Fi Features',
    description: 'Discover a wide range of decentralized finance features tailored for you.',
    imageSrc: '/elements/default_pic.png',
  },
  {
    step: 3,
    title: 'Secure Your Assets',
    description: 'Learn how to keep your digital assets safe and secure with our platform.',
    imageSrc: '/elements/default_pic.png',
  },
  {
    step: 4,
    title: 'Get Support',
    description: 'Need help? Our support team is here to assist you 24/7.',
    imageSrc: '/elements/default_pic.png',
  },
  {
    step: 5,
    title: 'Start Your Journey',
    description: 'Begin your De-Fi journey with TideBit today!',
    imageSrc: '/elements/default_pic.png',
  },
];

const GuidedTourModal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const totalSteps = GUIDED_TOUR_STEPS.length; // Info: (20251217 - Julian) 總步驟數

  // Info: (20251217 - Julian) 取得當前步驟的資料
  const currentStepData = GUIDED_TOUR_STEPS[currentStep];
  const { title, description, imageSrc } = currentStepData;

  const toNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const toPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Info: (20251216 - Julian) Carousel Indicators
  const carouselMapping = Array.from({ length: totalSteps }, (_, index) => index);
  const displayedCarousel = carouselMapping.map((step) => {
    const isActive = step === currentStep;
    return (
      <div
        key={`carousel-indicator-${step}`}
        className={`${
          isActive
            ? 'w-30px rounded-radius-rounded bg-carousel-indicator-active'
            : 'w-15px rounded-radius-rounded bg-carousel-indicator-base'
        } h-15px transition-all duration-150 ease-in-out`}
      ></div>
    );
  });

  // Info: (20251217 - Julian) 上一頁按鈕只在非第一步驟時顯示
  const displayedPrevBtn = currentStep > 0 && (
    <Button type="button" variant="infoOutline" size="square" onClick={toPrevStep}>
      <FaArrowLeft size={20} />
    </Button>
  );

  // Info: (20251217 - Julian) 下一頁按鈕，在最後一步驟改為開始按鈕
  const displayedNextBtn =
    currentStep < totalSteps - 1 ? (
      <Button type="button" variant="info" size="square" onClick={toNextStep}>
        <FaArrowRight size={20} />
      </Button>
    ) : (
      <Button type="button" variant="info" size="rectangle" onClick={toNextStep}>
        Start
      </Button>
    );

  return (
    <div className="fixed z-masking flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        <div className="flex flex-col gap-spacing-lv-6 px-spacing-lv-6 pb-spacing-lv-4 pt-spacing-lv-7">
          {/* Info: (20251216 - Julian) Image */}
          <div className="relative h-300px w-500px shrink-0 overflow-hidden">
            <Image src={imageSrc} width={500} height={300} alt="default_pic" />
          </div>
          {/* Info: (20251216 - Julian) Text */}
          <div className="flex w-500px flex-col gap-spacing-lv-2">
            <h2 className="text-lg font-bold text-text-neutral-primary">{title}</h2>
            <p className="font-normal text-text-neutral-secondary">{description}</p>
          </div>
          {/* Info: (20251216 - Julian) Carousel */}
          <div className="flex justify-center gap-spacing-lv-2 px-spacing-lv-2 py-spacing-lv-0">
            {displayedCarousel}
          </div>
        </div>
        {/* Info: (20251216 - Julian) Modal Actions */}
        <div className="flex items-center justify-between px-spacing-lv-6 py-spacing-lv-4">
          <Button type="button" variant="borderless">
            Skip
          </Button>
          <div className="flex items-center gap-spacing-lv-3">
            {displayedPrevBtn}
            {displayedNextBtn}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTourModal;
