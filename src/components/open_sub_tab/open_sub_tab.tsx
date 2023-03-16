import React, {useContext, useEffect, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {twoDecimal} from '../../lib/common';
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
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.openPrice * (1 + SUGGEST_TP / cfd.leverage))
          : twoDecimal(cfd.openPrice * (1 - SUGGEST_TP / cfd.leverage));
      const rSl =
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.openPrice * (1 - SUGGEST_SL / cfd.leverage))
          : twoDecimal(cfd.openPrice * (1 + SUGGEST_SL / cfd.leverage));

      // TODO: (20230314 - Shirley) get price point from `marketCtx`
      const positionLineGraph = [
        10050, 9972, 1060, 2065, 3042, 825, 40000, 7100, 4532, 720, 815, 632, 90, 10,
      ];

      // TODO: (20230314 - Shirley) get the very last price point from `marketCtx`
      const marketPrice =
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
          : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999;

      const marketValue = twoDecimal(marketPrice * cfd.amount);

      const openValue = twoDecimal(cfd.openPrice * cfd.amount);

      // TODO: (20230314 - Shirley) Calculate with `positionLineGraph[n-1]` buy/sell price
      const pnlSoFar =
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? marketValue - openValue
          : openValue - marketValue;

      const suggestion: ICFDSuggestion = {
        takeProfit: rTp,
        stopLoss: rSl,
      };

      const pnl: IPnL = {
        type: pnlSoFar < 0 ? ProfitState.LOSS : ProfitState.PROFIT,
        value: Math.abs(pnlSoFar),
      };

      return {...cfd, openValue, positionLineGraph, suggestion, pnl};
    });

    return displayedOpenPositionList;
  };

  const openPositionList = toOpenPositionItems(openCFDs).map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="">
        <div className="">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTab;
