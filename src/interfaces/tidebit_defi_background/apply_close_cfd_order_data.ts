import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp} from '../../lib/common';
import {IQuotation} from './quotation';

export interface IApplyCloseCFDOrderData {
  orderId: string;
  closePrice: number;
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
      deadline: getTimestamp() + 15,
      signature: '0x',
    }, // 報價單
    closeTimestamp: getTimestamp() + 86400, // openTimestamp + 86400
  };
  return dummyApplyCloseCFDOrderData;
};
