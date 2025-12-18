'use client';

import React, { useState, useContext, createContext, useMemo } from 'react';

interface IGlobalContextType {
  isReviewedTerms: boolean;
  reviewedTermsHandler: (isReviewed: boolean) => void;
}

const GlobalContext = createContext<IGlobalContextType>({
  isReviewedTerms: false,
  reviewedTermsHandler: () => {},
});

interface IGlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [isReviewedTerms, setIsReviewedTerms] = useState<boolean>(false);

  // Info: (20251218 - Julian) Visibility handler for Modals
  const reviewedTermsHandler = (isReviewed: boolean) => setIsReviewedTerms(isReviewed);

  const value = useMemo(
    () => ({
      isReviewedTerms,
      reviewedTermsHandler,
    }),
    [isReviewedTerms, reviewedTermsHandler]
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
