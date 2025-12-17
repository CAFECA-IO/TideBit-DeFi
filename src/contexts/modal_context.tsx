'use client';

import React, { useState, useContext, createContext, useMemo } from 'react';

interface IModalContextType {
  isTermsOfServiceModalVisible: boolean;
  termsOfServiceModalVisibilityHandler: () => void;
}

const ModalContext = createContext<IModalContextType>({
  isTermsOfServiceModalVisible: false,
  termsOfServiceModalVisibilityHandler: () => {},
});

interface IModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: IModalProviderProps) => {
  const [isTermsOfServiceModalVisible, setIsTermsOfServiceModalVisible] = useState<boolean>(false);

  // Info: (20251217 - Julian) Visibility handler for Modals
  const termsOfServiceModalVisibilityHandler = () =>
    setIsTermsOfServiceModalVisible((prev) => !prev);

  const value = useMemo(
    () => ({
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
    }),
    [isTermsOfServiceModalVisible, termsOfServiceModalVisibilityHandler]
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
