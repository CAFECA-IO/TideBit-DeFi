import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
