import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {ICFDSuggestion} from './cfd_suggestion';
import {IPnL} from './pnl';
import {getDummyApplyCreateCFDOrder} from './apply_create_cfd_order_data';
import {convertApplyCreateCFDToAcceptedCFD} from './apply_cfd_order';
import {randomHex, toDisplayAcceptedCFDOrder} from '../../lib/common';

export interface IDisplayAcceptedCFDOrder extends IAcceptedCFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
  suggestion: ICFDSuggestion;
  stateCode: number;
}

export const getDummyDisplayAcceptedCFDOrder = (currency: string) => {
  const dummyApplyCloseCFDOrder = getDummyApplyCreateCFDOrder(currency);
  const acceptedCFDOrder = convertApplyCreateCFDToAcceptedCFD(
    dummyApplyCloseCFDOrder,
    {currency, available: 10, locked: 0},
    randomHex(32),
    randomHex(32)
  );
  const dummyPositionLineGraph: number[] = [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10];
  const dummyDisplayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(
    acceptedCFDOrder,
    dummyPositionLineGraph
  );
  return dummyDisplayAcceptedCFDOrder;
};

export const dummyDisplayAcceptedCFDOrders: IDisplayAcceptedCFDOrder[] = [
  {
    display: true,
    id: 'open00001',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1681253000,
      currency: 'USDT',
      available: 1000,
      locked: 30,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 30,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1681253000,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00001',
      txid: '0x000000001',
      ticker: 'ETH',
      openPrice: 2321,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1681253000,
      unitAsset: 'USDT',
      targetAsset: 'ETH',
      leverage: 5,
      amount: 1.52,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1681758602,
      liquidationPrice: 300,
      typeOfPosition: 'BUY',
      fee: 0,
      guaranteedStop: false,
    },
    pnl: {
      type: 'PROFIT',
      value: 0.589,
    },
    openValue: 3526.4,
    closeValue: 4371.32,
    positionLineGraph: [10050, 9972, 13060, 4065, 3042, 8235, 20000, 7100, 4532, 7894],
    suggestion: {
      takeProfit: 0,
      stopLoss: 0,
    },
    targetAmount: 2331,
    targetAsset: 'ETH',
    userSignature: '',
    nodeSignature: '',
    stateCode: 0,
  },
  {
    display: true,
    id: 'open00002',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1681203000,
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1681203000,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00002',
      txid: '0x000000002',
      ticker: 'ETH',
      openPrice: 8731,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1681203000,
      unitAsset: 'USDT',
      targetAsset: 'ETH',
      leverage: 5,
      amount: 21.2,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1681783602,
      liquidationPrice: 230,
      typeOfPosition: 'SELL',
      fee: 0,
      guaranteedStop: true,
      stopLoss: 600,
    },
    pnl: {
      type: 'LOSS',
      value: 21.302,
    },
    openValue: 5312.4,
    closeValue: 4371.32,
    positionLineGraph: [4020, 972, 5720, 2000, 7100, 815, 632, 2065, 3422, 4532, 6720, 815],
    suggestion: {
      takeProfit: 0,
      stopLoss: 600,
    },
    targetAmount: 2331,
    targetAsset: 'ETH',
    userSignature: '',
    nodeSignature: '',
    stateCode: 3,
  },
  {
    display: true,
    id: 'open00003',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1687510000,
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1687510000,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00003',
      txid: '0x000000003',
      ticker: 'ETH',
      openPrice: 2931,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1687510000,
      unitAsset: 'USDT',
      targetAsset: 'ETH',
      leverage: 5,
      amount: 2.26,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1682208500,
      liquidationPrice: 400,
      typeOfPosition: 'BUY',
      fee: 0,
      guaranteedStop: true,
      takeProfit: 50000,
    },
    pnl: {
      type: 'LOSS',
      value: 621.3,
    },
    openValue: 6392.4,
    closeValue: 4371.32,
    positionLineGraph: [30422, 4532, 560, 720, 8145, 8925, 5245, 20700, 7100, 47278],
    suggestion: {
      takeProfit: 50000,
      stopLoss: 0,
    },
    targetAmount: 2331,
    targetAsset: 'ETH',
    userSignature: '',
    nodeSignature: '',
    stateCode: 1,
  },
  {
    display: true,
    id: 'open00004',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1683600000,
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1683600000,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00004',
      txid: '0x000000004',
      ticker: 'SOL',
      openPrice: 2931,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1683600000,
      unitAsset: 'USDT',
      targetAsset: 'SOL',
      leverage: 5,
      amount: 72.9,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1682806007,
      liquidationPrice: 50,
      typeOfPosition: 'SELL',
      fee: 0,
      guaranteedStop: true,
      stopLoss: 200,
    },
    pnl: {
      type: 'PROFIT',
      value: 81.43,
    },
    openValue: 2372.9,
    closeValue: 4371.32,
    positionLineGraph: [50, 89, 4532, 560, 720, 8145, 8925, 5245, 10700, 710, 650, 343],
    suggestion: {
      takeProfit: 0,
      stopLoss: 20,
    },
    targetAmount: 2331,
    targetAsset: 'SOL',
    userSignature: '',
    nodeSignature: '',
    stateCode: 2,
  },
  {
    display: true,
    id: 'open00005',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1682351000,
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1682351000,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00005',
      txid: '0x000000005',
      ticker: 'BTC',
      openPrice: 2931,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1682351000,
      unitAsset: 'USDT',
      targetAsset: 'SOL',
      leverage: 5,
      amount: 72.9,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1683206007,
      liquidationPrice: 50,
      typeOfPosition: 'SELL',
      fee: 0,
      guaranteedStop: true,
      takeProfit: 300,
      stopLoss: 100,
    },
    pnl: {
      type: 'PROFIT',
      value: 111.1,
    },
    openValue: 5823.24,
    closeValue: 4371.32,
    positionLineGraph: [150, 4323, 42, 289, 132, 1485, 650, 143, 290],
    suggestion: {
      takeProfit: 0,
      stopLoss: 20,
    },
    targetAmount: 2331,
    targetAsset: 'BTC',
    userSignature: '',
    nodeSignature: '',
    stateCode: 3,
  },
  {
    display: true,
    id: 'open00006',
    orderType: 'CFD',
    balanceSnapshot: {
      createTimestamp: 1682325400,
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    balanceDifferenceCauseByOrder: {
      currency: 'USDT',
      available: 1000,
      locked: 50,
    },
    orderStatus: 'SUCCESS',
    createTimestamp: 1682325400,
    applyData: {
      orderType: 'CFD',
      operation: 'CREATE',
    },
    orderSnapshot: {
      id: 'open00006',
      txid: '0x000000006',
      ticker: 'ETH',
      openPrice: 8731,
      orderType: 'CFD',
      state: 'OPENING',
      referenceId: '',
      createTimestamp: 1682325400,
      unitAsset: 'USDT',
      targetAsset: 'ETH',
      leverage: 5,
      amount: 21.2,
      margin: {
        asset: 'USDT',
        amount: 1000,
      },
      liquidationTime: 1681953602,
      liquidationPrice: 1500,
      typeOfPosition: 'BUY',
      fee: 0,
      guaranteedStop: false,
    },
    pnl: {
      type: 'LOSS',
      value: 1.413,
    },
    openValue: 3392.4,
    closeValue: 4371.32,
    positionLineGraph: [
      4246, 6890, 972, 5720, 20050, 7100, 815, 632, 2065, 3422, 4532, 6720, 8415, 2451,
    ],
    suggestion: {
      takeProfit: 0,
      stopLoss: 0,
    },
    targetAmount: 2331,
    targetAsset: 'ETH',
    userSignature: '',
    nodeSignature: '',
    stateCode: 0,
  },
];

/* TODO: dummyDisplayAcceptedCFDOrder (20230330 - tzuhan)
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const getDummyDisplayAcceptedCFDs = (currency: string) => {
  const dummyDisplayAcceptedCFDs: IDisplayAcceptedCFDOrder[] = [];
  for (let i = 0; i < 3; i++) {
    const profit = Math.random() > 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
    const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
    const date = new Date();
    const dummyDisplayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
      id: `TBDisplay${date.getFullYear()}${
        date.getMonth() + 1
      }${date.getDate()}${date.getSeconds()}${currency}`,
      txid: '0x',
      ticker: currency,
      state: OrderState.CLOSED,
      typeOfPosition: typeOfPosition,
      targetAsset: currency,
      unitAsset: unitAsset,
      openPrice: randomIntFromInterval(1000, 10000),
      amount: 1.8,
      createTimestamp: 1675299651,
      leverage: 5,
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
      takeProfit: 74521,
      stopLoss: 25250,
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: 1675386051,
      closePrice: randomIntFromInterval(1000, 10000),
      closeTimestamp: 1675386051,
      closedType: CFDClosedType.SCHEDULE,
      forcedClose: true,
      remark: 'str',
      pnl: {
        type: profit,
        value: 90752,
      },
      openValue: 24058 * 1.8,
      closeValue: 19537 * 1.8,
      positionLineGraph: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
      suggestion: {takeProfit: 74521, stopLoss: 25250},
      orderType: 'CFD',
      orderStatus: 'FAILED',
    };
    dummyDisplayAcceptedCFDs.push(dummyDisplayAcceptedCFDOrder);
  }
  return dummyDisplayAcceptedCFDs;
};
*/
