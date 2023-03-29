import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';
import {UserContext} from '../../contexts/user_context';
import {GlobalContext} from '../../contexts/global_context';
import {timestampToString, toDisplayAcceptedDepositOrder} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {IDisplayAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/display_accepted_deposit_order';

type TranslateFunction = (s: string) => string;
interface IReceiptItemProps {
  histories: IOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useContext(GlobalContext);

  const {timestamp, type, orderSnapshot, targetAmount, targetAsset, balanceSnapshot} =
    histories.histories;

  const getCFDData = userCtx.getCFD(orderSnapshot.id);

  /* Todo: (20230328 - Julian) get data from userContext */
  const getDepositData: IDisplayAcceptedDepositOrder = {
    id: 'TBD202303280000001',
    txid: '0x',
    orderType: OrderType.DEPOSIT,
    createTimestamp: 1679587700,
    orderStatus: OrderStatusUnion.FAILED,
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
  };

  const receiptDate = timestampToString(timestamp ?? 0);

  const displayedButtonColor =
    targetAmount == 0 ? 'bg-lightGray' : targetAmount > 0 ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedReceiptType =
    type === OrderType.DEPOSIT
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')
      : type === OrderType.WITHDRAW
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')
      : type === OrderType.CFD
      ? orderSnapshot.state === OrderState.OPENING
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')
        : orderSnapshot.state === OrderState.CLOSED
        ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')
        : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')
      : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE');

  const displayedButtonText = displayedReceiptType;

  const displayedButtonImage =
    type === OrderType.DEPOSIT || orderSnapshot.state === OrderState.CLOSED
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount = targetAmount >= 0 ? '+' + targetAmount : targetAmount;

  const displayedReceiptTxId = orderSnapshot.txid;

  const displayedReceiptStateColor =
    orderSnapshot.status === OrderStatusUnion.SUCCESS
      ? type === OrderType.CFD
        ? 'text-lightWhite'
        : 'text-tidebitTheme'
      : orderSnapshot.status === OrderStatusUnion.PROCESSING
      ? 'text-lightGreen5'
      : orderSnapshot.status === OrderStatusUnion.FAILED
      ? 'text-lightRed'
      : 'text-lightGray';

  const displayedReceiptState =
    orderSnapshot.status === OrderStatusUnion.SUCCESS
      ? type === OrderType.CFD
        ? `${displayedReceiptType} of ETH`
        : displayedReceiptTxId
      : orderSnapshot.status === OrderStatusUnion.PROCESSING
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_PROCESSING')
      : orderSnapshot.status === OrderStatusUnion.FAILED
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_ORDER_STATUS_FAILED')
      : '-';

  const buttonClickHandler =
    type === OrderType.CFD
      ? orderSnapshot.state === OrderState.OPENING
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
      : type === OrderType.DEPOSIT
      ? () => {
          /* Todo: (20230324 - Julian) deposit history modal */
          globalCtx.visibleDepositHistoryModalHandler();
          globalCtx.dataDepositHistoryModalHandler(
            toDisplayAcceptedDepositOrder(histories.histories)
          );
        }
      : () => {
          /* Todo: (20230324 - Julian) withdraw history modal */
        };

  const detailIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.989"
      height="19.989"
      viewBox="0 0 19.989 19.989"
    >
      <g id="Group_785" data-name="Group 785" transform="translate(-896 -505)">
        <path
          id="Path_76"
          data-name="Path 76"
          d="M21.082,24.294H11.088a3.213,3.213,0,0,1-3.213-3.213V11.088a3.213,3.213,0,0,1,3.213-3.213h9.994a3.213,3.213,0,0,1,3.213,3.213v9.994a3.213,3.213,0,0,1-3.213,3.213Z"
          transform="translate(891.694 500.694)"
          fill="#f2f2f2"
        />
        <path
          id="Path_77"
          data-name="Path 77"
          d="M7.961,4.392H18.485A3.218,3.218,0,0,0,15.457,2.25H5.463A3.213,3.213,0,0,0,2.25,5.463v9.994a3.218,3.218,0,0,0,2.142,3.029V7.961A3.569,3.569,0,0,1,7.961,4.392Z"
          transform="translate(893.75 502.75)"
          fill="#f2f2f2"
        />
      </g>
    </svg>
  );

  const displayedReceiptStateIcon =
    orderSnapshot.status === OrderStatusUnion.PROCESSING ? null : type === OrderType.CFD ? (
      orderSnapshot.status === OrderStatusUnion.FAILED ? (
        detailIcon
      ) : (
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      )
    ) : (
      detailIcon
    );

  const displayedReceiptFeeText =
    orderSnapshot.fee === 0
      ? orderSnapshot.fee
      : orderSnapshot.fee.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        });

  const displayedReceiptAvailableText =
    orderSnapshot.status === OrderStatusUnion.PROCESSING ? (
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
      <div className="inline-flex items-center">
        {/* Todo: (20230328 - Julian) available
         * 1. 用戶地址(to)
         * 2. Bolt 地址(超連結)
         */}
        <p className={`${displayedReceiptStateColor} mr-2`}>{displayedReceiptState}</p>
        {displayedReceiptStateIcon}
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
