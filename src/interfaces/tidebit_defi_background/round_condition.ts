export type IRoundConditionConstant = 'ENLARGE' | 'SHRINK';
export interface IRoundCondition {
  ENLARGE: IRoundConditionConstant;
  SHRINK: IRoundConditionConstant;
}

export const RoundCondition: IRoundCondition = {
  ENLARGE: 'ENLARGE',
  SHRINK: 'SHRINK',
};
