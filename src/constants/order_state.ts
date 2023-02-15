export type IOrderState = 'OPENING' | 'CLOSED';
export interface IOrderStateConstant {
  OPENING: IOrderState;
  CLOSED: IOrderState;
}
export const OrderState: IOrderStateConstant = {
  OPENING: 'OPENING',
  CLOSED: 'CLOSED',
};
