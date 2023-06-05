import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';
import {GlobalContext} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {timestampToString, toDisplayCFDOrder, roundToDecimalPlaces} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {IAcceptedWithdrawOrder} from '../../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../../interfaces/tidebit_defi_background/order';
import {ICurrency} from '../../constants/currency';
import {CFDOperation} from '../../constants/cfd_order_type';
import {FRACTION_DIGITS} from '../../constants/config';

type TranslateFunction = (s: string) => string;
interface IReceiptItemProps {
  histories: IAcceptedOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useContext(GlobalContext);
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const {createTimestamp, receipt, isClosed} = histories.histories;
  const {orderSnapshot: order, balanceSnapshot} = receipt;

  const balance = balanceSnapshot.shift();
  const receiptDate = timestampToString(createTimestamp ?? 0);
  const orderType = order.orderType;
  const orderStatus = order.orderStatus;
  const targetAsset =
    orderType === OrderType.CFD
      ? (order as ICFDOrder).margin.asset
      : orderType === OrderType.DEPOSIT
      ? (order as IDepositOrder).targetAsset
      : (order as IWithdrawOrder).targetAsset;
  const targetAmount =
    orderType === OrderType.CFD
      ? (order as ICFDOrder).state === OrderState.CLOSED
        ? (order as ICFDOrder).margin.amount + ((order as ICFDOrder).pnl?.value ?? 0) > 0
          ? (order as ICFDOrder).margin.amount + ((order as ICFDOrder).pnl?.value ?? 0)
          : 0
        : (order as ICFDOrder).margin.amount * -1
      : orderType === OrderType.DEPOSIT
      ? (order as IDepositOrder).targetAmount
      : (order as IWithdrawOrder).targetAmount * -1;

  /* Info: (20230524 - Julian) CFD Type : create / update / close */
  const cfdType = (histories.histories as IAcceptedCFDOrder).applyData.operation;

  const displayedButtonColor =
    targetAmount == 0 ? 'bg-lightGray' : targetAmount > 0 ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedReceiptType =
    orderType === OrderType.DEPOSIT
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')
      : orderType === OrderType.WITHDRAW
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')
      : orderType === OrderType.CFD
      ? (order as ICFDOrder).state === OrderState.CLOSED
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')
        : (order as ICFDOrder).state === OrderState.OPENING
        ? cfdType === CFDOperation.UPDATE
          ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_UPDATE')
          : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')
        : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')
      : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE');

  const displayedButtonText = displayedReceiptType;

  const displayedButtonImage =
    orderType === OrderType.DEPOSIT ||
    (orderType === OrderType.CFD && (order as ICFDOrder).state === OrderState.CLOSED)
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount =
    cfdType === CFDOperation.UPDATE
      ? '+0'
      : targetAmount >= 0
      ? '+' + targetAmount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
      : targetAmount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

  const displayedReceiptTxId = order.txhash;

  const displayedReceiptStateColor =
    orderStatus === OrderStatusUnion.SUCCESS
      ? orderType === OrderType.CFD
        ? 'text-lightWhite'
        : 'text-tidebitTheme'
      : orderStatus === OrderStatusUnion.PROCESSING || orderStatus === OrderStatusUnion.WAITING
      ? 'text-lightGreen5'
      : orderStatus === OrderStatusUnion.FAILED
      ? 'text-lightRed'
      : 'text-lightGray';

  const displayedReceiptState =
    orderStatus === OrderStatusUnion.SUCCESS
      ? orderType === OrderType.CFD
        ? `${displayedReceiptType}`
        : displayedReceiptTxId
      : orderStatus === OrderStatusUnion.PROCESSING || orderStatus === OrderStatusUnion.WAITING
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_PROCESSING')
      : orderStatus === OrderStatusUnion.FAILED
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_FAILED')
      : '-';

  /* Info: (20230523 - Julian) Line Graph Data */
  const positionLineGraph = marketCtx.listTickerPositions(targetAsset as ICurrency, {
    begin: createTimestamp,
  });

  const buttonClickHandler =
    orderType === OrderType.CFD
      ? isClosed === true
        ? () => {
            const closedCfd = userCtx.closedCFDs.find(cfd => cfd.id === order.id)! as ICFDOrder;
            const cfdData = toDisplayCFDOrder(closedCfd, []);

            globalCtx.dataHistoryPositionModalHandler(cfdData);
            globalCtx.visibleHistoryPositionModalHandler();
          }
        : () => {
            const updateCfd = order as ICFDOrder;
            /* Info: (20230602 - Julian) 拿到該 ticker 的當前價格 */
            const tickerPrice = marketCtx.availableTickers[updateCfd.targetAsset]?.price;
            const buyPrice = !!tickerPrice ? roundToDecimalPlaces(tickerPrice, 2) : 0;
            const sellPrice = !!tickerPrice ? roundToDecimalPlaces(tickerPrice, 2) : 0;
            const currentPrice =
              positionLineGraph.length > 0
                ? positionLineGraph[positionLineGraph.length - 1]
                : (!!tickerPrice &&
                    ((updateCfd.typeOfPosition === TypeOfPosition.BUY && buyPrice) ||
                      (updateCfd.typeOfPosition === TypeOfPosition.SELL && sellPrice))) ||
                  0;
            const cfdData = toDisplayCFDOrder(updateCfd, positionLineGraph, currentPrice);

            globalCtx.dataUpdateFormModalHandler(cfdData);
            globalCtx.visibleUpdateFormModalHandler();
          }
      : orderType === OrderType.DEPOSIT
      ? () => {
          globalCtx.dataDepositHistoryModalHandler(histories.histories as IAcceptedDepositOrder);
          globalCtx.visibleDepositHistoryModalHandler();
        }
      : orderType === OrderType.WITHDRAW
      ? () => {
          globalCtx.dataWithdrawalHistoryModalHandler(
            histories.histories as IAcceptedWithdrawOrder
          );
          globalCtx.visibleWithdrawalHistoryModalHandler();
        }
      : () => null;

  const displayedReceiptStateIcon =
    orderStatus === OrderStatusUnion.PROCESSING ||
    orderStatus === OrderStatusUnion.WAITING ? null : orderType === OrderType.CFD ? (
      orderStatus === OrderStatusUnion.FAILED ? (
        <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
      ) : (
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      )
    ) : (
      <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
    );

  const displayedReceiptFeeText =
    order.fee === 0
      ? order.fee
      : order.fee.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

  const displayedReceiptAvailableText =
    orderStatus === OrderStatusUnion.PROCESSING || orderStatus === OrderStatusUnion.WAITING ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      balance?.available.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS) ?? '-'
    );

  const displayedReceiptTime = (
    <div className="flex w-70px flex-col items-center justify-center bg-darkGray7 py-4">
      <p>{receiptDate.day}</p>
      <span className="text-sm text-lightGray">{receiptDate.time}</span>
    </div>
  );

  const displayedReceiptButton = (
    <div className="flex items-center lg:w-48">
      <button
        className={`inline-flex items-center rounded-full px-3 py-1 ${displayedButtonColor}`}
        onClick={buttonClickHandler}
      >
        <Image src={displayedButtonImage} width={15} height={15} alt="deposit icon" />
        <p className="ml-2 whitespace-nowrap">{displayedButtonText}</p>
      </button>
    </div>
  );

  const displayedReceiptIncome = (
    <div className="flex items-end lg:w-48">
      <div className="text-2xl">{displayedReceiptAmount}</div>
      <span className="ml-1 text-sm text-lightGray">{targetAsset}</span>
    </div>
  );

  const displayedReceiptDetail = (
    <div className="hidden flex-auto flex-col lg:flex lg:w-64">
      <span className="text-lightGray">{t('MY_ASSETS_PAGE.RECEIPT_SECTION_DETAIL')}</span>
      <div className="flex flex-col">
        <div className="inline-flex items-center">
          {/* Todo: (20230328 - Julian) available
           * 1. 用戶地址(to)
           * 2. Bolt 地址(超連結)
           */}
          <p className={`${displayedReceiptStateColor} mr-2`}>{displayedReceiptState}</p>
          {displayedReceiptStateIcon}
        </div>
        <div className="inline-flex items-center"></div>
      </div>
    </div>
  );

  const displayedReceiptFee = (
    <div className="hidden flex-col lg:flex lg:w-32">
      <span className="text-lightGray">{t('MY_ASSETS_PAGE.RECEIPT_SECTION_FEE')}</span>
      {displayedReceiptFeeText}
    </div>
  );

  const displayedReceiptAvailable = (
    <div className="hidden flex-col items-center lg:flex lg:w-32">
      <span className="text-lightGray">{t('MY_ASSETS_PAGE.RECEIPT_SECTION_AVAILABLE')}</span>
      {displayedReceiptAvailableText}
    </div>
  );

  return (
    <div className="flex h-70px w-full items-center">
      {displayedReceiptTime}

      <div className="flex h-full w-full items-center justify-between border-b-2 border-dashed border-lightGray4 pl-6">
        {displayedReceiptButton}
        {displayedReceiptIncome}
        {displayedReceiptDetail}
        {displayedReceiptFee}
        {displayedReceiptAvailable}
      </div>
    </div>
  );
};

export default ReceiptItem;
