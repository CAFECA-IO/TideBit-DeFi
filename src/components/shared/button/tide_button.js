import React from 'react';

const TideButton = ({content = '', isHover = false, isFocus = false, ...otherProps}) => {
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
    <button
      className={`${otherProps?.className} ${hoverStyle} ${focusStyle} text-white bg-cyan-400 border-0 mt-4 md:mt-0 py-2 px-5 focus:outline-none hover:bg-cyan-600 rounded text-base`}
    >
      {content}
    </button>
  );
};

export default TideButton;
