import {IPnL} from './pnl';
import {ProfitState} from '../../constants/profit_state';
import {unitAsset} from '../../constants/config';
export interface IUserAssets {
  currency: string;
  balance: {
    available: number;
    locked: number;
  };
  pnl: {
    today: {
      amount: IPnL;
      percentage: IPnL;
    };
    monthly: {
      amount: IPnL;
      percentage: IPnL;
    };
    cumulative: {
      amount: IPnL;
      percentage: IPnL;
    };
  };
  interest: {
    apy: number;
    monthly: number;
    cumulative: number;
  };
}

export const getDummyUserAssets = () => {
  const avbl = parseFloat((Math.random() * 1000).toFixed(2));
  const locked = parseFloat((Math.random() * 1000).toFixed(2));

  const pnlTodayType = Math.random() >= 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
  const pnlTodayAmount = parseFloat((Math.random() * 100).toFixed(2));
  const pnlTodayPercentage = parseFloat((Math.random() * 10).toFixed(2));

  const pnlMonthlyType = Math.random() >= 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
  const pnlMonthlyAmount = parseFloat((Math.random() * 500).toFixed(2));
  const pnlMonthlyPercentage = parseFloat((Math.random() * 50).toFixed(2));

  const pnlCumulativeType = Math.random() >= 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
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
        amount: {type: pnlTodayType, value: pnlTodayAmount},
        percentage: {type: pnlTodayType, value: pnlTodayPercentage},
      },
      monthly: {
        amount: {type: pnlMonthlyType, value: pnlMonthlyAmount},
        percentage: {type: pnlMonthlyType, value: pnlMonthlyPercentage},
      },
      cumulative: {
        amount: {type: pnlCumulativeType, value: pnlCumulativeAmount},
        percentage: {type: pnlCumulativeType, value: pnlCumulativePercentage},
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
