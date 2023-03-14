import React, {useContext, useEffect, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {twoDecimal} from '../../lib/common';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ProfitState} from '../../constants/profit_state';
// import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);

  const toOpenPositionItem = (cfd: IAcceptedCFDOrder[]): IDisplayAcceptedCFDOrder[] => {
    const displayedOpenPositionList = cfd.map(cfd => {
      const openValue = twoDecimal(cfd.openPrice * cfd.amount);
      const positionLineGraph = [100, 100];
      const suggestion: ICFDSuggestion = {
        takeProfit: 100,
        stopLoss: 100,
      };

      // TODO: (20230314 - Shirley) Caculate with `positionLineGraph[n-1]` buy/sell price
      // const pnl
      const pnl: IPnL = {
        type: ProfitState.LOSS,
        value: 200,
      };

      return {...cfd, openValue, positionLineGraph, suggestion, pnl};
    });

    return displayedOpenPositionList;
  };

  const openPositionList = openCFDs.map(cfd => {
    return (
      <div key={cfd.id}>
        {/* <OpenPositionItem openCfdDetails={cfd} /> */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="">
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
