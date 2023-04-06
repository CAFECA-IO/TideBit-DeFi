import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {timestampToString} from '../../lib/common';
import {ICFDOrderSnapshot} from '../../interfaces/tidebit_defi_background/order_snapshot';

const ReceiptSection = () => {
  const userCtx = useContext(UserContext);

  const listHistories = userCtx.histories;

  const [searches, setSearches] = useState('');
  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState<IAcceptedOrder[]>([]);

  useEffect(() => {
    if (searches !== '') {
      const searchResult = listHistories.filter(v => {
        const result =
          v.orderType.includes(searches || '') ||
          v.targetAsset.toLocaleLowerCase().includes(searches || '') ||
          v.targetAmount.toString().includes(searches || '');
        return result;
      });
      setFilteredReceipts(searchResult);
    } else if (filteredTradingType === '' && searches === '') {
      setFilteredReceipts(listHistories);
    } else if (filteredTradingType === OrderType.DEPOSIT) {
      setFilteredReceipts(listHistories.filter(v => v.orderType === OrderType.DEPOSIT));
    } else if (filteredTradingType === OrderType.WITHDRAW) {
      setFilteredReceipts(listHistories.filter(v => v.orderType === OrderType.WITHDRAW));
    } else if (filteredTradingType === OrderState.OPENING) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.orderType === OrderType.CFD &&
            (v.orderSnapshot as ICFDOrderSnapshot).state === OrderState.OPENING
        )
      );
    } else if (filteredTradingType === OrderState.CLOSED) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.orderType === OrderType.CFD &&
            (v.orderSnapshot as ICFDOrderSnapshot).state === OrderState.CLOSED
        )
      );
    }
  }, [filteredTradingType, searches]);

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
      />
      <div>{listCluster}</div>
    </div>
  );
};

export default ReceiptSection;
