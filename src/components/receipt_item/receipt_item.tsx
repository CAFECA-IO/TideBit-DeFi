import React, {useState} from 'react';
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

  const displayedButtonText =
    type === OrderType.DEPOSIT
      ? 'Deposit'
      : type === OrderType.WITHDRAW
      ? 'Withdraw'
      : type === 'CFD'
      ? orderSnapshot.state === OrderState.OPENING
        ? 'Open Position'
        : orderSnapshot.state === OrderState.CLOSED
        ? 'Close Position'
        : 'Open Position'
      : 'Trading Type';

  const displayedButtonImage =
    type === OrderType.DEPOSIT || orderSnapshot.state === OrderState.CLOSED
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount = targetAmount >= 0 ? '+' + targetAmount : targetAmount;

  const displayedReceiptTxId = orderSnapshot.txid;

  const displayedReceiptStateColor =
    orderSnapshot.status === OrderStatusUnion.SUCCESS
      ? 'text-tidebitTheme'
      : orderSnapshot.status === OrderStatusUnion.PROCESSING
      ? 'text-lightGreen5'
      : orderSnapshot.status === OrderStatusUnion.FAILED
      ? 'text-lightRed'
      : 'text-lightGray';

  const displayedReceiptState =
    orderSnapshot.status === OrderStatusUnion.SUCCESS
      ? displayedReceiptTxId
      : orderSnapshot.status === OrderStatusUnion.PROCESSING
      ? 'Processing'
      : orderSnapshot.status === OrderStatusUnion.FAILED
      ? 'Failed'
      : '-';

  const displayedReceiptFeeText =
    orderSnapshot.fee === 0
      ? orderSnapshot.fee
      : orderSnapshot.fee.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        });

  /* ToDo: (20230317 - Julian) if state === 'PROCESSING', avbl loading anim */
  const displayedReceiptAvailableText = balanceSnapshot.available.toLocaleString(
    UNIVERSAL_NUMBER_FORMAT_LOCALE,
    {
      minimumFractionDigits: 2,
    }
  );

  const displayedReceiptTime = (
    <div className="flex w-60px flex-col items-center justify-center bg-darkGray7 py-4 sm:w-70px">
      <p>{receiptDate.day}</p>
      <span className="text-sm text-lightGray">{receiptDate.time}</span>
    </div>
  );

  /* ToDo: (20230316 - Julian) button click handler */
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

  /* ToDo: (20230317 - Julian) 
  1. icon
  2. 串接 modal
   */
  const displayedReceiptDetail = (
    <div className="hidden flex-auto flex-col sm:flex sm:w-64">
      <span className="text-lightGray">Detail</span>
      <p className={`${displayedReceiptStateColor}`}>{displayedReceiptState}</p>
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
