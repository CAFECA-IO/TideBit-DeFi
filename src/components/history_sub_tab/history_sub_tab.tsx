import React, {useContext} from 'react';
import HistoryPositionItem from '../history_position_item/history_position_item';
import {UserContext} from '../../contexts/user_context';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {twoDecimal} from '../../lib/common';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

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
