import {ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
import {ITBETrade} from '../interfaces/tidebit_defi_background/ticker_data';
import {getTime, ITimeSpanUnion} from '../interfaces/tidebit_defi_background/time_span_union';
import IEIP712Data from '../interfaces/ieip712data';
import {IAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {OrderState} from '../constants/order_state';
import {TypeOfPosition} from '../constants/type_of_position';
import {IDisplayAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {ProfitState} from '../constants/profit_state';
import {SUGGEST_SL, SUGGEST_TP} from '../constants/config';

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

export const millesecondsToSeconds = (milleseconds: number) => Math.ceil(milleseconds / 1000);

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

/* Deprecated: IOrder replaced by IAcceptedOrder (20230407 - tzuhan)
export const acceptedOrderToOrder = (acceptedOrder: IAcceptedOrder) => {
  const order: IOrder = {
    timestamp: acceptedOrder.createTimestamp,
    type: acceptedOrder.orderType,
    targetAsset: acceptedOrder.targetAsset,
    targetAmount: acceptedOrder.targetAmount,
    balanceSnapshot: acceptedOrder.balanceSnapshot,
    detail: '',
    orderSnapshot: {
      id: acceptedOrder.id,
      txid: acceptedOrder.orderSnapshot.txid,
      status: acceptedOrder.orderStatus,
      state: undefined,
      remarks: acceptedOrder.orderSnapshot.remark,
      fee: acceptedOrder.orderSnapshot.fee,
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
  } else if (order.orderSnapshot.status === OrderStatusUnion.WAITING) {
    order.detail = 'Waiting';
  }
  if (acceptedOrder.orderType === OrderType.CFD) {
    order.orderSnapshot.state = (acceptedOrder.orderSnapshot as ICFDOrderSnapshot).state;
    if (order.orderSnapshot.state === eOrderState.OPENING) {
      order.detail = `Open position of ${order.targetAsset}`;
    }
    if (order.orderSnapshot.state === OrderState.CLOSED) {
      order.detail = `Close position of ${order.targetAsset}`;
    }
  }
  return order;
};
*/

/* Deprecated: IOrder replaced by IAcceptedDepositOrder (20230407 - tzuhan)
export const toDisplayAcceptedDepositOrder = (depositHistory: IOrder) => {
  const displayAcceptedDepositOrder: IAcceptedDepositOrder = {
    id: depositHistory.orderSnapshot.id,
    targetAsset: depositHistory.targetAsset,
    targetAmount: depositHistory.targetAmount,
    orderType: depositHistory.type,
    balanceSnapshot: {...depositHistory.balanceSnapshot, createTimestamp: depositHistory.timestamp},
    orderStatus: depositHistory.orderSnapshot.status,
    applyData: {
      orderType: depositHistory.type,
      createTimestamp: depositHistory.timestamp,
      targetAsset: depositHistory.targetAsset,
      targetAmount: depositHistory.targetAmount,
      decimals: depositHistory.orderSnapshot.decimals || 0,
      to: depositHistory.orderSnapshot.to || '',
      remark: '',
      fee: depositHistory.orderSnapshot.fee || 0,
    },
    balanceDifferenceCauseByOrder: {
      currency: depositHistory.targetAsset,
      available: 0,
      locked: depositHistory.targetAmount,
    },
    createTimestamp: depositHistory.timestamp,
    userSignature: '',
    nodeSignature: '',
    orderSnapshot: {
      orderType: OrderType.DEPOSIT,
      id: depositHistory.orderSnapshot.id,
      txid: depositHistory.orderSnapshot.txid,
      targetAsset: depositHistory.targetAsset,
      targetAmount: depositHistory.targetAmount,
      fee: depositHistory.orderSnapshot.fee,
      decimals: depositHistory.orderSnapshot.decimals || 0,
      to: depositHistory.orderSnapshot.to || '',
    },
  };
  return displayAcceptedDepositOrder;
};
*/

export const randomHex = (length: number) => {
  return (
    '0x' +
    Math.random()
      .toString(16)
      .substring(2, length + 2)
  );
};

// const positionLineGraph: number[] = tickerBook.listTickerPositions(orderSnapshot.ticker, {
//   begin: acceptedCFDOrder.createTimestamp,
// });

export const toDisplayAcceptedCFDOrder = (
  cfdOrder: IAcceptedCFDOrder,
  positionLineGraph: number[]
) => {
  const {orderSnapshot} = cfdOrder;
  const openValue = orderSnapshot.openPrice * orderSnapshot.amount;
  const closeValue =
    orderSnapshot.state === OrderState.CLOSED && orderSnapshot.closePrice
      ? orderSnapshot.closePrice * orderSnapshot.amount
      : 0;
  const pnl =
    orderSnapshot.state === OrderState.CLOSED && orderSnapshot.closePrice
      ? (closeValue - openValue) * (orderSnapshot.typeOfPosition === TypeOfPosition.BUY ? 1 : -1)
      : 0;
  const rTp =
    orderSnapshot.typeOfPosition === TypeOfPosition.BUY
      ? twoDecimal(orderSnapshot.openPrice * (1 + SUGGEST_TP / orderSnapshot.leverage))
      : twoDecimal(orderSnapshot.openPrice * (1 - SUGGEST_TP / orderSnapshot.leverage));
  const rSl =
    orderSnapshot.typeOfPosition === TypeOfPosition.BUY
      ? twoDecimal(orderSnapshot.openPrice * (1 - SUGGEST_SL / orderSnapshot.leverage))
      : twoDecimal(orderSnapshot.openPrice * (1 + SUGGEST_SL / orderSnapshot.leverage));
  const suggestion = {
    takeProfit: rTp,
    stopLoss: rSl,
  };
  const displayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
    ...cfdOrder,
    pnl: {
      type: pnl > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: pnl,
    },
    openValue: orderSnapshot.openPrice * orderSnapshot.amount,
    closeValue: orderSnapshot.closePrice
      ? orderSnapshot.closePrice * orderSnapshot.amount
      : undefined,
    positionLineGraph,
    suggestion,
  };
  return displayAcceptedCFDOrder;
};
