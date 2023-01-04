import {useEffect, useRef} from 'react';

interface IRippleButtonProps {
  className?: string;
  buttonStyle?: string;
  children: React.ReactNode;
}

const RippleButton = ({className, buttonStyle, children}: IRippleButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>();

  // useEffect(() => {
  //   // // const box: Element | null
  //   // const element = document.querySelector('#effectContainer') as HTMLElement | null;

  //   // // box has type Element or null here

  //   // if (element != null) {
  //   //   // box has type Element here
  //   //   element.style.backgroundColor = 'salmon';
  //   // }

  //   const applyContainerProperties = () => {
  //     if (!buttonRef) return;
  //     buttonRef?.current?.classList.add('effectContainer');
  //   };

  //   // MouseEvent property
  //   const applyStyles = (e: MouseEvent) => {
  //     const {offsetX, offsetY} = e;
  //     const {style} = buttonRef.current;
  //     const sizeOffset = 50;

  //     style.setProperty('--effect-top', `${offsetY - sizeOffset}px`);
  //     style.setProperty('--effect-left', `${offsetX - sizeOffset}px`);
  //   };

  //   const onClick = (e: MouseEvent) => {
  //     // if (buttonRef)
  //     buttonRef?.current?.classList.remove('active');
  //     applyStyles(e);

  //     buttonRef?.current?.classList.add('active');

  //     // setTimeout(() => {
  //     //   buttonRef?.current.classList.add('active');
  //     // }, 1);
  //   };

  //   applyContainerProperties();

  //   // Add the event listener on mount
  //   buttonRef?.current?.addEventListener('mouseup', onClick);

  //   // Needed for referencing the ref in the return function
  //   const cleanupRef = buttonRef?.current;

  //   return () => {
  //     // Remove the event listener on unmount
  //     cleanupRef?.removeEventListener('mouseup', onClick);
  //   };
  // });

  // return (
  //   <div>
  //     <button
  //       className={`${className} rounded-md bg-tidebitTheme px-8 py-2 transition-all hover:opacity-90`}
  //       type="button"
  //       ref={buttonRef}
  //     >
  //       {children}
  //     </button>
  //     {/* <Image ref={buttonRef} src="/elements/group_15198@2x.png" width={512} height={512} /> */}
  //   </div>
  // );
};

export default RippleButton;
