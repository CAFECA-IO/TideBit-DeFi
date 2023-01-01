import {useEffect} from 'react';

interface IUserRippleAnimation {
  element: React.RefObject<HTMLDivElement>;
  config?: {size: number; hexColor: string; duration: number};
}

export default function useRippleAnimation(
  element: React.RefObject<HTMLDivElement>,
  config = {size: 20, hexColor: '#ffffff', duration: 1500}
) {
  const {size, hexColor: color, duration} = config;

  useEffect(() => {
    const applyContainerProperties = () => {
      if (!element) return;
      element?.current?.classList.add('effectContainer');
    };

    // MouseEvent property
    const applyStyles = (e: MouseEvent) => {
      // const ele = Array.from(
      //   document.getElementsByClassName('effectContainer') as HTMLCollectionOf<HTMLElement>
      // );
      // ele.forEach((e) => e.classList.remove('active'));

      const {offsetX, offsetY} = e;
      const {style} = element.current;
      const sizeOffset = 50;

      style.setProperty('--effect-top', `${offsetY - sizeOffset}px`);
      style.setProperty('--effect-left', `${offsetX - sizeOffset}px`);

      style.setProperty('--effect-duration', `${duration}px`);
      style.setProperty('--effect-height', `${size}px`);
      style.setProperty('--effect-width', `${size}px`);
      style.setProperty('--effect-color', `${color}px`);
    };

    const onClick = (e: MouseEvent) => {
      // if (element)
      element?.current?.classList.remove('active');
      applyStyles(e);

      element?.current?.classList.add('active');

      // setTimeout(() => {
      //   element?.current.classList.add('active');
      // }, 1);
    };

    applyContainerProperties();

    // Add the event listener on mount
    element?.current?.addEventListener('mouseup', onClick);

    // Needed for referencing the ref in the return function
    const cleanupRef = element?.current;

    return () => {
      // Remove the event listener on unmount
      cleanupRef?.removeEventListener('mouseup', onClick);
    };
  }, [color, size, duration, element]);
}
