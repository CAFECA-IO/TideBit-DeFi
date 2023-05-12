export interface IUserAssets {
  currency: string;
  balance: {
    available: number;
    locked: number;
  };
  pnl: {
    today: {
      amount: number;
      percentage: number;
    };
    monthly: {
      amount: number;
      percentage: number;
    };
    cumulative: {
      amount: number;
      percentage: number;
    };
  };
  interest: {
    apy: number;
    monthly: number;
    cumulative: number;
  };
}

export const getDummyUserAssets = (currency: string) => {
  const userAssets: IUserAssets = {
    currency: 'USDT',
    balance: {
      available: 1296.47,
      locked: 589.628,
    },
    pnl: {
      today: {
        amount: -128.293,
        percentage: -1.5,
      },
      monthly: {amount: 98164532.83, percentage: 10.36},
      cumulative: {amount: -57692.4, percentage: -22.75},
    },
    interest: {
      apy: 1,
      monthly: 20.2,
      cumulative: 245,
    },
  };
  return userAssets;
};
