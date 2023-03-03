import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';
import {IQuotation} from './quotation';

export interface IApplyCreateCFDOrderData {
  ticker: string;
  typeOfPosition: ITypeOfPosition;
  price: number;
  quotation: IQuotation; // 報價單
  amount: number;
  targetAsset: string;
  uniAsset: string; // 計價單位
  createTimestamp?: number;
  leverage: number;
  margin: IMargin;
  takeProfit?: number;
  stopLoss?: number;
  fee?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
  liquidationPrice: number; // 強制平倉價格
  liquidationTime: number;
  remark?: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyCreateCFDOrderData = (currency: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const dummyApplyCreateCFDOrderData: IApplyCreateCFDOrderData = {
    ticker: currency,
    amount: 1.8,
    typeOfPosition: typeOfPosition,
    leverage: 5,
    price: randomIntFromInterval(1000, 10000),
    targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
    uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
    margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
    takeProfit: 74521,
    stopLoss: 25250,
    fee: 0,
    quotation: {
      ticker: currency,
      targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
      uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
      price: randomIntFromInterval(1000, 10000),
      deadline: Date.now() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS,
      signature: '0x',
    }, // 報價單

    liquidationPrice: randomIntFromInterval(1000, 10000),
    liquidationTime: Date.now() / 1000 + 86400, // openTimestamp + 86400
  };
  return dummyApplyCreateCFDOrderData;
};

const sth = getDummyApplyCreateCFDOrderData('BTC').amount;
