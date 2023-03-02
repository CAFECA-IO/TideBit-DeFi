import {TRANSFER_OPTIONS} from '../../constants/display';

export interface IBalance {
  currency: string;
  available: number;
  locked: number;
}

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
