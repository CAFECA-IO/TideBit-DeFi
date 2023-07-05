import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const HistorySubTabMobile = () => {
  const userCtx = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const historyPositionList =
    isLoading || userCtx.isLoadingCFDs ? (
      <Skeleton count={10} height={55} />
    ) : (
      userCtx.closedCFDs.map(cfd => (
        <div key={cfd.id}>{<HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd)} />}</div>
      ))
    );

  useEffect(() => {
    if (userCtx.isLoadingCFDs) {
      setIsLoading(false);
      return;
    }
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, [historyPositionList]);

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
