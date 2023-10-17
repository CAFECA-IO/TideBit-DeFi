export type IRoundConditionConstant = 'ENLARGE' | 'SHRINK' | 'ROUND';
export interface IRoundCondition {
  ENLARGE: IRoundConditionConstant;
  SHRINK: IRoundConditionConstant;
  ROUND: IRoundConditionConstant;
}

export const RoundCondition: IRoundCondition = {
  ENLARGE: 'ENLARGE',
  SHRINK: 'SHRINK',
  ROUND: 'ROUND',
};
