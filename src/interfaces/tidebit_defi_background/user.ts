import {IOrderStatusUnion} from '../../constants/order_status_union';
import {Trend} from '../../constants/trend';
import {ICFDBrief} from './cfd_brief';
import {ICFDOrderCreatingProps} from './cfd_order_request';
import {ICFDOrderUpdateRequest} from './cfd_order_update';
// import {IClosedCFDBrief} from './closed_cfd_brief';
import {IClosedCFDDetails} from './closed_cfd_details';
import {IDepositOrder} from './deposit_order';
import {INotificationItem} from './notification_item';
// import {IOpenCFDBrief} from './open_cfd_brief';
import {IOpenCFDDetails, dummyOpenCFDDetails} from './open_cfd_details';
import {IOpenCFDOrder} from './open_cfd_order';

import {ITickerItem} from './ticker_item';
import {IUserBalance} from './user_balance';
import {IWithdrawalOrder} from './withdrawal_order';

export interface IUser {
  id: string | null;
  username: string | null;
  email: string | null;
  wallet: string | null;
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnected: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  walletId: string | null;
  tideBitId: string | null;
  enableServiceTerm: boolean;

  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => Promise<void>;
  signServiceTerms: () => Promise<boolean>;
  addFavoriteTicker: (props: ITickerItem) => Promise<void>;
  removeFavoriteTicker: (props: ITickerItem) => Promise<void>;

  favoriteTickers: ITickerItem[];
  getFavoriteTickers: () => ITickerItem[];

  balances: IUserBalance;
  // + getTotalBalace(userId): return total balance in USDT with abvl and locked
  // + getPnL(): return today, 30days, total PNL

  getWalletBalance: (asset: string) => number; // 可入金多少
  // getBalances: (source: string, currencyId?: string) => IUserBalance;
  // + getBalances(source, currencyId[optional]):<Balance>

  // attribute 在前端用 useState 或用 const 來寫
  // CFDDetails: ICFDDetails;
  // openCFDItems: IOpenCFDBrief[];
  // closedCFDItems: IClosedCFDBrief[];
  positionsOnChart: ICFDBrief[];

  // 拿到所有 CFD 資料；function 用於不須及時更新的資料
  getOpenedCFD: () => IOpenCFDDetails[];
  getClosedCFD: () => IClosedCFDDetails[];

  // TODO: Replace IOrderStatusUnion with IResult (or better replacement)
  createOrder: (props: IOpenCFDOrder) => Promise<IOrderStatusUnion>;
  closeOrder: (props: {id: string}) => Promise<IOrderStatusUnion>;
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise<IOrderStatusUnion>;
  deposit: (props: IDepositOrder) => Promise<IOrderStatusUnion>;
  withdraw: (props: IWithdrawalOrder) => Promise<IOrderStatusUnion>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const dummyOpenCfds: IOpenCFDDetails[] = [
  {
    id: 'TBD20230207001',
    ticker: 'ETH',
    amount: 100,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 100,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: Trend.UP,
      symbol: '+',
      value: 90752,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207002',
    ticker: 'ETH',
    amount: 200,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 200,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: Trend.UP,
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207003',
    ticker: 'ETH',
    amount: 300,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 300,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: Trend.UP,
      symbol: '+',
      value: 9075200,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207004',
    ticker: 'ETH',
    amount: 400,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 400,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: Trend.UP,
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
];

// TODO: Produce different data for each elements
// : IOpenCFDDetails[]
// export const dummyOpenCfds = [...dummyOpenCfdOrders]

// [
//   dummyOpenCFDDetails,
//   dummyOpenCFDDetails,
//   dummyOpenCFDDetails,
//   dummyOpenCFDDetails,
// ];

// -----------Ignores below----------------
// 拿到所有withdraw / deposit / CFD 紀錄
// receipts: IReceipt[];
// getHistory: () => null;
// + getHistory():Array<SignedOrder:SignedWithdraw, SingedDeposit, SignedCFD>
