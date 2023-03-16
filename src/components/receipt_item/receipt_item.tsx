import React, {useState} from 'react';
import Image from 'next/image';
import {timestampToString} from '../../lib/common';
import {IOrder} from '../../interfaces/tidebit_defi_background/order';

interface IReceiptItemProps {
  histories: IOrder;
}

const ReceiptItem = (histories: IReceiptItemProps) => {
  const TradingType = histories.histories.type;

  const receiptDate = timestampToString(histories.histories.timestamp ?? 0);

  const displayedButtonColor =
    TradingType === 'DEPOSIT' || TradingType === 'CLOSE_CFD' ? 'bg-lightGreen5' : 'bg-lightRed';

  const displayedButtonText =
    TradingType === 'DEPOSIT'
      ? 'Deposit'
      : TradingType === 'WITHDRAW'
      ? 'Withdraw'
      : TradingType === 'OPEN_CFD'
      ? 'Open Position'
      : TradingType === 'CLOSE_CFD'
      ? 'Close Position'
      : 'Trading Type';

  const displayedButtonImage =
    TradingType === 'DEPOSIT' || TradingType === 'CLOSE_CFD'
      ? '/elements/group_149621.svg'
      : '/elements/group_14962.svg';

  const displayedReceiptAmount =
    TradingType === 'DEPOSIT' || TradingType === 'CLOSE_CFD'
      ? `+${histories.histories.targetAmount}`
      : `-${histories.histories.targetAmount}`;

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
        <p className="ml-2">{displayedButtonText}</p>
      </button>
    </div>
  );

  const displayedReceiptIncome = (
    <div className="flex items-end sm:w-48">
      <div className="text-2xl">{displayedReceiptAmount}</div>
      <span className="ml-1 text-sm text-lightGray">{histories.histories.targetAsset}</span>
    </div>
  );

  /* ToDo: (20230316 - Julian) get detail data */
  const displayedReceiptDetail = (
    <div className="hidden flex-auto flex-col sm:flex sm:w-64">
      <span className="text-lightGray">Detail</span>
      Failed
    </div>
  );

  const displayedReceiptFee = (
    <div className="hidden flex-col sm:flex sm:w-32">
      <span className="text-lightGray">Fee</span>
      {histories.histories.fee}
    </div>
  );

  /* ToDo: (20230316 - Julian) figure out available balance */
  const displayedReceiptAvailable = (
    <div className="hidden flex-col items-center sm:flex sm:w-32">
      <span className="text-lightGray">Available</span>
      21.60
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
