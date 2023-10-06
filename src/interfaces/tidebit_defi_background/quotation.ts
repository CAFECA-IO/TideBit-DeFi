import {ICurrency} from '../../constants/currency';
import {QUOTATION_RENEWAL_INTERVAL_SECONDS} from '../../constants/config';
import {ITypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp} from '../../lib/common';

export interface IQuotation {
  instId: string;
  targetAsset: ICurrency;
  unitAsset: string;
  typeOfPosition: ITypeOfPosition;
  price: number;
  spotPrice: number;
  spreadFee: number;
  deadline: number;
  signature: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyQuotation = (instId: string, typeOfPosition: ITypeOfPosition) => {
  const [targetAsset, unitAsset] = instId.split('-');
  const quotation: IQuotation = {
    instId: instId,
    targetAsset: targetAsset as ICurrency,
    unitAsset: unitAsset,
    typeOfPosition,
    spreadFee: randomIntFromInterval(3, 10),
    price: randomIntFromInterval(1300, 2200),
    spotPrice: randomIntFromInterval(1300, 2200),
    deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
    signature: '0x',
  };

  return quotation;
};
