import React from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';

const OpenSubTab = () => {
  // const clickCircularPauseHandler = () => {
  //   console.log('clickCircularPauseHandler');
  // };

  return (
    <>
      <div className="">
        <div className="">
          <OpenPositionItem
            profitOrLoss="loss"
            longOrShort="long"
            value={656.9}
            ticker="BTC"
            passedHour={11}
            profitOrLossAmount={34.9}
            tickerTrendArray={[1230, 1272, 1120, 1265, 1342, 1299]}
            horizontalValueLine={1324.4}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>

        <div className="">
          <OpenPositionItem
            profitOrLoss="profit"
            longOrShort="short"
            value={631.1}
            ticker="ETH"
            passedHour={15}
            profitOrLossAmount={29.9}
            tickerTrendArray={[1530, 1372, 1220, 1265, 1342, 1299]}
            horizontalValueLine={1300.6}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>

        <div className="">
          <OpenPositionItem
            profitOrLoss="profit"
            longOrShort="short"
            value={1234567.8}
            ticker="BTC"
            passedHour={23}
            profitOrLossAmount={1234.5}
            tickerTrendArray={[90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10]}
            horizontalValueLine={100}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    </>
  );
};

export default OpenSubTab;
