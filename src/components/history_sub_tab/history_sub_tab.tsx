import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayAcceptedCFDOrder} from '../../lib/common';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);

  /* Deprecated: replaced by `toDisplayAcceptedCFDOrder` (20230407 - tzuhan)
  const toHistoryPositionItems = (cfds: IAcceptedCFDOrder[]) => {
    const displayedHistoryPositionList: (IDisplayAcceptedCFDOrder | undefined)[] = cfds.map(cfd => {
      if (!cfd.orderSnapshot.closePrice) return;

      const openValue = cfd.orderSnapshot.openPrice * cfd.orderSnapshot.amount;
      const closeValue = cfd.orderSnapshot.closePrice * cfd.orderSnapshot.amount;

      const positionLineGraph = [100, 100]; // TODO: (20230316 - Shirley) from `marketCtx`
      const suggestion: ICFDSuggestion = {
        // TODO: (20230316 - Shirley) calculate
        takeProfit: 100,
        stopLoss: 100,
      };

      const value =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? closeValue - openValue
          : openValue - closeValue;

      const pnl: IPnL = {
        type: value > 0 ? ProfitState.PROFIT : value < 0 ? ProfitState.LOSS : ProfitState.EQUAL,
        value: Math.abs(value),
      };

      return {...cfd, pnl, openValue, closeValue, positionLineGraph, suggestion};
    });

    return displayedHistoryPositionList;
  };
  */

  const historyPositionList = userCtx.closedCFDs.map(cfd =>
    cfd ? (
      <div key={cfd.id}>
        <HistoryPositionItem closedCfdDetails={toDisplayAcceptedCFDOrder(cfd, [])} />
      </div>
    ) : null
  );

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{historyPositionList}</div>
    </>
  );
};

export default HistorySubTab;
