import React, {useContext, useState} from 'react';
import {UserContext} from '../../contexts/user_context';
import ReceiptItem from '../receipt_item/receipt_item';
import {dummyDepositOrder} from '../../interfaces/tidebit_defi_background/deposit_order';
import {dummyWithdrawalOrder} from '../../interfaces/tidebit_defi_background/withdrawal_order';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';

const ReceiptList = () => {
  const userCtx = useContext(UserContext);

  /* ToDo: (20230316 - Julian) get data from userCtx */
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

      available: 11.02,
      detail: {
        state: 'PROCESSING',
      },
    },
    {
      timestamp: 1675299651,
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
      timestamp: 1675239651,
      type: 'CLOSE_CFD',
      targetAsset: 'USDT',
      targetAmount: 0,
      remarks: 'sth',
      fee: 0,
    },
  ];

  const historyList = dummyHistoryList.map(history => {
    return <ReceiptItem histories={history} />;
  });

  return (
    <div className="py-3">
      {/* ToDo: (20230316 - Julian) get month data: 1.common.ts get string 2.reduce */}
      <h1 className="text-lg text-tidebitTheme">March 2023</h1>
      <div className="py-4">{historyList}</div>
    </div>
  );
};

export default ReceiptList;
