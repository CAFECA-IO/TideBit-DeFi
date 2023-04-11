import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {toDisplayAcceptedCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
// import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
// import {twoDecimal} from '../../lib/common';
// import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
// import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
// import {ProfitState} from '../../constants/profit_state';
// import {TypeOfPosition} from '../../constants/type_of_position';
// import {SUGGEST_SL, SUGGEST_TP} from '../../constants/config';

const OpenSubTabMobile = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const cfds = openCFDs
    .filter(cfd => cfd.display)
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });
      const displayCFD: IDisplayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(
        cfd,
        positionLineGraph
      );
      return displayCFD;
    });

  const openPositionList = cfds.map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;
