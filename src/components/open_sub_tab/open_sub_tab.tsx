import React, {useContext} from 'react';
import {ISignedOpendCFD, UserContext} from '../../lib/contexts/user_context';
import OpenPositionItem from '../open_position_item/open_position_item';

const OpenSubTab = () => {
  // const clickCircularPauseHandler = () => {
  //   console.log('clickCircularPauseHandler');
  // };
  const {openedCFDs} = useContext(UserContext);
  const openedCFDList = !!openedCFDs ? (
    openedCFDs.map((openedCFD: ISignedOpendCFD) => (
      <>
        <div className="">
          <OpenPositionItem
            profitOrLoss={openedCFD.profitOrLoss}
            longOrShort={openedCFD.longOrShort}
            value={openedCFD.value}
            ticker={openedCFD.ticker}
            passedHour={openedCFD.passedHour}
            profitOrLossAmount={openedCFD.profitOrLossAmount}
            tickerTrendArray={openedCFD.tickerTrendArray}
            horizontalValueLine={openedCFD.horizontalValueLine}
          />
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </>
    ))
  ) : (
    <></>
  );

  return (
    <>
      <div className="">{openedCFDList}</div>
    </>
  );
};

export default OpenSubTab;
