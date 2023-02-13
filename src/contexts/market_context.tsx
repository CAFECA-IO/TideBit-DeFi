import React, {useState, useContext, createContext} from 'react';
import {ICardProps, ILineGraphProps} from '../components/card/crypto_card';
import {
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  PROFIT_LOSS_COLOR_TYPE,
  TRADING_CHART_BORDER_COLOR,
} from '../constants/display';
import {ApexOptions} from 'apexcharts';
import {
  IBriefNewsItem,
  ICryptoSummary,
  IPriceStatistics,
  ITickerDetails,
} from '../interfaces/depre_tidebit_defi_background';
import {ITickerLiveStatistics} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {ITickerStatic} from '../interfaces/tidebit_defi_background/ticker_static';
import {UserContext} from './user_context';
import {ICryptocurrency} from '../interfaces/tidebit_defi_background/cryptocurrency';

export interface ITickerData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  // starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: number;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ILineGraphProps;
}

const SAMPLE_TICKERS = [
  'ETH',
  'BTC',
  'LTC',
  'MATIC',
  'BNB',
  'SOL',
  'SHIB',
  'DOT',
  'ADA',
  'AVAX',
  'Dai',
  'MKR',
  'XRP',
  'DOGE',
  'UNI',
  'Flow',
];

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomArray(min: number, max: number, length: number) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(randomNumber(min, max));
  }
  return arr;
}

// const sampleArray = randomArray(1100, 1200, 10);

const strokeColorDisplayed = (sampleArray: number[]) => {
  if (sampleArray[sampleArray.length - 1] > sampleArray[sampleArray.length - 2]) {
    // priceColor = 'text-lightGreen';
    return [PROFIT_LOSS_COLOR_TYPE.profit];
  }

  // priceColor = 'text-lightRed';
  return [PROFIT_LOSS_COLOR_TYPE.loss];
};

const TRADING_CRYPTO_DATA = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2371.svg',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2372.svg',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2374.svg',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2378.svg',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2381.svg',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2385.svg',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2388.svg',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2391.svg',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_x0020_1.svg',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2.svg',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2406.svg',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2-1.svg',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/uniswap-uni-logo.svg',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2_1_.svg',
  },
];

// Add line graph property to each object in array
const addPropertyToArray: ITickerData[] = TRADING_CRYPTO_DATA.map(item => {
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const newArray = {
    ...item,
    starred: false,
    lineGraphProps: {
      dataArray: dataArray,
      strokeColor: strokeColor,
      lineGraphWidth: '170',
      lineGraphWidthMobile: '140',
    },
  };
  // console.log('starColor:', item.starColor, 'gradientColor:', item.gradientColor);

  return newArray;
});

// export interface IPositionInfoOnChart {}

export const PositionInfoOnChart: ApexOptions = {
  chart: {
    type: 'candlestick',
    height: 0,

    toolbar: {
      show: false,
      tools: {
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
      },
    },

    // dropShadow: {
    //   enabled: true,
    //   top: 0,
    //   left: 0,
    //   blur: 3,
    //   opacity: 0.5,
    // },
  },
  responsive: [
    {
      breakpoint: 500,
      options: {
        candlestick: {
          width: '1000',
        },
      },
    },
  ],
  title: {
    text: '',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: TRADING_CHART_BORDER_COLOR,
      },
    },
    axisTicks: {
      show: false,
    },
  },
  grid: {
    show: false,
    // show: true,
    // yaxis: {
    //   lines: {show: false},
    // },
    // xaxis: {
    //   lines: {show: false},
    // },
    // padding: {
    //   right: 300,
    // },
  },

  yaxis: {
    tooltip: {
      enabled: true,
    },
    labels: {
      show: true,
      align: 'center',
      style: {
        colors: TRADING_CHART_BORDER_COLOR,
      },
    },
    opposite: true,
    axisBorder: {
      show: true,
      color: TRADING_CHART_BORDER_COLOR,
    },
    axisTicks: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    theme: 'dark',
  },

  plotOptions: {
    candlestick: {
      colors: {
        upward: PROFIT_LOSS_COLOR_TYPE.profit,
        downward: PROFIT_LOSS_COLOR_TYPE.loss,
      },
      wick: {
        useFillColor: true,
      },
    },
  },

  // markers: {
  //   discrete: [
  //     {
  //       seriesIndex: 0,
  //       dataPointIndex: dataArray.length - 1,
  //       size: 1,
  //       strokeColor: strokeColor[0],
  //       shape: 'circle',
  //     },
  //   ],
  // },
  // grid: {
  //   show: true,
  //   borderColor: strokeColor[0],
  //   strokeDashArray: 5,
  //   position: 'back',
  // },
  // forecastDataPoints: {
  //   count: 2,
  //   fillOpacity: 0.5,
  //   dashArray: 2,
  // },
  annotations: {
    position: 'back',
    yaxis: [
      {
        y: 1800,
        strokeDashArray: 3,
        borderColor: PROFIT_LOSS_COLOR_TYPE.loss,
        width: '100%',
        fillColor: '#ffffff',

        label: {
          position: 'right',
          borderColor: 'transparent',
          textAnchor: 'end',
          offsetY: 10,
          offsetX: 2,
          style: {
            color: '#ffffff',
            fontSize: '12px',
            background: PROFIT_LOSS_COLOR_TYPE.loss,
            padding: {
              right: 10,
            },
          },
          text: `Position $1800 Close`,
          borderWidth: 20,
        },

        offsetX: 0,
      },
      {
        y: 3500,
        strokeDashArray: 3,
        borderColor: PROFIT_LOSS_COLOR_TYPE.profit,
        width: '100%',
        fillColor: '#ffffff',

        label: {
          position: 'right',
          borderColor: 'transparent',
          textAnchor: 'end',
          offsetY: 10,
          offsetX: 2,
          style: {
            color: '#ffffff',
            fontSize: '12px',
            background: PROFIT_LOSS_COLOR_TYPE.profit,
            padding: {
              right: 10,
            },
          },
          text: `Position $3500 Close`,
          borderWidth: 20,
        },

        offsetX: 0,
      },
      {
        y: 3000,
        strokeDashArray: 0,
        borderColor: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
        width: '105%',
        fillColor: '#ffffff',

        label: {
          position: 'right',
          borderColor: 'transparent',
          textAnchor: 'end',
          offsetY: 10,
          offsetX: 42,
          style: {
            color: '#ffffff',
            fontSize: '12px',
            background: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
            padding: {
              left: -5,
              right: 20,
            },
          },
          text: `$3000`,
          borderWidth: 20,
        },

        offsetX: 0,
      },
    ],
  },
};

export interface IMarketProvider {
  children: React.ReactNode;
}

// TODO: Use `interfaces/` instead
export interface ITransferOptions {
  // [key: string]: {
  label: string;
  content: string;
}

export interface IMarketContext {
  availableTickers: ITickerData[];
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  showPositionOnChartHandler: (bool: boolean) => void;
  positionInfoOnChart: ApexOptions | null;
  candlestickId: string;
  candlestickChartIdHandler: (id: string) => void;
  availableTransferOptions: ITransferOptions[];
  liveStatstics: IPriceStatistics | null;
  bullAndBearIndex: number;
  // cryptoBriefNews: IBriefNewsItem[];
  // cryptoSummary: ICryptoSummary | null;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  getCryptoSummary: (tickerId: string) => ICryptoSummary | null;
  getCryptoNews: (tickerId: string) => IBriefNewsItem[] | null;
  listAvailableTickers: () => ITickerData[];
  listDepositCryptocurrencies: () => ICryptocurrency[];
  listWithdrawCryptocurrencies: () => ICryptocurrency[];
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  availableTickers: [],
  isCFDTradable: false,
  showPositionOnChart: false,
  showPositionOnChartHandler: () => null,
  positionInfoOnChart: null,
  candlestickId: '',
  candlestickChartIdHandler: () => null,
  availableTransferOptions: [],
  liveStatstics: null,
  bullAndBearIndex: 0,
  // cryptoBriefNews: [],
  // cryptoSummary: null,
  tickerStatic: null,
  tickerLiveStatistics: null,
  getCryptoSummary: () => null,
  getCryptoNews: () => null,
  listAvailableTickers: () => [],
  listDepositCryptocurrencies: () => [],
  listWithdrawCryptocurrencies: () => [],
});

const availableTransferOptions = [
  {label: 'USDT', content: 'Tether'},
  {label: 'ETH', content: 'ETH'},
  {label: 'BTC', content: 'BTC'},
  {label: 'USDC', content: 'USD Coin'},
  {label: 'DAI', content: 'DAI'},
  {label: 'BNB', content: 'BNB'},
  {label: 'BCH', content: 'BCH'},
  {label: 'LTC', content: 'LTC'},
  {label: 'ETC', content: 'ETC'},
  {label: 'USX', content: 'USX'},
  {label: 'NEO', content: 'NEO'},
  {label: 'EOS', content: 'EOS'},
];

const getCryptoSummary = (tickerId = 'ETH') => {
  return {
    icon: '',
    label: 'Ethereum',
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
  };
};

const getCryptoNews = (tickerId = 'ETH') => [
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
    img: '/elements/rectangle_715@2x.png',
  },
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    img: '/elements/rectangle_716@2x.png',
  },
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    img: '/elements/rectangle_717@2x.png',
  },
];

const tickerStatic: ITickerStatic = {
  id: 'ETH',
  label: 'ETH',
  leverage: 5,
  guaranteedStopFee: 0.2,
  cryptoBriefNews: [
    {
      id: 'NEWS20230210001',
      timestamp: 1675299651,
      title: 'Add news title here',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
      // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
      img: '/elements/rectangle_715@2x.png',
    },
    {
      id: 'NEWS20230210002',
      timestamp: 1675299651,
      title: 'Add news title here',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
      img: '/elements/rectangle_716@2x.png',
    },
    {
      id: 'NEWS20230210003',
      timestamp: 1675299651,
      title: 'Add news title here',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
      img: '/elements/rectangle_717@2x.png',
    },
  ],
  cryptoSummary: {
    icon: '/elements/group_2371.svg', // TODO: Use icon of Context in CryptoSummary component instead of hardcode
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

const tickerLiveStatistics: ITickerLiveStatistics = {
  id: 'ETH',
  longRecommendedSl: 5346.85,
  longRecommendedTp: 7233.97,
  spread: 0.1,
  fee: 0,
  volume: 92154731,
  price: 1580,
  fluctuating: {type: 'UP', value: 23.3, percentage: 2.65},
  buyEstimatedFilledPrice: 1590,
  sellEstimatedFilledPrice: 1570,
  bullAndBearIndex: 39,
  priceStatistics: {
    fiveMin: {low: 1200, high: 1320, now: '82'},
    sixtyMin: {low: 1100, high: 1840, now: '27'},
    oneDay: {low: 1060, high: 2040, now: '39'},
  },
};

const liveStatstics: IPriceStatistics = {
  fiveMin: {low: 1200, high: 1320, now: '80'},
  sixtyMin: {low: 1100, high: 1840, now: '27'},
  oneDay: {low: 1060, high: 2040, now: '39'},
};

const bullAndBearIndex = 62;

const cryptoBriefNews: IBriefNewsItem[] = [
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
    img: '/elements/rectangle_715@2x.png',
  },
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    img: '/elements/rectangle_716@2x.png',
  },
  {
    title: 'Add news title here',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
    img: '/elements/rectangle_717@2x.png',
  },
];

// // TODO: icon svg replaced by img src string
// const cryptoSummary: ICryptoSummary = {
//   icon: '',
//   label: 'Ethereum',
//   introduction: `Ethereum (ETH) was launched in 2015. Ethereum is a decentralized blockchain that supports smart contracts-essentially computer programs-that can automatically execute when certain conditions are met. The native cryptocurrency-essentially computer programs-of the platform is called ether or ethereum. Ethereum is divisible to 18 decimal places. There is currently no hard cap on the total supply
// of ETH.`,
//   whitePaperLink: '#',
//   websiteLink: '#',
//   price: '39051 USDT',
//   rank: 1,
//   publishTime: '2008-11-01',
//   publishAmount: '21,000,000',
//   tradingValue: '576,461,120',
//   tradingVolume: '19,014,962',
//   totalValue: '820,071,000,000 USDT',
// };

export const MarketProvider = ({children}: IMarketProvider) => {
  const userCtx = useContext(UserContext);
  const updateAvailableTickers = () => {
    let updateTickers = [...addPropertyToArray];
    if (userCtx.isConnected) {
      updateTickers = updateTickers.map(ticker => {
        return {
          ...ticker,
          starred: userCtx.isConnected
            ? userCtx.favoriteTickers.some(currency => currency === ticker.currency)
            : false,
        };
      });
    }
    return updateTickers;
  };
  const [availableTickers, setAvailableTickers] = useState<ITickerData[]>(updateAvailableTickers());
  const listAvailableTickers = () => {
    const updateTickers = updateAvailableTickers();
    setAvailableTickers(updateTickers);
    return updateTickers;
  };
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(true);
  const [candlestickId, setCandlestickId] = useState<string>('');

  const [transferOptions, setTransferOptions] =
    useState<ITransferOptions[]>(availableTransferOptions);

  const [showPositionOnChart, setShowPositionOnChart] = useState<boolean>(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  );

  const [positionInfoOnChart, setPositionInfoOnChart] = useState<ApexOptions>(PositionInfoOnChart);

  const showPositionOnChartHandler = (bool: boolean) => {
    setShowPositionOnChart(bool);
    // console.log('in market context, position context boolean:', bool);
  };

  const candlestickChartIdHandler = (id: string) => {
    setCandlestickId(id);
    // console.log('in market context, candlestick id:', id);
  };

  // console.log('market context:', transferOptions);

  // console.log('Whole array [addPropertyToArray]:', addPropertyToArray);
  // setAvailableTickers(addPropertyToArray); // infinite loop

  const listDepositCryptocurrencies = () => [];
  const listWithdrawCryptocurrencies = () => [];

  const defaultValue = {
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
    positionInfoOnChart,
    candlestickId,
    candlestickChartIdHandler,
    // transferOptions,
    availableTransferOptions: availableTransferOptions,
    liveStatstics,
    bullAndBearIndex,
    // cryptoBriefNews,
    // cryptoSummary,
    tickerStatic,
    tickerLiveStatistics,
    getCryptoSummary,
    getCryptoNews,
    listAvailableTickers,
    listDepositCryptocurrencies,
    listWithdrawCryptocurrencies,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
