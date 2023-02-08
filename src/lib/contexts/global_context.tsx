import {createContext, useState, useEffect, useContext, Dispatch, SetStateAction} from 'react';
import useWindowSize from '../hooks/use_window_size';
import {LAYOUT_BREAKPOINT} from '../../constants/display';
import {toast as toastify} from 'react-toastify';
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
  toast: (props: {type: string; message: string}) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as LayoutAssertionUnion,
  initialColorMode: '' as ColorModeUnion,
  colorMode: '' as ColorModeUnion,
  toggleColorMode: () => null,
  toast: () => null,
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

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  interface IToastify {
    type: string;
    message: string;
  }

  const TOAST_CLASSES_TYPE = {
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const toastHandler = ({type, message}: IToastify) => {
    return {
      [TOAST_CLASSES_TYPE.error]: toastify.error(message),
      [TOAST_CLASSES_TYPE.warning]: toastify.warning(message),
      [TOAST_CLASSES_TYPE.info]: toastify.info(message),
    }[type];
  };

  const toast = ({type, message}: IToastify) => {
    // toastify.info('toast in global context');
    // toastify.error(message);
    toastHandler({type: type, message: message});
    // console.log(TOAST_CLASSES_TYPE.error);
    // console.log(toastHandler);
  };

  const defaultValue = {
    width,
    height,
    layoutAssertion,
    initialColorMode,
    colorMode,
    toggleColorMode,
    toast,
  };
  return <GlobalContext.Provider value={defaultValue}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
