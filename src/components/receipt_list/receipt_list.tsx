import React from 'react';
import ReceiptItem from '../receipt_item/receipt_item';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {timestampToString} from '../../lib/common';
interface IReceiptListProps {
  monthData: string;
  filteredReceipts: IAcceptedOrder[];
}

const ReceiptList = ({monthData, filteredReceipts}: IReceiptListProps) => {
  const historyList = filteredReceipts.map(history => {
    const monthAndYear = timestampToString(history.createTimestamp).monthAndYear;

    if (monthAndYear == monthData) {
      return (
        <div key={history.receipt.orderSnapshot.id}>
          <ReceiptItem histories={history} />
        </div>
      );
    }
  });

  return (
    <div className="py-3">
      <h1 className="text-lg text-tidebitTheme">{monthData}</h1>
      <div className="py-4">{historyList}</div>
    </div>
  );
};

export default ReceiptList;
