'use client';

import React, { useState } from 'react';

interface ISliderProps {
  options: number[];
  selectOption: (value: number) => void;
  label?: string;
}

const Slider: React.FC<ISliderProps> = ({ options, selectOption, label }) => {
  const [activeValue, setActiveValue] = useState<number>(options[0]);

  const minIndex = 0; // Info: (20251222 - Julian) 最小索引值
  const maxIndex = options.length - 1; // Info: (20251222 - Julian) 最大索引值

  // Info: (20251222 - Julian) 計算進度條寬度百分比
  const activeIndex = options.indexOf(activeValue);
  const widthPercentage = (activeIndex / maxIndex) * 100;

  // Info: (20251222 - Julian) 產生節點
  const nodes = options.map((value, index) => {
    const isActive = value <= activeValue;
    // Info: (20251222 - Julian) 顯示 < 或 >
    const symbol = index === minIndex ? '<' : index === maxIndex ? '>' : '';

    const clickHandler = () => {
      setActiveValue(value);
      selectOption(value);
    };

    return (
      <button
        key={value}
        type="button"
        onClick={clickHandler}
        className="group relative z-10 flex flex-col items-center gap-spacing-lv-0"
      >
        <div
          className={`${isActive ? 'bg-slider-surface-active' : 'bg-slider-surface-base'} size-15px rounded-full border border-transparent group-hover:border-slider-surface-control group-hover:bg-slider-surface-active`}
        ></div>
        <p className="absolute top-5">
          {symbol}
          {value}
        </p>
      </button>
    );
  });

  const line = (
    <div className="absolute left-0 top-6px h-3px w-full overflow-hidden rounded-full bg-slider-surface-base">
      <div
        style={{ width: `${widthPercentage}%` }}
        className="absolute left-0 top-0 h-full rounded-full bg-slider-surface-active transition-all duration-150 ease-in-out"
      ></div>
    </div>
  );

  const displayedLabel = label && (
    <p className="text-sm font-medium text-text-neutral-tertiary">{label}:</p>
  );

  return (
    <div className="flex items-start gap-spacing-lv-3">
      {/* Info: (20251222 - Julian) Label */}
      {displayedLabel}
      {/* Info: (20251222 - Julian) Slider */}
      <div className="relative flex w-500px items-start justify-between text-sm font-semibold text-slider-text-primary">
        {line}
        {nodes}
      </div>
    </div>
  );
};

export default Slider;
