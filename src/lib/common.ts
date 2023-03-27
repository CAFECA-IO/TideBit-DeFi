import {getTime, ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
import {ITBETrade} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion} from '../interfaces/tidebit_defi_background/time_span_union';
import {OrderState} from '../constants/order_state';
import {OrderStatusUnion} from '../constants/order_status_union';
import {OrderType} from '../constants/order_type';
import IEIP712Data from '../interfaces/ieip712data';
import {IAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {IAcceptedDepositOrder} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {IAcceptedOrder} from '../interfaces/tidebit_defi_background/accepted_order';
import {IAcceptedWithdrawOrder} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {IBalance} from '../interfaces/tidebit_defi_background/balance';
import {IOrder} from '../interfaces/tidebit_defi_background/order';

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
  return Math.ceil(new Date().getTime() / 1000) + deadline;
}

/**
 *
 * @param timestamp is in seconds
 * @returns object
 */
export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      time: '-',
      abbreviatedMonth: '-',
      monthAndYear: '-',
      day: '-',
      abbreviatedTime: '-',
    };

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
  ];

  const monthFullNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthName = monthNames[monthIndex];
  const monthFullName = monthFullNames[monthIndex];

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  // return [dateString, timeString];
  return {
    date: dateString,
    time: timeString,
    abbreviatedMonth: monthName,
    monthAndYear: `${monthFullName} ${year}`,
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

export const twoDecimal = (num: number, mul?: number): number => {
  const roundedNum = Math.round(num * 100) / 100;
  const str = roundedNum.toFixed(2).replace(/\.?0+$/, '');
  const dec = str.split('.');
  const numDec = dec.length === 2 ? dec[1].length : 0;

  return mul
    ? Number((num * mul).toFixed(numDec).replace(/\.?0+$/, ''))
    : Number(num.toFixed(numDec).replace(/\.?0+$/, ''));
};

export const getNowSeconds = () => {
  return Math.ceil(new Date().getTime() / 1000);
};

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
  const _lastestBarTime = lastestBarTime || +_trades[0]?.ts;
  const time = getTime(timeSpan);
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
  if (sortTrades.length > 0) {
    for (let index = 0; index < sortTrades.length; index++) {
      const open = sortTrades[index][0];
      const high = Math.max(...sortTrades[index]);
      const low = Math.min(...sortTrades[index]);
      const close = sortTrades[index][sortTrades[index].length - 1];
      candlestickData = candlestickData.concat({
        x: new Date(_lastestBarTime + time * (index + 1)),
        y: {
          open,
          high,
          low,
          close,
        },
      });
    }
  }
  return candlestickData;
};

export const toIJSON = (typeData: IEIP712Data) => {
  return JSON.parse(JSON.stringify(typeData));
};

export const acceptedOrderToOrder = (acceptedOrder: IAcceptedOrder, balance: IBalance) => {
  const order: IOrder = {
    timestamp: acceptedOrder.createTimestamp,
    type: acceptedOrder.orderType,
    targetAsset: '',
    targetAmount: 0,
    balanceSnapshot: {
      ...balance,
    },
    detail: '',
    orderSnapshot: {
      id: acceptedOrder.id,
      txid: acceptedOrder.txid,
      status: acceptedOrder.orderStatus,
      state: undefined,
      remarks: acceptedOrder.remark,
      fee: acceptedOrder.fee,
    },
  };
  if (
    order.orderSnapshot.status === OrderStatusUnion.SUCCESS ||
    order.orderSnapshot.status === OrderStatusUnion.CANCELDED
  ) {
    order.detail = 'TxID/TxHash';
  } else if (order.orderSnapshot.status === OrderStatusUnion.PROCESSING) {
    order.detail = 'Processing';
  } else if (order.orderSnapshot.status === OrderStatusUnion.FAILED) {
    order.detail = 'Failed';
  }
  switch (acceptedOrder.orderType) {
    case OrderType.CFD:
      order.targetAsset = (acceptedOrder as IAcceptedCFDOrder).targetAsset;
      order.targetAmount = (acceptedOrder as IAcceptedCFDOrder).amount;
      order.orderSnapshot.state = (acceptedOrder as IAcceptedCFDOrder).state;
      if (order.orderSnapshot.state === OrderState.OPENING) {
        order.detail = `Open position of ${order.targetAsset}`;
      }
      if (order.orderSnapshot.state === OrderState.CLOSED) {
        order.detail = `Close position of ${order.targetAsset}`;
      }
      break;
    case OrderType.DEPOSIT:
      order.targetAsset = (acceptedOrder as IAcceptedDepositOrder).targetAsset;
      order.targetAmount = (acceptedOrder as IAcceptedDepositOrder).targetAmount;
      break;
    case OrderType.WITHDRAW:
      order.targetAsset = (acceptedOrder as IAcceptedWithdrawOrder).targetAsset;
      order.targetAmount = (acceptedOrder as IAcceptedWithdrawOrder).targetAmount;
      break;
  }
  return order;
};

export const randomHex = (length: number) => {
  return (
    '0x' +
    Math.random()
      .toString(16)
      .substring(2, length + 2)
  );
};
