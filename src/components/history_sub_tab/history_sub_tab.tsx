import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {toDisplayCFDOrder} from '../../lib/common';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);
  const historyPositionList = userCtx.closedCFDs.map(cfd =>
    cfd ? (
      <div key={cfd.id}>
        <HistoryPositionItem closedCfdDetails={toDisplayCFDOrder(cfd, [])} />
      </div>
    ) : null
  );

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{historyPositionList}</div>
    </>
  );
};

export default HistorySubTab;
