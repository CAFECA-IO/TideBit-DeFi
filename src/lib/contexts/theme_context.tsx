import {createContext, useState, useEffect, useContext} from 'react';
import useWindowSize from '../hooks/use_window_size';
import {LAYOUT_BREAKPOINT} from '../../constants/display';
export interface IViewportProvider {
  children: React.ReactNode;
}

export type LayoutAssertionUnion = 'mobile' | 'desktop';
export type ColorModeUnion = 'light' | 'dark';

export interface IViewportContext {
  width: number;
  height: number;
  layoutAssertion: LayoutAssertionUnion;
  // layoutAssertion: string;
  initialColorMode: ColorModeUnion;
}

export const ViewportContext = createContext<IViewportContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as LayoutAssertionUnion,
  initialColorMode: '' as ColorModeUnion,
});

export const ViewportProvider = ({children}: IViewportProvider) => {
  const windowSize = useWindowSize();
  const {width, height} = windowSize;
  const layoutAssertion: LayoutAssertionUnion = width < LAYOUT_BREAKPOINT ? 'mobile' : 'desktop';

  const [colorMode, setColorMode] = useState<ColorModeUnion>('dark');
  const initialColorMode: ColorModeUnion = 'dark';

  const defaultValue = {width, height, layoutAssertion, initialColorMode};
  return <ViewportContext.Provider value={defaultValue}>{children}</ViewportContext.Provider>;
};

export const useViewport = () => {
  return useContext(ViewportContext);
};
