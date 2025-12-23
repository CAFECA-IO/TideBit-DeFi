'use client';

import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { numberWithCommas } from '@/lib/utils/common';
import { useNumericKeyInput } from '@/lib/hooks/use_numeric_key_input';

const NumericInput: React.FC = () => {
  // Info: (20251223 - Julian) 儲存的數值(number)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputValue, setInputValue] = useState<number>(0);
  // Info: (20251223 - Julian) 顯示用的值(string)
  const [displayedValue, setDisplayedValue] = useState<string>(numberWithCommas(0));

  // Info: (20251223 - Julian) 處理輸入變更
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (value: string) => {
    // Info: (20251223 - Julian) 整理輸入的值
    const sanitizedValue =
      value
        .toString()
        .replace(/^0[^.](\d)/, '$1') // Info: (20251223 - Julian) 避免 01，但允許 0.1
        .replace(/[^0-9.]/g, '') // Info: (20251223 - Julian) 移除非數字和小數點字符
        .replace(/(\..*)\./g, '$1') || '0'; // Info: (20251223 - Julian) 只允許一個小數點

    // // Info: (20251223 - Julian) 允許輸入 `.`，但顯示 `0.`
    if (sanitizedValue === '.') {
      setDisplayedValue('0.');
      return;
    } else if (sanitizedValue === '0') {
      setDisplayedValue('');
      return;
    }

    // Info: (20251223 - Julian) 格式化數值顯示
    const newValue = numberWithCommas(sanitizedValue);

    // Info: (20251223 - Julian) 更新狀態
    setDisplayedValue(newValue === '-' ? '0' : newValue);
  };

  // Info: (20251223 - Julian) 處理鍵盤輸入
  const { onKeyDown } = useNumericKeyInput({
    value: displayedValue,
    onChange: setDisplayedValue,
  });

  // Info: (20251223 - Julian) 禁止滾輪改變數值
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  // Info: (20251223 - Julian) 離開輸入框後，再處理數值更新
  const handleBlur = () => {
    const num = parseFloat(displayedValue.replace(/,/g, ''));
    setInputValue(num);
  };

  return (
    <div className="flex">
      <button
        type="button"
        className="rounded-l-radius-s bg-button-neutral-filled-neutral-default p-spacing-lv-2 text-button-neutral-filled-on-neutral-default"
      >
        <FaMinus size={24} />
      </button>
      <div className="border-x border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-3">
        <input
          type="text"
          value={displayedValue}
          // onChange={handleInputChange}
          onKeyDown={onKeyDown}
          onWheel={handleWheel}
          onBlur={handleBlur}
          className="h-full flex-1 bg-transparent text-center text-sm font-medium text-text-field-text-active outline-none"
        />
      </div>
      <button
        type="button"
        className="rounded-r-radius-s bg-button-neutral-filled-neutral-default p-spacing-lv-2 text-button-neutral-filled-on-neutral-default"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default NumericInput;
