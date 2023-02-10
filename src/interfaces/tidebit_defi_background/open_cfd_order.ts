import {ICFDOrderCreatingProps} from './cfd_order_request';
import {IOrder} from './order';

export interface IOpenCFDOrder extends IOrder, ICFDOrderCreatingProps {
  type: 'OPEN_CFD';
}

export const dummyOpenCFDOrder: IOpenCFDOrder = {
  // ---order data structure---
  timestamp: 1675299651,
  type: 'OPEN_CFD',
  targetAsset: 'USDT',
  targetAmount: 15, // margin
  fee: 0,

  // ---input data from UI---
  ticker: 'ETH',
  typeOfPosition: 'SELL',
  leverage: 5,
  positionValue: 75, // 倉位價值 = targetAmount * leverage
  stopLoss: 62,
  guaranteedStop: true,
  guaranteedStopFee: 0.77,
  estimatedFilledPrice: 50, // estimated filled price / open price 預估成交價格
};
