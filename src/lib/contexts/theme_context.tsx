import {createContext, useState, useEffect, useContext} from 'react';
import useWindowSize from '../hooks/use_window_size';

export interface IViewportProvider {
  children: React.ReactNode;
}

export interface IViewportContext {
  width: number;
  height: number;
}

export const ViewportContext = createContext<IViewportContext>({
  width: 0,
  height: 0,
});

export const ViewportProvider = ({children}: IViewportProvider) => {
  const windowSize = useWindowSize();
  // const [width, setWidth] = useState(100);
  // const [height, setHeight] = useState(100);

  // const handleWindowResize = () => {
  //   setWidth(window.innerWidth);
  //   setHeight(window.innerHeight);
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleWindowResize);
  //   return () => window.removeEventListener('resize', handleWindowResize);
  // }, []);

  const {width, height} = windowSize;
  const defaultValue = {width, height};

  return <ViewportContext.Provider value={defaultValue}>{children}</ViewportContext.Provider>;
};

// export const useViewport = () => {
//   return useContext<IViewportContext>(ViewportContext);
// };
