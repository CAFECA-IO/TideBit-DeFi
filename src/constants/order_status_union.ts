export type IOrderStatusUnion = 'WAITING' | 'PROCESSING' | 'SUCCESS' | 'CANCELDED' | 'FAILED';

export type IOrderStatusUnionConstant = {
  WAITING: IOrderStatusUnion;
  PROCESSING: IOrderStatusUnion;
  SUCCESS: IOrderStatusUnion;
  CANCELDED: IOrderStatusUnion;
  FAILED: IOrderStatusUnion;
};

export const OrderStatusUnion: IOrderStatusUnionConstant = {
  WAITING: 'WAITING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  CANCELDED: 'CANCELDED',
  FAILED: 'FAILED',
};
