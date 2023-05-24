import {TRANSFER_OPTIONS} from '../../constants/display';

export interface IBalanceDetails {
  id: string;
  userAddress: string;
  currency: string;
  available: number;
  locked: number;
  blockNumber?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface IBalance {
  currency: string;
  available: number;
  locked: number;
}

export const convertBalanceDetailsToBalance = (balanceDetails: IBalanceDetails): IBalance => {
  const balance: IBalance = {
    currency: balanceDetails.currency,
    available: balanceDetails.available,
    locked: balanceDetails.locked,
  };
  return balance;
};

export const getDummyBalances = () => {
  const balances: IBalance[] = TRANSFER_OPTIONS.map(option => {
    const balance: IBalance = {
      currency: option.label,
      available: parseFloat((Math.random() * 1000).toFixed(2)),
      locked: parseFloat((Math.random() * 1000).toFixed(2)),
    };
    return balance;
  });
  return balances;
};

export function isIBalance(obj: IBalance): obj is IBalance {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'currency' in obj &&
    typeof obj.currency === 'string' &&
    'available' in obj &&
    typeof obj.available === 'number' &&
    'locked' in obj &&
    typeof obj.locked === 'number'
  );
}
