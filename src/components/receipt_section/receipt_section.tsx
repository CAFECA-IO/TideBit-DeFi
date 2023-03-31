import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import {timestampToString} from '../../lib/common';

const ReceiptSection = () => {
  const userCtx = useContext(UserContext);

  const listHistories = userCtx.histories;

  const [searches, setSearches] = useState('');
  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState<IOrder[]>([]);

  useEffect(() => {
    if (searches !== '') {
      const searchResult = listHistories.filter(v => {
        const result =
          v.type.includes(searches || '') ||
          v.targetAsset.toLocaleLowerCase().includes(searches || '') ||
          v.targetAmount.toString().includes(searches || '');
        return result;
      });
      setFilteredReceipts(searchResult);
    } else if (filteredTradingType === '' && searches === '') {
      setFilteredReceipts(listHistories);
    } else if (filteredTradingType === OrderType.DEPOSIT) {
      setFilteredReceipts(listHistories.filter(v => v.type === OrderType.DEPOSIT));
    } else if (filteredTradingType === OrderType.WITHDRAW) {
      setFilteredReceipts(listHistories.filter(v => v.type === OrderType.WITHDRAW));
    } else if (filteredTradingType === OrderState.OPENING) {
      setFilteredReceipts(listHistories.filter(v => v.orderSnapshot.state === OrderState.OPENING));
    } else if (filteredTradingType === OrderState.CLOSED) {
      setFilteredReceipts(listHistories.filter(v => v.orderSnapshot.state === OrderState.CLOSED));
    }
  }, [filteredTradingType, searches]);

  const dataMonthList = filteredReceipts
    /* Info: (20230322 - Julian) sort by desc */
    .sort((a, b) => b.timestamp - a.timestamp)
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
        setSearches={setSearches}
      />
      <div>{listCluster}</div>
    </div>
  );
};

export default ReceiptSection;
