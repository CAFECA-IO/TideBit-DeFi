export type IProfitState = 'PROFIT' | 'LOSS' | 'EQUAL';
export interface IProfitStateConstant {
  PROFIT: IProfitState;
  LOSS: IProfitState;
  EQUAL: IProfitState;
}
export const ProfitState: IProfitStateConstant = {
  PROFIT: 'PROFIT',
  LOSS: 'LOSS',
  EQUAL: 'EQUAL',
};
