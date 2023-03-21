import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {dummyDepositOrder} from '../../interfaces/tidebit_defi_background/deposit_order';
import {dummyWithdrawalOrder} from '../../interfaces/tidebit_defi_background/withdrawal_order';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import {timestampToString} from '../../lib/common';

const ReceiptSection = () => {
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

  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState<IOrder[]>([]);

  useEffect(() => {
    if (filteredTradingType === '') {
      setFilteredReceipts(dummyHistoryList);
    } else if (filteredTradingType === 'DEPOSIT') {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === 'DEPOSIT'));
    } else if (filteredTradingType === 'WITHDRAW') {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === 'WITHDRAW'));
    } else if (filteredTradingType === 'OPEN_CFD') {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === 'OPEN_CFD'));
    } else if (filteredTradingType === 'CLOSE_CFD') {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === 'CLOSE_CFD'));
    }
  }, [filteredTradingType]);

  const dataMonthList = filteredReceipts.map(history => {
    return timestampToString(history.timestamp).monthAndYear;
  });

  const monthList = dataMonthList.sort().reduce((prev: string[], curr) => {
    if (!prev.includes(curr)) {
      prev.push(curr);
    }

    return prev;
  }, []);

  const listCluster = monthList.map(v => {
    return (
      <div>
        <ReceiptList monthData={v} filteredReceipts={filteredReceipts} />
      </div>
    );
  });

  return (
    <div className="p-4 sm:p-16">
      <ReceiptSearch
        filteredTradingType={filteredTradingType}
        setFilteredTradingType={setFilteredTradingType}
      />
      <div>{listCluster}</div>
    </div>
  );
};

export default ReceiptSection;
