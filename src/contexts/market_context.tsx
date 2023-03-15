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
  dummyTicker,
  ITBETrade,
  ITickerMarket,
} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion, TimeSpanUnion} from '../interfaces/tidebit_defi_background/time_span_union';
import {ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {APIName, Method} from '../constants/api_request';
import TickerBookInstance from '../lib/books/ticker_book';

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
  timeSpan: ITimeSpanUnion;
  candlestickChartData: ICandlestickData[] | null;
  listAvailableTickers: () => ITickerData[];
  depositCryptocurrencies: ICryptocurrency[]; // () => ICryptocurrency[];
  withdrawCryptocurrencies: ICryptocurrency[]; //  () => ICryptocurrency[];
  selectTickerHandler: (props: string) => IResult;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;
  getCandlestickChartData: (tickerId: string) => Promise<void>; // x 100
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
  timeSpan: TimeSpanUnion._1d,
  selectTimeSpanHandler: () => null,
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
  selectTickerHandler: () => dummyResultSuccess,
  getCandlestickChartData: () => Promise.resolve(),
  init: () => Promise.resolve(),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
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
  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useState<
    ICandlestickData[] | null
  >(null);
  const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);
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
  const selectTimeSpanHandler = (timeSpan: ITimeSpanUnion) => {
    tickerBook.timeSpan = timeSpan;
    setTimeSpan(tickerBook.timeSpan);
  };
  const selectTickerHandler = (tickerId: string) => {
    const ticker: ITickerData = availableTickersRef.current[tickerId];
    setSelectedTicker(ticker);
    // ++ TODO: get from api
    const tickerStatic: ITickerStatic = getDummyTickerStatic(tickerId);
    setTickerStatic(tickerStatic);
    const tickerLiveStatistics: ITickerLiveStatistics = getDummyTickerLiveStatistics(tickerId);
    setTickerLiveStatistics(tickerLiveStatistics);

    getCandlestickChartData(tickerId);
    workerCtx.tickerChangeHandler(ticker);
    return dummyResultSuccess;
  };

  /* Deprecated: updateCandlestickData with ICandlestickData 可能會有派上用場的時候 (20230407 - Tzuhan)
  const updateCandlestickData = (candlestickData: ICandlestickData) => {
    let candlestickDatas = candlestickChartDataRef.current
      ? [...candlestickChartDataRef.current]
      : [];
    const lastestData = candlestickDatas[candlestickDatas.length - 1];
    // eslint-disable-next-line no-console
    // console.log(`lastestData`, lastestData, lastestData.x.getTime());
    // eslint-disable-next-line no-console
    // console.log(
    //   `candlestickData`,
    //   candlestickData,
    //   candlestickData.x.getTime(),
    //   candlestickData.x.getTime() - lastestData.x.getTime() >= getTime(timeSpanRef.current)
    // );
    if (lastestData) {
      if (candlestickData.x.getTime() - lastestData.x.getTime() >= getTime(timeSpanRef.current)) {
        candlestickDatas = candlestickDatas.concat([candlestickData]);
      } else {
        candlestickDatas[candlestickDatas.length - 1].y = candlestickData.y;
      }
    } else {
      candlestickDatas = [candlestickData];
    }
    // eslint-disable-next-line no-console
    // console.log(`candlestickDatas[${candlestickDatas.length}]`, candlestickDatas);
    setCandlestickChartData(candlestickDatas);
  };
  */

  const getCandlestickChartData = async (tickerId: string) => {
    workerCtx.requestHandler({
      name: APIName.GET_CANDLESTICK_DATA,
      method: Method.GET,
      ticker: selectedTickerRef.current?.currency,
      params: {
        limit: tickerBook.limit,
        timespan: timeSpan,
      },
      callback: (candlestickChartData: ICandlestickData[]) => {
        tickerBook.updateCandlestick(
          tickerId,
          candlestickChartData.map(data => ({...data, x: new Date(data.x)}))
        );
        setCandlestickChartData(tickerBook.candlesticks[tickerId]);
      },
    });
  };

  const init = async () => {
    setIsCFDTradable(true);
    workerCtx.requestHandler({
      name: APIName.LIST_TICKERS,
      method: Method.GET,
      params: {
        limit: tickerBook.limit,
        timespan: timeSpan,
      },
      callback: (tickers: ITickerData[]) => {
        tickerBook.updateTickers(tickers);
        setAvailableTickers({...tickerBook.tickers});
        selectTickerHandler(tickers[0].currency);
      },
    });
    workerCtx.requestHandler({
      name: APIName.LIST_DEPOSIT_CRYPTO_CURRENCIES,
      method: Method.GET,
      callback: (cryptocurrencies: ICryptocurrency[]) => {
        // console.log(`maket init depositcurrencies`, cryptocurrencies);
        setDepositCryptocurrencies([...cryptocurrencies]);
      },
    });
    workerCtx.requestHandler({
      name: APIName.LIST_WITHDRAW_CRYPTO_CURRENCIES,
      method: Method.GET,
      callback: (cryptocurrencies: ICryptocurrency[]) => {
        setWithdrawCryptocurrencies([...cryptocurrencies]);
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
      notificationCtx.emitter.on(TideBitEvent.TICKER, (tickerMarketData: ITickerMarket) => {
        tickerBook.updateTicker(tickerMarketData);
        setAvailableTickers({...tickerBook.tickers});
        if (tickerMarketData.currency === selectedTickerRef.current?.currency)
          setSelectedTicker(tickerBook.tickers[tickerMarketData.currency]);
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
        (ticker: string, trades: ITBETrade[]) => {
          tickerBook.updateCandlestickByTrade(ticker, trades);
          setAvailableTickers({...tickerBook.tickers});
          if (selectedTickerRef.current?.currency === ticker)
            setCandlestickChartData(tickerBook.candlesticks[ticker]);
        }
      ),
    []
  );

  const defaultValue = {
    selectedTicker,
    selectedTickerRef,
    selectTickerHandler,
    selectTimeSpanHandler,
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
    candlestickId,
    candlestickChartData,
    timeSpan,
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
