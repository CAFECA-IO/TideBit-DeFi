import IEIP712Data from '../interfaces/ieip712data';
import {ITypeOfPosition, TypeOfPosition} from '../constants/type_of_position';
import {IDisplayCFDOrder} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {getProfitState} from '../constants/profit_state';
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
  FRACTION_DIGITS,
  TARGET_MAX_DIGITS,
  TARGET_MIN_DIGITS,
  MAX_FEE_RATE,
  MIN_FEE_RATE,
  instIds,
  MONTH_SHORT_NAME_LIST,
} from '../constants/config';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../constants/display';
import ServiceTerm from '../constants/contracts/service_term';
import IJSON from '../interfaces/ijson';
import RLP from 'rlp';
import {ICFDOrder} from '../interfaces/tidebit_defi_background/order';
import {Currency, ICurrency, ICurrencyConstant} from '../constants/currency';
import {CustomError} from './custom_error';
import {Code, ICode, Reason} from '../constants/code';
import {ITypeOfValidation, TypeOfValidation} from '../constants/validation';
import SafeMath from './safe_math';
import {
  IRoundConditionConstant,
  RoundCondition,
} from '../interfaces/tidebit_defi_background/round_condition';
import BigNumber from 'bignumber.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Keccak = require('@cafeca/keccak');

interface IValidateInput {
  typeOfValidation: ITypeOfValidation;
  value?: number;
  upperLimit?: number;
  lowerLimit?: number;
}

/**
 * (20231023 - Shirley)
 * @param number
 * @param decimal target number digits
 * @param condition `RoundCondition.SHRINK` 使負數無條件進位，正數無條件捨去； `RoundCondition.ENLARGE || !condition` 使負數無條件捨去，正數無條件進位
 * @returns
 */
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
 * @param serverTzOffset e.g.`UTC+8`=-8
 * @param timestamp  in seconds
 * @param timezoneOffset e.g.`UTC+8`=8
 * @returns timestamp with timezoneOffset
 */
export const adjustTimestamp = (
  serverTzOffset: number,
  timestamp: number,
  timezoneOffset: number
) => {
  const ts = serverTzOffset * 60 * 60 + timestamp + timezoneOffset * 60 * 60;

  return ts;
};

/**
 *
 * @param timestamp is in seconds
 * @returns object
 */
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

/**
 *
 * @param address to be truncated
 * @returns '0x1234...12345'
 */
export const accountTruncate = (text: string, limitLength: number) => {
  const result =
    text?.length >= limitLength
      ? text?.substring(0, 6) + '...' + text?.substring(text.length - 5)
      : text;
  return result;
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
      throw new CustomError(Code.LOCK_PROCEDURE_WRONG);
    }
  };

  return [lock, unlock, room];
};

export const getTimestamp = () => Math.ceil(Date.now() / 1000);

export const getTimestampInMilliseconds = () => Date.now();

export const millisecondsToSeconds = (milliseconds: number) => Math.ceil(milliseconds / 1000);

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

export const randomHex = (length: number) =>
  `0x${[...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export const toPnl = (data: {
  openPrice: number;
  closePrice: number;
  amount: number;
  typeOfPosition: ITypeOfPosition;
  spread: number;
}) => {
  const pnlValue = roundToDecimalPlaces(
    (data.closePrice - data.openPrice) *
      data.amount *
      (data.typeOfPosition === TypeOfPosition.BUY ? 1 : -1),
    2,
    RoundCondition.SHRINK
  );
  const pnlType = getProfitState(pnlValue);
  const pnl = {
    type: pnlType,
    value: pnlValue,
  };
  return pnl;
};

export const toDisplayCFDOrder = (cfdOrder: ICFDOrder): IDisplayCFDOrder => {
  const openValue = roundToDecimalPlaces(
    cfdOrder.openPrice * cfdOrder.amount,
    2,
    RoundCondition.SHRINK
  );
  /** Deprecated: (20230608 - tzuhan)
  const spreadValue = spread ? spread : 0;
  const closeValue =
    cfdOrder.state === OrderState.CLOSED && cfdOrder.closePrice
      ? roundToDecimalPlaces(cfdOrder.closePrice * cfdOrder.amount, 2)
      : closePrice || 0;
  const currentValue = currentPrice
    ? roundToDecimalPlaces(Number(currentPrice) * cfdOrder.amount, 2)
    : positionLineGraph.length > 0
    ? roundToDecimalPlaces(
        Number(positionLineGraph[positionLineGraph.length - 1]) * cfdOrder.amount,
        2
      )
    : roundToDecimalPlaces(Number(cfdOrder.openPrice) * cfdOrder.amount, 2);
    */

  /* Info: (20230602 - Julian) pnl with spread
   * BUY -> closeValue - openValue
   * SELL -> openValue - closeValue */

  /** Deprecated: (20230608 - tzuhan)
  const pnl =
    cfdOrder.state === OrderState.CLOSED && cfdOrder.closePrice
      ? roundToDecimalPlaces(
          (closeValue - openValue) *
            (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 : -1) *
            (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 + spreadValue : 1 - spreadValue),
          2
        )
      : roundToDecimalPlaces(
          (currentValue - openValue) *
            (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 : -1) *
            (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 + spreadValue : 1 - spreadValue),
          2
        );
  const pnlPerncent = roundToDecimalPlaces((pnl / openValue) * 100, 2);
  */
  const rTp =
    cfdOrder.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(cfdOrder.openPrice * (1 + SUGGEST_TP / cfdOrder.leverage), 2)
      : roundToDecimalPlaces(cfdOrder.openPrice * (1 - SUGGEST_TP / cfdOrder.leverage), 2);
  const rSl =
    cfdOrder.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(cfdOrder.openPrice * (1 - SUGGEST_SL / cfdOrder.leverage), 2)
      : roundToDecimalPlaces(cfdOrder.openPrice * (1 + SUGGEST_SL / cfdOrder.leverage), 2);
  const suggestion = {
    takeProfit: rTp,
    stopLoss: rSl,
  };

  /** Deprecated: (20230608 - tzuhan)

  // Info: (20230510 - Julian) positionLineGraph with spread
  const positionLineGraphWithSpread =
    cfdOrder.typeOfPosition === TypeOfPosition.BUY
      ? positionLineGraph.map((v: number) => v * (1 - spreadValue))
      : positionLineGraph.map((v: number) => v * (1 + spreadValue));

  const openPrice = cfdOrder.openPrice;
  const nowPrice = positionLineGraph[positionLineGraph.length - 1];
  */
  // const liquidationPrice = cfdOrder.liquidationPrice;
  // const takeProfitPrice = cfdOrder.takeProfit ?? 0;
  // const stopLossPrice = cfdOrder.stopLoss ?? 0;

  // const rangingLiquidation = Math.abs(cfdOrder.openPrice - liquidationPrice);
  // const rangingTP = Math.abs(cfdOrder.openPrice - takeProfitPrice);
  // const rangingSL = Math.abs(cfdOrder.openPrice - stopLossPrice);

  // /* Info: (20230411 - Julian) sort by stateCode (liquidation -> SL -> TP -> createTimestamp) */
  // const stateCode =
  //   Math.abs(currentPrice - liquidationPrice) <= rangingLiquidation * 0.1
  //     ? cfdStateCode.LIQUIDATION
  //     : Math.abs(currentPrice - stopLossPrice) <= rangingSL * 0.1
  //     ? cfdStateCode.STOP_LOSS
  //     : Math.abs(currentPrice - takeProfitPrice) <= rangingTP * 0.1
  //     ? cfdStateCode.TAKE_PROFIT
  //     : cfdStateCode.COMMON;

  const displayCFDOrder: IDisplayCFDOrder = {
    ...cfdOrder,
    openValue: openValue,
    /** 
    pnl: {
      type: pnl > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: Math.abs(pnl),
    },
    closeValue: closeValue,
    positionLineGraph: positionLineGraphWithSpread,
    */
    suggestion,
    // stateCode: stateCode,
  };
  return displayCFDOrder;
};

export const getStateCode = (cfd: ICFDOrder, tickerPrice: number): number => {
  const liquidationPrice = cfd.liquidationPrice;
  const takeProfitPrice = cfd.takeProfit ?? 0;
  const stopLossPrice = cfd.stopLoss ?? 0;

  const rangingLiquidation = Math.abs(cfd.openPrice - liquidationPrice);
  const rangingTP = Math.abs(cfd.openPrice - takeProfitPrice);
  const rangingSL = Math.abs(cfd.openPrice - stopLossPrice);

  /* Info: (20230411 - Julian) sort by stateCode (liquidation -> SL -> TP -> createTimestamp) */
  const stateCode =
    Math.abs(tickerPrice - liquidationPrice) <= rangingLiquidation * 0.1
      ? cfdStateCode.LIQUIDATION
      : Math.abs(tickerPrice - stopLossPrice) <= rangingSL * 0.1
      ? cfdStateCode.STOP_LOSS
      : Math.abs(tickerPrice - takeProfitPrice) <= rangingTP * 0.1
      ? cfdStateCode.TAKE_PROFIT
      : cfdStateCode.COMMON;
  return stateCode;
};

export const getServiceTermContract = (address: string) => {
  const serviceTermsContract = ServiceTerm;
  const message = {
    title: SERVICE_TERM_TITLE,
    domain: DOMAIN,
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
  const agree = [
    asciiToString((decodedData[2] as Array<Uint8Array>)[0]),
    asciiToString((decodedData[2] as Array<Uint8Array>)[1]),
  ];
  const signer = decodedData[3]
    ? `0x${Buffer.from(decodedData[3] as Uint8Array).toString('hex')}`
    : undefined;
  const expired = decodedData[4] ? asciiToInt(decodedData[4] as Uint8Array) : undefined;
  const iat = decodedData[5] ? asciiToInt(decodedData[5] as Uint8Array) : undefined;
  return {
    message: {
      title,
      domain,
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
  // Deprecated: (20230717 - tzuhan) [debug]
  // eslint-disable-next-line no-console
  console.log(`verifySignedServiceTerm: `, ` serviceTerm: `, serviceTerm);
  // Info: 1. verify contract domain (20230411 - tzuhan)
  if (serviceTerm.message.domain !== DOMAIN) isDeWTLegit = false && isDeWTLegit;
  // Info: 2. verify contract agreement (20230411 - tzuhan)
  if (serviceTerm.message.agree[0] !== TERM_OF_SERVICE) isDeWTLegit = false && isDeWTLegit;
  if (serviceTerm.message.agree[1] !== PRIVATE_POLICY) isDeWTLegit = false && isDeWTLegit;
  // Info: 3. verify contract expiration time (20230411 - tzuhan)
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
  // Deprecated: (20230717 - tzuhan) [debug]
  // eslint-disable-next-line no-console
  console.log(
    `verifySignedServiceTerm:`,
    `serviceTerm.message.domain(${serviceTerm.message.domain}) !== DOMAIN(${DOMAIN})`,
    serviceTerm.message.domain !== DOMAIN,
    `serviceTerm.message.agree[0](${serviceTerm.message.agree[0]}) !== TERM_OF_SERVICE(${TERM_OF_SERVICE})`,
    serviceTerm.message.agree[0] !== TERM_OF_SERVICE,
    `serviceTerm.message.agree[1](${serviceTerm.message.agree[1]}) !== PRIVATE_POLICY(${PRIVATE_POLICY})`,
    serviceTerm.message.agree[1] !== PRIVATE_POLICY,
    `serviceTerm.message.iat(${serviceTerm.message.iat}) > serviceTerm.message.expired(${serviceTerm.message.expired})`,
    (serviceTerm.message?.iat ?? 0) > (serviceTerm.message?.expired ?? 0),
    `getTimestamp()`,
    getTimestamp(),
    `serviceTerm.message.iat(${serviceTerm.message?.iat ?? 0}) > getTimestamp()(${getTimestamp()})`,
    (serviceTerm.message?.iat ?? 0) > getTimestamp(),
    `serviceTerm.message.expired(${
      serviceTerm.message?.expired ?? 0
    }) < getTimestamp()(${getTimestamp()})`,
    (serviceTerm.message?.expired ?? 0) < getTimestamp(),
    `getTimestamp()(${getTimestamp()}) - serviceTerm.message.iat(${
      serviceTerm.message?.iat ?? 0
    }) > DeWT_VALIDITY_PERIOD(${DeWT_VALIDITY_PERIOD})`,
    getTimestamp() - (serviceTerm.message?.iat ?? 0) > DeWT_VALIDITY_PERIOD
  );
  return {isDeWTLegit, serviceTerm};
};

export const getCookieByName = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  /**  Deprecated: (20230717 - tzuhan) [debug]
  // eslint-disable-next-line no-console
  console.log(
    `getCookieByName: ${name}`,
    ` document.cookie: `,
    document.cookie,
    `cookieValue: `,
    cookieValue
  );
  */
  return cookieValue;
};

export const addDaysToDate = (days: number): number => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result.getTime();
};

export const setCookie = (name: string, value: number, expirationTimestamp: number) => {
  const expires = `expires=${new Date(expirationTimestamp).toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const isCookieExpired = (cookieValue: string): boolean => {
  const expirationTimestamp = parseInt(cookieValue, 10);

  if (isNaN(expirationTimestamp)) {
    return true;
  }

  const expired = expirationTimestamp < new Date().getTime();
  return expired;
};

export const hasValue = (obj: any) => {
  return Object?.values(obj)?.some(v => v !== null && v !== undefined);
};

export const capitalized = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function findCurrencyByCode(code: string): ICurrency | undefined {
  const currencyKeys = Object.keys(Currency) as Array<keyof ICurrencyConstant>;

  for (const key of currencyKeys) {
    if (key.toUpperCase() === code.toUpperCase()) {
      return Currency[key] as ICurrency;
    }
  }

  return undefined;
}

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

/** (20231017 - Shirley)
 * @description 這個函數將檢查輸入的 n 是否為數字，使用 SafeMath 的 isNumber 方法進行判斷。預設使用 roundToDecimalPlaces 的 SHRINK 方法。如果你希望該數字放大，則在放進 numberFormatted 之前，應該先用 roundToDecimalPlaces 來調整它。函數的輸出將是一個字串格式。
 * @param n
 * @param dash
 * @param sign
 * @returns string
 */
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

export const getEstimatedPnL = (
  amount: number,
  typeOfPosition: ITypeOfPosition,
  entryPrice: number,
  targetPrice: number,
  isProfit: boolean
) => {
  const isLong = typeOfPosition === TypeOfPosition.BUY;
  const diff = isLong ? targetPrice - entryPrice : entryPrice - targetPrice;
  const rs = diff * amount;
  const isPositive = rs > 0;

  let symbol = '';

  if (isProfit) {
    symbol = isPositive ? '+' : '-';
  } else {
    symbol = isPositive ? '+' : '-';
  }

  const number = Math.abs(rs);
  return {number: number, symbol: symbol};
};

export const swapKeysAndValues = (obj: Record<string, string>): Record<string, string> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<string, string>
  );
};

export const findCodeByReason = (reason: string): ICode | undefined => {
  const ReasonToCode = swapKeysAndValues(Reason);

  return ReasonToCode[reason] as ICode;
};

/**
 * @description Verify if the fee rate and target amount are within the specified range
 */
export const validateCFD = (feeRate: number, amount: number) => {
  let result = false;
  if (
    MIN_FEE_RATE <= feeRate &&
    feeRate <= MAX_FEE_RATE &&
    TARGET_MIN_DIGITS <= amount &&
    amount <= TARGET_MAX_DIGITS
  ) {
    result = true;
  } else {
    result = false;
  }

  return result;
};

/**
 * (20230928 - Shirley)
 * @dev check whether the number format is valid or not
 */
export const validateNumberFormat = (value: number | string) => {
  const regex = /^\d*\.?\d{0,2}$/;
  return regex.test(value?.toString());
};

export function getValueByProp(obj: any, prop: string) {
  const keys = prop.split('.');
  return keys.reduce((o, k) => (o || {})[k], obj);
}

/**
 * (20230928 - Shirley)
 * @dev check whether the tp/sl value is valid or not
 */
export const validateAllInput = ({
  typeOfValidation,
  value,
  upperLimit: upperLimit,
  lowerLimit: lowerLimit,
}: IValidateInput): boolean => {
  let isValid = false;

  switch (typeOfValidation) {
    case TypeOfValidation.TPSL:
      if (value !== undefined && upperLimit !== undefined && lowerLimit !== undefined) {
        const validFormat = validateNumberFormat(value);
        if (!validFormat) {
          isValid = false;
        } else {
          if (value > upperLimit || value < lowerLimit) {
            isValid = false;
          } else {
            isValid = true;
          }
        }
      }
      break;

    case TypeOfValidation.TARGET:
      if (value !== undefined && upperLimit !== undefined && lowerLimit !== undefined) {
        const validFormat = validateNumberFormat(value);
        if (!validFormat) {
          isValid = false;
        } else {
          if (value > upperLimit || value < lowerLimit) {
            isValid = false;
          } else {
            isValid = true;
          }
        }
      }
      break;
  }

  return isValid;
};

/**
 *
 * @param text to be truncated
 * @param limitLength the maximum length for the string
 * @returns truncated text at word boundary
 */
export const truncateText = (text: string, limitLength: number) => {
  const words = text.split(' ');

  let result = '';

  for (let i = 0; i < words.length; i++) {
    if ((result + words[i]).length > limitLength) break;

    if (result.length != 0) result += ' ';

    result += words[i];
  }

  if (text.length > limitLength) result += '...';

  return result;
};

export const getKeccak256Hash = (data: string) => {
  data = data.toLowerCase().replace('0x', '');
  const keccak256 = new Keccak('keccak256');
  const hash = keccak256.update(data).digest('hex');
  return hash;
};

export const toChecksumAddress = (address: string) => {
  address = address.toLowerCase().replace('0x', '');
  const hash = getKeccak256Hash(address);

  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
};

export function isValidTradeURL(url: string): boolean {
  let result = false;

  for (const instId of instIds) {
    const expectedURL = `/trade/cfd/${instId}`;
    if (url === expectedURL) {
      result = true;
      return result;
    }
  }

  return result;
}

// Info:(20230925 - Julian) i18n URL workaround
export const getI18nLink = (link: string, locale: string) => {
  if (link.toLowerCase().includes('bitcoin')) {
    const bitcoinText = locale === 'tw' ? 'zh_TW' : locale === 'cn' ? 'zh_CN' : 'en';
    const bitcoinLink = link.includes('en')
      ? link.replace('en', bitcoinText)
      : `${link}/${bitcoinText}`;
    return bitcoinLink;
  } else if (link.toLowerCase().includes('ethereum')) {
    const ethereumText = locale === 'tw' ? 'zh-tw' : locale === 'cn' ? 'zh' : 'en';
    const ethereumLink = link.includes('en')
      ? link.replace('en', ethereumText)
      : `${link}/${ethereumText}`;
    return ethereumLink;
  }
};

export function ratioToPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}`;
}

export const areArraysEqual = (arr1: Array<string>, arr2: Array<string>) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }

  return true;
};

export const arrayDifferences = (arr1: Array<string>, arr2: Array<string>) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const inArr1NotInArr2: string[] = [];
  const inArr2NotInArr1: string[] = [];

  for (const item of set1) {
    if (!set2.has(item)) inArr1NotInArr2.push(item);
  }

  for (const item of set2) {
    if (!set1.has(item)) inArr2NotInArr1.push(item);
  }

  return {
    inArr1NotInArr2,
    inArr2NotInArr1,
  };
};
