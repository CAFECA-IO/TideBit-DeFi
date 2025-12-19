'use client';

import React, { useState, useContext, createContext, useMemo } from 'react';

interface IGlobalContextType {
  isSidebarOpen: boolean;
  sidebarToggleHandler: () => void;
  isReviewedTerms: boolean;
  reviewedTermsHandler: (isReviewed: boolean) => void;
}

const GlobalContext = createContext<IGlobalContextType>({
  isSidebarOpen: true,
  sidebarToggleHandler: () => {},
  isReviewedTerms: false,
  reviewedTermsHandler: () => {},
});

interface IGlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isReviewedTerms, setIsReviewedTerms] = useState<boolean>(false);

  // Info: (20251219 - Julian) Sidebar toggle handler
  const sidebarToggleHandler = () => setIsSidebarOpen((prev) => !prev);

  // Info: (20251218 - Julian) Visibility handler for Modals
  const reviewedTermsHandler = (isReviewed: boolean) => setIsReviewedTerms(isReviewed);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      sidebarToggleHandler,
      isReviewedTerms,
      reviewedTermsHandler,
    }),
    [isSidebarOpen, sidebarToggleHandler, isReviewedTerms, reviewedTermsHandler]
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export function useGlobalCtx() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalCtx must be used within GlobalProvider');
  }
  return context;
}
