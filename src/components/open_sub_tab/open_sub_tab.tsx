import React, {useContext, Suspense} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {
  IDisplayCFDOrder,
  listDummyDisplayCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  const cfds = openCFDs
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });
      const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph);
      return displayCFD;
    })
    .sort((a, b) => {
      return a.createTimestamp - b.createTimestamp;
    })
    .sort((a, b) => {
      return b.stateCode - a.stateCode;
    });

  // Deprecated: to be removed (20230413 - Shirley)
  // /* ToDo: (20230411 - Julian) dummy data */
  // const dummyCFDs: IDisplayCFDOrder[] = listDummyDisplayCFDOrder('ETH')
  //   .slice(-2)
  //   .sort((a, b) => {
  //     return a.createTimestamp - b.createTimestamp;
  //   })
  //   .sort((a, b) => {
  //     return b.stateCode - a.stateCode;
  //   });

  // Deprecated: [debug] (20230413 - Shirley)
  // eslint-disable-next-line no-console
  console.log('cfd from ctx ', JSON.parse(JSON.stringify(cfds)));

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
          <Suspense
            fallback={
              <div className="inline-flex items-end">
                {/* ToDo: (20230419 - Julian) Loading animation */}
                <Lottie className="w-40px" animationData={smallConnectingAnimation} />
                Loading...
              </div>
            }
          >
            {openPositionList}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default OpenSubTab;
