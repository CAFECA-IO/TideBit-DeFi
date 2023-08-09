import React, {useContext, useState, useEffect} from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {getStateCode, toDisplayCFDOrder} from '../../lib/common';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import {useGlobal} from '../../contexts/global_context';
import {LayoutAssertion} from '../../constants/layout_assertion';

const OpenSubTab = () => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();

  const [isLoading, setIsLoading] = useState(true);
  const [cfds, setCfds] = useState<IDisplayCFDOrder[]>([]);

  // eslint-disable-next-line no-console
  console.log('re run in open sub tab');

  useEffect(() => {
    const cfdList = userCtx.openCFDs
      .map(cfd => {
        const tickerPrice = marketCtx.availableTickers[cfd.instId]?.price;
        const displayCFD: IDisplayCFDOrder = {
          ...toDisplayCFDOrder(cfd),
          stateCode: getStateCode(cfd, tickerPrice),
        };

        return displayCFD;
      })
      .sort((a, b) => {
        return a.createTimestamp - b.createTimestamp;
      })
      .sort((a, b) => {
        return a.stateCode! - b.stateCode!;
      });

    setCfds(cfdList);
  }, [userCtx.openCFDs]);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);
    if (userCtx.isLoadingCFDs) {
      setIsLoading(true);
      return;
    }

    timer = setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, [userCtx.openCFDs, userCtx.isLoadingCFDs]);

  const openPositionList = isLoading ? (
    <Skeleton count={5} height={150} />
  ) : (
    cfds.map(cfd => {
      return (
        <div key={cfd.id}>
          {<OpenPositionItem openCfdDetails={cfd} />}
          <div className="my-auto h-px w-full rounded bg-white/50"></div>
        </div>
      );
    })
  );

  const desktopLayout = (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{openPositionList}</div>
  );

  const mobileLayout = (
    <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-400px">
      <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      {displayedLayout}{' '}
    </SkeletonTheme>
  );
};

export default OpenSubTab;
