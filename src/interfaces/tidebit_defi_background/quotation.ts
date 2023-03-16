import {TypeOfPosition} from '../../constants/type_of_position';

export interface IQuotation {
  ticker: string;
  targetAsset: string;
  uniAsset: string;
  price: number;
  deadline: number;
  signature: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyQuotation = (currency: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const quotation: IQuotation = {
    ticker: currency,
    targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
    uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
    price: randomIntFromInterval(1000, 10000),
    deadline: Math.ceil(Date.now() / 1000) + 15,
    signature: '0x',
  };
  return quotation;
};
