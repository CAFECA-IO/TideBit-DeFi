/* eslint-disable no-console */
import {getTime, ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
import {ITBETrade} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion} from '../interfaces/tidebit_defi_background/time_span_union';

export const roundToDecimalPlaces = (val: number, precision: number): number => {
  const roundedNumber = Number(val.toFixed(precision));
  return roundedNumber;
};

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloatFromInterval(min: number, max: number, decimalPlaces: number) {
  return Number((Math.random() * (max - min) + min).toFixed(decimalPlaces));
}

export function getDeadline(deadline: number) {
  return new Date().getTime() / 1000 + deadline;
}

/**
 *
 * @param timestamp is in seconds
 * @returns object
 */
export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {date: '-', time: '-', abbreviatedMonth: '-', day: '-', abbreviatedTime: '-'};

  const date = new Date(timestamp * 1000);
  // const date = new Date();

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const monthIndex = date.getMonth();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    // 'January',
    // 'February',
    // 'March',
    // 'April',
    // 'May',
    // 'June',
    // 'July',
    // 'August',
    // 'September',
    // 'October',
    // 'November',
    // 'December',
  ];
  const monthName = monthNames[monthIndex];

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  // return [dateString, timeString];
  return {
    date: dateString,
    time: timeString,
    abbreviatedMonth: monthName,
    day: day,
    abbreviatedTime: `${hour}:${minute}`,
  };
};

/**
 *
 * @param address to be truncated
 * @returns '0x1234...12345'
 */
export const accountTruncate = (text: string) => {
  return text?.substring(0, 6) + '...' + text?.substring(text.length - 5);
};

/**
 *
 * @param milleseconds
 * @returns
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

interface IRoomOfLocker {
  [key: string]: boolean;
}

type ILocker = [() => boolean, () => boolean, IRoomOfLocker];

const room: IRoomOfLocker = {'common.Example': false};

export const locker = (id: string): ILocker => {
  // let locked = false;

  const lock = () => {
    if (room[id]) {
      // room[id] === true 代表已經上鎖，某 function 正在執行中；
      // 故 `lock` 回傳 false，代表不能執行某 function
      return false;
    } else {
      // room[id] === false 代表沒有上鎖，代表該 function 可以執行；
      // 故鎖上房門並讓 `lock` 回傳 true， 代表可以執行某 function
      room[id] = true;
      // locked = true;
      return true;
    }
  };

  const unlock = () => {
    // room[id] 代表該 function 已經執行完畢，可以解鎖房門
    if (room[id]) {
      room[id] = false;
      // locked = false;
      return true;
    } else {
      // 重複解鎖，代表流程有問題，故拋出錯誤
      throw new Error('Something is wrong with the procedure. Unlocking when not locked.');
    }
  };

  return [lock, unlock, room];
};

export const getTimestamp = () => Math.ceil(Date.now() / 1000);

export const toQuery = (params: {[key: string]: string | number | boolean} | undefined) => {
  const query: string = params
    ? `?${Object.keys(params)
        .map(key => `${key}=${params![key]}`)
        .join('&')}`
    : ``;
  return query;
};

export const convertTradesToCandlestickData = (
  trades: ITBETrade[],
  timeSpan: ITimeSpanUnion,
  lastestBarTime?: number
) => {
  const _trades = [...trades].sort((a, b) => +a.ts - +b.ts);
  console.log(`_trades[${_trades.length}]`);
  const _lastestBarTime = lastestBarTime || +_trades[0]?.ts;
  console.log(`_lastestBarTime`, _lastestBarTime);
  const time = getTime(timeSpan);
  console.log(`time`, time);
  let sortTrades: number[][] = [];
  let candlestickData: ICandlestickData[] = [];
  sortTrades = _trades.reduce((prev, curr, index) => {
    if (+curr.ts - _lastestBarTime > (index + 1) * time) {
      prev = [...prev, [+curr.price]];
    } else {
      let tmp: number[] = prev.pop() || [];
      tmp = [...tmp, +curr.price];
      prev = [...prev, tmp];
    }
    return prev;
  }, sortTrades);
  console.log(`sortTrades[${sortTrades.length}]`, sortTrades);
  if (sortTrades.length > 0) {
    for (let index = 0; index < sortTrades.length; index++) {
      console.log(`sortTrades[${index}]:[${sortTrades[index].length}]`);
      const open = sortTrades[index][0];
      const high = Math.max(...sortTrades[index]);
      const low = Math.min(...sortTrades[index]);
      const close = sortTrades[index][sortTrades[index].length - 1];
      candlestickData = candlestickData.concat({
        x: new Date(_lastestBarTime + time * index),
        open,
        high,
        low,
        close,
      });
    }
  }
  console.log(`candlestickData[${candlestickData.length}]`, candlestickData);
  return candlestickData;
};
