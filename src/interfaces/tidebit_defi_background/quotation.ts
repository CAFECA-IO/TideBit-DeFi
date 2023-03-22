import {unitAsset} from '../../constants/config';
import {ITypeOfPosition} from '../../constants/type_of_position';

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
    price: randomIntFromInterval(1000, 10000),
    deadline: Math.ceil(Date.now() / 1000) + 15,
    signature: '0x',
  };
  return quotation;
};
