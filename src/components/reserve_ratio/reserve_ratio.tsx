import React from 'react';
import Image from 'next/image';
import {FaLink} from 'react-icons/fa';
import {BiLinkAlt} from 'react-icons/bi';

// TODO: mobile version
// TODO: background image (overlay layout)
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

      {/* <TestReserveRatio /> */}

      {/* Reserve Ratio Card */}
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
        <div className="top-0 w-full">
          <div className="absolute right-180px w-278px p-4 md:right-250px md:w-400px lg:right-1/3 xl:right-2/5">
            <div className="flex h-full flex-col rounded-lg bg-darkGray4 p-8">
              <div className="mb-3 flex items-center">
                <div className="mr-3 inline-flex shrink-0 items-center justify-center rounded-full text-lightWhite">
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
                    width={50}
                    height={50}
                    alt="tether-seeklogo.com.svg"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-3xl font-medium text-lightGreen2">USDT</h2>
                  <p className="-my-1 mb-1">reserve ratio</p>
                </div>
              </div>

              <div className="grow">
                <p className="font-bold">
                  <span className="pr-2 text-6xl font-bold leading-relaxed">120</span> %
                </p>

                <div className="ml-48 flex w-120px flex-row items-center rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite">
                  <p>Blockchain</p>
                  <div className="pl-2">
                    <BiLinkAlt size={20} />
                  </div>
                </div>
                <span className="my-auto h-px w-full rounded bg-lightGray1/30 xs:inline-block"></span>

                {/* <a className="mt-3 inline-flex items-center text-indigo-400">
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
                </a> */}
                <div className="mb-5 flex flex-col space-y-2">
                  <div className="text-base text-lightGray">TideBit user asset holdings</div>
                  <div>3,016,827,845</div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="text-base text-lightGray">TideBit wallet assets</div>
                  <div>3,061,068,937</div>
                </div>
              </div>
            </div>
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
