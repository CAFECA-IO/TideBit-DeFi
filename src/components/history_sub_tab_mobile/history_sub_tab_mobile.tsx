import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';

const HistorySubTabMobile = () => {
  const userCtx = useContext(UserContext);
  const historyPositionList = userCtx.closedCFDs.map(cfd => (
    <div key={cfd.id}>
      <HistoryPositionItem
        profitOrLoss={cfd.pnl.type}
        longOrShort="long"
        openValue={cfd.openValue}
        closeValue={cfd.closedValue}
        ticker={cfd.ticker}
        profitOrLossAmount={cfd.pnl.value}
      />
    </div>
  ));

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{historyPositionList}</div>
      </div>
    </>
  );
};

export default HistorySubTabMobile;
