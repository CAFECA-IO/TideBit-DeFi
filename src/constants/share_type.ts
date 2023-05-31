export type IShareType = 'CFD' | 'rank' | 'badge';

export interface IShareTypeConstant {
  CFD: IShareType;
  RANK: IShareType;
  BADGE: IShareType;
}

export const ShareType: IShareTypeConstant = {
  CFD: 'CFD',
  RANK: 'rank',
  BADGE: 'badge',
};
