import React from 'react';

const CryptoSummary = () => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  const cryptoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43">
      <g data-name="Group 2330">
        <circle cx="21.5" cy="21.5" r="21.5" fill="#627eea" data-name="Ellipse 12"></circle>
        <g data-name="Group 2325" transform="translate(12.198 5.422)">
          <path
            fill="rgba(255,255,255,0.6)"
            d="M226.9 67.826v12.021l10.161 4.541z"
            data-name="Path 25757"
            transform="translate(-216.741 -67.826)"
          ></path>
          <path
            fill="#fff"
            d="M219.81 67.826l-10.162 16.562 10.162-4.541z"
            data-name="Path 25758"
            transform="translate(-209.648 -67.826)"
          ></path>
          <path
            fill="rgba(255,255,255,0.6)"
            d="M226.9 105.059v8.169l10.171-14.068z"
            data-name="Path 25759"
            transform="translate(-216.741 -80.706)"
          ></path>
          <path
            fill="#fff"
            d="M219.81 113.227v-8.17l-10.162-5.9z"
            data-name="Path 25760"
            transform="translate(-209.648 -80.706)"
          ></path>
          <path
            fill="rgba(255,255,255,0.2)"
            d="M226.9 98.68l10.161-5.9-10.161-4.537z"
            data-name="Path 25761"
            transform="translate(-216.741 -76.219)"
          ></path>
          <path
            fill="rgba(255,255,255,0.6)"
            d="M209.648 92.781l10.162 5.9V88.243z"
            data-name="Path 25762"
            transform="translate(-209.648 -76.219)"
          ></path>
        </g>
      </g>
    </svg>
  );

  return (
    <>
      <div className="flex-col justify-start">
        {' '}
        <h1 className="text-start text-xl text-lightWhite">About</h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        <div className={`${overallWidth}`}>
          <section className="">
            <div className="container mx-auto flex flex-wrap items-center pb-5">
              {/* Left side */}
              <div className="mb-0 border-b border-gray-800 pb-10 md:mb-0 md:w-1/2 md:border-r md:border-b-0 md:py-0 md:pr-12">
                {/* Icon and name */}
                <div className="flex items-center space-x-3 text-center">
                  <div className="">{cryptoIcon}</div>
                  <h1 className="text-lg font-medium text-white">Ethereum</h1>
                </div>

                <p className="pt-2 text-sm leading-relaxed text-lightGray5">
                  Ethereum (ETH) was launched in 2015. Ethereum is a decentralized blockchain that
                  supports smart contracts-essentially computer programs-that can automatically
                  execute when certain conditions are met. The native cryptocurrency-essentially
                  computer programs-of the platform is called ether or ethereum. Ethereum is
                  divisible to 18 decimal places. There is currently no hard cap on the total supply
                  of ETH.
                </p>

                {/* <a className="mt-4 inline-flex items-center text-blue-400">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a> */}
              </div>

              {/* Right side */}
              {/* <div className="flex flex-col md:w-1/2 md:pl-12">
                <h2 className="title-font mb-3 text-sm font-semibold tracking-wider text-white">
                  CATEGORIES
                </h2>
                <nav className="-mb-1 flex list-none flex-wrap">
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">First Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Second Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Third Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Fourth Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Fifth Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Sixth Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Seventh Link</a>
                  </li>
                  <li className="mb-1 w-1/2 lg:w-1/3">
                    <a className="hover:text-white">Eighth Link</a>
                  </li>
                </nav>
              </div> */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CryptoSummary;
