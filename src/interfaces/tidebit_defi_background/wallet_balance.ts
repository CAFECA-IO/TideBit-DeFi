export interface IWalletBalance {
  currency: string;
  balance: number;
}

export const dummyWalletBalancelist: IWalletBalance[] = [
  {
    currency: 'BTC',
    balance: 1,
  },
  {
    currency: 'ETH',
    balance: 10,
  },
  {
    currency: 'USDT',
    balance: 100,
  },
];
