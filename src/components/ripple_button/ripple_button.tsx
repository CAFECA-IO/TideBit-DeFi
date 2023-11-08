import React, {useEffect, useRef} from 'react';

interface IRippleButtonProps {
  className?: string;
  buttonStyle?: string;
  children: React.ReactNode | string;
  buttonType: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * @dev `disabledStyle` is regulated separate component, because the disabled state should be changed dynamically
 * @dev const disabledStyle = submitDisabled ? 'cursor-not-allowed' : ' hover:cursor-pointer';
 */
const RippleButton = ({
  onClick,
  className,
  children,
  buttonType = 'button',
  disabled,
  ...otherProps
}: IRippleButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const applyContainerProperties = () => {
      if (!buttonRef) return;
      buttonRef?.current?.classList.add('effectContainer');
    };

    const applyStyles = (e: MouseEvent) => {
      const {offsetX, offsetY} = e;

      const sizeOffset = 50;

      buttonRef.current?.style.setProperty('--effect-top', `${offsetY - sizeOffset}px`);
      buttonRef.current?.style.setProperty('--effect-left', `${offsetX - sizeOffset}px`);
    };

    const onClick = (e: MouseEvent) => {
      buttonRef?.current?.classList.remove('active');
      applyStyles(e);

      buttonRef?.current?.classList.add('active');
    };

    applyContainerProperties();

    buttonRef?.current?.addEventListener('mouseup', onClick);

    const cleanupRef = buttonRef?.current;

    return () => {
      cleanupRef?.removeEventListener('mouseup', onClick);
    };
  });

  return (
    <div>
      <button
        onClick={onClick}
        className={`${className}`}
        type={buttonType}
        ref={buttonRef}
        disabled={disabled}
        {...otherProps}
      >
        {children}
      </button>
    </div>
  );
};

export default RippleButton;
