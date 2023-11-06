import React, {useContext, useState, useEffect} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {useGlobal} from '../../contexts/global_context';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const [isLoading, setIsLoading] = useState(true);

  const cfds = userCtx.closedCFDs.sort((a, b) => (b.closeTimestamp ?? 0) - (a.closeTimestamp ?? 0));

  const historyPositionList = isLoading ? (
    <Skeleton count={10} height={55} />
  ) : (
    cfds.map(cfd => (
      <div key={cfd.id}>{<HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd)} />}</div>
    ))
  );

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

  const desktopLayout = (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{historyPositionList}</div>
  );

  const mobileLayout = (
    <div className="flex w-400px flex-col overflow-x-hidden px-8">
      <div className="h-80vh overflow-y-auto px-4">{historyPositionList}</div>
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        {displayedLayout}{' '}
      </SkeletonTheme>
    </>
  );
};

export default HistorySubTab;
