import { useEffect, useRef } from 'react';
import useStateRef from 'react-usestateref';

function useOuterClick<T extends HTMLElement>(initialVisibleState: boolean) {
  const [componentVisible, setComponentVisible] = useStateRef<boolean>(initialVisibleState);

  const targetRef = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (event.target instanceof HTMLElement && !targetRef.current?.contains(event.target)) {
        setComponentVisible(false);
      }
    }

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [setComponentVisible]);

  return {
    targetRef,
    componentVisible,
    setComponentVisible,
  };
}

export default useOuterClick;
