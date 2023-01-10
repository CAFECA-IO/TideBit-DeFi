import {useState, useEffect, useContext} from 'react';
import {ViewportContext} from '../contexts/theme_context';

const useViewport = () => {
  // const [width, setWidth] = useState(window.innerWidth)
  // const [height, setHeight] = useState(window.innerHeight)
  const {width, height} = useContext(ViewportContext);

  const handleWindowResize = () => {
    // setWidth(window.innerWidth);
    // setHeight(window.innerHeight);
  };

  useEffect(() => {
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
