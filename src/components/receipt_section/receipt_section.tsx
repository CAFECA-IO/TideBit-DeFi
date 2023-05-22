import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {timestampToString} from '../../lib/common';
import Skeleton from 'react-loading-skeleton';
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
  const [filteredDate, setFilteredDate] = useState<string[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<IAcceptedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    /* Todo: (20230412 - Julian)
     * filter receipts by filteredDate #289 */
    if (searches !== '') {
      const searchResult = listHistories.filter(v => {
        const orderType = v.receipt.orderSnapshot.orderType;
        const targetAsset =
          orderType === OrderType.CFD
            ? (v.receipt.orderSnapshot as ICFDOrder).margin.asset
            : orderType === OrderType.DEPOSIT
            ? (v.receipt.orderSnapshot as IDepositOrder).targetAsset
            : (v.receipt.orderSnapshot as IWithdrawOrder).targetAsset;
        const targetAmount =
          orderType === OrderType.CFD
            ? (v.receipt.orderSnapshot as ICFDOrder).margin.amount
            : orderType === OrderType.DEPOSIT
            ? (v.receipt.orderSnapshot as IDepositOrder).targetAmount
            : (v.receipt.orderSnapshot as IWithdrawOrder).targetAmount;
        const result =
          orderType.includes(searches || '') ||
          targetAsset.toLocaleLowerCase().includes(searches || '') ||
          targetAmount.toString().includes(searches || '');
        return result;
      });
      setFilteredReceipts(searchResult);
    } else if (filteredTradingType === '' && searches === '') {
      setFilteredReceipts(listHistories);
    } else if (filteredTradingType === OrderType.DEPOSIT) {
      setFilteredReceipts(
        listHistories.filter(v => {
          const orderType = v.receipt.orderSnapshot.orderType;
          return orderType === OrderType.DEPOSIT;
        })
      );
    } else if (filteredTradingType === OrderType.WITHDRAW) {
      setFilteredReceipts(
        listHistories.filter(v => v.receipt.orderSnapshot.orderType === OrderType.WITHDRAW)
      );
    } else if (filteredTradingType === OrderState.OPENING) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.receipt.orderSnapshot.orderType === OrderType.CFD &&
            (v.receipt.orderSnapshot as ICFDOrder).state === OrderState.OPENING
        )
      );
    } else if (filteredTradingType === OrderState.CLOSED) {
      setFilteredReceipts(
        listHistories.filter(
          v =>
            v.receipt.orderSnapshot.orderType === OrderType.CFD &&
            (v.receipt.orderSnapshot as ICFDOrder).state === OrderState.OPENING
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
        {isLoading ? (
          <div className="flex flex-col">
            <Skeleton width={140} height={25} />
            <div className="mt-5 flex justify-between space-x-2 lg:space-x-4">
              <Skeleton width={70} height={70} />
              <div className="flex flex-1 items-center justify-between lg:space-x-20">
                <Skeleton width={120} height={30} borderRadius={50} />
                <Skeleton width={100} height={25} />
                <div className="hidden flex-1 flex-col space-y-2 lg:flex lg:w-52">
                  <Skeleton width={30} height={20} />
                  <Skeleton width={240} height={20} />
                </div>
                <div className="hidden flex-col space-y-2 lg:flex lg:w-20">
                  <Skeleton width={30} height={20} />
                  <Skeleton width={20} height={20} />
                </div>
                <div className="hidden flex-col space-y-2 lg:flex lg:w-24">
                  <Skeleton width={60} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ReceiptList monthData={v} filteredReceipts={filteredReceipts} />
        )}
      </div>
    );
  });

  return (
    <div className="p-4 sm:p-16">
      {isLoading ? (
        <div className="mt-4 flex items-end">
          <div className="flex flex-col">
            <Skeleton width={95} height={25} />
            <Skeleton width={160} height={50} />
          </div>
          <div className="ml-10 flex flex-col">
            <Skeleton width={50} height={25} />
            <Skeleton width={140} height={50} />
          </div>
          <div className="ml-8 flex-1">
            <Skeleton width={140} height={50} />
          </div>
          <div className="">
            <Skeleton width={300} height={50} borderRadius={50} />
          </div>
        </div>
      ) : (
        <ReceiptSearch
          filteredTradingType={filteredTradingType}
          setFilteredTradingType={setFilteredTradingType}
          setSearches={setSearches}
          filteredDate={filteredDate}
          setFilteredDate={setFilteredDate}
        />
      )}
      <div>{listCluster}</div>
    </div>
  );
};

export default ReceiptSection;
