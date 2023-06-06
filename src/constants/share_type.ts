export type IShareType = 'CFD' | 'rank' | 'badge' | 'article';

export interface IShareTypeConstant {
  CFD: IShareType;
  RANK: IShareType;
  BADGE: IShareType;
  ARTICLE: IShareType;
}

export const ShareType: IShareTypeConstant = {
  CFD: 'CFD',
  RANK: 'rank',
  BADGE: 'badge',
  ARTICLE: 'article',
};
