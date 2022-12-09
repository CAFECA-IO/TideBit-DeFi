import React, {useState, useEffect, useRef, forwardRef} from 'react';

// interface UseOuterClickProps { // initialVisibleState: boolean; // componentVisible: boolean; //
setComponentVisible?: React.Dispatch<React.SetStateAction<boolean>>; // }

// ClassAttributes<HTMLDivElement>.ref?: LegacyRef<HTMLDivElement>

function useOuterClick(initialVisibleState: boolean) { const [componentVisible, setComponentVisible]
= useState<boolean>(initialVisibleState);

const ref = useRef<HTMLDivElement>(null); // forwardRef(otherProps?.refP) ?? // const ref =
useRef(null);

const handleClickOutside = (event: {target: HTMLElement}): void => { // if (!componentVisible)
return;

    if (ref.current && !ref.current.contains(event.target)) {
      setComponentVisible(false);
    }

};

useEffect(() => { document.addEventListener('click', handleClickOutside, true); return () => {
document.removeEventListener('click', handleClickOutside, true); }; }, []);

return { ref, componentVisible, setComponentVisible, }; }

export default useOuterClick;
