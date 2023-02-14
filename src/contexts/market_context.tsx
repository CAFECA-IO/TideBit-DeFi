/* eslint-disable no-console */
import React, {useState, useContext, createContext} from 'react';
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
import {
  dummyTickerLiveStatistics,
  getDummyTickerLiveStatistics,
  ITickerLiveStatistics,
} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {
  dummyTickerStatic,
  getDummyTickerStatic,
  ITickerStatic,
} from '../interfaces/tidebit_defi_background/ticker_static';
import {UserContext} from './user_context';
import {ICryptocurrency} from '../interfaces/tidebit_defi_background/cryptocurrency';
import {dummyResultSuccess, IResult} from '../interfaces/tidebit_defi_background/result';
import {
  ITickerData,
  dummyTickers,
  dummyTicker,
  getDummyTicker,
} from '../interfaces/tidebit_defi_background/ticker_data';

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
  selectedTicker: ITickerData;
  availableTickers: ITickerData[];
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  showPositionOnChartHandler: (bool: boolean) => void;
  positionInfoOnChart: ApexOptions | null;
  candlestickId: string;
  candlestickChartIdHandler: (id: string) => void;
  availableTransferOptions: ITransferOptions[];
  // liveStatstics: IPriceStatistics | null;
  // bullAndBearIndex: number;
  // cryptoBriefNews: IBriefNewsItem[];
  // cryptoSummary: ICryptoSummary | null;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  // getCryptoSummary: (tickerId: string) => ICryptoSummary | null;
  // getCryptoNews: (tickerId: string) => IBriefNewsItem[] | null;
  listAvailableTickers: () => ITickerData[];
  listDepositCryptocurrencies: () => ICryptocurrency[];
  listWithdrawCryptocurrencies: () => ICryptocurrency[];
  selectTickerHandler: (props: string) => IResult;
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  selectedTicker: dummyTicker,
  availableTickers: [],
  isCFDTradable: false,
  showPositionOnChart: false,
  showPositionOnChartHandler: () => null,
  positionInfoOnChart: null,
  candlestickId: '',
  candlestickChartIdHandler: () => null,
  availableTransferOptions: [],
  // liveStatstics: null,
  // bullAndBearIndex: 0,
  // cryptoBriefNews: [],
  // cryptoSummary: null,
  tickerStatic: null,
  tickerLiveStatistics: null,
  // getCryptoSummary: () => null,
  // getCryptoNews: () => null,
  listAvailableTickers: () => [],
  listDepositCryptocurrencies: () => [],
  listWithdrawCryptocurrencies: () => [],
  selectTickerHandler: (props: string) => dummyResultSuccess,
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

// const getCryptoSummary = (tickerId = 'ETH') => {
//   return {
//     icon: '',
//     label: 'Ethereum',
//     introduction: `Ethereum (ETH) was launched in 2015. Ethereum is a decentralized blockchain that supports smart contracts-essentially computer programs-that can automatically execute when certain conditions are met. The native cryptocurrency-essentially computer programs-of the platform is called ether or ethereum. Ethereum is divisible to 18 decimal places. There is currently no hard cap on the total supply
//   of ETH.`,
//     whitePaperLink: '#',
//     websiteLink: '#',
//     price: '39051 USDT',
//     rank: 1,
//     publishTime: '2008-11-01',
//     publishAmount: '21,000,000',
//     tradingValue: '576,461,120',
//     tradingVolume: '19,014,962',
//     totalValue: '820,071,000,000 USDT',
//   };
// };
// const getCryptoNews = (tickerId = 'ETH') => [
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
//     img: '/elements/rectangle_715@2x.png',
//   },
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     img: '/elements/rectangle_716@2x.png',
//   },
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     img: '/elements/rectangle_717@2x.png',
//   },
// ];

// const liveStatstics: IPriceStatistics = {
//   fiveMin: {low: 1200, high: 1320, now: '80'},
//   sixtyMin: {low: 1100, high: 1840, now: '27'},
//   oneDay: {low: 1060, high: 2040, now: '39'},
// };

// const bullAndBearIndex = 62;

// const cryptoBriefNews: IBriefNewsItem[] = [
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     // img: 'https://www.tidebit.com/wp-content/uploads/2020/09/20200915_1.jpg',
//     img: '/elements/rectangle_715@2x.png',
//   },
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     img: '/elements/rectangle_716@2x.png',
//   },
//   {
//     title: 'Add news title here',
//     content:
//       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
//     img: '/elements/rectangle_717@2x.png',
//   },
// ];

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
    let updateTickers = [...dummyTickers];
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
  const [selectedTicker, setSelectedTicker] = useState<ITickerData>(dummyTicker);
  const [tickerStatic, setTickerStatic] = useState<ITickerStatic>(dummyTickerStatic);
  const [tickerLiveStatistics, setTickerLiveStatistics] =
    useState<ITickerLiveStatistics>(dummyTickerLiveStatistics);
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

  const selectTickerHandler = (currency: string) => {
    // console.log(`selectTickerHandler currency`, currency);
    const ticker: ITickerData = getDummyTicker(currency);
    console.log(`selectTickerHandler ticker`, ticker);
    setSelectedTicker(ticker);
    const tickerStatic: ITickerStatic = getDummyTickerStatic(currency);
    setTickerStatic(tickerStatic);
    const tickerLiveStatistics: ITickerLiveStatistics = getDummyTickerLiveStatistics(currency);
    setTickerLiveStatistics(tickerLiveStatistics);
    // TODO:
    // 1.candlestickChartIdHandler
    // 2.showPositionOnChartHandler
    if (userCtx.isConnected) {
      userCtx.listOpenCFDs(currency);
      userCtx.listClosedCFDs(currency);
    }

    // if is connected
    // 5.c
    return dummyResultSuccess;
  };

  const defaultValue = {
    selectedTicker,
    selectTickerHandler,
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
    positionInfoOnChart,
    candlestickId,
    candlestickChartIdHandler,
    // transferOptions,
    availableTransferOptions: availableTransferOptions,
    // liveStatstics,
    // bullAndBearIndex,
    tickerStatic,
    tickerLiveStatistics,
    listAvailableTickers,
    listDepositCryptocurrencies,
    listWithdrawCryptocurrencies,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
