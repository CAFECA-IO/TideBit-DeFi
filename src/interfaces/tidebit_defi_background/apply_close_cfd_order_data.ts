import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IQuotation} from './quotation';

export interface IApplyCloseCFDOrderData {
  orderId: string;
  closePrice?: number; // TODO: discussion
  quotation: IQuotation;
  closeTimestamp?: number;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyCloseCFDOrderData = (currency: string, id?: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const date = new Date();
  const dummyApplyCloseCFDOrderData: IApplyCloseCFDOrderData = {
    orderId: id
      ? id
      : `TB${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}${date.getSeconds()}${currency}`,
    closePrice: randomIntFromInterval(1000, 10000),
    quotation: {
      ticker: currency,
      targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
      uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
      price: randomIntFromInterval(1000, 10000),
      deadline: Date.now() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS,
      signature: '0x',
    }, // 報價單
    closeTimestamp: Date.now() / 1000 + 86400, // openTimestamp + 86400
  };
  return dummyApplyCloseCFDOrderData;
};
