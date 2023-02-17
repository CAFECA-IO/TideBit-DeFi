import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
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
import {ITimeSpanUnion} from '../interfaces/tidebit_defi_background/time_span_union';
import {
  getDummyCandlestickChartData,
  ICandlestickData,
} from '../interfaces/tidebit_defi_background/candlestickData';
import {Event} from '../constants/event';

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

export interface ITransferOptions {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  fee: number;
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
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  candlestickChartData: ICandlestickData[];
  listAvailableTickers: () => ITickerData[];
  listDepositCryptocurrencies: () => ICryptocurrency[];
  listWithdrawCryptocurrencies: () => ICryptocurrency[];
  selectTickerHandler: (props: string) => IResult;
  getCandlestickChartData: (props: {
    tickerId: string;
    timeSpan: ITimeSpanUnion;
  }) => Promise<ICandlestickData[]>; // x 100
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
  candlestickChartData: [],
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
  getCandlestickChartData: (props: {tickerId: string; timeSpan: ITimeSpanUnion}) =>
    Promise.resolve<ICandlestickData[]>([]),
});

const availableTransferOptions = [
  {
    id: 'USDT',
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    icon: '/elements/tether-seeklogo.com.svg',
    fee: 0,
  },
  {id: 'ETH', symbol: 'ETH', name: 'ETH', decimals: 18, icon: '/elements/group_2371.svg', fee: 0},
  {id: 'BTC', symbol: 'BTC', name: 'BTC', decimals: 18, icon: '', fee: 0},
  {id: 'USDC', symbol: 'USDC', name: 'USD Coin', decimals: 18, icon: '', fee: 0},
  {id: 'DAI', symbol: 'DAI', name: 'DAI', decimals: 18, icon: '', fee: 0},
  {id: 'BNB', symbol: 'BNB', name: 'BNB', decimals: 18, icon: '', fee: 0},
  {id: 'BCH', symbol: 'BCH', name: 'BCH', decimals: 18, icon: '', fee: 0},
  {id: 'LTC', symbol: 'LTC', name: 'LTC', decimals: 18, icon: '', fee: 0},
  {id: 'ETC', symbol: 'ETC', name: 'ETC', decimals: 18, icon: '', fee: 0},
  {id: 'USX', symbol: 'USX', name: 'USX', decimals: 18, icon: '', fee: 0},
  {id: 'NEO', symbol: 'NEO', name: 'NEO', decimals: 18, icon: '', fee: 0},
  {id: 'EOS', symbol: 'EOS', name: 'EOS', decimals: 18, icon: '', fee: 0},
];

export const MarketProvider = ({children}: IMarketProvider) => {
  const userCtx = useContext(UserContext);
  const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData>(dummyTicker);
  const [tickerStatic, setTickerStatic] = useState<ITickerStatic>(dummyTickerStatic);
  const [tickerLiveStatistics, setTickerLiveStatistics] =
    useState<ITickerLiveStatistics>(dummyTickerLiveStatistics);
  const [candlestickChartData, setCandlestickChartData] = useState<ICandlestickData[]>(
    getDummyCandlestickChartData()
  );
  const [availableTickers, setAvailableTickers] = useState<ITickerData[]>([...dummyTickers]);
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(true);
  const [candlestickId, setCandlestickId] = useState<string>('');

  const [transferOptions, setTransferOptions] =
    useState<ICryptocurrency[]>(availableTransferOptions);

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

  const listAvailableTickers = () => {
    const updateTickers = updateAvailableTickers();
    setAvailableTickers(updateTickers);
    return updateTickers;
  };

  const listDepositCryptocurrencies = () => [];

  const listWithdrawCryptocurrencies = () => [];

  const selectTickerHandler = (currency: string) => {
    // console.log(`selectTickerHandler currency`, currency);
    const ticker: ITickerData = getDummyTicker(currency);
    // console.log(`selectTickerHandler ticker`, ticker);
    setSelectedTicker(ticker);
    const tickerStatic: ITickerStatic = getDummyTickerStatic(currency);
    setTickerStatic(tickerStatic);
    const tickerLiveStatistics: ITickerLiveStatistics = getDummyTickerLiveStatistics(currency);
    setTickerLiveStatistics(tickerLiveStatistics);
    const candlestickChartData = getDummyCandlestickChartData();
    setCandlestickChartData(candlestickChartData);
    if (userCtx.isConnected) {
      userCtx.listOpenCFDs(currency);
      userCtx.listClosedCFDs(currency);
    }
    return dummyResultSuccess;
  };

  const getCandlestickChartData = async (props: {tickerId: string; timeSpan: ITimeSpanUnion}) => {
    let candlestickChartData: ICandlestickData[] = [];
    candlestickChartData = await Promise.resolve(getDummyCandlestickChartData(50));
    return candlestickChartData;
  };

  React.useEffect(() => {
    if (userCtx.wallet !== walletRef.current) {
      setWallet(userCtx.wallet);
      // Event: Login
      if (userCtx.isConnected) {
        userCtx.listOpenCFDs(selectedTickerRef.current.currency);
        userCtx.listClosedCFDs(selectedTickerRef.current.currency);
      }
    }
  }, [userCtx.wallet]);

  const defaultValue = {
    selectedTicker,
    selectTickerHandler,
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
    positionInfoOnChart,
    candlestickId,
    candlestickChartData,
    candlestickChartIdHandler,
    availableTransferOptions: availableTransferOptions,
    tickerStatic,
    tickerLiveStatistics,
    listAvailableTickers,
    listDepositCryptocurrencies,
    listWithdrawCryptocurrencies,
    getCandlestickChartData,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
