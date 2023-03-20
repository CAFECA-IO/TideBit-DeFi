import React from 'react';
import {dummyDepositOrder} from '../../interfaces/tidebit_defi_background/deposit_order';
import {dummyWithdrawalOrder} from '../../interfaces/tidebit_defi_background/withdrawal_order';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import ReceiptItem from '../receipt_item/receipt_item';
import {timestampToString} from '../../lib/common';
interface IReceiptListProps {
  monthData: string;
  //historyListData: IOrder[];
}

const ReceiptList = ({monthData}: IReceiptListProps) => {
  const dummyHistoryList: IOrder[] = [
    dummyDepositOrder,
    dummyWithdrawalOrder,
    dummyOpenCFDOrder,
    {
      timestamp: 1675299651,
      type: 'WITHDRAW',
      targetAsset: 'USDT',
      targetAmount: -10,
      remarks: 'sth',
      fee: 0,

      detail: {
        state: 'PROCESSING',
      },
    },
    {
      timestamp: 1652775575,
      type: 'OPEN_CFD',
      targetAsset: 'USDT',
      targetAmount: -60,
      remarks: 'sth',
      fee: 0,

      available: 21.02,
      detail: {
        txId: '0x1234567890abcdef',
        state: 'DONE',
      },
    },
    {
      timestamp: 1675299751,
      type: 'CLOSE_CFD',
      targetAsset: 'USDT',
      targetAmount: 60,
      remarks: 'sth',
      fee: 0,

      available: 23.02,
      detail: {
        state: 'FAILED',
      },
    },
    {
      timestamp: 1674200996,
      type: 'CLOSE_CFD',
      targetAsset: 'USDT',
      targetAmount: 0,
      remarks: 'sth',
      fee: 0,

      available: 23.02,
      detail: {
        txId: '0x1234567890abcdee',
        state: 'DONE',
      },
    },
  ];

  const historyList = dummyHistoryList.map(history => {
    const monthAndYear = timestampToString(history.timestamp).monthAndYear;

    if (monthAndYear == monthData) {
      return (
        <div>
          {/* ToDo: (20230320 - Julian) add key */}
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
