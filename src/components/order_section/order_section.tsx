import React from 'react';
import TradeTab from '../trade_tab/trade_tab';

const OrderSection = () => {
  const tabPart = (
    <>
      <div className="z-10 flex flex-wrap border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="pr-1">
          <button
            type="button"
            className="inline-block rounded-t-2xl bg-darkGray7 px-53px py-2 text-lightWhite hover:cursor-pointer"
          >
            Trade
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className="inline-block rounded-t-2xl bg-darkGray6 px-53px py-2 text-lightGray hover:cursor-pointer"
          >
            Position
          </button>
        </div>
      </div>
    </>
  );

  const isDisplayedTradeTab = (
    <>
      {/* tab section */}
      <div className="fixed top-70px right-0">{tabPart}</div>

      {/* trade or position section */}
      <div
        className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              className={`pointer-events-auto ${'w-300px'} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              <h1 className="pl-5 text-2xl font-bold">Order section</h1>

              {/* <div className="mt-20">
                <NotificationItem />
              </div>
              <div className="mt-5">
                <NotificationItem />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      <div className="pt-700px text-7xl text-blue-100">OrderSection</div>
      {isDisplayedTradeTab}
    </>
  );
};

export default OrderSection;
