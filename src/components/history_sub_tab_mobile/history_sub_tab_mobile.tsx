import React from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';

const HistorySubTabMobile = () => {
  const historyPositionList = (
    <div>
      <HistoryPositionItem
        profitOrLoss="loss"
        longOrShort="long"
        openValue={639.9}
        closeValue={638.3}
        ticker="ETH"
        profitOrLossAmount={34.9}
      />
    </div>
  );

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{historyPositionList}</div>
      </div>
    </>
  );
};

export default HistorySubTabMobile;
