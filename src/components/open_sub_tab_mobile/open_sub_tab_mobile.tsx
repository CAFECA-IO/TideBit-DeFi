import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {toDisplayCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';

const OpenSubTabMobile = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const cfds = openCFDs.map(cfd => {
    const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
      begin: cfd.createTimestamp,
    });
    const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph);
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
