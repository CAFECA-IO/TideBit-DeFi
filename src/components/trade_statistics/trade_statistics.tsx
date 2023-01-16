import React from 'react';

const TradeStatistics = () => {
  return (
    <>
      <div className="mt-5 flex-col justify-start lg:mt-8 lg:pl-5">
        <h1 className="text-start text-xl text-lightWhite">Live Statistics</h1>
        <span className="mb-3 inline-block h-px w-2/3 rounded bg-white/30"></span>
        <p className="text-base text-lightGray">Traders' Sentiment</p>

        {/* Sellers vs. Buyers */}
        <div className="w-2/3">
          <div className="relative mb-4 h-2 w-full rounded-full bg-lightRed">
            <div className="absolute top-0 left-0 h-2 w-2/3 rounded-l bg-lightGreen5"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeStatistics;
