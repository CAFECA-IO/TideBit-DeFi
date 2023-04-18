import {ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
import {ITBETrade} from '../interfaces/tidebit_defi_background/ticker_data';
import {getTime, ITimeSpanUnion} from '../constants/time_span_union';
import IEIP712Data from '../interfaces/ieip712data';
import {OrderState} from '../constants/order_state';
import {TypeOfPosition} from '../constants/type_of_position';
import {IDisplayCFDOrder} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {ProfitState} from '../constants/profit_state';
import {cfdStateCode} from '../constants/cfd_state_code';
import {
  DeWT_VALIDITY_PERIOD,
  DOMAIN,
  PRIVATE_POLICY,
  SERVICE_TERM_TITLE,
  SUGGEST_SL,
  SUGGEST_TP,
  TERM_OF_SERVICE,
  MONTH_FULL_NAME_LIST,
} from '../constants/config';
import ServiceTerm from '../constants/contracts/service_term';
import packageJson from '../../package.json';
import IJSON from '../interfaces/ijson';
import RLP from 'rlp';
import {ICFDOrder} from '../interfaces/tidebit_defi_background/order';

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

  const monthName = monthNames[monthIndex];
  const monthFullName = MONTH_FULL_NAME_LIST[monthIndex];

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

export const getTimestampInMilliseconds = () => Date.now();

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

export const randomHex = (length: number) => {
  return (
    '0x' +
    Math.random()
      .toString(16)
      .substring(2, length + 2)
  );
};

export const toDisplayCFDOrder = (cfdOrder: ICFDOrder, positionLineGraph: number[]) => {
  const openValue = cfdOrder.openPrice * cfdOrder.amount;
  const closeValue =
    cfdOrder.state === OrderState.CLOSED && cfdOrder.closePrice
      ? cfdOrder.closePrice * cfdOrder.amount
      : 0;
  const pnl =
    cfdOrder.state === OrderState.CLOSED && cfdOrder.closePrice
      ? (closeValue - openValue) * (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 : -1)
      : 0;
  const rTp =
    cfdOrder.typeOfPosition === TypeOfPosition.BUY
      ? twoDecimal(cfdOrder.openPrice * (1 + SUGGEST_TP / cfdOrder.leverage))
      : twoDecimal(cfdOrder.openPrice * (1 - SUGGEST_TP / cfdOrder.leverage));
  const rSl =
    cfdOrder.typeOfPosition === TypeOfPosition.BUY
      ? twoDecimal(cfdOrder.openPrice * (1 - SUGGEST_SL / cfdOrder.leverage))
      : twoDecimal(cfdOrder.openPrice * (1 + SUGGEST_SL / cfdOrder.leverage));
  const suggestion = {
    takeProfit: rTp,
    stopLoss: rSl,
  };

  const openPrice = cfdOrder.openPrice;
  const nowPrice = positionLineGraph[positionLineGraph.length - 1];
  const liquidationPrice = cfdOrder.liquidationPrice;
  const takeProfitPrice = cfdOrder.takeProfit ?? 0;
  const stopLossPrice = cfdOrder.stopLoss ?? 0;

  const rangingLiquidation = Math.abs(openPrice - liquidationPrice);
  const rangingTP = Math.abs(openPrice - takeProfitPrice);
  const rangingSL = Math.abs(openPrice - stopLossPrice);

  /* Info: (20230411 - Julian) sort by stateCode (liquidation -> SL -> TP -> createTimestamp) */
  const stateCode =
    Math.abs(nowPrice - liquidationPrice) <= rangingLiquidation * 0.1
      ? cfdStateCode.LIQUIDATION
      : Math.abs(nowPrice - stopLossPrice) <= rangingSL * 0.1
      ? cfdStateCode.STOP_LOSS
      : Math.abs(nowPrice - takeProfitPrice) <= rangingTP * 0.1
      ? cfdStateCode.TAKE_PROFIT
      : cfdStateCode.COMMON;

  const displayCFDOrder: IDisplayCFDOrder = {
    ...cfdOrder,
    pnl: {
      type: pnl > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: pnl,
    },
    openValue: cfdOrder.openPrice * cfdOrder.amount,
    closeValue: cfdOrder.closePrice ? cfdOrder.closePrice * cfdOrder.amount : undefined,
    positionLineGraph,
    suggestion,
    stateCode: stateCode,
  };
  return displayCFDOrder;
};

export const getServiceTermContract = (address: string) => {
  const serviceTermsContract = ServiceTerm;
  const message = {
    title: SERVICE_TERM_TITLE,
    domain: DOMAIN,
    version: packageJson.version,
    agree: [TERM_OF_SERVICE, PRIVATE_POLICY],
    signer: address,
    expired: getTimestamp() + DeWT_VALIDITY_PERIOD,
    iat: getTimestamp(),
  };
  serviceTermsContract.message = message;
  return serviceTermsContract;
};
const convertServiceTermToObject = (serviceTerm: IEIP712Data) => {
  const message = serviceTerm.message as {[key: string]: IJSON};
  const data = {
    primaryType: serviceTerm.primaryType as string,
    domain: {...serviceTerm.domain},
    message: {
      title: message.title as string,
      domain: message.domain as string,
      version: message.version as string,
      agree: message.agree as string[],
      signer: message.signer as string,
      expired: message.expired as number,
      iat: message.iat as number,
    },
  };
  return data;
};

export const rlpEncodeServiceTerm = (serviceTerm: IEIP712Data) => {
  const data = convertServiceTermToObject(serviceTerm);
  const encodedData = RLP.encode([
    data.message.title,
    data.message.domain,
    data.message.version,
    data.message.agree,
    data.message.signer,
    data.message.expired,
    data.message.iat,
  ]);
  const dataToHex = Buffer.from(encodedData).toString('hex');
  return dataToHex;
};

const asciiToString = (asciiBuffer: Uint8Array) => {
  let string = '';
  const hexString = Buffer.from(asciiBuffer).toString('hex');
  for (let i = 0; i < hexString.length; i += 2) {
    string += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return string;
};

const asciiToInt = (asciiBuffer: Uint8Array) => {
  const hexString = Buffer.from(asciiBuffer).toString('hex');
  const asciiInt = parseInt(hexString, 16);
  return asciiInt;
};

export const rlpDecodeServiceTerm = (data: string) => {
  const buffer = Buffer.from(data, 'hex');
  const decodedData = RLP.decode(buffer);
  const title = decodedData[0] ? asciiToString(decodedData[0] as Uint8Array) : undefined;
  const domain = decodedData[1] ? asciiToString(decodedData[1] as Uint8Array) : undefined;
  const version = decodedData[2] ? asciiToString(decodedData[2] as Uint8Array) : undefined;
  const agree = [
    asciiToString((decodedData[3] as Array<Uint8Array>)[0]),
    asciiToString((decodedData[3] as Array<Uint8Array>)[1]),
  ];
  const signer = decodedData[4]
    ? `0x${Buffer.from(decodedData[4] as Uint8Array).toString('hex')}`
    : undefined;
  const expired = decodedData[5] ? asciiToInt(decodedData[5] as Uint8Array) : undefined;
  const iat = decodedData[6] ? asciiToInt(decodedData[6] as Uint8Array) : undefined;
  return {
    message: {
      title,
      domain,
      version,
      agree,
      signer,
      expired,
      iat,
    },
  };
};

export const verifySignedServiceTerm = (encodedServiceTerm: string) => {
  let isDeWTLegit = true;
  const serviceTerm = rlpDecodeServiceTerm(encodedServiceTerm);
  // Info: 1. verify contract domain (20230411 - tzuhan)
  if (serviceTerm.message.domain !== DOMAIN) isDeWTLegit = false && isDeWTLegit;
  // Info: 2. verify contract version (20230411 - tzuhan)
  if (serviceTerm.message.version !== packageJson.version) isDeWTLegit = false && isDeWTLegit;
  // Info: 3. verify contract agreement (20230411 - tzuhan)
  if (serviceTerm.message.agree[0] !== TERM_OF_SERVICE) isDeWTLegit = false && isDeWTLegit;
  if (serviceTerm.message.agree[1] !== PRIVATE_POLICY) isDeWTLegit = false && isDeWTLegit;
  // Info: 4. verify contract expiration time (20230411 - tzuhan)
  if (
    !serviceTerm.message.expired || // Info: expired 不存在 (20230411 - tzuhan)
    !serviceTerm.message.iat || // Info: iat 不存在 (20230411 - tzuhan)
    serviceTerm.message.iat > serviceTerm.message.expired || // Info: iat 大於 expired (20230411 - tzuhan)
    serviceTerm.message.iat > getTimestamp() || // Info: iat 大於現在時間  (20230411 - tzuhan)
    serviceTerm.message.expired < getTimestamp() || // Info: expired 小於現在時間 (20230411 - tzuhan)
    serviceTerm.message.iat - serviceTerm.message.expired > DeWT_VALIDITY_PERIOD || // Info: iat 與 expired 的時間間隔大於 DeWT 的有效時間 (20230411 - tzuhan)
    getTimestamp() - serviceTerm.message.iat > DeWT_VALIDITY_PERIOD // Info: 現在時間與 iat 的時間間隔大於 DeWT 的有效時間 (20230411 - tzuhan)
  )
    isDeWTLegit = false && isDeWTLegit;
  return {isDeWTLegit, serviceTerm};
};

export const getCookieByName = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue;
};
