'use client';

import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { numberWithCommas } from '@/lib/utils/common';
import { KEYBOARD_EVENT_CODE } from '@/constants/keyboard_event_code';

interface INumericInputProps {
  saveNumberValue: (value: number) => void;
  plusValue?: number;
  minusValue?: number;
}

const NumericInput: React.FC<INumericInputProps> = ({
  saveNumberValue,
  plusValue = 1,
  minusValue = 1,
}) => {
  // Info: (20251223 - Julian) 移除非數字、非小數點、非負號的正規表達式
  const removeRegex = /[^0-9.-]/g;

  // Info: (20251223 - Julian) 顯示用的值(string)
  const [displayedValue, setDisplayedValue] = useState<string>(numberWithCommas(0));

  const saveNumber = (str: string) => {
    // Info: (20251223 - Julian) 移除格式並轉為數字
    const num = parseFloat(str.replace(removeRegex, ''));
    saveNumberValue(isNaN(num) ? 0 : num);
  };

  // Info: (20251223 - Julian) 處理輸入變更
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

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
    }

    // Info: (20251223 - Julian) 格式化數值顯示
    const formattedValue = numberWithCommas(sanitizedValue);
    const newValue = formattedValue === '-' ? '0' : formattedValue;

    // Info: (20251223 - Julian) 更新狀態
    setDisplayedValue(newValue);
  };

  // Info: (20250306 - Julian) 處理在中文輸入法下，填入數字的情況
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Info: (20250603 - Anna)  忽略 Ctrl/Cmd + V（貼上）
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
      return;
    }

    // Info: (20250313 - Julian) 執行預設行為: Tab, Backspace, Delete, ArrowLeft, ArrowRight
    if (
      event.code === KEYBOARD_EVENT_CODE.TAB ||
      event.code === KEYBOARD_EVENT_CODE.BACKSPACE ||
      event.code === KEYBOARD_EVENT_CODE.DELETE ||
      event.code === KEYBOARD_EVENT_CODE.ARROW_LEFT ||
      event.code === KEYBOARD_EVENT_CODE.ARROW_RIGHT
    ) {
      return;
    }

    // Info: (20250306 - Julian) 阻止預設事件
    event.preventDefault();

    let temp = displayedValue; // Info: (20250306 - Julian) 取得目前顯示值
    let code = ''; // Info: (20250306 - Julian) 按鍵 code

    const input = event.currentTarget; // Info: (20250306 - Julian) 取得 input 元件
    const cursorPos = input.selectionStart ?? displayedValue.length; // Info: (20250306 - Julian) 取得當前游標位置

    // Info: (20250321 - Julian) 數字鍵正規表達式：digit0 ~ digit9, numpad0 ~ numpad9
    const regex = /^(Digit|Numpad)[0-9]$/;

    // Info: (20250306 - Julian) 如果按下的是數字鍵
    if (regex.test(event.code)) {
      code = event.code.replace(/\D/g, ''); // Info: (20250321 - Julian) 取得數字 (去掉前面的字符)
      // Info: (20250319 - Anna) 允許輸入小數點，但只能輸入一次
    } else if (
      (event.key === '.' || event.code === KEYBOARD_EVENT_CODE.PERIOD) &&
      displayedValue.includes('.')
    ) {
      code = '.';
    }

    // Info: (20250306 - Julian) 插入數字
    if (code) {
      temp = temp.slice(0, cursorPos) + code + temp.slice(cursorPos);

      // Info: (20250306 - Julian) 變更顯示值
      handleChange({ target: { value: temp } } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  // Info: (20251223 - Julian) 禁止滾輪改變數值
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  // Info: (20251223 - Julian) 當 input 失去焦點時，儲存數值，若為空則設為 0
  const handleBlur = () => {
    if (!displayedValue) {
      setDisplayedValue('0');
    }
    saveNumber(displayedValue);
  };

  // Info: (20251223 - Julian) 當 input focus 時，如果值為 0，則清空
  const handleFocus = () => {
    if (displayedValue === '0') {
      setDisplayedValue('');
    }
  };

  // Info: (20251223 - Julian) 減號按鈕處理：將目前值減去 minusValue，更新顯示並儲存
  const handleMinus = () => {
    const newValue = parseFloat(displayedValue.replace(removeRegex, '')) - minusValue;
    const formattedValue = numberWithCommas(newValue.toString());
    setDisplayedValue(formattedValue);
    saveNumberValue(newValue);
  };

  // Info: (20251223 - Julian) 加號按鈕處理：將目前值加上 plusValue，更新顯示並儲存
  const handlePlus = () => {
    const newValue = parseFloat(displayedValue.replace(removeRegex, '')) + plusValue;
    const formattedValue = numberWithCommas(newValue.toString());
    setDisplayedValue(formattedValue);
    saveNumberValue(newValue);
  };

  return (
    <div className="flex">
      <button
        type="button"
        onClick={handleMinus}
        className="rounded-l-radius-s bg-button-neutral-filled-neutral-default p-spacing-lv-2 text-button-neutral-filled-on-neutral-default"
      >
        <FaMinus size={24} />
      </button>
      <div className="border-x border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-3">
        <input
          type="text"
          value={displayedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="h-full flex-1 bg-transparent text-center text-sm font-medium text-text-field-text-active outline-none"
        />
      </div>
      <button
        type="button"
        onClick={handlePlus}
        className="rounded-r-radius-s bg-button-neutral-filled-neutral-default p-spacing-lv-2 text-button-neutral-filled-on-neutral-default"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default NumericInput;
