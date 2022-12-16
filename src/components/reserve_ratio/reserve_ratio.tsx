import React from 'react';
import Image from 'next/image';

const ReserveRatio = () => {
  return (
    <section>
      <div className="mb-40 items-center text-2xl font-medium text-white lg:text-3xl xl:text-4xl">
        <div className="flex items-center justify-center">
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
          <h1 className="mx-1 text-center">
            Latest
            <span className="text-tidebitTheme"> reserve ratio</span> of TideBit holdings
          </h1>
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
        </div>
      </div>

      <div className="relative">
        {/* <div
          style={{
            backgroundImage: `url('/elements/group_15244.svg')`,
            width: '100%',
            height: '100%',
          }}
        > */}
        {/* background image */}
        <Image
          className="absolute w-full"
          src="/elements/group_15244.svg"
          width={1252}
          height={879}
          alt="picture"
        />
        {/* </div> */}
      </div>

      <div className="w-278px p-4 lg:w-400px">
        <div className="flex h-full flex-col rounded-lg bg-darkGray4 p-8">
          <div className="mb-3 flex items-center">
            <div className="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
              {/* <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg> */}
              <Image
                src="/elements/tether-seeklogo.com.svg"
                width={40}
                height={40}
                alt="tether-seeklogo.com.svg"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium text-lightGreen2">USDT</h2>
              <p className="-my-2">reserve ratio</p>
            </div>
          </div>
          <div className="grow">
            <p className="text-base leading-relaxed">120 %</p>
            <a className="mt-3 inline-flex items-center text-indigo-400">
              Learn More
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <div className="block max-w-sm rounded-lg bg-white text-center shadow-lg">
          <div className="border-b border-gray-300 py-3 px-6">Featured</div>
          <div className="p-6">
            <h5 className="mb-2 text-xl font-medium text-gray-900">Special title treatment</h5>
            <p className="mb-4 text-base text-gray-700">
              With supporting text below as a natural lead-in to additional content.
            </p>
            <button
              type="button"
              className=" inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              Button
            </button>
          </div>
          <div className="border-t border-gray-300 py-3 px-6 text-gray-600">2 days ago</div>
        </div>
      </div> */}
    </section>
  );
};

export default ReserveRatio;
