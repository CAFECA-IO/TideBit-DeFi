import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  TypeOfPnLColorHex,
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
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {APIRequest, Method} from '../constants/api_request';

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
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  availableTickers: ITickerData[] | null;
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  showPositionOnChartHandler: (bool: boolean) => void;
  candlestickId: string;
  candlestickChartIdHandler: (id: string) => void;
  availableTransferOptions: ITransferOptions[];
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  candlestickChartData: ICandlestickData[] | null;
  listAvailableTickers: () => ITickerData[];
  listDepositCryptocurrencies: () => ICryptocurrency[];
  listWithdrawCryptocurrencies: () => ICryptocurrency[];
  selectTickerHandler: (props: string) => IResult;
  getCandlestickChartData: (props: {
    tickerId: string;
    timeSpan: ITimeSpanUnion;
  }) => Promise<ICandlestickData[]>; // x 100
  init: () => Promise<void>;
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  selectedTicker: dummyTicker,
  selectedTickerRef: React.createRef<ITickerData>(),
  availableTickers: [],
  isCFDTradable: false,
  showPositionOnChart: false,
  showPositionOnChartHandler: () => null,
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
  init: () => Promise.resolve(),
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
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  // const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  const [tickerStatic, setTickerStatic] = useState<ITickerStatic | null>(null);
  const [tickerLiveStatistics, setTickerLiveStatistics] = useState<ITickerLiveStatistics | null>(
    null
  );
  const [candlestickChartData, setCandlestickChartData] = useState<ICandlestickData[] | null>(null);
  const [availableTickers, setAvailableTickers] = useState<ITickerData[] | null>(null);
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
  const [candlestickId, setCandlestickId] = useState<string>('');

  const [transferOptions, setTransferOptions] =
    useState<ICryptocurrency[]>(availableTransferOptions);

  const [showPositionOnChart, setShowPositionOnChart] = useState<boolean>(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  );

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
    if (userCtx.enableServiceTerm) {
      updateTickers = updateTickers.map(ticker => {
        return {
          ...ticker,
          starred: userCtx.enableServiceTerm
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
    // if (userCtx.enableServiceTerm) {
    //   userCtx.listOpenCFDs(currency);
    //   userCtx.listClosedCFDs(currency);
    // }
    // notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    workerCtx.tickerChangeHandler(ticker);
    return dummyResultSuccess;
  };

  const getCandlestickChartData = async (props: {tickerId: string; timeSpan: ITimeSpanUnion}) => {
    let candlestickChartData: ICandlestickData[] = [];
    candlestickChartData = await Promise.resolve(getDummyCandlestickChartData(50));
    return candlestickChartData;
  };

  const init = async () => {
    // console.log(`MarketProvider init is called`);
    setIsCFDTradable(true);
    workerCtx.requestHandler({
      name: APIRequest.LIST_TICKERS,
      request: {
        name: APIRequest.LIST_TICKERS,
        method: Method.GET,
        url: 'http://localhost:3000/api/tickers',
      },
      callback: (tickers: ITickerData[]) => {
        setAvailableTickers([...tickers]);
        selectTickerHandler(tickers[0].currency);
      },
    });
    return await Promise.resolve();
  };

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.IS_CFD_TRADEBLE, (isCFDTradable: boolean) => {
        setIsCFDTradable(isCFDTradable);
      }),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER, (ticker: ITickerData) => {
        setSelectedTicker(ticker);
        // ++ TODO: update availableTickers
      }),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_STATISTIC, (tickerStatic: ITickerStatic) => {
        setTickerStatic(tickerStatic);
      }),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(
        TideBitEvent.TICKER_LIVE_STATISTIC,
        (tickerLiveStatistics: ITickerLiveStatistics) => {
          setTickerLiveStatistics(tickerLiveStatistics);
        }
      ),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(
        TideBitEvent.CANDLESTICK,
        (candlestickData: ICandlestickData[]) => {
          setCandlestickChartData(candlestickData);
        }
      ),
    []
  );

  const defaultValue = {
    selectedTicker,
    selectedTickerRef,
    selectTickerHandler,
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
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
    init,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
