'use client';

import React, { useState, useEffect } from 'react';
import { timestampToString } from '@/lib/utils/common';

interface INumberContainerProps {
  value: number;
  maxValue?: number;
  minValue?: number;
}

interface ICountdownProps {
  targetTimestamp: number;
  label?: string;
}

// Info: (20251229 - Julian) constants setting
const SECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const SECONDS_IN_AN_HOUR = 1000 * 60 * 60;
const SECONDS_IN_A_MINUTE = 1000 * 60;
const MAX_TIME_VALUE = 59;

const NumberContainer: React.FC<INumberContainerProps> = ({
  value,
  maxValue = 99,
  minValue = 0,
}) => {
  const containerStyle =
    'relative flex w-60px flex-col items-center justify-center overflow-hidden rounded-radius-s border border-border-neutral-default bg-surface-neutral-container-lv2 px-8px py-16px text-6xl font-extrabold text-text-brand-primary';

  // Info: (20251229 - Julian) 限制數值範圍，並轉換為兩位數字的字串
  const availableValue = Math.max(minValue, Math.min(maxValue, value));
  const twoDigitValue = availableValue.toString().padStart(2, '0');
  const digits = twoDigitValue.split('');

  return (
    <div className="grid grid-cols-2 gap-spacing-lv-0 font-[Manrope]">
      <div className={containerStyle}>
        <span className="transition-all duration-300 ease-out">{digits[0]}</span>
      </div>
      <div className={containerStyle}>
        <span className="transition-all duration-300 ease-out">{digits[1]}</span>
      </div>
    </div>
  );
};

function getTimeLeft(targetTimestamp: number) {
  // Info: (20251229 - Julian) 取得目前時間的 Unix Timestamp（秒）
  const now = Math.floor(Date.now() / 1000);
  // Info: (20251229 - Julian) 計算剩餘秒數(不小於 0)
  const diff = Math.max(targetTimestamp - now, 0);

  // Info: (20251229 - Julian) 將剩餘秒數轉換為天、時、分
  const days = Math.floor(diff / SECONDS_IN_A_DAY);
  const hours = Math.floor((diff % SECONDS_IN_A_DAY) / SECONDS_IN_AN_HOUR);
  const minutes = Math.floor((diff % SECONDS_IN_AN_HOUR) / SECONDS_IN_A_MINUTE);

  return { days, hours, minutes };
}

const Countdown: React.FC<ICountdownProps> = ({ targetTimestamp, label }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetTimestamp));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetTimestamp));
    }, 60_000); // Info: (20251229 - Julian) 每分鐘更新一次

    return () => clearInterval(id);
  }, [targetTimestamp]);

  const displayLabel = label && (
    <p className="text-lg font-semibold text-text-neutral-primary">{label}</p>
  );

  return (
    <div className="gap-24px flex flex-col items-center justify-center">
      {/* Info: (20251229 - Julian) Label */}
      {displayLabel}
      <div className="gap-24px grid grid-cols-3">
        <div className="flex flex-col items-center gap-spacing-lv-2 uppercase">
          <NumberContainer value={timeLeft.days} />
          <p className="font-semibold text-text-neutral-secondary">days</p>
        </div>
        <div className="flex flex-col items-center gap-spacing-lv-2 uppercase">
          <NumberContainer value={timeLeft.hours} maxValue={MAX_TIME_VALUE} />
          <p className="font-semibold text-text-neutral-secondary">hr</p>
        </div>
        <div className="flex flex-col items-center gap-spacing-lv-2 uppercase">
          <NumberContainer value={timeLeft.minutes} maxValue={MAX_TIME_VALUE} />
          <p className="font-semibold text-text-neutral-secondary">min</p>
        </div>
      </div>
      <p className="text-base font-semibold text-text-neutral-tertiary">
        {timestampToString(targetTimestamp).dateWithSlash}
      </p>
    </div>
  );
};

export default Countdown;
