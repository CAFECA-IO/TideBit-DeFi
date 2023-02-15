export type IOrderStatusUnion = 'PROCESSING' | 'SUCCESS' | 'CANCELDED' | 'FAILED';

export type IOrderStatusUnionConstant = {
  PROCESSING: IOrderStatusUnion;
  SUCCESS: IOrderStatusUnion;
  CANCELDED: IOrderStatusUnion;
  FAILED: IOrderStatusUnion;
};

export const OrderStatusUnion: IOrderStatusUnionConstant = {
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  CANCELDED: 'CANCELDED',
  FAILED: 'FAILED',
};
