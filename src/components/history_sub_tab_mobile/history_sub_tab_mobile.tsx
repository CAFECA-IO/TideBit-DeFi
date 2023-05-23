import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const HistorySubTabMobile = () => {
  const userCtx = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const historyPositionList = userCtx.closedCFDs.map(cfd => (
    <div key={cfd.id}>
      {isLoading ? (
        <Skeleton count={1} height={55} />
      ) : (
        <HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd, [])} />
      )}
    </div>
  ));

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
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
