'use client';

import React from 'react';
import Image from 'next/image';
import { FiLock } from 'react-icons/fi';
import { IFundingItemUI } from '@/interfaces/funding';
import { numberWithCommas } from '@/lib/utils/common';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';
import { FundingStatus } from '@/constants/funding';

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
    fundingStatus,
    raisedFundingAmount,
    goalFundingAmount,
    committedFundAmount,
    committedTokensCount,
    investorsCount,
    isCommitted,
    isLocked,
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

  // Info: (202501218 - Julian) 根據是否鎖定，調整文字樣式
  const statValueStyle = `${isLocked ? 'text-text-state-mute' : 'text-text-neutral-primary'} text-lg font-bold`;
  const statLabelStyle = `${isLocked ? 'text-text-state-mute' : 'text-text-neutral-tertiary'} text-xs font-normal`;

  const displayedBudge = (
    <div
      className={`${
        isLocked
          ? 'bg-badge-neutral-light text-badge-neutral-on-light'
          : 'bg-badge-brand-secondary text-badge-brand-on-secondary'
      } rounded-radius-rounded px-spacing-lv-2 py-spacing-lv-0 text-xs font-bold`}
    >
      {industry}
    </div>
  );

  const displayedCoverOverlay = (
    <div
      className={` ${
        isLocked ? 'bg-opacity-neutral-dark-80' : 'bg-transparent'
      } absolute bottom-0 left-0 flex size-full flex-col justify-end px-spacing-lv-4 py-spacing-lv-3`}
    >
      {isLocked && (
        <div className="ml-auto text-icon-neutral-primary">
          <FiLock size={24} />
        </div>
      )}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div
            className={`${isLocked ? 'text-text-state-mute' : 'text-text-neutral-primary'} flex items-end gap-spacing-lv-0`}
          >
            <p className="text-2xl font-bold">$ {tokenPrice}</p>
            <p className="text-xs font-normal">/{tokenName}</p>
          </div>
          {displayedBudge}
        </div>
      </div>
    </div>
  );

  // Info: (202501219 - Julian) 募資進行中： 顯示進度條與「Token 價值」、「投資人數」、「剩餘天數」三個統計數據
  const onGoingContent = (
    <>
      {/* Info: (202501218 - Julian) Funding Progress */}
      <ProgressBar
        percentage={progressPercentage}
        color={ProgressBarColor.GRADIENT}
        size={ProgressBarSize.BASE}
        minText={raisedFundingText}
        maxText={goalFundingText}
        disabled={isLocked}
      />
      {/* Info: (202501218 - Julian) Funding Stats */}
      <div className="grid grid-cols-3 px-spacing-lv-4 pb-spacing-lv-4 pt-spacing-lv-2">
        <div className="flex flex-col items-center">
          <p className={statValueStyle}>{leftStatData.value}</p>
          <p className={statLabelStyle}>{leftStatData.label}</p>
        </div>
        <div className="flex flex-col items-center border-x border-border-neutral-strong">
          <p className={statValueStyle}>{centerStatData.value}</p>
          <p className={statLabelStyle}>{centerStatData.label}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className={statValueStyle}>{rightStatData.value}</p>
          <p className={statLabelStyle}>{rightStatData.label}</p>
        </div>
      </div>
    </>
  );

  const upcomingContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col"></div>
      </div>
    </>
  );

  const closedContent = <></>;

  const displayedContent =
    fundingStatus === FundingStatus.ON_GOING
      ? onGoingContent
      : fundingStatus === FundingStatus.UPCOMING
        ? upcomingContent
        : closedContent;

  return (
    <div className="relative">
      {/* Info: (202501219 - Julian) Committed Mark */}
      {isCommitted && (
        <div className="absolute -top-2 right-spacing-lv-4 z-10">
          <Image src="/icons/committed_mark.svg" width={36} height={40} alt="committed mark" />
        </div>
      )}
      <div className="flex flex-col overflow-hidden rounded-radius-l bg-surface-neutral-container-lv2">
        {/* Info: (202501218 - Julian) Cover Image */}
        <div className="relative h-180px w-full shrink-0">
          <Image src={coverImageId} alt="Funding Cover" fill objectFit="cover" />

          {/* Info: (202501218 - Julian) Token & Industry */}
          {displayedCoverOverlay}
        </div>

        <div className="flex flex-col">
          {/* Info: (202501218 - Julian) Company Name and Title */}
          <div className="flex flex-col gap-spacing-lv-0 px-spacing-lv-6 py-spacing-lv-3">
            <p className="text-xs font-normal text-text-neutral-tertiary">{companyName}</p>
            <p
              className={`${isLocked ? 'text-text-state-mute' : 'text-text-neutral-primary'} font-bold`}
            >
              {title}
            </p>
          </div>
          {/* Info: (202501219 - Julian) Content */}
          {displayedContent}
        </div>
      </div>
    </div>
  );
};

export default FundingTicket;
