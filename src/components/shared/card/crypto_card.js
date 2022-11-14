import React from 'react';
import {FaEthereum} from 'react-icons/fa';

const CryptoCard = () => {
  return (
    <div className="shadow-lg rounded-2xl w-50 p-4 border-2 bg-white dark:bg-gradient-to-b from-blue-800 via-gray-900 to-black border-blue-900 opacity-90">
      <div className="flex items-center">
        <span className="bg-blue-500 p-2 h-10 w-10 rounded-full relative">
          <FaEthereum
            size={30}
            className="text-white h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </span>
        <div className="ml-2 items-center">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-50">Ethereum</p>
          <p className="text-xs dark:text-gray-200 opacity-60">ETH</p>
        </div>
      </div>

      <div className="flex flex-col justify-start">
        <div className="mt-5 mb-2 relative w-28 h-2 bg-gray-200 rounded">
          <div className="absolute top-0 h-2 left-0 rounded bg-blue-200 w-2/3"></div>
        </div>

        <span className="flex justify-between items-center text-green-400 text-sm -mb-5">
          <p className="text-green-400 text-base text-left font-bold my-4">$17,414</p>
          <div className="flex ml-10">
            <span className="text-sm">(+11.1%)</span>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
            </svg>
          </div>
        </span>
      </div>
    </div>
  );
};

export default CryptoCard;
