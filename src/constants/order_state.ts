export type IOrderState = 'OPENING' | 'CLOSED' | 'FREEZED';
export interface IOrderStateConstant {
  OPENING: IOrderState;
  CLOSED: IOrderState;
  FREEZED: IOrderState;
}
export const OrderState: IOrderStateConstant = {
  OPENING: 'OPENING',
  CLOSED: 'CLOSED',
  FREEZED: 'FREEZED',
};
