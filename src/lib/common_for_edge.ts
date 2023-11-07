import {Code} from '../constants/code';
import {FRACTION_DIGITS, MONTH_FULL_NAME_LIST, MONTH_SHORT_NAME_LIST} from '../constants/config';
import {ICurrency} from '../constants/currency';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../constants/display';
import {
  IRoundConditionConstant,
  RoundCondition,
} from '../interfaces/tidebit_defi_background/round_condition';
import {CustomError} from './custom_error';
import SafeMath from './safe_math';

export const roundToDecimalPlaces = (
  number: number,
  decimal: number,
  condition?: IRoundConditionConstant
): number => {
  const factor = Math.pow(10, decimal);

  if (SafeMath.eq(number, 0)) {
    return Number(`0.${'0'.repeat(decimal)}`);
  }

  let roundedNumber = 0;

  if (condition === RoundCondition.SHRINK) {
    if (SafeMath.lt(number, 0)) {
      roundedNumber = (Math.ceil((Math.abs(number) + Number.EPSILON) * factor) / factor) * -1;
    } else if (SafeMath.gt(number, 0)) {
      roundedNumber = Math.floor(number * factor) / factor;
    }
  } else if (condition === RoundCondition.ENLARGE || !condition) {
    roundedNumber = Math.ceil((number + Number.EPSILON) * factor) / factor;
  }

  if (roundedNumber === -0) {
    return 0;
  }

  return roundedNumber;
};

export const numberFormatted = (n: number | string | undefined, dash = false, sign = false) => {
  const zero = dash ? '-' : '0';
  if (!n) return zero;
  const signStr = SafeMath.gt(+n, 0) ? '' : '-';
  const number = Math.abs(+n);

  const result =
    !n || n === '0' || !SafeMath.isNumber(number)
      ? zero
      : sign
      ? signStr +
        Math.abs(roundToDecimalPlaces(+n, 2, RoundCondition.SHRINK)).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE,
          FRACTION_DIGITS
        )
      : Math.abs(roundToDecimalPlaces(+n, 2, RoundCondition.SHRINK)).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE,
          FRACTION_DIGITS
        );

  return result;
};

export const timestampToString = (timestamp: number, timezoneOffset?: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      time: '-',
      month: '-',
      abbreviatedMonth: '-',
      monthName: '-',
      monthAndYear: '-',
      day: '-',
      abbreviatedTime: '-',
      year: '-',
    };

  if (timezoneOffset !== undefined) {
    const offsetTimestamp = timestamp + timezoneOffset * 60;
    const date = new Date(offsetTimestamp * 1000);

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minute = date.getUTCMinutes().toString().padStart(2, '0');
    const second = date.getUTCSeconds().toString().padStart(2, '0');

    const monthIndex = date.getUTCMonth();

    const monthName = MONTH_SHORT_NAME_LIST[monthIndex];
    const monthFullName = MONTH_FULL_NAME_LIST[monthIndex];

    const dateString = `${year}-${month}-${day}`;
    const timeString = `${hour}:${minute}:${second}`;

    return {
      date: dateString,
      time: timeString,
      month: month,
      abbreviatedMonth: monthName,
      monthName: monthFullName,
      monthAndYear: `${monthFullName} ${year}`,
      day: day,
      abbreviatedTime: `${hour}:${minute}`,
      year: year,
    };
  } else {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    const monthIndex = date.getMonth();

    const monthName = MONTH_SHORT_NAME_LIST[monthIndex];
    const monthFullName = MONTH_FULL_NAME_LIST[monthIndex];

    const dateString = `${year}-${month}-${day}`;
    const timeString = `${hour}:${minute}:${second}`;

    return {
      date: dateString,
      time: timeString,
      month: month,
      abbreviatedMonth: monthName,
      monthName: monthFullName,
      monthAndYear: `${monthFullName} ${year}`,
      day: day,
      abbreviatedTime: `${hour}:${minute}`,
      year: year,
    };
  }
};

export const adjustTimestamp = (
  serverTzOffset: number,
  timestamp: number,
  timezoneOffset: number
) => {
  const ts = serverTzOffset * 60 * 60 + timestamp + timezoneOffset * 60 * 60;

  return ts;
};

export const accountTruncate = (text: string, limitLength: number) => {
  const result =
    text?.length >= limitLength
      ? text?.substring(0, 6) + '...' + text?.substring(text.length - 5)
      : text;
  return result;
};

export function getChainNameByCurrency(
  currency: ICurrency,
  tradingData: {
    instId: string;
    currency: ICurrency;
    name: string;
    star: boolean;
    starred: boolean;
    tokenImg: string;
    tradingVolume: string;
  }[]
) {
  const foundCurrency = tradingData.find(item => item.currency === currency);

  if (foundCurrency && !!foundCurrency.name) {
    return foundCurrency.name;
  } else {
    throw new CustomError(Code.CANNOT_FIND_CHAIN_BY_CURRENCY);
  }
}

export const getTimestamp = () => Math.ceil(Date.now() / 1000);

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
