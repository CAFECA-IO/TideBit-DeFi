import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const HistorySubTabMobile = () => {
  const userCtx = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const cfds = userCtx.closedCFDs.sort((a, b) => b.closeTimestamp! - a.closeTimestamp!);

  const historyPositionList = isLoading ? (
    <Skeleton count={10} height={55} />
  ) : (
    cfds.map(cfd => (
      <div key={cfd.id}>{<HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd)} />}</div>
    ))
  );

  useEffect(() => {
    if (userCtx.isLoadingCFDs) {
      setIsLoading(true);
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, [cfds, userCtx.isLoadingCFDs]);

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
          <div className="h-80vh overflow-y-auto px-4">{historyPositionList}</div>
        </div>
      </SkeletonTheme>
    </>
  );
};

export default HistorySubTabMobile;
