export interface IWalletBalance {
  currency: string;
  balance: number;
}

export const dummyWalletBalance_USDT: IWalletBalance = {
  currency: 'USDT',
  balance: 1296.5,
};

export const dummyWalletBalance_ETH: IWalletBalance = {
  currency: 'ETH',
  balance: 329.87,
};

export const dummyWalletBalance_BTC: IWalletBalance = {
  currency: 'BTC',
  balance: 0.013,
};
