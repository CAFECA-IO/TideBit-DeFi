import {OrderState} from '../../constants/order_state';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ICFDDetails} from './cfd_details';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDDetails extends ICFDDetails {
  positionLineGraph: ITickerLineGraph;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const dummyOpenCFDDetails: IOpenCFDDetails = {
  id: 'TBD202302070000001',
  ticker: 'ETH',
  amount: 1.8,
  state: OrderState.OPENING,
  typeOfPosition: TypeOfPosition.BUY,
  leverage: 5,
  margin: randomIntFromInterval(650, 10000),
  openPrice: randomIntFromInterval(10, 100),
  fee: 0,
  guaranteedStop: false,
  guaranteedStopFee: 0.77,
  openTimestamp: 1675299651,
  scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
  openValue: 74589658,
  pnl: {
    type: ProfitState.PROFIT,
    value: 90752,
  },
  liquidationPrice: 19537,
  takeProfit: 74521,
  // stopLoss: 25250,
  recommendedTp: 35412,
  recommendedSl: 19453,
  positionLineGraph: {
    dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
  },
};

export const getDummyOpenCFDs = (currency: string, number = 3) => {
  const dummyOpenCFDs: IOpenCFDDetails[] = [];
  for (let i = 0; i < number; i++) {
    const profit = Math.random() > 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
    const dummyOpenCFD: IOpenCFDDetails = {
      id: `TBD${Date.now()}${(Math.random() * 10000).toFixed(0)}`,
      ticker: currency,
      amount: 1.8,
      state: OrderState.OPENING,
      typeOfPosition: Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL,
      leverage: 5,
      margin: randomIntFromInterval(650, 10000),
      openPrice: randomIntFromInterval(10, 100),
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      openTimestamp: Date.now() / 1000 + i * 60 * 60,
      scheduledClosingTimestamp: Date.now() / 1000 + i * 60 * 60 + 10 * 24 * 60 * 60, // openTimestamp + 86400
      openValue: 74589658,
      pnl: {
        type: profit,
        value: parseInt((Math.random() * 1000).toFixed(0)),
      },
      liquidationPrice: 19537,
      takeProfit: 74521,
      // stopLoss: 25250,
      recommendedTp: 35412,
      recommendedSl: 19453,
      positionLineGraph: {
        dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
      },
    };
    dummyOpenCFDs.push(dummyOpenCFD);
  }
  return dummyOpenCFDs;
};
