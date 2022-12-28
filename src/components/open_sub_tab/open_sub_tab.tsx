import React from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';

const OpenSubTab = () => {
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
            pNL={34.9}
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
            pNL={29.9}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>

        <div className="">
          <OpenPositionItem
            profitOrLoss="profit"
            longOrShort="short"
            value={1234567.8}
            ticker="ETH"
            passedHour={23}
            pNL={1234.5}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    </>
  );
};

export default OpenSubTab;
