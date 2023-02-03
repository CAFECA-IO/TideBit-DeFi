import {createContext, useState, useEffect, useContext} from 'react';

export interface IGlobalProvider {
  children: React.ReactNode;
}

export interface IGlobalContext {
  toast: string;
}

export const GlobalContext = createContext<IGlobalContext>({
  toast: '',
});

const toast = 'dummy toast';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const defaultValue = {toast};

  return <GlobalContext.Provider value={defaultValue}>{children}</GlobalContext.Provider>;
};
