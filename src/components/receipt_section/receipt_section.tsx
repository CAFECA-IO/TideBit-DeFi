import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {timestampToString} from '../../lib/common';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../../interfaces/tidebit_defi_background/order';

const ReceiptSection = () => {
  const userCtx = useContext(UserContext);

  const listHistories = userCtx.histories;

  const [searches, setSearches] = useState('');
  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredDate, setFilteredDate] = useState<number[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<IAcceptedOrder[]>([]);

  useEffect(() => {
    if (searches !== '') {
      const searchResult = listHistories.filter(v => {
        const orderType = v.receipt.order.orderType;
        const targetAsset =
          orderType === OrderType.CFD
            ? (v.receipt.order as ICFDOrder).margin.asset
            : orderType === OrderType.DEPOSIT
            ? (v.receipt.order as IDepositOrder).targetAsset
            : (v.receipt.order as IWithdrawOrder).targetAsset;
        const targetAmount =
          orderType === OrderType.CFD
            ? (v.receipt.order as ICFDOrder).margin.amount
            : orderType === OrderType.DEPOSIT
            ? (v.receipt.order as IDepositOrder).targetAmount
            : (v.receipt.order as IWithdrawOrder).targetAmount;
        const result =
          orderType.toLocaleLowerCase().includes(searches) ||
          targetAsset.toLocaleLowerCase().includes(searches) ||
          targetAmount.toString().includes(searches);
        return result;
      });
      setFilteredReceipts(searchResult);
    } else if (filteredDate[0] && filteredDate[1]) {
      setFilteredReceipts(
        listHistories.filter(v => {
          const createTimestamp = v.createTimestamp * 1000;
          return createTimestamp >= filteredDate[0] && createTimestamp <= filteredDate[1];
        })
      );
    } else if (filteredTradingType === '' && searches === '') {
      setFilteredReceipts(listHistories);
    } else if (filteredTradingType === OrderType.DEPOSIT) {
      setFilteredReceipts(
        listHistories.filter(v => {
          const orderType = v.receipt.order.orderType;
          return orderType === OrderType.DEPOSIT;
        })
      );
    } else if (filteredTradingType === OrderType.WITHDRAW) {
      setFilteredReceipts(
        listHistories.filter(v => v.receipt.order.orderType === OrderType.WITHDRAW)
      );
    } else if (filteredTradingType === OrderState.OPENING) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.receipt.order.orderType === OrderType.CFD &&
            (v.receipt.order as ICFDOrder).state === OrderState.OPENING
        )
      );
    } else if (filteredTradingType === OrderState.CLOSED) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.receipt.order.orderType === OrderType.CFD &&
            (v.receipt.order as ICFDOrder).state === OrderState.CLOSED
        )
      );
    }
  }, [filteredTradingType, filteredDate, searches]);

  const dataMonthList = filteredReceipts
    /* Info: (20230322 - Julian) sort by desc */
    .sort((a, b) => b.createTimestamp - a.createTimestamp)
    .map(history => {
      return timestampToString(history.createTimestamp).monthAndYear;
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
        setSearches={setSearches}
        filteredDate={filteredDate}
        setFilteredDate={setFilteredDate}
      />
      <div>{listCluster}</div>
      {filteredDate[0]} ~ {filteredDate[1]}
    </div>
  );
};

export default ReceiptSection;
