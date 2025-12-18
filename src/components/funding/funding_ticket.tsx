'use client';

import React from 'react';
import Image from 'next/image';
import { IFundingItemUI } from '@/interfaces/funding';
import { numberWithCommas } from '@/lib/utils/common';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';

type StatDisplay = { value: number; label: string };
interface IFundingTicketProps {
  data: IFundingItemUI;
}

const FundingTicket: React.FC<IFundingTicketProps> = ({ data }) => {
  const {
    coverImageId,
    tokenPrice,
    tokenName,
    industry,
    companyName,
    title,
    raisedFundingAmount,
    goalFundingAmount,
    committedFundAmount,
    committedTokensCount,
    investorsCount,
  } = data;

  const progressPercentage = (raisedFundingAmount / goalFundingAmount) * 100;
  const raisedFundingText = `NT$ ${numberWithCommas(raisedFundingAmount)}`;
  const goalFundingText = `NT$ ${numberWithCommas(goalFundingAmount)}`;

  // Info: (202501218 - Julian) 根據整理好的 StatDisplay ，產生統計數據區塊
  const leftStatData: StatDisplay = {
    value: committedFundAmount,
    label: 'Tokens / 10K',
  };

  const centerStatData: StatDisplay = {
    value: committedTokensCount,
    label: 'Investors',
  };

  const rightStatData: StatDisplay = {
    value: investorsCount,
    label: 'Days',
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-radius-l bg-surface-neutral-container-lv2">
      {/* Info: (202501218 - Julian) Cover Image */}
      <div className="relative h-180px w-full shrink-0">
        <Image src={coverImageId} alt="Funding Cover" fill objectFit="cover" />

        {/* Info: (202501218 - Julian) Token & Industry */}
        <div className="absolute bottom-0 left-0 w-full px-spacing-lv-4 py-spacing-lv-3">
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-spacing-lv-0 text-text-neutral-primary">
              <p className="text-2xl font-bold">$ {tokenPrice}</p>
              <p className="text-xs font-normal">/{tokenName}</p>
            </div>
            <div className="rounded-radius-rounded bg-badge-brand-secondary px-spacing-lv-2 py-spacing-lv-0 text-xs font-bold text-badge-brand-on-secondary">
              {industry}
            </div>
          </div>
        </div>
      </div>

      {/* Info: (202501218 - Julian) Content */}
      <div className="flex flex-col">
        {/* Info: (202501218 - Julian) Company Name and Title */}
        <div className="flex flex-col gap-spacing-lv-0 px-spacing-lv-6 py-spacing-lv-3">
          <p className="text-xs font-normal text-text-neutral-tertiary">{companyName}</p>
          <p className="font-bold text-text-neutral-primary">{title}</p>
        </div>
        {/* Info: (202501218 - Julian) Funding Progress */}
        <ProgressBar
          percentage={progressPercentage}
          color={ProgressBarColor.GRADIENT}
          size={ProgressBarSize.BASE}
          minText={raisedFundingText}
          maxText={goalFundingText}
        />
        {/* Info: (202501218 - Julian) Funding Stats */}
        <div className="grid grid-cols-3 px-spacing-lv-4 pb-spacing-lv-4 pt-spacing-lv-2">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-text-neutral-primary">{leftStatData.value}</p>
            <p className="text-xs font-normal text-text-neutral-tertiary">{leftStatData.label}</p>
          </div>
          <div className="flex flex-col items-center border-x border-border-neutral-strong">
            <p className="text-lg font-bold text-text-neutral-primary">{centerStatData.value}</p>
            <p className="text-xs font-normal text-text-neutral-tertiary">{centerStatData.label}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-text-neutral-primary">{rightStatData.value}</p>
            <p className="text-xs font-normal text-text-neutral-tertiary">{rightStatData.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTicket;
