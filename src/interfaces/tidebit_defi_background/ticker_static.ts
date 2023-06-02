import {ICurrency} from '../../constants/currency';
import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';
import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';
import {getDummyTicker, ITickerData} from './ticker_data';

export interface ITickerStatic {
  id: string;
  label: string; // 交易對名稱
  leverage: number;

  guaranteedStopFee: number; // 保證停損手續費

  // slippage: number; // 滑價
  cryptoBriefNews: IBriefNewsItem[]; // 相關新聞
  // getCryptoNews: () => IBriefNewsItem[];
  cryptoSummary: ICryptoSummary; // 相關資訊
  // getCryptoSummary: () => ICryptoSummary;
}
const dummy = generateDummyData(9);
export const dummyTickerStatic: ITickerStatic = {
  id: 'ETH',
  label: 'ETH',
  leverage: 5,
  guaranteedStopFee: 0.2,
  cryptoBriefNews: dummy,

  cryptoSummary: {
    icon: '/asset_icon/eth.svg', // TODO: Use icon of Context in CryptoSummary component instead of hardcode
    id: 'ETH',
    name: 'Ethereum',
    introduction: `Ethereum (ETH) was launched in 2015. Ethereum is a decentralized blockchain that supports smart contracts-essentially computer programs-that can automatically execute when certain conditions are met. The native cryptocurrency-essentially computer programs-of the platform is called ether or ethereum. Ethereum is divisible to 18 decimal places. There is currently no hard cap on the total supply
of ETH.`,
    whitePaperLink: '#',
    websiteLink: '#',
    price: '39051 USDT',
    rank: 1,
    publishTime: '2008-11-01',
    publishAmount: '21,000,000',
    tradingValue: '576,461,120',
    tradingVolume: '19,014,962',
    totalValue: '820,071,000,000 USDT',
  },
};

export const getDummyTickerStatic = (currency: ICurrency) => {
  const ticker: ITickerData = getDummyTicker(currency);

  const tickerStatic: ITickerStatic = {
    id: `${currency}`,
    label: `${currency}`,
    leverage: 5,
    guaranteedStopFee: 0.2,
    cryptoBriefNews: [
      {
        id: 'NEWS20230210001',
        timestamp: 1675299651,
        title: `Add news title here(${currency})`,
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
        // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
        img: '/news/rectangle_715@2x.png',
      },
      {
        id: 'NEWS20230210002',
        timestamp: 1675299651,
        title: `Add news title here(${currency})`,
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
        img: '/news/rectangle_716@2x.png',
      },
      {
        id: 'NEWS20230210003',
        timestamp: 1675299651,
        title: `Add news title here(${currency})`,
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
        img: '/news/rectangle_717@2x.png',
      },
    ],

    cryptoSummary: {
      icon: ticker.tokenImg,
      id: `${currency}`,
      name: `${currency}`,
      introduction: `${currency} (${currency}) was launched in 2015. ${currency} is a decentralized blockchain that supports smart contracts-essentially computer programs-that can automatically execute when certain conditions are met. The native cryptocurrency-essentially computer programs-of the platform is called ${currency} or ${currency}. ${currency} is divisible to 18 decimal places. There is currently no hard cap on the total supply
  of ${currency}.`,
      whitePaperLink: '#',
      websiteLink: '#',
      price: `${(Math.random() * 1000).toFixed(2)} USDT`,
      rank: 1,
      publishTime: '2008-11-01',
      publishAmount: '21,000,000',
      tradingValue: '576,461,120',
      tradingVolume: '19,014,962',
      totalValue: '820,071,000,000 USDT',
    },
  };
  return tickerStatic;
};

interface IRecommendedNews {
  newsId: string;
  img: string;
  date: number;
  title: string;
  description: string;
}

interface IArticle {
  newsId: string;
  img: string;
  date: number;
  title: string;
  content: string;
}

function generateDummyData(length: number) {
  const cryptoBriefNews = [];

  for (let i = 0; i < length; i++) {
    const imgName = i === 0 ? `/news/rectangle_767` : `/news/rectangle_767-${i}`;

    const data = {
      id: 'news-eth-20230602' + i,
      timestamp: 1685496317,
      title: 'Add news title here',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
      img: imgName + '@2x.png',
    };

    cryptoBriefNews.push(data);
  }

  return cryptoBriefNews;
}

export const dummyRecommendationNews: IRecommendedNews[] = [
  {
    newsId: 'news-eth-20230531001',
    img: '/news/rectangle_767-5@2x.png',
    date: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230601001',
    img: '/news/rectangle_767-6@2x.png',
    date: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602001',
    img: '/news/rectangle_767-7@2x.png',
    date: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602002',
    img: '/news/rectangle_767-8@2x.png',
    date: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602003',
    img: '/news/rectangle_767-4@2x.png',
    date: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },
];

export const dummyNews: IArticle = {
  newsId: 'news-eth-20230602003',
  img: '/news/rectangle_767-4@2x.png',
  // TODO: /news/rectangle_809@2x.png
  date: 1685673712,
  title: 'Add news title here',
  content:
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
};
