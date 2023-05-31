import React from 'react';
import RippleButton from '../ripple_button/ripple_button';

interface ITideButton {
  children: React.ReactNode;
  isHover?: boolean;
  isFocus?: boolean;
  className?: string;
  onClick?: () => void;
}

const TideButton = ({children, isHover = false, isFocus = false, ...otherProps}: ITideButton) => {
  // const hoverStyle =
  // 	isHover && `hover:scale-110 transition duration-300 ease-in-out`;
  const hoverStyle =
    isHover &&
    `px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:scale-105`;
  // font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150
  const focusStyle =
    isFocus &&
    `focus:ring-cyan-500 focus:ring-offset-cyan-200 ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`;

  return (
    <RippleButton
      buttonType="button"
      className={`${otherProps?.className} ${hoverStyle} ${focusStyle} mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
      {...otherProps}
    >
      {children}
    </RippleButton>
  );
};

export default TideButton;
