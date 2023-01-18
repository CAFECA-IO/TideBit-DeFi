import {ICFDBrief} from './cfd_brief';
import {ICFDOrderRequest} from './cfd_order_request';
import {ICFDOrderUpdate} from './cfd_order_update';
import {IClosedCFDBrief} from './closed_cfd_brief';
import {IClosedCFDDetails} from './closed_cfd_details';
import {INotification} from './notification';
import {IOpenCFDBrief} from './open_cfd_brief';
import {IOpenCFDDetails} from './open_cfd_details';
import {IOrderStatusUnion} from './order_status_union';
import {ITickerItem} from './ticker_item';
import {IUserBalance} from './user_balance';

export interface IUser {
  id: string | null;
  username: string | null;
  email: string | null;
  wallet: string | null;
  favoriteTickers: ITickerItem[];
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnected: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  walletId: string | null;
  tideBitId: string | null;
  enableServiceTerm: boolean;

  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  signServiceTerm: () => Promise<boolean>;
  addFavoriteTicker: (props: ITickerItem) => Promise<void>;
  removeFavoriteTicker: (props: ITickerItem) => Promise<void>;

  balances: IUserBalance;
  getWalletBalance: (asset: string) => number;
  // getTotalBalace: () => IUserBalance;
  // getPnL: () => null;

  // attribute 在前端用 useState 或用 const 來寫
  // CFDDetails: ICFDDetails;
  openCFDItems: IOpenCFDBrief[];
  closedCFDItems: IClosedCFDBrief[];
  positionsOnChart: ICFDBrief[];

  // function 用於不須及時更新的資料
  getOpenedCFD: (id: number) => IOpenCFDDetails[];
  getClosedCFD: (id: number) => IClosedCFDDetails[];

  createOrder: (props: ICFDOrderRequest) => Promise<IOrderStatusUnion>;
  closeOrder: (props: {id: string}) => Promise<IOrderStatusUnion>;
  updateOrder: (props: ICFDOrderUpdate) => Promise<IOrderStatusUnion>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
  deposit: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;

  notifications: INotification[];
  // getNotifications: () => INotification[];

  // -----------Ignores below----------------
  // 拿到所有withdraw / deposit / CFD 紀錄
  // receipts: IReceipt[];
  // getHistory: () => null;
  // + getHistory():Array<SignedOrder:SignedWithdraw, SingedDeposit, SignedCFD>
}
