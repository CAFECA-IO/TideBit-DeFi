import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTH_SHORT_NAME } from '@/constants/display';

// Info: (20251218 - Julian) 合併和處理 Tailwind CSS 類名的工具
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Info: (20251218 - Julian) 給數值加上千分位逗號的格式化工具
export const numberWithCommas = (number: number | string) => {
  if (number === null || number === undefined || number === '') {
    return '-';
  }
  const num = typeof number === 'string' ? parseFloat(number) : number;

  // Info: (20251223 - Julian) 將整數部分和小數部分分離
  const numStr = num.toString().split('.');
  const integerStr = numStr[0];
  const decimalStr = numStr.length > 1 ? `.${numStr[1]}` : '';

  // Info: (20251223 - Julian) 格式化整數：每三位數加一個逗號；小數部分保持不變
  const formattedIntegerPart = integerStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Info: (20251223 - Julian) 組合整數部分和小數部分
  const formattedNumber = `${formattedIntegerPart}${decimalStr}`;

  return num < 0 ? `(${formattedNumber})` : formattedNumber;
};

// Info: (20251219 - Julian) 將大數字轉換為帶單位的字串表示（K, M, B）
export const bigNumberToString = (number: number | string) => {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  const absNum = Math.abs(num); // Info: (20260109 - Julian) 取絕對值進行比較

  if (absNum >= 1_000_000_000) {
    // Info: (20260109 - Julian) 處理十億
    const billion = Math.floor(num / 1_000_000_000);
    return numberWithCommas(billion) + ' B';
  } else if (absNum >= 1_000_000) {
    // Info: (20260109 - Julian) 處理百萬
    const million = Math.floor(num / 1_000_000);
    return numberWithCommas(million) + ' M';
  } else if (absNum >= 1_000) {
    // Info: (20260109 - Julian) 處理千
    const thousand = Math.floor(num / 1_000);
    return numberWithCommas(thousand) + ' K';
  } else {
    return numberWithCommas(num);
  }
};

// Info: (20251219 - Julian) 將時間戳轉換為日期/時間字串的工具
export const timestampToString = (timestamp: number | undefined) => {
  if (timestamp === 0 || timestamp === undefined || timestamp === null) {
    return {
      dateString: '-',
      dateWithSlash: '-',
      dateWithDash: '-',
    };
  }

  const dateObj = new Date(timestamp * 1000);

  // Info: (20251219 - Julian) 取出年份
  const year = dateObj.getFullYear();

  // Info: (20251219 - Julian) 取出月份
  const month = dateObj.getMonth() + 1;
  const monthWithPad = month.toString().padStart(2, '0'); // Info: (20251219 - Julian) 二位數月份
  const monthShortName = MONTH_SHORT_NAME[month - 1]; // Info: (20251219 - Julian) 月份縮寫

  // Info: (20251219 - Julian) 取出日期
  const day = dateObj.getDate();
  const dayWithPad = day.toString().padStart(2, '0'); // Info: (20251219 - Julian) 二位數日期

  // Info: (20251219 - Julian) Formatting
  const dateString = `${monthShortName} ${day}, ${year}`;
  const dateWithSlash = `${year}/${monthWithPad}/${dayWithPad}`;
  const dateWithDash = `${year}-${monthWithPad}-${dayWithPad}`;

  return {
    dateString, // e.g., "Jan 01, 2026"
    dateWithSlash, // e.g., "2026/01/01"
    dateWithDash, // e.g., "2026-01-01"
  };
};

// Info: (20251230 - Julian) 取得 CSS 變數顏色
export function getCssVariable(variableName: string): string {
  const computedStyle = getComputedStyle(document.documentElement);
  const property = computedStyle.getPropertyValue(variableName);
  const value = property || variableName;

  return value.trim();
}
