export type IOrderType = 'CFD' | 'DEPOSIT' | 'WITHDRAW' | 'SPOT';

export type IOrderTypeConstant = {
  CFD: IOrderType;
  DEPOSIT: IOrderType;
  WITHDRAW: IOrderType;
  SPOT: IOrderType;
};

export const OrderType: IOrderTypeConstant = {
  CFD: 'CFD',
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  SPOT: 'SPOT',
};
