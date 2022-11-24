import React from 'react';
import Image from 'next/image';

// <div className="flex flex-col items-center bg-gray-800 p-3 rounded hover:cursor-pointer hover:opacity-80">

const WalletOption = ({name = '', img = '', iconSize = '', ...otherProps}) => {
  return (
    <div
      {...otherProps}
      className={`flex flex-col items-center rounded bg-darkGray2 px-1 py-3 text-sm hover:cursor-pointer hover:opacity-80`}
    >
      <Image
        className="rounded-xl bg-darkGray2 p-1 hover:cursor-pointer hover:opacity-80"
        onClick={() => {
          // console.log(`${name} clicked`);
        }}
        src={img}
        height={iconSize}
        width={iconSize}
        alt={name}
      />
      <p className="mx-1 mt-1 text-xs">{name}</p>
    </div>
  );
};

export default WalletOption;
