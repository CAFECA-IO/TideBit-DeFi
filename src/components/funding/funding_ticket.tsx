'use client';

import React from 'react';
import Image from 'next/image';
import { IFundingItemUI } from '@/interfaces/funding';
import { numberWithCommas } from '@/lib/utils/common';

interface IFundingTicketProps {
  data: IFundingItemUI;
}

const GradientProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
  // Info: (202501218 - Julian) 限制 percentage 在 0 到 100 之間
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative h-16px w-full overflow-hidden rounded-radius-rounded bg-loading-indicator-surface-base px-spacing-lv-0">
      <div
        style={{ width: `${clampedPercentage}%` }}
        className="absolute left-0 rounded-radius-rounded bg-gradient-to-r from-loading-indicator-surface-gradient-0 to-loading-indicator-surface-gradient-100"
      >
        <p className="text-center text-xs font-extrabold text-loading-indicator-text-on-primary">
          {clampedPercentage}%
        </p>
      </div>
    </div>
  );
};

const FundingTicket: React.FC<IFundingTicketProps> = ({ data }) => {
  const { coverImageId, companyName, title, raisedFundingAmount, goalFundingAmount } = data;

  const progressPercentage = (raisedFundingAmount / goalFundingAmount) * 100;

  return (
    <div className="flex flex-col overflow-hidden rounded-radius-l bg-surface-neutral-container-lv2">
      {/* Info: (202501218 - Julian) Cover Image */}
      <div className="relative h-180px w-full">
        <Image src={coverImageId} alt="Funding Cover" fill objectFit="cover" />
      </div>

      {/* Info: (202501218 - Julian) Content */}
      <div className="flex flex-col">
        <div className="flex flex-col gap-spacing-lv-0 px-spacing-lv-6 py-spacing-lv-3">
          <p className="text-xs font-normal text-text-neutral-tertiary">{companyName}</p>
          <p className="font-bold text-text-neutral-primary">{title}</p>
        </div>
        <div className="flex flex-col gap-spacing-lv-0 px-spacing-lv-6 py-spacing-lv-2">
          <div className="flex items-center justify-between font-semibold text-loading-indicator-text-primary">
            <p>NT$ {numberWithCommas(raisedFundingAmount)}</p>
            <p>NT$ {numberWithCommas(goalFundingAmount)}</p>
          </div>
          <GradientProgressBar percentage={progressPercentage} />
        </div>
        <div className="grid grid-cols-3 px-spacing-lv-4 pb-spacing-lv-4 pt-spacing-lv-2">
          <div className="flex flex-col items-center">
            <p className="font-normal text-text-neutral-tertiary">Tokens / 10K</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-normal text-text-neutral-tertiary">Investors</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-normal text-text-neutral-tertiary">Days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTicket;
