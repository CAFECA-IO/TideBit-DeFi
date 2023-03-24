import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {
  IOrder,
  dummyDepositOrder,
  dummyWithdrawalOrder,
  dummyOpenCFDOrder,
  dummyClosedCFDOrder,
} from '../../interfaces/tidebit_defi_background/order';
import {timestampToString} from '../../lib/common';

const ReceiptSection = () => {
  const userCtx = useContext(UserContext);

  /* ToDo: (20230316 - Julian) get data from userCtx */
  /* Till: (20230331 - Julian) dummy data for test */
  const dummyHistoryList: IOrder[] = [
    dummyDepositOrder,
    dummyWithdrawalOrder,
    dummyOpenCFDOrder,
    dummyClosedCFDOrder,
    {
      timestamp: 1679587700,
      type: OrderType.DEPOSIT,
      targetAsset: 'ETH',
      targetAmount: 80,
      remarks: '',
      balanceSnapshot: {
        currency: 'USDT',
        available: 2308,
        locked: 1,
      },
      orderSnapshot: {
        id: 'TBDDeposit20230320_002',
        txid: '0x',
        status: 'SUCCESS',
        detail: '',
        fee: 0,
      },
    },
    {
      timestamp: 1679587200,
      type: OrderType.WITHDRAW,
      targetAsset: 'ETH',
      targetAmount: -10,
      remarks: '',
      balanceSnapshot: {
        currency: 'USDT',
        available: 1979,
        locked: 1,
      },
      orderSnapshot: {
        id: 'TBDWithdraw20230320_002',
        txid: '0x',
        status: 'SUCCESS',
        detail: '',
        fee: -0.05,
      },
    },
    {
      timestamp: 1673299651,
      type: OrderType.CFD,
      targetAsset: 'ETH',
      targetAmount: -5,
      remarks: '',
      balanceSnapshot: {
        currency: 'USDT',
        available: 1999,
        locked: 1,
      },
      orderSnapshot: {
        id: 'TBDCFD20230320_001',
        txid: '0x',
        status: 'FAILED',
        state: OrderState.OPENING,
        detail: '',
        fee: 0,
      },
    },
    {
      timestamp: 1679999651,
      type: OrderType.CFD,
      targetAsset: 'ETH',
      targetAmount: +30,
      remarks: '',
      balanceSnapshot: {
        currency: 'USDT',
        available: 1998,
        locked: 1,
      },
      orderSnapshot: {
        id: 'TBDCFD20230320_002',
        txid: '0x',
        status: 'SUCCESS',
        state: OrderState.CLOSED,
        detail: '',
        fee: 0,
      },
    },
  ];
  /* Till: (20230331 - Julian) dummy data for test */

  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState<IOrder[]>([]);

  useEffect(() => {
    if (filteredTradingType === '') {
      setFilteredReceipts(dummyHistoryList);
    } else if (filteredTradingType === OrderType.DEPOSIT) {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === OrderType.DEPOSIT));
    } else if (filteredTradingType === OrderType.WITHDRAW) {
      setFilteredReceipts(dummyHistoryList.filter(v => v.type === OrderType.WITHDRAW));
    } else if (filteredTradingType === OrderState.OPENING) {
      setFilteredReceipts(
        dummyHistoryList.filter(v => v.orderSnapshot.state === OrderState.OPENING)
      );
    } else if (filteredTradingType === OrderState.CLOSED) {
      setFilteredReceipts(
        dummyHistoryList.filter(v => v.orderSnapshot.state === OrderState.CLOSED)
      );
    }
  }, [filteredTradingType]);

  const dataMonthList = filteredReceipts
    .sort((a, b) => b.timestamp - a.timestamp) /* Info: (20230322 - Julian) sort by desc */
    .map(history => {
      return timestampToString(history.timestamp).monthAndYear;
    });

  const monthList = dataMonthList.reduce((prev: string[], curr) => {
    if (!prev.includes(curr)) {
      prev.push(curr);
    }

    return prev;
  }, []);

  const listCluster = monthList.map(v => {
    return (
      <div key={v}>
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
