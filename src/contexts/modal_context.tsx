'use client';

import React, { useState, useContext, createContext, useMemo } from 'react';

interface IModalContextType {
  isTermsOfServiceModalVisible: boolean;
  termsOfServiceModalVisibilityHandler: () => void;
  isGuidedTourModalVisible: boolean;
  guidedTourModalVisibilityHandler: () => void;
}

const ModalContext = createContext<IModalContextType>({
  isTermsOfServiceModalVisible: false,
  termsOfServiceModalVisibilityHandler: () => {},
  isGuidedTourModalVisible: false,
  guidedTourModalVisibilityHandler: () => {},
});

interface IModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: IModalProviderProps) => {
  const [isTermsOfServiceModalVisible, setIsTermsOfServiceModalVisible] = useState<boolean>(false);
  const [isGuidedTourModalVisible, setIsGuidedTourModalVisible] = useState<boolean>(false);

  // Info: (20251217 - Julian) Visibility handler for Modals
  const termsOfServiceModalVisibilityHandler = () =>
    setIsTermsOfServiceModalVisible((prev) => !prev);

  const guidedTourModalVisibilityHandler = () => setIsGuidedTourModalVisible((prev) => !prev);

  const value = useMemo(
    () => ({
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
      isGuidedTourModalVisible,
      guidedTourModalVisibilityHandler,
    }),
    [
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
      isGuidedTourModalVisible,
      guidedTourModalVisibilityHandler,
    ]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export function useModalCtx() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalCtx must be used within ModalProvider');
  }
  return context;
}
