import React from 'react';
import {CgSearch} from 'react-icons/cg';

interface INewsHeader {
  searchChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewsHeader = ({searchChangeHandler}: INewsHeader) => {
  const heading = 'News';
  return (
    <>
      <div className="flex w-full justify-center text-6xl">
        <div className="relative">
          <div className="font-bold">{heading}</div>
          <div className="reflection bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent">
            {heading}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center pl-250px lg:hidden">
        <div className="relative mb-5 mt-5 lg:mr-100px">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center"></div>
          <input
            type="search"
            className="absolute right-0 block w-250px rounded-full bg-darkGray p-3 pl-5 pr-10 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
            placeholder={`Search news`}
            required
            onChange={searchChangeHandler}
          />
          <button
            type="button"
            className="absolute right-0 top-px rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-white/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
          >
            <CgSearch size={30} />
          </button>
        </div>
      </div>

      <div className="mb-5 mt-0 hidden lg:relative lg:mr-100px lg:flex">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center"></div>
        <input
          type="search"
          className="absolute right-0 block w-250px rounded-full bg-darkGray p-3 pl-5 pr-10 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
          placeholder={`Search news`}
          required
          onChange={searchChangeHandler}
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
