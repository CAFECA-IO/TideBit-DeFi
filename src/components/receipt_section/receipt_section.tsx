import React, {useState, useContext, useEffect} from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {timestampToString} from '../../lib/common';
import {FiChevronDown} from 'react-icons/fi';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import Skeleton from 'react-loading-skeleton';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../../interfaces/tidebit_defi_background/order';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';

const ReceiptSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const userCtx = useContext(UserContext);

  const listHistories: IAcceptedOrder[] = userCtx.histories.map(v => {
    return {
      ...v,
      isClosed: false,
    };
  });

  /* Info: (20230605 - Julian) 用於 isClosed 的判斷 */
  const [receipts, setReceipts] = useState<IAcceptedOrder[]>(listHistories);

  const [searches, setSearches] = useState('');
  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [filteredDate, setFilteredDate] = useState<string[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<IAcceptedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sliceReceipts, setSliceReceipts] = useState<IAcceptedOrder[]>([]);

  // Info: (20230829 - Julian) receipts 顯示行數
  const [showRow, setShowRow] = useState(10);
  // Info: (20230829 - Julian) 是否顯示 See more 按鈕
  const [isShowMore, setIsShowMore] = useState(true);

  // Info: (20230829 - Julian) 每次增加 10 行
  const seeMoreHandler = () => setShowRow(showRow + 10);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    /* Info: (20230605 - Julian)
     * 1. 先將已關閉的 CFD 訂單列出來
     * 2. 再去找出 txhash 一樣的訂單，並將 isClosed 設為 true */
    const closedReceipts = listHistories.filter(v => {
      return (
        v.receipt.orderSnapshot.orderType === OrderType.CFD &&
        (v.receipt.orderSnapshot as ICFDOrder).state === OrderState.CLOSED
      );
    });

    const result = listHistories.map(v => {
      const isClosed = closedReceipts.some(closed => {
        return closed.receipt.orderSnapshot.id === v.receipt.orderSnapshot.id;
      });
      const d = {
        ...v,
        isClosed,
      };
      return d;
    });

    setReceipts(result);
  }, [userCtx.histories]);

  useEffect(() => {
    // Info: (20230829 - Julian) 每次搜尋都重置 showRow
    setShowRow(10);

    const searchResult = receipts
      .filter(v => {
        /* Info: (20230605 - Julian) Search by trading type
         * if filteredTradingType is empty, return all */
        if (filteredTradingType !== '') {
          switch (filteredTradingType) {
            case OrderType.DEPOSIT:
              return v.receipt.orderSnapshot.orderType === OrderType.DEPOSIT;
            case OrderType.WITHDRAW:
              return v.receipt.orderSnapshot.orderType === OrderType.WITHDRAW;
            case OrderState.OPENING:
              return (
                v.receipt.orderSnapshot.orderType === OrderType.CFD &&
                (v.receipt.orderSnapshot as ICFDOrder).state === OrderState.OPENING
              );
            case OrderState.CLOSED:
              return (
                v.receipt.orderSnapshot.orderType === OrderType.CFD &&
                (v.receipt.orderSnapshot as ICFDOrder).state === OrderState.CLOSED
              );
            default:
              return true;
          }
        } else {
          return true;
        }
      })
      .filter(v => {
        /* Info: (20230605 - Julian) search by keyword
         * include orderType, targetAsset, targetAmount, if searches is empty, return all */
        if (searches.length > 0) {
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
            orderType.toLocaleLowerCase().includes(searches) ||
            targetAsset.toLocaleLowerCase().includes(searches) ||
            targetAmount.toString().includes(searches);
          return result;
        } else {
          return true;
        }
      })
      .filter(v => {
        if (filteredDate.length > 0) {
          /* Info: (20230602 - Julian) search by date
           * from filteredDate[0] 00:00:00 to filteredDate[1] 23:59:59, if filteredDate is empty, return all */
          const startTime = new Date(filteredDate[0]).getTime() / 1000;
          const endTime = new Date(filteredDate[1]).getTime() / 1000 + 86399;

          return v.createTimestamp >= startTime && v.createTimestamp <= endTime;
        } else {
          return true;
        }
      });

    setFilteredReceipts(searchResult);
  }, [filteredTradingType, searches, filteredDate, receipts]);

  useEffect(() => {
    /* Info: (20230829 - Julian) 如果 showRow 大於等於 filteredReceipts 長度，就顯示全部
     * 如果不是，就從最後面取出 showRow 個 */
    const sliceReceipts =
      showRow >= filteredReceipts.length ? filteredReceipts : filteredReceipts.slice(-showRow, -1);
    setSliceReceipts(sliceReceipts);

    // Info: (20230829 - Julian) 如果 showRow 已經大於等於 filteredReceipts 長度，就不顯示 See more 按鈕
    if (showRow >= filteredReceipts.length) {
      setIsShowMore(false);
    } else {
      setIsShowMore(true);
    }
  }, [filteredReceipts, showRow]);

  const dataMonthList = sliceReceipts
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
          <ReceiptList monthData={v} sliceReceipts={sliceReceipts} />
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

      <div className="flex flex-col">
        {listCluster}
        {/* Info: (20230829 - Julian) See more button */}
        <button
          onClick={seeMoreHandler}
          className={`${
            isShowMore ? 'flex' : 'hidden'
          } items-center justify-center space-x-2 text-base uppercase text-tidebitTheme`}
        >
          <p>{t('MY_ASSETS_PAGE.RECEIPT_SECTION_SEE_MORE')}</p>
          <FiChevronDown className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ReceiptSection;
