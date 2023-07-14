import {ICurrency} from '../../constants/currency';
import {CFDClosedType, ICFDClosedType} from '../../constants/cfd_closed_type';
import {CFDOperation, ICFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IApplyCFDOrder} from './apply_cfd_order';
import {getDummyQuotation, IQuotation} from './quotation';

export interface IApplyCloseCFDOrder extends IApplyCFDOrder {
  operation: ICFDOperation;
  referenceId: string;
  quotation: IQuotation;
  closePrice: number;
  closedType: ICFDClosedType;
  forcedClose?: boolean;
  closeTimestamp?: number;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyCloseCFDOrder = (ticker: string, id?: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const date = new Date();
  const dummyApplyCloseCFDOrder: IApplyCloseCFDOrder = {
    orderType: OrderType.CFD,
    operation: CFDOperation.CLOSE,
    referenceId: id
      ? id
      : `TB${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}${date.getSeconds()}${ticker}`,
    closePrice: randomIntFromInterval(1000, 10000),
    closedType: CFDClosedType.BY_USER,
    quotation: getDummyQuotation(ticker, typeOfPosition),
    closeTimestamp: Math.ceil(Date.now() / 1000) + 86400, // openTimestamp + 86400
  };
  return dummyApplyCloseCFDOrder;
};
