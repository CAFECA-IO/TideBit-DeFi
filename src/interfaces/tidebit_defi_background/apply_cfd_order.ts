import {ICFDOperation} from '../../constants/cfd_order_type';
import {OrderState} from '../../constants/order_state';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp, randomHex, roundToDecimalPlaces} from '../../lib/common';
import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {IApplyCloseCFDOrder} from './apply_close_cfd_order';
import {IApplyCreateCFDOrder} from './apply_create_cfd_order';
import {IApplyOrder} from './apply_order';
import {IApplyUpdateCFDOrder} from './apply_update_cfd_order';
import {IBalance} from './balance';
import {ICFDOrder} from './order';

export interface IApplyCFDOrder extends IApplyOrder {
  operation: ICFDOperation;
}

// TODO: temp id then replace by DB id (20230330 - tzuhan)
export const convertApplyCreateCFDToAcceptedCFD = (
  applyCFDData: IApplyCreateCFDOrder,
  balance: IBalance,
  userSignature: string,
  nodeSignature: string,
  orderStatus?: IOrderStatusUnion
) => {
  const id = randomHex(20);
  const txid = randomHex(32);
  const CFDOrder: ICFDOrder = {
    id,
    orderType: applyCFDData.orderType,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    txid,
    fee: 0,
    remark: '',
    ticker: applyCFDData.ticker,
    state: OrderState.OPENING,
    openPrice: applyCFDData.price,
    createTimestamp: getTimestamp(),
    typeOfPosition: applyCFDData.typeOfPosition,
    targetAsset: applyCFDData.targetAsset,
    unitAsset: applyCFDData.unitAsset,
    amount: applyCFDData.amount,
    leverage: applyCFDData.leverage,
    margin: applyCFDData.margin,
    guaranteedStop: applyCFDData.guaranteedStop,
    liquidationPrice: applyCFDData.liquidationPrice,
    liquidationTime: applyCFDData.liquidationTime,
    takeProfit: applyCFDData.takeProfit,
    stopLoss: applyCFDData.stopLoss,
    guaranteedStopFee: applyCFDData.guaranteedStopFee,
  };
  const acceptedCFDOrder: IAcceptedCFDOrder = {
    txid,
    applyData: applyCFDData,
    userSignature: userSignature,
    receipt: {
      order: CFDOrder,
      balance: {
        currency: applyCFDData.margin.asset,
        available: balance.available - applyCFDData.margin.amount,
        locked: balance.locked + applyCFDData.margin.amount,
      },
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
  };
  return {CFDOrder, acceptedCFDOrder};
};

export const convertApplyUpdateCFDToAcceptedCFD = (
  applyCFDData: IApplyUpdateCFDOrder,
  cfdOrder: ICFDOrder,
  balance: IBalance,
  userSignature: string,
  nodeSignature: string,
  orderStatus?: IOrderStatusUnion
) => {
  const txid = randomHex(32);
  const updateCFDOrder: ICFDOrder = {
    ...cfdOrder,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    takeProfit: applyCFDData.takeProfit,
    stopLoss: applyCFDData.stopLoss,
    guaranteedStopFee: applyCFDData.guaranteedStopFee,
    guaranteedStop: applyCFDData.guaranteedStop
      ? applyCFDData.guaranteedStop
      : cfdOrder.guaranteedStop,
  };
  const acceptedCFDOrder: IAcceptedCFDOrder = {
    txid,
    applyData: applyCFDData,
    userSignature: userSignature,
    receipt: {
      order: updateCFDOrder,
      balance,
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
  };
  return {updateCFDOrder, acceptedCFDOrder};
};

export const convertApplyCloseCFDToAcceptedCFD = (
  applyCFDData: IApplyCloseCFDOrder,
  cfdOrder: ICFDOrder,
  balance: IBalance,
  userSignature: string,
  nodeSignature: string,
  orderStatus?: IOrderStatusUnion
) => {
  const pnl =
    (applyCFDData.closePrice - cfdOrder.openPrice) *
    cfdOrder.amount *
    (cfdOrder.typeOfPosition === TypeOfPosition.BUY ? 1 : -1);
  const balanceDiff = {
    currency: balance.currency,
    available: balance.available * -1 + pnl,
    locked: balance.locked * -1,
  };
  const txid = randomHex(32);
  const updateCFDOrder: ICFDOrder = {
    ...cfdOrder,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    state: OrderState.CLOSED,
    closePrice: applyCFDData.closePrice,
    closeTimestamp: applyCFDData.closeTimestamp,
    closedType: applyCFDData.closedType,
    forcedClose: false,
    pnl: {
      type: pnl > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: pnl,
    },
  };
  const acceptedCFDOrder: IAcceptedCFDOrder = {
    txid,
    applyData: applyCFDData,
    userSignature: userSignature,
    receipt: {
      order: updateCFDOrder,
      balance: {
        ...balance,
        available: balance.available - balanceDiff.available,
        locked: balance.locked + balanceDiff.locked,
      },
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
  };
  return {updateCFDOrder, acceptedCFDOrder};
};
