import React from 'react';
import {DUMMY_OPEN_POSITION_DATA} from '../../constants/config';
import OpenPositionItem from '../open_position_item/open_position_item';

const openPositionList = DUMMY_OPEN_POSITION_DATA.map(items => {
  return (
    <div key={items.id}>
      <OpenPositionItem
        profitOrLoss={items.profitOrLoss}
        longOrShort={items.longOrShort}
        value={items.value}
        ticker={items.ticker}
        passedHour={items.passedHour}
        profitOrLossAmount={items.profitOrLossAmount}
        tickerTrendArray={items.tickerTrendArray}
        horizontalValueLine={items.horizontalValueLine}
      />

      <span className="my-auto block h-px w-full rounded bg-white/50"></span>
    </div>
  );
});

const OpenSubTabMobile = () => {
  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;
