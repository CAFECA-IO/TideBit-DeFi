import React, {useContext, useEffect, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {getTimestamp, twoDecimal} from '../../lib/common';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {MarketContext} from '../../contexts/market_context';
import {SUGGEST_SL, SUGGEST_TP} from '../../constants/config';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  const toOpenPositionItems = (cfds: IAcceptedCFDOrder[]): IDisplayAcceptedCFDOrder[] => {
    const displayedOpenPositionList = cfds.map(cfd => {
      const rTp =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.orderSnapshot.openPrice * (1 + SUGGEST_TP / cfd.orderSnapshot.leverage))
          : twoDecimal(cfd.orderSnapshot.openPrice * (1 - SUGGEST_TP / cfd.orderSnapshot.leverage));
      const rSl =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.orderSnapshot.openPrice * (1 - SUGGEST_SL / cfd.orderSnapshot.leverage))
          : twoDecimal(cfd.orderSnapshot.openPrice * (1 + SUGGEST_SL / cfd.orderSnapshot.leverage));

      // TODO: (20230314 - Shirley) get price point from `marketCtx`
      const positionLineGraph = [
        10050, 9972, 1060, 2065, 3042, 825, 20000, 7100, 4532, 720, 815, 632, 90, 10,
      ];

      // TODO: (20230314 - Shirley) get the very last price point from `marketCtx`
      const marketPrice =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
          : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999;

      const marketValue = marketPrice * cfd.orderSnapshot.amount;

      const openValue = cfd.orderSnapshot.openPrice * cfd.orderSnapshot.amount;

      // TODO: (20230314 - Shirley) Calculate with `positionLineGraph[n-1]` buy/sell price
      const pnlSoFar =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(marketValue - openValue)
          : twoDecimal(openValue - marketValue);

      const suggestion: ICFDSuggestion = {
        takeProfit: rTp,
        stopLoss: rSl,
      };

      const pnl: IPnL = {
        type: pnlSoFar < 0 ? ProfitState.LOSS : ProfitState.PROFIT,
        value: Math.abs(pnlSoFar),
      };

      return {
        ...cfd,
        openValue,
        positionLineGraph,
        suggestion,
        pnl,
      };
    });

    return displayedOpenPositionList;
  };

  const cfds = toOpenPositionItems(openCFDs);

  const openPositionList = cfds.map(cfd => {
    return (
      <div key={cfd.orderSnapshot.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">
        <div className="">
          {/* 6 */}
          {openPositionList}
        </div>
        {/* Divider */}
        {/* <div className="my-auto h-px w-full rounded bg-white/50"></div> */}
      </div>
    </>
  );
};

export default OpenSubTab;
