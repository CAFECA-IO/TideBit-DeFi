import React, {useContext, useEffect, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
// import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);

  const openPositionList = openCFDs.map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem
          openCfdDetails={cfd}
          profitOrLoss={cfd.pnl.type}
          longOrShort="long"
          value={cfd.openValue}
          ticker={cfd.ticker}
          passedHour={11}
          profitOrLossAmount={cfd.pnl.value}
          tickerTrendArray={cfd.positionLineGraph.dataArray}
        />
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
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    </>
  );
};

export default OpenSubTab;
