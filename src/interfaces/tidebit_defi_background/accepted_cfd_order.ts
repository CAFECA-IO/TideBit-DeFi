import {IAcceptedOrder} from './accepted_order';
import {IApplyCFDOrder} from './apply_cfd_order';
import {ICFDOrderSnapshot} from './order_snapshot';

export interface IAcceptedCFDOrder extends IAcceptedOrder {
  applyData: IApplyCFDOrder;
  orderSnapshot: ICFDOrderSnapshot;
}

/* TODO: dummyAcceptedCFDOrder (20230330 - tzuhan)
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const getDummyAcceptedCFDOrder = (currency = 'ETH', state?: IOrderState) => {
  const random = Math.random();
  const typeOfPosition = random > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const date = new Date();
  const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
    id: '',
    orderType: 'CFD',
    orderStatus: 'WAITING',
    targetAsset: '',
    targetAmount: 0,
    applyData: undefined,
    userSignature: '',
    balanceDifferenceCauseByOrder: undefined,
    balanceSnapshot: undefined,
    orderSnapshot: {
      id: `TBAcceptedCFD${date.getFullYear()}${
     date.getMonth() + 1
   }${date.getDate()}${date.getSeconds()}${currency}`,
   txid: '0x',
   ticker: currency,
   orderStatus: random > 0.5 ? OrderStatusUnion.PROCESSING : OrderStatusUnion.SUCCESS,
   orderType: OrderType.CFD,
   state: state
     ? state
     : random > 0.5
     ? OrderState.CLOSED
     : random === 0.5
     ? OrderState.FREEZED
     : OrderState.OPENING,
   typeOfPosition: typeOfPosition,
   targetAsset: currency,
   unitAsset: unitAsset,
   openPrice: 24058,
   amount: 1.8,
   createTimestamp: 1675299651,
   leverage: 5,
   margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
   takeProfit: 74521,
   stopLoss: 25250,
   fee: 0,
   guaranteedStop: false,
   guaranteedStopFee: 0.77,
   liquidationPrice: 19537,
   liquidationTime: 1675386051, // openTimestamp + 86400
   closePrice: 19537,
   closeTimestamp: 1675386051,
   closedType: CFDClosedType.SCHEDULE,
   forcedClose: true,
   remark: 'str',
   },
    nodeSignature: '',
    createTimestamp: 0,
    updateTimestamp: 0
  };
  return dummyAcceptedCFDOrder;
};

export const getDummyAcceptedCFDs = (currency: string, state?: IOrderState, id?: string) => {
  const date = new Date();
  const dummyAcceptedCFDs: IAcceptedCFDOrder[] = [];
  for (let i = 0; i < 3; i++) {
    const random = Math.random();
    const typeOfPosition = random > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
    const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
      id: id
        ? id
        : `TBAcceptedCFD${date.getFullYear()}${
            date.getMonth() + 1
          }${date.getDate()}${date.getSeconds()}${currency}-${i}`,
      txid: randomHex(32),
      ticker: currency,
      orderStatus: random > 0.5 ? OrderStatusUnion.SUCCESS : OrderStatusUnion.PROCESSING,
      orderType: OrderType.CFD,
      state: state
        ? state
        : random > 0.5
        ? OrderState.CLOSED
        : random === 0.5
        ? OrderState.FREEZED
        : OrderState.OPENING,
      typeOfPosition: typeOfPosition,
      targetAsset: currency,
      unitAsset: unitAsset,
      openPrice: randomIntFromInterval(1000, 10000),
      amount: 1.8,
      createTimestamp: getTimestamp(),
      leverage: 5,
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
      takeProfit: randomIntFromInterval(7000, 70000),
      stopLoss: randomIntFromInterval(100, 1000),
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: getTimestamp() + 86400,
      closePrice: randomIntFromInterval(1000, 10000),
      closeTimestamp: random > 0.5 ? getTimestamp() + 86400 : undefined,
      closedType:
        random > 0.5
          ? Math.random() > 0.5
            ? CFDClosedType.FORCED_LIQUIDATION
            : CFDClosedType.SCHEDULE
          : undefined,
      forcedClose: true,
      remark: 'str',
    };
    dummyAcceptedCFDs.push(dummyAcceptedCFDOrder);
  }
  return dummyAcceptedCFDs;
};
*/
