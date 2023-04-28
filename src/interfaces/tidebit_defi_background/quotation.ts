import {QUOTATION_RENEWAL_INTERVAL_SECONDS, unitAsset} from '../../constants/config';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp, getTimestampInMilliseconds} from '../../lib/common';

export interface IQuotation {
  ticker: string;
  targetAsset: string;
  unitAsset: string;
  typeOfPosition: ITypeOfPosition;
  price: number;
  deadline: number;
  signature: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyQuotation = (currency: string, typeOfPosition: ITypeOfPosition) => {
  const quotation: IQuotation = {
    ticker: currency,
    targetAsset: currency,
    unitAsset: unitAsset,
    typeOfPosition,
    price: randomIntFromInterval(1300, 2200),
    deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
    signature: '0x',
  };

  return quotation;
};
