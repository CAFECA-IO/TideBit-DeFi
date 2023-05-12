import {TRADING_CRYPTO_DATA} from '../../constants/config';
import {Currency, ICurrency} from '../../constants/currency';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {getChainNameByCurrency, randomIntFromInterval} from '../../lib/common';

export interface ISharingOrder {
  tickerId: ICurrency;
  targetAssetName: string;
  typeOfPosition: ITypeOfPosition;
  openPrice: number;
  closePrice: number;
  leverage: number;
  user: string;
  qrcodeUrl?: string;
}

export const getDummySharingOrder = (
  currency?: ICurrency,
  typeOfPosition?: ITypeOfPosition
): ISharingOrder => {
  const currencies: ICurrency[] = Object.values(Currency);
  const ticker = currency ? currency : currencies[randomIntFromInterval(0, currencies.length - 1)];
  const order: ISharingOrder = {
    tickerId: ticker,
    targetAssetName: getChainNameByCurrency(ticker, TRADING_CRYPTO_DATA),
    typeOfPosition: typeOfPosition
      ? typeOfPosition
      : randomIntFromInterval(0, 1) === 0
      ? TypeOfPosition.BUY
      : TypeOfPosition.SELL,
    openPrice: 2000,
    closePrice: 2000,
    leverage: 5,
    user: 'user',
  };
  return order;
};

export const isDummySharingOrder = (order: ISharingOrder): boolean => {
  if (
    typeof order.tickerId !== 'string' ||
    typeof order.targetAssetName !== 'string' ||
    typeof order.typeOfPosition !== 'string' ||
    typeof order.openPrice !== 'number' ||
    typeof order.closePrice !== 'number' ||
    typeof order.leverage !== 'number' ||
    typeof order.user !== 'string'
  ) {
    return false;
  }

  // Info: (20230508 - Shirley) Check if tickerId is a valid ICurrency
  if (!Object.values(Currency).includes(order.tickerId as ICurrency)) {
    return false;
  }

  // Info: (20230508 - Shirley) Check if typeOfPosition is a valid ITypeOfPosition
  if (order.typeOfPosition !== TypeOfPosition.BUY && order.typeOfPosition !== TypeOfPosition.SELL) {
    return false;
  }

  // Info: (20230508 - Shirley) If qrcodeUrl exists, check if it's a string
  if (order.qrcodeUrl !== undefined && typeof order.qrcodeUrl !== 'string') {
    return false;
  }

  return true;
};
