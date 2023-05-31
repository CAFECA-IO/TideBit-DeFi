import React from 'react';
import {CgSearch} from 'react-icons/cg';

const NewsHeader = () => {
  // TODO: i18n (20230531 - Shirley)
  const heading = 'News';
  return (
    <>
      <div className="flex w-full justify-center text-6xl">
        <div className="relative ">
          <div className="font-bold">{heading}</div>
          <div className="reflection bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent">
            {heading}
          </div>
        </div>
      </div>

      <div className="relative mr-100px mt-0 mb-5">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center"></div>
        <input
          type="search"
          // value={searches}
          className="absolute right-0 block w-250px rounded-full bg-darkGray p-3 pl-5 pr-10 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
          placeholder={`Search news`}
          required
          // onChange={onSearchChange}
        />
        <button
          type="button"
          className="absolute right-0 top-px rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-white/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
        >
          <CgSearch size={30} />
        </button>
      </div>
    </>
  );
};

export default NewsHeader;
