export type IOrderType = 'CFD' | 'DEPOSIT' | 'WITHDRAW' | 'SPOT';

export type IOrderTypeConstant = {
  [key: string]: IOrderType;
};

export const OrderType: IOrderTypeConstant = {
  CFD: 'CFD',
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  SPOT: 'SPOT',
};
