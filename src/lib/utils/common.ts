import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTH_SHORT_NAME } from '@/constants/display';

// Info: (20251218 - Julian) 合併和處理 Tailwind CSS 類名的工具
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Info: (20251218 - Julian) 給數值加上千分位逗號的格式化工具
export const numberWithCommas = (number: number | string) => {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  const formattedNumber = new Intl.NumberFormat().format(Math.abs(num));
  return num < 0 ? `(${formattedNumber})` : formattedNumber;
};

// Info: (20251219 - Julian) 將大數字轉換為帶單位的字串表示（K, M, B）
export const bigNumberToString = (number: number | string) => {
  const num = typeof number === 'string' ? parseFloat(number) : number;

  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(0) + ' B';
  } else if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(0) + ' M';
  } else if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(0) + ' K';
  } else {
    return num.toString();
  }
};

// Info: (20251219 - Julian) 將時間戳轉換為日期/時間字串的工具
export const timestampToString = (timestamp: number | undefined) => {
  if (timestamp === 0 || timestamp === undefined || timestamp === null) {
    return {
      dateString: '-',
      dateWithSlash: '-',
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

  return {
    dateString,
    dateWithSlash,
  };
};
