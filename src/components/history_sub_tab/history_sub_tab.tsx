import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const cfds = userCtx.closedCFDs.sort((a, b) => b.closeTimestamp! - a.closeTimestamp!);

  const historyPositionList = cfds.map(cfd =>
    cfd ? (
      <div key={cfd.id}>
        {isLoading ? (
          <Skeleton count={1} height={55} />
        ) : (
          <HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd, [])} />
        )}
      </div>
    ) : null
  );

  useEffect(() => {
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, [historyPositionList]);

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{historyPositionList}</div>
      </SkeletonTheme>
    </>
  );
};

export default HistorySubTab;
