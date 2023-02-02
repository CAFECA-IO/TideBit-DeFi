import React, {useContext} from 'react';
import {ISignedClosedCFD, UserContext} from '../../lib/contexts/user_context';
import HistoryPositionItem from '../history_position_item/history_position_item';

const HistorySubTab = () => {
  const {closedCFDs} = useContext(UserContext);
  const closedCFDList = !!closedCFDs ? (
    closedCFDs.map((closedCFD: ISignedClosedCFD) => (
      <div>
        <HistoryPositionItem
          profitOrLoss={closedCFD.profitOrLoss}
          longOrShort={closedCFD.longOrShort}
          openValue={closedCFD.openValue}
          closeValue={closedCFD.closeValue}
          ticker={closedCFD.ticker}
          profitOrLossAmount={closedCFD.profitOrLossAmount}
        />
      </div>
    ))
  ) : (
    <></>
  );
  return <>{closedCFDList}</>;
};

export default HistorySubTab;
