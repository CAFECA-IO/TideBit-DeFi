'use client';

import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { numberWithCommas } from '@/lib/utils/common';
import { KEYBOARD_EVENT_CODE } from '@/constants/keyboard_event_code';

export enum NumericInputSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface INumericInputProps {
  saveNumberValue: (value: number) => void;
  defaultValue?: number; // Info: (20251223 - Julian) 預設值，若不提供則為 0
  plusValue?: number; // Info: (20251223 - Julian) 點擊加號時增加的值，預設為 1
  minusValue?: number; // Info: (20251223 - Julian) 點擊減號時減少的值，預設為 1
  maxValue?: number; // Info: (20251223 - Julian) 最大值限制，預設為 Infinity
  minValue?: number; // Info: (20251223 - Julian) 最小值限制，預設為 0
  size?: NumericInputSize; // Info: (20251224 - Julian) 輸入框大小
}

// ToDo: (20251224 - Julian) 未來可能有需要加入小數點的需求
const NumericInput: React.FC<INumericInputProps> = ({
  saveNumberValue,
  defaultValue = 0,
  plusValue = 1,
  minusValue = 1,
  maxValue = Infinity,
  minValue = 0,
  size = NumericInputSize.MEDIUM,
}) => {
  // Info: (20251223 - Julian) 移除非數字、非小數點、非負號的正規表達式
  const removeRegex = /[^0-9.-]/g;

  // Info: (20251223 - Julian) 顯示用的值(string)
  const [displayedValue, setDisplayedValue] = useState<string>(numberWithCommas(defaultValue));

  // Info: (20251224 - Julian) 按鈕樣式設定
  const btnSize = size === NumericInputSize.SMALL ? 20 : size === NumericInputSize.LARGE ? 36 : 24;
  const btnStyle = size === NumericInputSize.LARGE ? 'p-spacing-lv-4' : 'p-spacing-lv-2';
  // Info: (20251224 - Julian) 輸入框文字樣式設定
  const inputStyle =
    size === NumericInputSize.SMALL
      ? 'text-xs font-medium'
      : size === NumericInputSize.LARGE
        ? 'text-3xl font-semibold'
        : 'text-sm font-medium';

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
        .replace(/[^0-9]/g, '') // Info: (20251223 - Julian) 移除非數字
        .replace(/(\..*)\./g, '$1') || '0'; // Info: (20251223 - Julian) 只允許一個小數點

    // Info: (20251223 - Julian) 允許輸入 `.`，但顯示 `0.`
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
      // Info: (20250321 - Julian) 取得數字 (去掉前面的字符)
      code = event.code.replace(/\D/g, '');
    } else if (
      // Info: (20250319 - Anna) 允許輸入小數點，但只能輸入一次
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
    // Info: (20251223 - Julian) 取得純數字
    const pureNum = parseFloat(displayedValue.replace(removeRegex, ''));
    // Info: (20251223 - Julian) 計算新值
    const newValue = pureNum - minusValue;
    // Info: (20251223 - Julian) 檢查是否低於最小值
    const availableValue = newValue < minValue ? minValue : newValue;
    // Info: (20251223 - Julian) 格式化顯示值
    const formattedValue = numberWithCommas(availableValue.toString());

    setDisplayedValue(formattedValue);
    saveNumberValue(availableValue);
  };

  // Info: (20251223 - Julian) 加號按鈕處理：將目前值加上 plusValue，更新顯示並儲存
  const handlePlus = () => {
    // Info: (20251223 - Julian) 取得純數字
    const pureNum = parseFloat(displayedValue.replace(removeRegex, ''));
    // Info: (20251223 - Julian) 計算新值
    const newValue = pureNum + plusValue;
    // Info: (20251223 - Julian) 檢查是否超過最大值
    const availableValue = newValue > maxValue ? maxValue : newValue;
    // Info: (20251223 - Julian) 格式化顯示值
    const formattedValue = numberWithCommas(availableValue.toString());

    setDisplayedValue(formattedValue);
    saveNumberValue(availableValue);
  };

  return (
    <div className="flex w-full">
      <button
        type="button"
        onClick={handleMinus}
        className={`${btnStyle} rounded-l-radius-s bg-button-neutral-filled-neutral-default text-button-neutral-filled-on-neutral-default`}
      >
        <FaMinus size={btnSize} />
      </button>
      <div className="flex-1 border-x border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-3">
        <input
          type="text"
          value={displayedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${inputStyle} size-full bg-transparent text-center text-text-field-text-active outline-none`}
          aria-label="Numeric input"
        />
      </div>
      <button
        type="button"
        onClick={handlePlus}
        className={`${btnStyle} rounded-r-radius-s bg-button-neutral-filled-neutral-default p-spacing-lv-2 text-button-neutral-filled-on-neutral-default`}
      >
        <FaPlus size={btnSize} />
      </button>
    </div>
  );
};

export default NumericInput;
