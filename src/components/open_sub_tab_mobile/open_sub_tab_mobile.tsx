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

  // const toOpenPositionItems = (cfds: IAcceptedCFDOrder[]): IDisplayAcceptedCFDOrder[] => {
  //   const displayedOpenPositionList = cfds.map(cfd => {
  //     const rTp =
  //       cfd.typeOfPosition === TypeOfPosition.BUY
  //         ? twoDecimal(cfd.openPrice * (1 + SUGGEST_TP / cfd.leverage))
  //         : twoDecimal(cfd.openPrice * (1 - SUGGEST_TP / cfd.leverage));
  //     const rSl =
  //       cfd.typeOfPosition === TypeOfPosition.BUY
  //         ? twoDecimal(cfd.openPrice * (1 - SUGGEST_SL / cfd.leverage))
  //         : twoDecimal(cfd.openPrice * (1 + SUGGEST_SL / cfd.leverage));

  //     // ToD0: (20230330 - Julian) get price point from `marketCtx`
  //     const positionLineGraph = [
  //       10050, 9972, 1060, 2065, 3042, 825, 20000, 7100, 4532, 720, 815, 632, 90, 10,
  //     ];

  //     // ToDo: (20230330 - Julian) get the very last price point from `marketCtx`
  //     const marketPrice =
  //       cfd.typeOfPosition === TypeOfPosition.BUY
  //         ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
  //         : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999;

  //     const marketValue = marketPrice * cfd.amount;

  //     const openValue = cfd.openPrice * cfd.amount;

  //     // ToDo: (20230330 - Julian) Calculate with `positionLineGraph[n-1]` buy/sell price
  //     const pnlSoFar =
  //       cfd.typeOfPosition === TypeOfPosition.BUY
  //         ? twoDecimal(marketValue - openValue)
  //         : twoDecimal(openValue - marketValue);

  //     const suggestion: ICFDSuggestion = {
  //       takeProfit: rTp,
  //       stopLoss: rSl,
  //     };

  //     const pnl: IPnL = {
  //       type: pnlSoFar < 0 ? ProfitState.LOSS : ProfitState.PROFIT,
  //       value: Math.abs(pnlSoFar),
  //     };

  //     return {
  //       ...cfd,
  //       openValue,
  //       positionLineGraph,
  //       suggestion,
  //       pnl,
  //     };
  //   });

  //   return displayedOpenPositionList;
  // };

  // const cfds = toOpenPositionItems(openCFDs);

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
