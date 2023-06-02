export interface IBriefNewsItem {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  // link: string;
  img: string;
}

export const dummyBriefNewsItem: IBriefNewsItem = {
  id: '1',
  timestamp: 1675299651,
  title: 'TideBit DeFi Launches CFD Trading',
  description: 'TideBit DeFi Launches CFD Trading',
  // link: 'https://www.tidebit.com',
  img: '/elements/2634@2x.png',
};
