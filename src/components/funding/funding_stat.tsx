import React from 'react';
import { IFundingItemUI } from '@/interfaces/funding';
import { numberWithCommas, bigNumberToString } from '@/lib/utils/common';
import { FundingResult } from '@/constants/funding';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';

interface IFundingStatProps {
  data: IFundingItemUI;
}

// Info: (202501224 - Julian) 募資進行中：顯示進度條與「售出/釋出 Token 數量」、「投資人數」、「剩餘天數」三個統計數據
const FundingStat: React.FC<IFundingStatProps> = ({ data }) => {
  const {
    raisedFundingAmount,
    goalFundingAmount,
    investorsCount,
    remainingDays,
    releasedTokensCount,
    soldTokensCount,
    fundingResult,
    isLocked,
  } = data;

  const isFailed = fundingResult === FundingResult.FAILED;

  // Info: (202501219 - Julian) 用於 Progress Bar
  const progressPercentage = (raisedFundingAmount / goalFundingAmount) * 100;
  const progressColor = isFailed
    ? ProgressBarColor.ERROR
    : isLocked
      ? ProgressBarColor.DISABLED
      : ProgressBarColor.GRADIENT;
  const raisedFundingText = `NT$ ${numberWithCommas(raisedFundingAmount)}`;
  const goalFundingText = `NT$ ${numberWithCommas(goalFundingAmount)}`;

  // Info: (202501218 - Julian) 根據是否鎖定，調整文字樣式
  const statValueStyle = `${
    isLocked && !isFailed ? 'text-text-state-mute' : 'text-text-neutral-primary'
  } text-lg font-bold`;
  const statLabelStyle = `${isLocked && !isFailed ? 'text-text-state-mute' : 'text-text-neutral-tertiary'} text-xs font-normal`;

  return (
    <>
      {/* Info: (202501218 - Julian) Funding Progress */}
      <ProgressBar
        percentage={progressPercentage}
        color={progressColor}
        size={ProgressBarSize.BASE}
        minText={raisedFundingText}
        maxText={goalFundingText}
      />
      {/* Info: (202501218 - Julian) Funding Stats */}
      <div className="grid grid-cols-3 px-spacing-lv-4 pb-spacing-lv-4 pt-spacing-lv-2">
        <div className="flex flex-col items-center">
          <p className={statValueStyle}>{bigNumberToString(soldTokensCount)}</p>
          <p className={statLabelStyle}>Tokens / {bigNumberToString(releasedTokensCount)}</p>
        </div>
        <div className="flex flex-col items-center border-x border-border-neutral-strong">
          <p className={statValueStyle}>{numberWithCommas(investorsCount)}</p>
          <p className={statLabelStyle}>Investors</p>
        </div>
        <div className="flex flex-col items-center">
          <p className={statValueStyle}>{numberWithCommas(remainingDays)}</p>
          <p className={statLabelStyle}>Days</p>
        </div>
      </div>
    </>
  );
};

export default FundingStat;
