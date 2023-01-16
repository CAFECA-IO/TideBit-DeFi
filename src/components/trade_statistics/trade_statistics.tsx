import React from 'react';
import {VscTriangleDown} from 'react-icons/vsc';

interface ITradeStatistics {
  bullAndBearIndex: string;
  long: number;
  short: number;
  fiveMin: {low: number; high: number; now: string};
  sixtyMin: {low: number; high: number; now: string};
  oneDay: {low: number; high: number; now: string};
}

const TradeStatistics = ({
  bullAndBearIndex,
  long,
  short,
  fiveMin,
  sixtyMin,
  oneDay,
}: ITradeStatistics) => {
  const overallWidth = 'w-2/3 xl:w-3/4';
  const displayedBBI = `w-${bullAndBearIndex}`;

  const fiveMinNow = `ml-${fiveMin.now}`;
  const sixtyMinNow = `ml-${sixtyMin.now}`;
  const oneDayNow = `ml-${oneDay.now}`;

  // console.log('six。tyNow: ', sixtyMinNow);
  const nowPointer = (
    <div className="">
      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="31" viewBox="0 0 33 31">
        <defs>
          <filter id="Polygon_17" width="33" height="31" x="0" y="0" filterUnits="userSpaceOnUse">
            <feOffset dy="3"></feOffset>
            <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
            <feFlood floodOpacity="0.502"></feFlood>
            <feComposite in2="blur" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
        </defs>
        <g filter="url(#Polygon_17)">
          <path
            fill="#f2f2f2"
            d="M7.5 0L15 13H0z"
            data-name="Polygon 17"
            transform="rotate(180 12 9.5)"
          ></path>
        </g>
      </svg>
    </div>
  );
  // console.log(displayedBBI);

  return (
    <>
      <div className="mt-5 flex-col justify-start lg:mt-8 lg:pl-5">
        <h1 className="text-start text-xl text-lightWhite">Live Statistics</h1>
        <span className={`${overallWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>

        {/* ----------Sellers vs. Buyers---------- */}
        <p className="mb-3 text-base text-lightGray">Traders' Sentiment</p>
        <div className={`${overallWidth}`}>
          {/* Text */}
          <div className="flex w-full justify-between">
            <p className="text-sm text-lightGreen5">{long}% Buyers</p>
            <p className="text-sm text-lightRed">{short}% Sellers</p>
          </div>
          {/* Bar */}
          <div className={`relative mb-4 h-2 w-full rounded-full bg-lightRed`}>
            <div
              className={`absolute top-0 left-0 h-2 ${displayedBBI} rounded-l bg-lightGreen5`}
            ></div>
          </div>
        </div>

        {/* ----------High and Low vs. Now---------- */}
        <p className="mb-3 text-base text-lightGray">High/ Low</p>
        <div className={`${overallWidth}`}>
          {/* Text */}
          <div className="-mb-2 flex w-full justify-between">
            <p className="text-sm text-lightWhite">Low</p>
            <p className="text-sm text-lightWhite">High</p>
          </div>

          {/* [5 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4 ${fiveMinNow}`}>{nowPointer}</div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{fiveMin.low}</p>
              <p className="text-sm text-lightWhite">5 minutes</p>
              <p className="text-sm text-lightWhite">{fiveMin.high}</p>
            </div>
          </div>

          {/* [60 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`${sixtyMinNow} -mb-4`}>{nowPointer}</div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{sixtyMin.low}</p>
              <p className="text-sm text-lightWhite">60 minutes</p>
              <p className="text-sm text-lightWhite">{sixtyMin.high}</p>
            </div>
          </div>

          {/* [1 day] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4 ${oneDayNow}`}>{nowPointer}</div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{oneDay.low}</p>
              <p className="text-sm text-lightWhite">1 day</p>
              <p className="text-sm text-lightWhite">{oneDay.high}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeStatistics;
