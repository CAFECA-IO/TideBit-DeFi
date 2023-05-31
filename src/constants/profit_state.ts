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

export const getProfitState = (value: number): IProfitState => {
  if (value > 0) {
    return ProfitState.PROFIT;
  } else if (value < 0) {
    return ProfitState.LOSS;
  } else {
    return ProfitState.EQUAL;
  }
};
