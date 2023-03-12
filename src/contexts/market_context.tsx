import React, {useContext, createContext, useCallback} from 'react';
import useState from 'react-usestateref';
import {INITIAL_POSITION_LABEL_DISPLAYED_STATE} from '../constants/display';
import {
  getDummyTickerLiveStatistics,
  ITickerLiveStatistics,
} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {
  getDummyTickerStatic,
  ITickerStatic,
} from '../interfaces/tidebit_defi_background/ticker_static';
import {UserContext} from './user_context';
import {
  dummyCryptocurrencies,
  ICryptocurrency,
} from '../interfaces/tidebit_defi_background/cryptocurrency';
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

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  availableTickers: {[currency: string]: ITickerData};
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  showPositionOnChartHandler: (bool: boolean) => void;
  candlestickId: string;
  candlestickChartIdHandler: (id: string) => void;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  candlestickChartData: ICandlestickData[] | null;
  listAvailableTickers: () => ITickerData[];
  depositCryptocurrencies: ICryptocurrency[]; // () => ICryptocurrency[];
  withdrawCryptocurrencies: ICryptocurrency[]; //  () => ICryptocurrency[];
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
  availableTickers: {},
  isCFDTradable: false,
  showPositionOnChart: false,
  showPositionOnChartHandler: () => null,
  candlestickId: '',
  candlestickChartIdHandler: () => null,
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
  depositCryptocurrencies: [], // () => [],
  withdrawCryptocurrencies: [], // () => [],
  selectTickerHandler: (props: string) => dummyResultSuccess,
  getCandlestickChartData: (props: {tickerId: string; timeSpan: ITimeSpanUnion}) =>
    Promise.resolve<ICandlestickData[]>([]),
  init: () => Promise.resolve(),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  // const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  const [depositCryptocurrencies, setDepositCryptocurrencies, depositCryptocurrenciesRef] =
    useState<ICryptocurrency[]>([...dummyCryptocurrencies]);
  const [withdrawCryptocurrencies, setWithdrawCryptocurrencies, withdrawCryptocurrenciesRef] =
    useState<ICryptocurrency[]>([...dummyCryptocurrencies]);
  const [tickerStatic, setTickerStatic] = useState<ITickerStatic | null>(null);
  const [tickerLiveStatistics, setTickerLiveStatistics] = useState<ITickerLiveStatistics | null>(
    null
  );
  const [candlestickChartData, setCandlestickChartData] = useState<ICandlestickData[] | null>(null);
  const [availableTickers, setAvailableTickers, availableTickersRef] = useState<{
    [currency: string]: ITickerData;
  }>({});
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
  const [candlestickId, setCandlestickId] = useState<string>('');

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

  const listAvailableTickers = useCallback(() => {
    const availableTickers: {[currency: string]: ITickerData} = {...availableTickersRef.current};
    if (userCtx.enableServiceTerm) {
      for (const favoriteTicker of userCtx.favoriteTickers) {
        if (availableTickers[favoriteTicker])
          availableTickers[favoriteTicker] = {
            ...availableTickers[favoriteTicker],
            starred: true,
          };
      }
    }
    return Object.values(availableTickers);
  }, [userCtx.favoriteTickers, availableTickersRef.current]);

  // const listDepositCryptocurrencies = () => depositCryptocurrenciesRef.current;

  // const listWithdrawCryptocurrencies = () => withdrawCryptocurrenciesRef.current;

  const selectTickerHandler = (currency: string) => {
    // console.log(`selectTickerHandler currency`, currency);
    const ticker: ITickerData = availableTickersRef.current[currency];
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
    setIsCFDTradable(true);
    workerCtx.requestHandler({
      name: APIRequest.LIST_TICKERS,
      request: {
        name: APIRequest.LIST_TICKERS,
        method: Method.GET,
        url: '/api/tickers',
      },
      callback: (tickers: ITickerData[]) => {
        let availableTickers: {[currency: string]: ITickerData} = {};
        availableTickers = [...tickers].reduce((prev, curr) => {
          if (!prev[curr.currency]) prev[curr.currency] = curr;
          return prev;
        }, availableTickers);
        setAvailableTickers(availableTickers);
        selectTickerHandler(tickers[0].currency);
        // console.log(`market init availableTickers`, availableTickers);
      },
    });
    // workerCtx.requestHandler({
    //   name: APIRequest.LIST_DEPOSIT_CRYPTO_CURRENCIES,
    //   request: {
    //     name: APIRequest.LIST_DEPOSIT_CRYPTO_CURRENCIES,
    //     method: Method.GET,
    //     url: '/api/deposits',
    //   },
    //   callback: (cryptocurrencies: ICryptocurrency[]) => {
    //     console.log(`maket init depositcurrencies`, cryptocurrencies);
    //     setDepositCryptocurrencies([...cryptocurrencies]);
    //   },
    // });
    // workerCtx.requestHandler({
    //   name: APIRequest.LIST_WITHDRAW_CRYPTO_CURRENCIES,
    //   request: {
    //     name: APIRequest.LIST_WITHDRAW_CRYPTO_CURRENCIES,
    //     method: Method.GET,
    //     url: '/api/withdraws',
    //   },
    //   callback: (cryptocurrencies: ICryptocurrency[]) => {
    //     setWithdrawCryptocurrencies([...cryptocurrencies]);
    //   },
    // });
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
        if (ticker.currency === selectedTickerRef.current?.currency) setSelectedTicker(ticker);
        const availableTickers = {...availableTickersRef.current};
        availableTickers[ticker.currency] = {...ticker};
        setAvailableTickers(availableTickers);
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
    tickerStatic,
    tickerLiveStatistics,
    listAvailableTickers,
    depositCryptocurrencies: depositCryptocurrenciesRef.current,
    withdrawCryptocurrencies: withdrawCryptocurrenciesRef.current,
    getCandlestickChartData,
    init,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
