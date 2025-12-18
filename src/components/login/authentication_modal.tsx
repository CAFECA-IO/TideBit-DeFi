'use client';

import React from 'react';

// ToDo: (20251218 - Julian) During development: Lottie animation needed here

const AuthenticationModal: React.FC = () => {
  const isModalVisible = false;

  const isDisplayedModal = isModalVisible && (
    <div className="fixed z-masking flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask-subtle p-50px backdrop-blur-lg">
      <div className="flex flex-col items-stretch overflow-hidden rounded-radius-m bg-modal-surface-background">
        Face ID
      </div>
    </div>
  );

  return isDisplayedModal;
};

export default AuthenticationModal;
