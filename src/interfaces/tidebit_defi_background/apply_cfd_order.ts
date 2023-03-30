import {CFDOperation, ICFDOperation} from '../../constants/cfd_order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {IApplyCloseCFDOrder} from './apply_close_cfd_order_data';
import {IApplyCreateCFDOrder} from './apply_create_cfd_order_data';
import {IApplyOrder} from './apply_order';
import {IApplyUpdateCFDOrder} from './apply_update_cfd_order_data';
import {IBalance} from './balance';

export interface IApplyCFDOrder extends IApplyOrder {
  operation: ICFDOperation;
}

// TODO: temp id then replace by DB id (20230330 - tzuhan)
export const convertApplyCreateCFDToAcceptedCFD = (
  applyCFDData: IApplyCreateCFDOrder,
  balance: IBalance,
  userSignature: string,
  nodeSignature: string
) => {
  const date = new Date();
  const id = `${OrderType.CFD}${CFDOperation.CREATE}${date.getTime()}${
    applyCFDData.ticker
  }${Math.ceil(Math.random() * 1000000000)}`;
  const txid = randomHex(32);
  const accpetedCFDOrder: IAcceptedCFDOrder = {
    id,
    orderType: OrderType.CFD,
    orderStatus: OrderStatusUnion.WAITING,
    applyData: applyCFDData,
    targetAsset: applyCFDData.margin.asset,
    targetAmount: -applyCFDData.margin.amount,
    userSignature: userSignature,
    orderSnapshot: {
      id,
      txid,
      fee: 0,

      ticker: applyCFDData.ticker,
      state: OrderState.OPENING,
      orderType: applyCFDData.orderType,

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
    },
    balanceDifferenceCauseByOrder: {
      currency: applyCFDData.margin.asset,
      available: -applyCFDData.margin.amount,
      locked: applyCFDData.margin.amount,
    },
    balanceSnapshot: {
      currency: applyCFDData.margin.asset,
      available: balance.available - applyCFDData.margin.amount,
      locked: balance.locked + applyCFDData.margin.amount,
      createTimestamp: getTimestamp(),
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
    display: true,
  };
  return accpetedCFDOrder;
};

export const convertApplyUpdateCFDToAcceptedCFD = (
  applyCFDData: IApplyUpdateCFDOrder,
  accpetedCFDOrder: IAcceptedCFDOrder,
  userSignature: string,
  nodeSignature: string
) => {
  const date = new Date();
  const id = `${OrderType.CFD}${CFDOperation.UPDATE}${date.getTime()}${
    accpetedCFDOrder.orderSnapshot.ticker
  }${Math.ceil(Math.random() * 1000000000)}`;
  const updateAccpetedCFDOrder: IAcceptedCFDOrder = {
    ...accpetedCFDOrder,
    id,
    orderType: OrderType.CFD,
    orderStatus: OrderStatusUnion.WAITING,
    applyData: applyCFDData,
    userSignature: userSignature,
    balanceDifferenceCauseByOrder: {
      currency: accpetedCFDOrder.balanceDifferenceCauseByOrder.currency,
      available: 0,
      locked: 0,
    },
    orderSnapshot: {
      ...accpetedCFDOrder.orderSnapshot,
      takeProfit: applyCFDData.takeProfit,
      stopLoss: applyCFDData.stopLoss,
      guaranteedStopFee: applyCFDData.guaranteedStopFee,
      guaranteedStop: applyCFDData.guaranteedStop
        ? applyCFDData.guaranteedStop
        : accpetedCFDOrder.orderSnapshot.guaranteedStop,
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
    display: true,
  };
  return updateAccpetedCFDOrder;
};

export const convertApplyCloseCFDToAcceptedCFD = (
  applyCFDData: IApplyCloseCFDOrder,
  accpetedCFDOrder: IAcceptedCFDOrder,
  balance: IBalance,
  userSignature: string,
  nodeSignature: string
) => {
  const {balanceDifferenceCauseByOrder, orderSnapshot} = accpetedCFDOrder;
  const pnl =
    (applyCFDData.closePrice - orderSnapshot.openPrice) *
    orderSnapshot.amount *
    (orderSnapshot.typeOfPosition === TypeOfPosition.BUY ? 1 : -1);
  const balanceDiff = {
    currency: balanceDifferenceCauseByOrder.currency,
    available: balanceDifferenceCauseByOrder.available * -1 + pnl,
    locked: balanceDifferenceCauseByOrder.locked * -1,
  };
  const date = new Date();
  const id = `${OrderType.CFD}${CFDOperation.UPDATE}${date.getTime()}${
    orderSnapshot.ticker
  }${Math.ceil(Math.random() * 1000000000)}`;
  const updateAccpetedCFDOrder: IAcceptedCFDOrder = {
    ...accpetedCFDOrder,
    id,
    orderType: OrderType.CFD,
    orderStatus: OrderStatusUnion.WAITING,
    applyData: applyCFDData,
    userSignature: userSignature,
    balanceDifferenceCauseByOrder: balanceDiff,
    balanceSnapshot: {
      currency: balanceDiff.currency,
      available: balance.available - balanceDiff.available,
      locked: balance.locked + balanceDiff.locked,
      createTimestamp: getTimestamp(),
    },
    orderSnapshot: {
      ...orderSnapshot,
      state: OrderState.CLOSED,
      closePrice: applyCFDData.closePrice,
      closeTimestamp: applyCFDData.closeTimestamp,
      closedType: applyCFDData.closedType,
      forcedClose: false,
      pnl,
    },
    nodeSignature: nodeSignature,
    createTimestamp: getTimestamp(),
    display: true,
  };
  return updateAccpetedCFDOrder;
};
