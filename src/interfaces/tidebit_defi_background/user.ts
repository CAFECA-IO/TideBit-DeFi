import {ICFDBrief} from './cfd_brief';
import {ICFDOrderCreatingRequest} from './cfd_order_request';
import {ICFDOrderUpdateRequest} from './cfd_order_update';
import {IClosedCFDBrief} from './closed_cfd_brief';
import {IClosedCFDDetails} from './closed_cfd_details';
import {INotificationItem} from './notification_item';
import {IOpenCFDBrief} from './open_cfd_brief';
import {IOpenCFDDetails, dummyOpenCFDDetails} from './open_cfd_details';
import {IOrderStatusUnion} from './order_status_union';
import {ITickerItem} from './ticker_item';
import {IUserBalance} from './user_balance';

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

  favoriteTickers: ITickerItem[]; // TODO: missed in the document
  getFavoriteTickers: () => ITickerItem[];

  balances: IUserBalance;
  // + getTotalBalace(userId): return total balance in USDT with abvl and locked
  // + getPnL(): return today, 30days, total PNL

  // TODO: function name
  getWalletBalance: (asset: string) => number; // 可入金多少
  // getBalances: (source: string, currencyId?: string) => IUserBalance;
  // + getBalances(source, currencyId[optional]):<Balance>

  // attribute 在前端用 useState 或用 const 來寫
  // CFDDetails: ICFDDetails;
  openCFDItems: IOpenCFDBrief[];
  closedCFDItems: IClosedCFDBrief[];
  positionsOnChart: ICFDBrief[];

  // 拿到所有 CFD 資料；function 用於不須及時更新的資料
  getOpenedCFD: () => IOpenCFDDetails[];
  getClosedCFD: () => IClosedCFDDetails[];

  // TODO: uncertain props
  createOrder: (props: ICFDOrderCreatingRequest) => Promise<IOrderStatusUnion>;
  closeOrder: (props: {id: string}) => Promise<IOrderStatusUnion>;
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise<IOrderStatusUnion>;
  deposit: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const dummyOpenCFDDetails1: IOpenCFDDetails = {
  id: 'TBD202302070000001',
  ticker: 'ETH',
  amount: 1.8,
  state: 'OPENING',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: randomIntFromInterval(650, 10000),
  openPrice: 24058,
  fee: 0,
  guaranteedStop: false,
  guaranteedStopFee: 0.77,
  openTimestamp: 1675299651,
  scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
  openValue: 74589658,
  pnl: {
    type: 'UP',
    symbol: '+',
    value: 90752,
  },
  liquidationPrice: 19537,
  takeProfit: 74521,
  stopLoss: 25250,
  recommendedTp: 35412,
  recommendedSl: 19453,
};

// [true, false][randomIntFromInterval(0, 1)]
// ['+', '-'][randomIntFromInterval(0, 1)]

// const dummyOpenCFDDetailsArray: IOpenCFDDetails[] = Array.from({ length: 10 }, () => {
//   return {
//     id: `TBD${randomIntFromInterval(100000000, 999999999)}`,
//     ticker: ['ETH', 'BTC'][randomIntFromInterval(0, 1)],
//     amount: randomIntFromInterval(1, 10) + Math.random(),
//     state: 'OPENING',
//     typeOfPosition: ['BUY', 'SELL'][randomIntFromInterval(0, 1)],
//     leverage: 5,
//     margin: randomIntFromInterval(650, 10000),
//     openPrice: randomIntFromInterval(10000, 100000),
//     fee: Math.random(),
//     guaranteedStop: false,
//     guaranteedStopFee: Math.random(),
//     openTimestamp: 1675299651,
//     scheduledClosingTimestamp: 1675386051,
//     openValue: randomIntFromInterval(1000000, 1000000000),
//     pnl: {
//       type: 'UP',
//       symbol: '+',
//       value: 90752,
//     },
//     liquidationPrice: randomIntFromInterval(10000, 100000),
//     // takeProfit: randomIntFromInterval(10000, 100000),
//     // stopLoss: randomIntFromInterval(10000, 100000),
//     recommendedTp: randomIntFromInterval(10000, 100000),
//     recommendedSl: randomIntFromInterval(10000, 100000),
//   };
// });

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
      type: 'UP',
      symbol: '+',
      value: 90752,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
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
      type: 'UP',
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
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
      type: 'UP',
      symbol: '+',
      value: 9075200,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
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
      type: 'UP',
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
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
