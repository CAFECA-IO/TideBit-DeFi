import {unitAsset} from '../../constants/config';
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
  const avbl = parseFloat((Math.random() * 1000).toFixed(2));
  const locked = parseFloat((Math.random() * 1000).toFixed(2));

  const pnlTodayAmount = parseFloat((Math.random() * 100).toFixed(2));
  const pnlTodayPercentage = parseFloat((Math.random() * 10).toFixed(2));

  const pnlMonthlyAmount = parseFloat((Math.random() * 500).toFixed(2));
  const pnlMonthlyPercentage = parseFloat((Math.random() * 50).toFixed(2));

  const pnlCumulativeAmount = parseFloat((Math.random() * 1000).toFixed(2));
  const pnlCumulativePercentage = parseFloat((Math.random() * 500).toFixed(2));

  const interestApy = parseFloat((Math.random() * 10).toFixed(2));
  const interestMonthly = parseFloat((Math.random() * 100).toFixed(2));
  const interestCumulative = parseFloat((Math.random() * 1000).toFixed(2));

  const userAssets: IUserAssets = {
    currency: unitAsset,
    balance: {
      available: avbl,
      locked: locked,
    },
    pnl: {
      today: {
        amount: pnlTodayAmount,
        percentage: pnlTodayPercentage,
      },
      monthly: {
        amount: pnlMonthlyAmount,
        percentage: pnlMonthlyPercentage,
      },
      cumulative: {
        amount: pnlCumulativeAmount,
        percentage: pnlCumulativePercentage,
      },
    },
    interest: {
      apy: interestApy,
      monthly: interestMonthly,
      cumulative: interestCumulative,
    },
  };
  return userAssets;
};
