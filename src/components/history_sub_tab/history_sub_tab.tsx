import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';

const HistorySubTab = () => {
  const userCtx = useContext(UserContext);
  const historyPositionList = userCtx.closedCFDs.map(cfd => (
    <div key={cfd.id}>
      <HistoryPositionItem closedCfdDetails={cfd} />
    </div>
  ));
  return <>{historyPositionList}</>;
};

export default HistorySubTab;
