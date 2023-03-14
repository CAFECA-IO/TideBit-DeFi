import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {twoDecimal} from '../../lib/common';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);

  const toHistoryPositionItem = () => {
    const displayedHistoryPositionList = userCtx.closedCFDs.map(cfd => {
      if (!cfd.closePrice) return;

      const openValue = twoDecimal(cfd.openPrice * cfd.amount);
      const closeValue = twoDecimal(cfd.closePrice * cfd.amount);
      // TODO: (20230314 - Shirley)
      const positionLineGraph = [100, 100];
      const suggestion: ICFDSuggestion = {
        takeProfit: 100,
        stopLoss: 100,
      };

      const value =
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(closeValue - openValue)
          : twoDecimal(openValue - closeValue);

      const pnl: IPnL = {
        type: value > 0 ? ProfitState.PROFIT : value < 0 ? ProfitState.LOSS : ProfitState.EQUAL,
        value: cfd.closePrice ? Math.abs(cfd.closePrice - cfd.openPrice) * cfd.amount : 0,
      };

      return {...cfd, pnl, openValue, closeValue, positionLineGraph, suggestion};
    });

    // console.log('displayedHistoryPositionList', displayedHistoryPositionList);

    return displayedHistoryPositionList;
  };

  const historyPositionList = toHistoryPositionItem().map(cfd =>
    cfd ? (
      <div key={cfd.id}>
        <HistoryPositionItem closedCfdDetails={cfd} />
      </div>
    ) : null
  );

  // console.log('toHistoryPositionItem', toHistoryPositionItem());
  // console.log('userCtx.closedCFDs', userCtx.closedCFDs);

  return <>{historyPositionList}</>;
};

export default HistorySubTab;
