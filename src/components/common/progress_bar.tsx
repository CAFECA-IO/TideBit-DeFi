'use client';

import React from 'react';

export enum ProgressBarColor {
  PRIMARY = 'primary',
  GRADIENT = 'gradient',
  ERROR = 'error',
  SUCCESS = 'success',
  DISABLED = 'disabled',
}

export enum ProgressBarSize {
  BASE = 'base',
  SM = 'sm',
  XS = 'xs',
}

interface IProgressBarProps {
  percentage: number;
  color: ProgressBarColor;
  size: ProgressBarSize;
  maxText?: string;
  minText?: string;
  className?: string;
}

const ProgressBar: React.FC<IProgressBarProps> = ({
  percentage,
  color,
  size,
  maxText = '',
  minText = '',
  className = '',
}) => {
  // Info: (202501218 - Julian) 進度條顏色
  const barColor =
    color === ProgressBarColor.PRIMARY
      ? 'bg-loading-indicator-surface-primary'
      : color === ProgressBarColor.GRADIENT
        ? 'bg-gradient-to-r from-loading-indicator-surface-gradient-0 to-loading-indicator-surface-gradient-100'
        : color === ProgressBarColor.ERROR
          ? 'bg-loading-indicator-surface-error'
          : 'bg-loading-indicator-surface-success';
  // Info: (202501218 - Julian) 停用狀態下的進度條顏色
  const isShowBarColor = color === ProgressBarColor.DISABLED ? 'bg-surface-state-mute' : barColor;

  // Info: (202501218 - Julian) 進度條高度
  const barSize =
    size === ProgressBarSize.BASE ? 'h-16px' : size === ProgressBarSize.SM ? 'h-8px' : 'h-4px';

  // Info: (202501218 - Julian) 文字顏色
  const textColor =
    color === ProgressBarColor.ERROR
      ? 'text-loading-indicator-text-on-error'
      : color === ProgressBarColor.SUCCESS
        ? 'text-loading-indicator-text-on-success'
        : 'text-loading-indicator-text-on-primary'; // Info: (202501218 - Julian) primary 和 gradient 使用相同的文字顏色
  // Info: (202501218 - Julian) 停用狀態下的文字顏色
  const isShowTextColor =
    color === ProgressBarColor.DISABLED ? 'text-loading-indicator-text-on-primary' : textColor;

  // Info: (202501218 - Julian) BASE 才顯示百分比
  const textSize = size === ProgressBarSize.BASE ? 'block' : 'hidden';

  // Info: (202501218 - Julian) 限制 percentage 在 0 到 100 之間，並取整數
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100).toFixed(0);

  return (
    <div className={`${className} flex flex-col gap-spacing-lv-0 px-spacing-lv-6 py-spacing-lv-2`}>
      <div className="flex items-center justify-between font-semibold text-loading-indicator-text-primary">
        <p>{minText}</p>
        <p>{maxText}</p>
      </div>
      <div
        className={`${barSize} relative my-spacing-lv-0 w-full overflow-hidden rounded-radius-rounded bg-loading-indicator-surface-base`}
      >
        <div
          style={{ width: `${clampedPercentage}%` }}
          className={`${isShowBarColor} absolute left-0 h-full rounded-radius-rounded`}
        >
          <p className={`${isShowTextColor} ${textSize} text-center text-xs font-extrabold`}>
            {clampedPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
