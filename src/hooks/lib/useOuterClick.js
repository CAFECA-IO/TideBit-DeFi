import {useState, useEffect, useRef} from 'react';

function useOuterClick(initialVisibleState) {
  const [componentVisible, setComponentVisible] = useState(initialVisibleState);
  const ref = useRef(null);

  const handleClickOutside = event => {
    // if (!componentVisible) return;

    if (ref.current && !ref.current.contains(event.target)) {
      setComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return {
    ref,
    componentVisible,
    setComponentVisible,
  };
}

export default useOuterClick;
