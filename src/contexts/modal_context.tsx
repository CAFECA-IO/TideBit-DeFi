'use client';

import React, { useState, useContext, createContext, useMemo } from 'react';

interface IModalContextType {
  isTermsOfServiceModalVisible: boolean;
  termsOfServiceModalVisibilityHandler: () => void;
  isGuidedTourModalVisible: boolean;
  guidedTourModalVisibilityHandler: () => void;
  isRegisterModalVisible: boolean;
  registerModalVisibilityHandler: () => void;
  // Info: (20251223 - Tzuhan) 新增 Authentication Modal 控制
  isAuthenticationModalVisible: boolean;
  authenticationModalVisibilityHandler: () => void;
}

const ModalContext = createContext<IModalContextType>({
  isTermsOfServiceModalVisible: false,
  termsOfServiceModalVisibilityHandler: () => {},
  isGuidedTourModalVisible: false,
  guidedTourModalVisibilityHandler: () => {},
  isRegisterModalVisible: false,
  registerModalVisibilityHandler: () => {},
  // Info: (20251223 - Tzuhan) Default values
  isAuthenticationModalVisible: false,
  authenticationModalVisibilityHandler: () => {},
});

interface IModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: IModalProviderProps) => {
  const [isTermsOfServiceModalVisible, setIsTermsOfServiceModalVisible] = useState<boolean>(false);
  const [isGuidedTourModalVisible, setIsGuidedTourModalVisible] = useState<boolean>(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  // Info: (20251223 - Tzuhan) State
  const [isAuthenticationModalVisible, setIsAuthenticationModalVisible] = useState<boolean>(false);

  const termsOfServiceModalVisibilityHandler = () =>
    setIsTermsOfServiceModalVisible((prev) => !prev);

  const guidedTourModalVisibilityHandler = () => setIsGuidedTourModalVisible((prev) => !prev);

  const registerModalVisibilityHandler = () => setIsRegisterModalVisible((prev) => !prev);

  // Info: (20251223 - Tzuhan) Handler
  const authenticationModalVisibilityHandler = () =>
    setIsAuthenticationModalVisible((prev) => !prev);

  const value = useMemo(
    () => ({
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
      isGuidedTourModalVisible,
      guidedTourModalVisibilityHandler,
      isRegisterModalVisible,
      registerModalVisibilityHandler,
      // Info: (20251223 - Tzuhan) Value
      isAuthenticationModalVisible,
      authenticationModalVisibilityHandler,
    }),
    [
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
      isGuidedTourModalVisible,
      guidedTourModalVisibilityHandler,
      isRegisterModalVisible,
      registerModalVisibilityHandler,
      isAuthenticationModalVisible,
      authenticationModalVisibilityHandler,
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
