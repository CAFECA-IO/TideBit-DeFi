import React, {useContext, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';

const OpenSubTab = () => {
  const {openCFDBriefs} = useContext(UserContext);
  const openPositionList = openCFDBriefs.map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem
          openCfdDetails={cfd}
          profitOrLoss="loss"
          longOrShort="long"
          value={656.9}
          ticker="BTC"
          passedHour={11}
          profitOrLossAmount={34.9}
          tickerTrendArray={[1230, 1272, 1120, 1265, 1342, 1299]}
          horizontalValueLine={1230}
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
