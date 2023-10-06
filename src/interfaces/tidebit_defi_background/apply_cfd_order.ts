import {ICFDOperation} from '../../constants/cfd_order_type';
import {OrderState} from '../../constants/order_state';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp, randomHex} from '../../lib/common';
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
  droneSignature: string,
  locutusSignature: string,
  orderStatus?: IOrderStatusUnion
) => {
  const id = randomHex(20);
  const orderId = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
  const CFDOrder: ICFDOrder = {
    id: orderId,
    orderType: applyCFDData.orderType,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    txhash,
    fee: 0,
    remark: '',
    instId: applyCFDData.instId,
    state: OrderState.OPENING,
    openPrice: applyCFDData.price,
    openSpotPrice: applyCFDData.quotation.spotPrice,
    openSpreadFee: applyCFDData.quotation.spreadFee,
    createTimestamp: timestamp,
    updatedTimestamp: timestamp,
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
    id,
    orderType: OrderType.CFD,
    txhash,
    sequence,
    applyData: applyCFDData,
    receipt: {
      txhash,
      sequence,
      orderSnapshot: CFDOrder,
      balanceSnapshot: [
        {
          currency: applyCFDData.margin.asset,
          available: balance.available - applyCFDData.margin.amount,
          locked: balance.locked + applyCFDData.margin.amount,
        },
      ],
    },
    userSignature: userSignature,
    droneSignature: droneSignature,
    locutusSignature: locutusSignature,
    createTimestamp: timestamp,
  };
  return {CFDOrder, acceptedCFDOrder};
};

export const convertApplyUpdateCFDToAcceptedCFD = (
  applyCFDData: IApplyUpdateCFDOrder,
  cfdOrder: ICFDOrder,
  balance: IBalance,
  userSignature: string,
  droneSignature: string,
  locutusSignature: string,
  orderStatus?: IOrderStatusUnion
) => {
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
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
    id,
    orderType: OrderType.CFD,
    txhash,
    sequence,
    applyData: applyCFDData,
    receipt: {
      txhash,
      sequence,
      orderSnapshot: updateCFDOrder,
      balanceSnapshot: [
        {
          ...balance,
        },
      ],
    },
    userSignature: userSignature,
    droneSignature: droneSignature,
    locutusSignature: locutusSignature,
    createTimestamp: timestamp,
  };
  return {updateCFDOrder, acceptedCFDOrder};
};

export const convertApplyCloseCFDToAcceptedCFD = (
  applyCFDData: IApplyCloseCFDOrder,
  cfdOrder: ICFDOrder,
  balance: IBalance,
  userSignature: string,
  droneSignature: string,
  locutusSignature: string,
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
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
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
    id,
    orderType: OrderType.CFD,
    txhash,
    sequence,
    applyData: applyCFDData,
    receipt: {
      txhash,
      sequence,
      orderSnapshot: updateCFDOrder,
      balanceSnapshot: [
        {
          ...balance,
          available: balance.available - balanceDiff.available,
          locked: balance.locked + balanceDiff.locked,
        },
      ],
    },
    userSignature: userSignature,
    droneSignature: droneSignature,
    locutusSignature: locutusSignature,
    createTimestamp: timestamp,
  };
  return {updateCFDOrder, acceptedCFDOrder};
};
