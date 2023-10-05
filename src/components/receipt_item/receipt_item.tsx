import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';
import {GlobalContext} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {numberFormatted, timestampToString, toDisplayCFDOrder, toPnl} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
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
import {CFDOperation} from '../../constants/cfd_order_type';
import {FRACTION_DIGITS} from '../../constants/config';
import {ToastId} from '../../constants/toast_id';
import {ToastTypeAndText} from '../../constants/toast_type';
import SafeMath from '../../lib/safe_math';

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
        ? +SafeMath.gt(
            SafeMath.plus((order as ICFDOrder).margin.amount, (order as ICFDOrder).pnl?.value ?? 0),
            0
          )
          ? +SafeMath.plus((order as ICFDOrder).margin.amount, (order as ICFDOrder).pnl?.value ?? 0)
          : 0
        : +SafeMath.mult((order as ICFDOrder).margin.amount, -1)
      : orderType === OrderType.DEPOSIT
      ? +(order as IDepositOrder).targetAmount
      : +SafeMath.mult((order as IWithdrawOrder).targetAmount, -1);

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
      ? '+' + numberFormatted(targetAmount)
      : numberFormatted(targetAmount);

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

  /* Info: (20230713 - Julian) show history modal */
  const closedCfdHandler = () => {
    const closedOrder = userCtx.getCFD(order.id) ?? (order as ICFDOrder);
    const cfdData = toDisplayCFDOrder(closedOrder);
    globalCtx.dataHistoryPositionModalHandler(cfdData);
    globalCtx.visibleHistoryPositionModalHandler();
  };

  /* Info: (20230713 - Julian) show update CFD modal */
  const updateCfdHandler = () => {
    const updateCfd = order as ICFDOrder;
    const cfdData = toDisplayCFDOrder(updateCfd);
    const spread = marketCtx.getTickerSpread(cfdData.targetAsset);
    const closePrice = marketCtx.predictCFDClosePrice(cfdData.instId, cfdData.typeOfPosition);
    marketCtx.selectTickerHandler(cfdData.instId);

    const pnl =
      cfdData?.pnl ||
      toPnl({
        openPrice: cfdData.openPrice,
        closePrice: cfdData?.closePrice ?? closePrice,
        typeOfPosition: cfdData.typeOfPosition,
        amount: cfdData.amount,
        spread,
      });

    globalCtx.dataUpdateFormModalHandler({...cfdData, pnl});
    globalCtx.visibleUpdateFormModalHandler();
  };

  // Info: (20230713 - Julian) when click position or d/w history button
  const buttonClickHandler =
    orderType === OrderType.CFD
      ? isClosed
        ? closedCfdHandler
        : updateCfdHandler
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

  const copyClickHandler = () => {
    navigator.clipboard.writeText(displayedReceiptTxId);

    globalCtx.toast({
      type: ToastTypeAndText.INFO.type,
      message: t('TOAST.COPY_SUCCESS'),
      toastId: ToastId.COPY_SUCCESS,
      autoClose: 300,
      isLoading: false,
      typeText: t(ToastTypeAndText.INFO.text),
    });
  };

  const displayedReceiptStateIcon =
    orderStatus === OrderStatusUnion.PROCESSING ||
    orderStatus === OrderStatusUnion.WAITING ? null : orderType === OrderType.CFD ? (
      orderStatus === OrderStatusUnion.FAILED ? (
        <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
      ) : (
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      )
    ) : (
      <button onClick={copyClickHandler}>
        <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
      </button>
    );

  const displayedReceiptFeeText = order.fee === 0 ? order.fee : numberFormatted(order.fee);

  const displayedReceiptAvailableText =
    orderStatus === OrderStatusUnion.WAITING ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      numberFormatted(balance?.available, true)
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
    <div className="flex h-76px w-full items-center">
      <div className="w-70px">{displayedReceiptTime}</div>

      <div className="flex h-full flex-1 items-center justify-between border-b-2 border-dashed border-lightGray4 pl-3">
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
