import React from 'react';

const dummyTradeTab = (
  <>
    <div className="flex w-5/12 flex-col items-center justify-center rounded-md bg-lightGreen5 py-1">
      <p>UP</p>
      <p className="text-xxs">Above $ 1545.0</p>
    </div>
    <div className="flex w-5/12 flex-col items-center justify-center rounded-md bg-lightRed py-1">
      <p>Down</p>
      <p className="text-xxs">Below $ 1030.0</p>
    </div>
  </>
);

const TradeTabMobile = () => {
  return <div className="flex basis-3/4 justify-between">{dummyTradeTab}</div>;
};

export default TradeTabMobile;
