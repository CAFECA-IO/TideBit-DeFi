import React from 'react';
import {DUMMY_HISTORY_POSITION_DATA} from '../../constants/config';
import HistoryPositionItem from '../history_position_item/history_position_item';

const historyPositionList = DUMMY_HISTORY_POSITION_DATA.map(items => {
  return (
    <>
      <HistoryPositionItem
        profitOrLoss={items.profitOrLoss}
        longOrShort={items.longOrShort}
        openValue={items.openValue}
        closeValue={items.closeValue}
        ticker={items.ticker}
        profitOrLossAmount={items.profitOrLossAmount}
      />
    </>
  );
});

const HistorySubTabMobile = () => {
  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{historyPositionList}</div>
      </div>
    </>
  );
};

export default HistorySubTabMobile;
