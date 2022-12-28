import React from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';

const OpenSubTab = () => {
  return (
    <>
      <div className="">
        <div className="">
          <OpenPositionItem
            profitOrLoss="profit"
            longOrShort="long"
            value={639}
            ticker="BTC"
            remainingHour={20}
            pNL={34.9}
          />
        </div>
        {/* Divider */}
        <div className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></div>

        <div className="">
          <OpenPositionItem
            profitOrLoss="loss"
            longOrShort="short"
            value={600}
            ticker="ETH"
            remainingHour={15}
            pNL={23.55}
          />
        </div>
        {/* Divider */}
        <div className="absolute top-400px my-auto h-px w-7/8 rounded bg-white/50"></div>
      </div>
    </>
  );
};

export default OpenSubTab;
