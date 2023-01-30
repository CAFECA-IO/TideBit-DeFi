import {ICFDBrief} from './cfd_brief';
import {ICFDOrderCreatingRequest} from './cfd_order_request';
import {ICFDOrderUpdateRequest} from './cfd_order_update';
import {IClosedCFDBrief} from './closed_cfd_brief';
import {IClosedCFDDetails} from './closed_cfd_details';
import {INotificationItem} from './notification_item';
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

  // function 用於不須及時更新的資料
  getOpenedCFD: (positionId: string) => IOpenCFDDetails[];
  getClosedCFD: (positionId: string) => IClosedCFDDetails[];

  // TODO: uncertain props
  createOrder: (props: ICFDOrderCreatingRequest) => Promise<IOrderStatusUnion>;
  closeOrder: (props: {id: string}) => Promise<IOrderStatusUnion>;
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise<IOrderStatusUnion>;
  deposit: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
}

// -----------Ignores below----------------
// 拿到所有withdraw / deposit / CFD 紀錄
// receipts: IReceipt[];
// getHistory: () => null;
// + getHistory():Array<SignedOrder:SignedWithdraw, SingedDeposit, SignedCFD>
