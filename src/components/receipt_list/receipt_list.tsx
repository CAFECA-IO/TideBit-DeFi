import React from 'react';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import ReceiptItem from '../receipt_item/receipt_item';
import {timestampToString} from '../../lib/common';
interface IReceiptListProps {
  monthData: string;
  filteredReceipts: IOrder[];
}

const ReceiptList = ({monthData, filteredReceipts}: IReceiptListProps) => {
  const historyList = filteredReceipts.map(history => {
    const monthAndYear = timestampToString(history.timestamp).monthAndYear;

    if (monthAndYear == monthData) {
      return (
        <div key={history.orderSnapshot.id}>
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
