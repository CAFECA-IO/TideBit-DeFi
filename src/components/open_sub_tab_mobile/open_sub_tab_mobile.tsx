import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../lib/contexts/user_context';
import {dummyOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';

const OpenSubTabMobile = () => {
  const userCtx = useContext(UserContext);

  const openPositionList = (
    <div>
      <OpenPositionItem
        openCfdDetails={dummyOpenCFDDetails}
        profitOrLoss="loss"
        longOrShort="long"
        value={656.9}
        ticker="BTC"
        passedHour={11}
        profitOrLossAmount={34.9}
        tickerTrendArray={[1230, 1272, 1120, 1265, 1342, 1299]}
        horizontalValueLine={1230}
      />

      <span className="my-auto block h-px w-full rounded bg-white/50"></span>
    </div>
  );

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;
