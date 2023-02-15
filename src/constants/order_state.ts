export type IOrderState = 'OPENING' | 'CLOSED';
export interface IOrderStateConstant {
  [key: string]: IOrderState;
}
export const OrderState: IOrderStateConstant = {
  OPENING: 'OPENING',
  CLOSED: 'CLOSED',
};
