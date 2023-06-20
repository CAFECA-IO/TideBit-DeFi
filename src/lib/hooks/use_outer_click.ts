import React, {useState, useEffect, useRef, forwardRef} from 'react';
import useStateRef from 'react-usestateref';

// interface UseOuterClickProps { // initialVisibleState: boolean; // componentVisible: boolean; //
// setComponentVisible?: React.Dispatch<React.SetStateAction<boolean>>; // }

// ClassAttributes<HTMLDivElement>.ref?: LegacyRef<HTMLDivElement>

function useOuterClick<T extends HTMLElement>(initialVisibleState: boolean) {
  const [componentVisible, setComponentVisible, componentVisibleRef] =
    useStateRef<boolean>(initialVisibleState);

  // const ref = useRef<HTMLDivElement>(null); // forwardRef(otherProps?.refP) ?? // const ref =

  const targetRef = useRef<T>(null);

  // function assertIsNode(e: EventTarget | null): asserts e is Node {
  //   if (!e || !('nodeType' in e)) {
  //     throw new Error(`Node expected, got ${e}`);
  //   }
  // }

  // const handleClickOutside = (this: Document, event: {target: MouseEvent}): void => {
  //   // if (!componentVisible) return;
  //   // assertIsNode(event.target);

  //   // HTMLElement
  //   if (event.target instanceof Node && !ref.current?.contains(event.target)) {
  //     setComponentVisible(false);
  //   }
  // };

  function handleClickOutside(this: Document, event: MouseEvent): void {
    // event.target instanceof HTMLElement
    // event.target instanceof Node
    // assertIsNode(event.target);
    if (event.target instanceof HTMLElement && !targetRef.current?.contains(event.target)) {
      setComponentVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return {targetRef: targetRef, componentVisible: componentVisibleRef.current, setComponentVisible};
}

export default useOuterClick;
