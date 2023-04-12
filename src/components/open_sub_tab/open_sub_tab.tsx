import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

const OpenSubTab = () => {
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
