import {IQuotation} from './quotation';

export interface IApplyCloseCFDOrderData {
  orderId: string;
  closePrice: number;
  quotation: IQuotation;
  closeTimestamp?: number;
}
