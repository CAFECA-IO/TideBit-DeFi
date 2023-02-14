export type IOrderStatusUnion = 'PROCESSING' | 'SUCCESS' | 'CANCELDED' | 'FAILED';

export type IOrderStatusUnionConstant = {
  [key: string]: IOrderStatusUnion;
};

export const OrderStatusUnion: IOrderStatusUnionConstant = {
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  CANCELDED: 'CANCELDED',
  FAILED: 'FAILED',
};
