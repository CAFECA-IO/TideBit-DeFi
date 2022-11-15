import React from 'react';
import Image from 'next/image';

// <div className="flex flex-col items-center bg-gray-800 p-3 rounded hover:cursor-pointer hover:opacity-80">

const WalletOption = ({name = 'Metamask', img = '/metamask.png', iconSize = '50'}) => {
  return (
    <div className="flex flex-col items-center bg-gray-800 px-1 py-3 rounded hover:cursor-pointer hover:opacity-80">
      <Image
        className="bg-gray-800 p-1 rounded-xl hover:cursor-pointer hover:opacity-80"
        onClick={() => {
          console.log(`${name} clicked`);
        }}
        src={img}
        height={iconSize}
        width={iconSize}
        alt={name}
      />
      <p className="mt-1 mx-1 text-xs">{name}</p>
    </div>
  );
};

export default WalletOption;
