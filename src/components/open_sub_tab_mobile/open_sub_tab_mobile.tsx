import React, {useContext, useState, useEffect} from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {getStateCode, toDisplayCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';

const OpenSubTabMobile = () => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const [isLoading, setIsLoading] = useState(true);
  const [cfds, setCfds] = useState<IDisplayCFDOrder[]>([]);

  useEffect(() => {
    const cfdList = userCtx.openCFDs
      .map(cfd => {
        const tickerPrice = marketCtx.availableTickers[cfd.ticker]?.price;
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
        return b.stateCode! - a.stateCode!;
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
  }, [cfds, userCtx.isLoadingCFDs]);

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

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
          <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
        </div>
      </SkeletonTheme>
    </>
  );
};

export default OpenSubTabMobile;
