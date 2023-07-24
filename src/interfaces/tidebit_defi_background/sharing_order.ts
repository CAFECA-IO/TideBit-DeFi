import {TRADING_CRYPTO_DATA} from '../../constants/config';
import {Currency, ICurrency} from '../../constants/currency';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {getChainNameByCurrency, getTimestamp, randomIntFromInterval} from '../../lib/common';

export interface ISharingOrder {
  id: string;
  instId: string;
  targetAsset: ICurrency;
  targetAssetName: string;
  typeOfPosition: ITypeOfPosition;
  openPrice: number;
  closePrice: number;
  leverage: number;
  userName: string;
  qrcodeUrl?: string;
  createTimestamp: number;
  closeTimestamp: number;
}

export const getDummySharingOrder = (
  currency?: ICurrency,
  typeOfPosition?: ITypeOfPosition
): ISharingOrder => {
  const currencies: ICurrency[] = Object.values(Currency);
  const targetAsset = currency
    ? currency
    : currencies[randomIntFromInterval(0, currencies.length - 1)];
  const order: ISharingOrder = {
    id: 'dummy_id',
    instId: `${targetAsset}-USDT`,
    targetAsset: targetAsset,
    targetAssetName: getChainNameByCurrency(targetAsset, TRADING_CRYPTO_DATA),
    typeOfPosition: typeOfPosition
      ? typeOfPosition
      : randomIntFromInterval(0, 1) === 0
      ? TypeOfPosition.BUY
      : TypeOfPosition.SELL,
    openPrice: randomIntFromInterval(1000, 1200),
    closePrice: randomIntFromInterval(1000, 1200),
    createTimestamp: getTimestamp() - 86400,
    closeTimestamp: getTimestamp(),
    leverage: 5,
    userName: 'user',
  };
  return order;
};

export const isSharingOrder = (order: any) => {
  if (
    // TODO: Validate the `instId` when data has the property (20230724 - Shirley)
    // typeof order.instId !== 'string' ||
    typeof order.targetAssetName !== 'string' ||
    typeof order.typeOfPosition !== 'string' ||
    typeof order.openPrice !== 'number' ||
    typeof order.closePrice !== 'number' ||
    typeof order.leverage !== 'number' ||
    typeof order.userName !== 'string'
  ) {
    return false;
  } else if (!Object.values(Currency).includes(order.targetAsset as ICurrency)) {
    // Info: (20230508 - Shirley) Check if tickerId is a valid ICurrency
    return false;
  } else if (
    order.typeOfPosition !== TypeOfPosition.BUY &&
    order.typeOfPosition !== TypeOfPosition.SELL
  ) {
    // Info: (20230508 - Shirley) Check if typeOfPosition is a valid ITypeOfPosition
    return false;
  }
  return true;
};

export const isDummySharingOrder = (order: ISharingOrder): boolean => {
  if (
    typeof order.instId !== 'string' ||
    typeof order.targetAsset !== 'string' ||
    typeof order.targetAssetName !== 'string' ||
    typeof order.typeOfPosition !== 'string' ||
    typeof order.openPrice !== 'number' ||
    typeof order.closePrice !== 'number' ||
    typeof order.leverage !== 'number' ||
    typeof order.userName !== 'string'
  ) {
    return false;
  }

  // Info: (20230508 - Shirley) Check if tickerId is a valid ICurrency
  if (!Object.values(Currency).includes(order.targetAsset as ICurrency)) {
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

export const getInvalidSharingOrder = (
  currency?: ICurrency,
  typeOfPosition?: ITypeOfPosition
): ISharingOrder => {
  const now = getTimestamp();
  const order: ISharingOrder = {
    id: '_id',
    instId: `${Currency.ETH}-USDT`,
    targetAsset: Currency.ETH,
    targetAssetName: getChainNameByCurrency(Currency.ETH, TRADING_CRYPTO_DATA),
    typeOfPosition: TypeOfPosition.BUY,
    openPrice: 0,
    closePrice: 0,
    createTimestamp: now,
    closeTimestamp: now,
    leverage: 5,
    userName: 'X',
  };
  return order;
};
