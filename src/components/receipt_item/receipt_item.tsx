import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';
import {UserContext} from '../../contexts/user_context';
import {GlobalContext} from '../../contexts/global_context';
import {timestampToString} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {IAcceptedOrder} from '../../interfaces/tidebit_defi_background/accepted_order';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {IAcceptedWithdrawOrder} from '../../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../../interfaces/tidebit_defi_background/order';
import {FRACTION_DIGITS} from '../../constants/config';

type TranslateFunction = (s: string) => string;
interface IReceiptItemProps {
  histories: IAcceptedOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useContext(GlobalContext);

  const {createTimestamp, receipt} = histories.histories;
  const {orderSnapshot: order, balanceSnapshot} = receipt;
  const balance = balanceSnapshot.shift();

  const getCFDData = userCtx.getCFD((order as ICFDOrder).id);

  /* Todo: (20230328 - Julian) get data from userContext 
  const getDepositData: IDisplayAcceptedDepositOrder = {
    id: 'TBD202303280000001',
    txid: '0x',
    orderType: OrderType.DEPOSIT,
    createTimestamp: 1679587700,
    orderStatus: OrderStatusUnion.PROCESSING,
    fee: 0,
    remark: '',
    targetAsset: 'USDT',
    targetAmount: 80,
    decimals: 18,
    to: '0x',
    balanceSnapshot: {
      currency: 'USDT',
      available: 0,
      locked: 1900,
    },
  };*/

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
        ? (order as ICFDOrder).margin.amount + ((order as ICFDOrder).pnl?.value || 0) > 0
          ? (order as ICFDOrder).margin.amount + ((order as ICFDOrder).pnl?.value || 0)
          : 0
        : (order as ICFDOrder).margin.amount * -1
      : orderType === OrderType.DEPOSIT
      ? (order as IDepositOrder).targetAmount
      : (order as IWithdrawOrder).targetAmount * -1;

  const displayedButtonColor =
    targetAmount == 0 ? 'bg-lightGray' : targetAmount > 0 ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedReceiptType =
    orderType === OrderType.DEPOSIT
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')
      : orderType === OrderType.WITHDRAW
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')
      : orderType === OrderType.CFD
      ? (order as ICFDOrder).state === OrderState.OPENING
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')
        : (order as ICFDOrder).state === OrderState.CLOSED
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')
        : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')
      : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE');

  const displayedButtonText = displayedReceiptType;

  const displayedButtonImage =
    orderType === OrderType.DEPOSIT ||
    (orderType === OrderType.CFD && (order as ICFDOrder).state === OrderState.CLOSED)
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount = targetAmount >= 0 ? '+' + targetAmount : targetAmount;

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

  // ToDo:(20230518 - Julian)已關閉的倉位不可以編輯
  const buttonClickHandler =
    orderType === OrderType.CFD
      ? (order as ICFDOrder).state === OrderState.OPENING
        ? () => {
            /* ToDo: convert IAceptedOrder to IDataPositionUpdatedModal in order to use getCFD (20230324 - Luphia)
            globalCtx.dataUpdateFormModalHandler(getCFDData);
            
            globalCtx.dataPositionUpdatedModalHandler(getCFDData as IDataPositionUpdatedModal); 
            globalCtx.visiblePositionUpdatedModalHandler(); */
            globalCtx.visibleUpdateFormModalHandler();
          }
        : () => {
            /* ToDo: convert IAceptedOrder to IDisplayCFDOrder in order to use getCFD (20230324 - Luphia) 
            globalCtx.dataHistoryPositionModalHandler(toDisplayAcceptedCFDOrder(getCFDData, [])); */
            globalCtx.visibleHistoryPositionModalHandler();
          }
      : orderType === OrderType.DEPOSIT
      ? () => {
          globalCtx.dataDepositHistoryModalHandler(histories.histories as IAcceptedDepositOrder);
          globalCtx.visibleDepositHistoryModalHandler();
        }
      : () => {
          globalCtx.dataWithdrawalHistoryModalHandler(
            histories.histories as IAcceptedWithdrawOrder
          );
          globalCtx.visibleWithdrawalHistoryModalHandler();
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
      balance?.available.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
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
      {displayedReceiptAvailableText ?? '-'}
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
