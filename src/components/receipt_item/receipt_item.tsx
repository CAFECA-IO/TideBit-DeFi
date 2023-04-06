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
import {ICFDOrderSnapshot} from '../../interfaces/tidebit_defi_background/order_snapshot';

type TranslateFunction = (s: string) => string;
interface IReceiptItemProps {
  histories: IAcceptedOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useContext(GlobalContext);

  const {
    createTimestamp,
    orderStatus,
    orderType,
    orderSnapshot,
    targetAmount,
    targetAsset,
    balanceSnapshot,
  } = histories.histories;

  const getCFDData = userCtx.getCFD(orderSnapshot.id);

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

  // const displayedDepositData = toDisplayAcceptedDepositOrder(histories.histories);

  const receiptDate = timestampToString(createTimestamp ?? 0);

  const displayedButtonColor =
    targetAmount == 0 ? 'bg-lightGray' : targetAmount > 0 ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedReceiptType =
    orderType === OrderType.DEPOSIT
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')
      : orderType === OrderType.WITHDRAW
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')
      : orderType === OrderType.CFD
      ? (orderSnapshot as ICFDOrderSnapshot).state === OrderState.OPENING
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')
        : (orderSnapshot as ICFDOrderSnapshot).state === OrderState.CLOSED
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')
        : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')
      : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE');

  const displayedButtonText = displayedReceiptType;

  const displayedButtonImage =
    orderType === OrderType.DEPOSIT ||
    (orderType === OrderType.CFD &&
      (orderSnapshot as ICFDOrderSnapshot).state === OrderState.CLOSED)
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount = targetAmount >= 0 ? '+' + targetAmount : targetAmount;

  const displayedReceiptTxId = orderSnapshot.txid;

  const displayedReceiptStateColor =
    orderStatus === OrderStatusUnion.SUCCESS
      ? orderType === OrderType.CFD
        ? 'text-lightWhite'
        : 'text-tidebitTheme'
      : orderStatus === OrderStatusUnion.PROCESSING
      ? 'text-lightGreen5'
      : orderStatus === OrderStatusUnion.FAILED
      ? 'text-lightRed'
      : 'text-lightGray';

  const displayedReceiptState =
    orderStatus === OrderStatusUnion.SUCCESS
      ? orderType === OrderType.CFD
        ? `${displayedReceiptType}`
        : displayedReceiptTxId
      : orderStatus === OrderStatusUnion.PROCESSING
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_PROCESSING')
      : orderStatus === OrderStatusUnion.FAILED
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_FAILED')
      : '-';

  const buttonClickHandler =
    orderType === OrderType.CFD
      ? (orderSnapshot as ICFDOrderSnapshot).state === OrderState.OPENING
        ? () => {
            /* ToDo: convert IAceptedOrder to IDataPositionUpdatedModal in order to use getCFD (20230324 - Luphia)
            globalCtx.dataPositionUpdatedModalHandler(getCFDData);
             */
            globalCtx.visiblePositionUpdatedModalHandler();
          }
        : () => {
            /* ToDo: convert IAceptedOrder to IDisplayAcceptedCFDOrder in order to use getCFD (20230324 - Luphia)
            globalCtx.dataHistoryPositionModalHandler(getCFDData);
             */
            globalCtx.visibleHistoryPositionModalHandler();
          }
      : orderType === OrderType.DEPOSIT
      ? () => {
          /* Todo: (20230324 - Julian) deposit history modal */
          globalCtx.dataDepositHistoryModalHandler(histories.histories as IAcceptedDepositOrder);
          globalCtx.visibleDepositHistoryModalHandler();
        }
      : () => {
          /* ToDo: (20230329 - Julian) transfer IOrder to IAcceptedWithdrawOrder 
          globalCtx.dataWithdrawalHistoryModalHandler(getDepositData);
          */
          globalCtx.visibleWithdrawalHistoryModalHandler();
        };

  const displayedReceiptStateIcon =
    orderStatus === OrderStatusUnion.PROCESSING ? null : orderType === OrderType.CFD ? (
      orderStatus === OrderStatusUnion.FAILED ? (
        <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
      ) : (
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      )
    ) : (
      <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
    );

  const displayedReceiptFeeText =
    orderSnapshot.fee === 0
      ? orderSnapshot.fee
      : orderSnapshot.fee.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        });

  const displayedReceiptAvailableText =
    orderStatus === OrderStatusUnion.PROCESSING ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      balanceSnapshot.available.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
        minimumFractionDigits: 2,
      })
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
