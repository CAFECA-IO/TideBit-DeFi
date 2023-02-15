export interface IBalance {
  currency: string;
  available: number;
  locked: number;
}

export const dummyBalance_USDT: IBalance = {
  currency: 'USDT',
  available: 1296.5,
  locked: 12.1,
};

export const dummyBalance_ETH: IBalance = {
  currency: 'ETH',
  available: 329.87,
  locked: 0.81,
};

export const dummyBalance_BTC: IBalance = {
  currency: 'BTC',
  available: 0.013,
  locked: 0.0001,
};
