import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const historyPositionList = userCtx.closedCFDs.map(cfd =>
    cfd ? (
      <div key={cfd.id}>
        {isLoading ? (
          <Skeleton count={1} height={40} />
        ) : (
          <HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd, [])} />
        )}
      </div>
    ) : null
  );

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
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
