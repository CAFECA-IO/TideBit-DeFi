'use client';

import React, { useState, useEffect } from 'react';

interface INumberContainerProps {
  value: number;
  maxValue?: number;
  minValue?: number;
}

interface ISingleNumberContainerProps {
  number: number;
}

const SingleNumberContainer: React.FC<ISingleNumberContainerProps> = ({ number }) => {
  const [currentNumber, setCurrentNumber] = useState<number>(number);
  const [prevNumber, setPrevNumber] = useState<number | null>(number);

  const containerStyle =
    'relative flex w-60px flex-col items-center justify-center overflow-hidden rounded-radius-s border border-border-neutral-default bg-surface-neutral-container-lv2 px-8px py-16px text-6xl font-extrabold text-text-brand-primary';

  useEffect(() => {
    if (number !== currentNumber) {
      setTimeout(() => {
        // Info: (20251229 - Julian) 保存舊數字
        setPrevNumber(currentNumber);
        // Info: (20251229 - Julian) 更新數字
        setCurrentNumber(number);
      }, 0);
    }
  }, [number, currentNumber]);

  const displayPrevNumber = prevNumber !== null && (
    <span
      key={`prev-${prevNumber}`}
      className="absolute animate-flip-out transition-all duration-300 ease-out"
    >
      {prevNumber}
    </span>
  );

  return (
    <div className={containerStyle}>
      {displayPrevNumber}
      <span
        key={`current-${currentNumber}`}
        className="animate-flip-in transition-all duration-300 ease-out"
      >
        {currentNumber}
      </span>
    </div>
  );
};

const NumberContainer: React.FC<INumberContainerProps> = ({
  value,
  maxValue = 99,
  minValue = 0,
}) => {
  // Info: (20251229 - Julian) 限制數值範圍，並轉換為兩位數字的字串
  const availableValue = Math.max(minValue, Math.min(maxValue, value));
  const strValue = availableValue.toString().padStart(2, '0');
  const digits = strValue.split('');

  // Info: (20251229 - Julian) 取得十位數
  const tens = parseInt(digits[0], 10);
  // Info: (20251229 - Julian) 取得個位數
  const units = parseInt(digits[1], 10);

  return (
    <div className="grid grid-cols-2 gap-spacing-lv-0 font-[Manrope]">
      {/* Info: (20251229 - Julian) 十位數 */}
      <SingleNumberContainer number={tens} />
      {/* Info: (20251229 - Julian) 個位數 */}
      <SingleNumberContainer number={units} />
    </div>
  );
};

export default NumberContainer;
