import React, {useState, useEffect, useRef, forwardRef} from 'react';

// interface UseOuterClickProps { // initialVisibleState: boolean; // componentVisible: boolean; //
// setComponentVisible?: React.Dispatch<React.SetStateAction<boolean>>; // }

// ClassAttributes<HTMLDivElement>.ref?: LegacyRef<HTMLDivElement>

function useOuterClick(initialVisibleState: boolean) {
  const [componentVisible, setComponentVisible] = useState<boolean>(initialVisibleState);

  const ref = useRef<HTMLDivElement>(null); // forwardRef(otherProps?.refP) ?? // const ref =
  // useRef(null);

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
    if (event.target instanceof HTMLElement && !ref.current?.contains(event.target)) {
      setComponentVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return {ref, componentVisible, setComponentVisible};
}

export default useOuterClick;
