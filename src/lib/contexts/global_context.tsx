import {createContext, useState, useEffect, useContext, Dispatch, SetStateAction} from 'react';
import useWindowSize from '../hooks/use_window_size';
import {LAYOUT_BREAKPOINT} from '../../constants/display';
export interface IGlobalProvider {
  children: React.ReactNode;
}

export type LayoutAssertionUnion = 'mobile' | 'desktop';
export type ColorModeUnion = 'light' | 'dark';

export interface IGlobalContext {
  width: number;
  height: number;
  layoutAssertion: LayoutAssertionUnion;
  initialColorMode: ColorModeUnion;
  colorMode: ColorModeUnion;
  toggleColorMode: () => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as LayoutAssertionUnion,
  initialColorMode: '' as ColorModeUnion,
  colorMode: '' as ColorModeUnion,
  toggleColorMode: () => null,
  // setColorMode: (() => {}) as Dispatch<SetStateAction<ColorModeUnion>>,
});

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const windowSize = useWindowSize();
  const {width, height} = windowSize;
  const layoutAssertion: LayoutAssertionUnion = width < LAYOUT_BREAKPOINT ? 'mobile' : 'desktop';

  const initialColorMode: ColorModeUnion = 'dark';
  const [colorMode, setColorMode] = useState<ColorModeUnion>(initialColorMode);
  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  const defaultValue = {
    width,
    height,
    layoutAssertion,
    initialColorMode,
    colorMode,
    toggleColorMode,
  };
  return <GlobalContext.Provider value={defaultValue}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
