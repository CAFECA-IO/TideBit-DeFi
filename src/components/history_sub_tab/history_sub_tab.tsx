import React from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';

const HistorySubTab = () => {
  return (
    <>
      <div>
        <HistoryPositionItem
          profitOrLoss="loss"
          longOrShort="long"
          openValue={639.9}
          closeValue={638.3}
          ticker="ETH"
          pNL={34.9}
        />
      </div>
      <div>
        <HistoryPositionItem
          profitOrLoss="profit"
          longOrShort="long"
          openValue={639.9}
          closeValue={700.3}
          ticker="BTC"
          pNL={123456.9}
        />
      </div>
      <div>
        <HistoryPositionItem
          profitOrLoss="profit"
          longOrShort="short"
          openValue={639.9}
          closeValue={500}
          ticker="ETH"
          pNL={9452.3}
        />
      </div>
    </>
  );
};

export default HistorySubTab;
