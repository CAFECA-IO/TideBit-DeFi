'use client';

import React, { useState, useContext, createContext, useMemo, useCallback } from 'react';

interface IModalContextType {
  isTermsOfServiceModalVisible: boolean;
  termsOfServiceModalVisibilityHandler: () => void;
  isGuidedTourModalVisible: boolean;
  guidedTourModalVisibilityHandler: () => void;
  isRegisterModalVisible: boolean;
  registerModalVisibilityHandler: () => void;
  isAuthenticationModalVisible: boolean;
  authenticationModalVisibilityHandler: () => void;
  isCreateCompanyModalVisible: boolean;
  createCompanyModalVisibilityHandler: () => void;
}

const ModalContext = createContext<IModalContextType>({
  isTermsOfServiceModalVisible: false,
  termsOfServiceModalVisibilityHandler: () => {},
  isGuidedTourModalVisible: false,
  guidedTourModalVisibilityHandler: () => {},
  isRegisterModalVisible: false,
  registerModalVisibilityHandler: () => {},
  isAuthenticationModalVisible: false,
  authenticationModalVisibilityHandler: () => {},
  isCreateCompanyModalVisible: false,
  createCompanyModalVisibilityHandler: () => {},
});

interface IModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: IModalProviderProps) => {
  const [isTermsOfServiceModalVisible, setIsTermsOfServiceModalVisible] = useState<boolean>(false);
  const [isGuidedTourModalVisible, setIsGuidedTourModalVisible] = useState<boolean>(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  const [isAuthenticationModalVisible, setIsAuthenticationModalVisible] = useState<boolean>(false);
  const [isCreateCompanyModalVisible, setIsCreateCompanyModalVisible] = useState<boolean>(false);

  const termsOfServiceModalVisibilityHandler = useCallback(
    () => setIsTermsOfServiceModalVisible((prev) => !prev),
    []
  );

  const guidedTourModalVisibilityHandler = useCallback(
    () => setIsGuidedTourModalVisible((prev) => !prev),
    []
  );

  const registerModalVisibilityHandler = useCallback(
    () => setIsRegisterModalVisible((prev) => !prev),
    []
  );

  const authenticationModalVisibilityHandler = useCallback(
    () => setIsAuthenticationModalVisible((prev) => !prev),
    []
  );

  const createCompanyModalVisibilityHandler = useCallback(() => {
    setIsCreateCompanyModalVisible((prev) => !prev);
    console.log('Toggled CreateCompanyModal visibility');
  }, []);

  const value = useMemo(
    () => ({
      isTermsOfServiceModalVisible,
      termsOfServiceModalVisibilityHandler,
      isGuidedTourModalVisible,
      guidedTourModalVisibilityHandler,
      isRegisterModalVisible,
      registerModalVisibilityHandler,
      isAuthenticationModalVisible,
      authenticationModalVisibilityHandler,

      isCreateCompanyModalVisible,
      createCompanyModalVisibilityHandler,
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
      isCreateCompanyModalVisible,
      createCompanyModalVisibilityHandler,
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
