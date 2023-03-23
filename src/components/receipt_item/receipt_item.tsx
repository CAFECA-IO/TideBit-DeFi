import React from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';
import {timestampToString} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';

interface IReceiptItemProps {
  histories: IOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const {timestamp, type, orderSnapshot, targetAmount, targetAsset, balanceSnapshot} =
    histories.histories;

  const receiptDate = timestampToString(timestamp ?? 0);

  const displayedButtonColor =
    targetAmount == 0 ? 'bg-lightGray' : targetAmount > 0 ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedReceiptType =
    type === OrderType.DEPOSIT
      ? 'Deposit'
      : type === OrderType.WITHDRAW
      ? 'Withdraw'
      : type === OrderType.CFD
      ? orderSnapshot.state === OrderState.OPENING
        ? 'Open Position'
        : orderSnapshot.state === OrderState.CLOSED
        ? 'Close Position'
        : 'Open Position'
      : 'Trading Type';

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
      ? 'Processing'
      : orderSnapshot.status === OrderStatusUnion.FAILED
      ? 'Failed'
      : '-';

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

  /* Todo: (20230316 - Julian) Fix icon */
  const displayedReceiptStateIcon =
    orderSnapshot.status === OrderStatusUnion.PROCESSING ? null : type === OrderType.CFD ? (
      <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
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
    <div className="flex w-60px flex-col items-center justify-center bg-darkGray7 py-4 sm:w-70px">
      <p>{receiptDate.day}</p>
      <span className="text-sm text-lightGray">{receiptDate.time}</span>
    </div>
  );

  /* ToDo: (20230316 - Julian) button click handler
          txid -> get detail from userCtx -> globalCtx
   */
  const displayedReceiptButton = (
    <div className="flex items-center sm:w-48">
      <button className={`inline-flex items-center rounded-full px-3 py-1 ${displayedButtonColor}`}>
        <Image src={displayedButtonImage} width={15} height={15} alt="deposit icon" />
        <p className="ml-2 whitespace-nowrap">{displayedButtonText}</p>
      </button>
    </div>
  );

  const displayedReceiptIncome = (
    <div className="flex items-end sm:w-48">
      <div className="text-2xl">{displayedReceiptAmount}</div>
      <span className="ml-1 text-sm text-lightGray">{targetAsset}</span>
    </div>
  );

  const displayedReceiptDetail = (
    <div className="hidden flex-auto flex-col sm:flex sm:w-64">
      <span className="text-lightGray">Detail</span>
      <div className="inline-flex items-center">
        <p className={`${displayedReceiptStateColor} mr-2`}>{displayedReceiptState}</p>
        {displayedReceiptStateIcon}
      </div>
    </div>
  );

  const displayedReceiptFee = (
    <div className="hidden flex-col sm:flex sm:w-32">
      <span className="text-lightGray">Fee</span>
      {displayedReceiptFeeText}
    </div>
  );

  const displayedReceiptAvailable = (
    <div className="hidden flex-col items-center sm:flex sm:w-32">
      <span className="text-lightGray">Available</span>
      {displayedReceiptAvailableText ?? '-'}
    </div>
  );

  return (
    <div className="flex h-60px w-full items-center sm:h-70px">
      {displayedReceiptTime}

      <div className="flex h-full w-full items-center justify-between border-b-2 border-dashed border-lightGray4 pl-2 sm:pl-6">
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
