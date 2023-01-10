import {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {ViewportContext} from '../contexts/theme_context';

const useViewport = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  // const {width, height} = useContext(ViewportContext);
  const timedelay = 1000;

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // return (
  //   <viewportContext.Provider value={{ width, height }}>
  //     {children}
  //   </viewportContext.Provider>
  // );
  return {width, height};
};

export default useViewport;
