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
import {
  defaultResultFailed,
  defaultResultSuccess,
  IResult,
} from '../interfaces/tidebit_defi_background/result';
import {
  ITickerData,
  dummyTicker,
  ITBETrade,
  ITickerMarket,
  ITickerItem,
  dummyTickers,
  toDummyTickers,
} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion, TimeSpanUnion} from '../constants/time_span_union';
import {
  ICandlestick,
  ICandlestickData,
} from '../interfaces/tidebit_defi_background/candlestickData';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {APIName, Method} from '../constants/api_request';
import TickerBookInstance from '../lib/books/ticker_book';
import {TRADING_CRYPTO_DATA, unitAsset} from '../constants/config';
import {getDummyQuotation, IQuotation} from '../interfaces/tidebit_defi_background/quotation';
import {
  getDummyTickerHistoryData,
  ITickerHistoryData,
} from '../interfaces/tidebit_defi_background/ticker_history_data';
import {ITypeOfPosition} from '../constants/type_of_position';
import {
  dummyTideBitPromotion,
  ITideBitPromotion,
} from '../interfaces/tidebit_defi_background/tidebit_promotion';
import {Currency, ICurrency} from '../constants/currency';
import {CustomError} from '../lib/custom_error';
import {Code, Reason} from '../constants/code';
import CandlestickBookInstance from '../lib/books/candlestick_book';
import {IPusherAction} from '../interfaces/tidebit_defi_background/pusher_data';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  guaranteedStopFeePercentage: number | null;
  availableTickers: {[currency: string]: ITickerData};
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  candlestickId: string;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  timeSpan: ITimeSpanUnion;
  candlestickChartData: ICandlestickData[] | null;
  depositCryptocurrencies: ICryptocurrency[]; // () => ICryptocurrency[];
  withdrawCryptocurrencies: ICryptocurrency[]; //  () => ICryptocurrency[];
  tidebitPromotion: ITideBitPromotion;
  init: () => Promise<void>;
  // getGuaranteedStopFeePercentage: () => Promise<IResult>;
  showPositionOnChartHandler: (bool: boolean) => void;
  candlestickChartIdHandler: (id: string) => void;
  listAvailableTickers: () => ITickerData[];
  selectTickerHandler: (props: ICurrency) => Promise<IResult>;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;
  getCandlestickChartData: (tickerId: string) => Promise<IResult>; // x 100
  getCFDQuotation: (tickerId: string, typeOfPosition: ITypeOfPosition) => Promise<IResult>;
  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  getTickerHistory: (
    ticker: string,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => IResult;
    */
  listTickerPositions: (
    ticker: string,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => number[];
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  selectedTicker: dummyTicker,
  guaranteedStopFeePercentage: null,
  selectedTickerRef: React.createRef<ITickerData>(),
  availableTickers: {},
  isCFDTradable: false,
  showPositionOnChart: false,
  candlestickId: '',
  candlestickChartData: [],
  timeSpan: TimeSpanUnion._1s,
  selectTimeSpanHandler: () => null,
  // liveStatstics: null,
  // bullAndBearIndex: 0,
  // cryptoBriefNews: [],
  // cryptoSummary: null,
  tickerStatic: null,
  tickerLiveStatistics: null,
  depositCryptocurrencies: [], // () => [],
  withdrawCryptocurrencies: [], // () => [],
  tidebitPromotion: dummyTideBitPromotion,
  init: () => Promise.resolve(),
  // getGuaranteedStopFeePercentage: () => Promise.resolve(defaultResultSuccess),
  showPositionOnChartHandler: () => null,
  candlestickChartIdHandler: () => null,
  listAvailableTickers: () => [],
  selectTickerHandler: () => Promise.resolve(defaultResultSuccess),
  getCandlestickChartData: () => Promise.resolve(defaultResultSuccess),
  getCFDQuotation: () => Promise.resolve(defaultResultSuccess),
  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  getTickerHistory: (): IResult => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  */
  listTickerPositions: (): number[] => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const candlestickBook = React.useMemo(() => CandlestickBookInstance, []);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  // const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  const [
    guaranteedStopFeePercentage,
    setGuaranteedStopFeePercentage,
    guaranteedStopFeePercentageRef,
  ] = useState<number | null>(null);
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
    [currency in ICurrency]: ITickerData;
  }>(toDummyTickers);
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
  const [candlestickId, setCandlestickId] = useState<string>('');
  /* ToDo: (20230419 - Julian) get TideBit data from backend */
  const [tidebitPromotion, setTidebitPromotion] =
    useState<ITideBitPromotion>(dummyTideBitPromotion);

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
  const selectTickerHandler = async (tickerId: ICurrency) => {
    const ticker: ITickerData = availableTickersRef.current[tickerId];
    setSelectedTicker(ticker);
    // ++ TODO: get from api
    const tickerStatic: ITickerStatic = getDummyTickerStatic(tickerId);
    setTickerStatic(tickerStatic);
    const tickerLiveStatistics: ITickerLiveStatistics = getDummyTickerLiveStatistics(tickerId);
    setTickerLiveStatistics(tickerLiveStatistics);

    await getCandlestickChartData(tickerId);
    /** Deprecated: replaced by pusher (20230502 - tzuhan) 
    workerCtx.tickerChangeHandler(ticker);
    */
    return defaultResultSuccess;
  };

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  const listTradesData = async (tickerId: string) => {
    let result: IResult = defaultResultFailed;
    try {
      const trades = (await workerCtx.requestHandler({
        name: APIName.LIST_TBE_TRADES,
        method: Method.GET,
        params: {
          symbol: tickerId,
          limit: tickerBook.limit,
        },
      })) as ITBETrade[];
      tickerBook.updateTrades(tickerId, trades);
      result = defaultResultSuccess;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230327)
      // eslint-disable-next-line no-console
      console.error(`listTradesData error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };
  */

  const getCandlestickChartData = async (tickerId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      /* TODO: when backend provide this api (20230424 - tzuhan)
      const apiResult = (await workerCtx.requestHandler({
        name: APIName.GET_CANDLESTICK_DATA,
        method: Method.GET,
        params: {
          symbol: tickerId,
          limit: tickerBook.limit,
          timespan: timeSpanRef.current,
        },
        /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
        callback: (result: ICandlestickData[], error: Error) => {
          if (error) {
            // Deprecate: error handle (Tzuhan - 20230321)
          } else {
            const candlestickChartData = result.map(data => ({
              ...data,
              x: new Date(data.x),
            }));
            tickerBook.updateCandlestick(tickerId, candlestickChartData);
            setCandlestickChartData(tickerBook.candlesticks[tickerId]);
          }
        },
      })) as ICandlestickData[];
      const candlestickChartData = apiResult.map(data => ({
        ...data,
        x: new Date(data.x),
      }));
      tickerBook.updateCandlestick(tickerId, candlestickChartData);
      */
      // await listTradesData(tickerId);

      setCandlestickChartData(candlestickBook.listCandlestickData(`${tickerId}-${unitAsset}`, {}));
      result = defaultResultSuccess;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getCandlestickChartData error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const getCFDQuotation = async (tickerId: string, typeOfPosition: ITypeOfPosition) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: send request (Tzuhan - 20230317)
      const quotation: IQuotation = getDummyQuotation(tickerId, typeOfPosition);
      result = {...defaultResultSuccess};
      result.data = quotation;
    } catch (error) {
      result = {...defaultResultFailed};
      result.code = Code.CANNOT_GET_QUOTATION_FROM_CONTEXT;
      result.reason = Reason[result.code];
    }
    return result;
  };

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  const getTickerHistory = (
    ticker: string,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => {
    let result: IResult = defaultResultFailed;
    try {
      const tickerHistory: ITickerHistoryData[] = tickerBook.getTickerHistory(ticker, options);
      result = defaultResultSuccess;
      result.data = tickerHistory;
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  */

  const listTickerPositions = (
    ticker: string,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => {
    let positions: number[] = [];
    try {
      positions = tickerBook.listTickerPositions(ticker, options);
    } catch (error) {
      // TODO: error handle (20230331 - tzuhan)
    }
    return positions;
  };

  const getGuaranteedStopFeePercentage = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      const guaranteedStopFeePercentage = (await workerCtx.requestHandler({
        name: APIName.GET_GUARANTEED_STOP_FEE_PERCENTAGE,
        method: Method.GET,
        /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
        callback: (result: number, error: Error) => {
          if (error) {
            // Deprecate: error handle (Tzuhan - 20230321)
          } else {
            setGuaranteedStopFeePercentage(result);
          }
        },
        */
      })) as number;
      setGuaranteedStopFeePercentage(guaranteedStopFeePercentage);
      result = defaultResultSuccess;
      result.data = guaranteedStopFeePercentage;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getGuaranteedStopFeePercentage error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const listTickers = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      // 1. get tickers from backend
      const tickers = (await workerCtx.requestHandler({
        name: APIName.LIST_TICKERS,
        method: Method.GET,
      })) as ITickerItem[];
      tickerBook.updateTickers(tickers);
      setAvailableTickers({...tickerBook.listTickers()});
      // 2. get ticker trades
      // 2.1 available tickers get trades from api
      /** Deprecated: replaced by pusher (20230424 - tzuhan)
      for (const ticker of tickers) {
        const trades = (await workerCtx.requestHandler({
          name: APIName.LIST_TBE_TRADES,
          method: Method.GET,
          params: {
            symbol: ticker.currency,
          },
        })) as ITBETrade[];
        tickerBook.updateTrades(ticker.currency, trades);
      }
      setAvailableTickers({...tickerBook.listTickers()});
      */
      await selectTickerHandler(tickers[0].currency);
      result = defaultResultSuccess;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listTickers error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const listDepositCryptocurrencies = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      const cryptocurrencies = (await workerCtx.requestHandler({
        name: APIName.LIST_DEPOSIT_CRYPTO_CURRENCIES,
        method: Method.GET,
        /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
        callback: (cryptocurrencies: ICryptocurrency[], error: Error) => {
          if (error) {
            // Deprecate: error handle (Tzuhan - 20230321)
          } else {
            setDepositCryptocurrencies([...cryptocurrencies]);
          }
        },
        */
      })) as ICryptocurrency[];
      setDepositCryptocurrencies([...cryptocurrencies]);
      result = defaultResultSuccess;
      result.data = cryptocurrencies;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listDepositCryptocurrencies error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const lisWithdrawCryptocurrencies = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      const cryptocurrencies = (await workerCtx.requestHandler({
        name: APIName.LIST_WITHDRAW_CRYPTO_CURRENCIES,
        method: Method.GET,
        /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
        callback: (cryptocurrencies: ICryptocurrency[], error: Error) => {
          if (error) {
            // Deprecate: error handle (Tzuhan - 20230321)
          } else {
            setWithdrawCryptocurrencies([...cryptocurrencies]);
          }
        },
        */
      })) as ICryptocurrency[];
      setWithdrawCryptocurrencies([...cryptocurrencies]);
      result = defaultResultSuccess;
      result.data = cryptocurrencies;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`lisWithdrawCryptocurrencies error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const init = async () => {
    setIsCFDTradable(true);
    await getGuaranteedStopFeePercentage();
    await listTickers();
    await listDepositCryptocurrencies();
    await lisWithdrawCryptocurrencies();
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
      notificationCtx.emitter.on(TideBitEvent.TICKER, (tickerData: ITickerData) => {
        tickerBook.updateTicker(tickerData);
        const updateTickers = {...tickerBook.listTickers()};
        setAvailableTickers(updateTickers);
        if (tickerData.currency === selectedTickerRef.current?.currency)
          setSelectedTicker(updateTickers[tickerData.currency]);
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
        (action: IPusherAction, candlesticks: ICandlestick) => {
          candlestickBook.updateCandlesticksData(action, candlesticks);
          const [baseUnit, quoteUnit] = candlesticks.instId.split(`-`);
          if (selectedTickerRef.current?.currency === baseUnit)
            setCandlestickChartData(candlestickBook.listCandlestickData(candlesticks.instId, {}));
        }
      ),
    []
  );

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TRADES, (market: string, trades: ITBETrade[]) => {
        const ticker = market.toUpperCase().replace(unitAsset, ``);
        tickerBook.updateTrades(ticker, trades);
        const updateTickers = {...tickerBook.listTickers()};
        setAvailableTickers(updateTickers);
        if (selectedTickerRef.current?.currency === ticker)
          setCandlestickChartData([...tickerBook.listCandlestickData(ticker, {})]);
      }),
    []
  );
  */

  const defaultValue = {
    selectedTicker: selectedTickerRef.current,
    selectedTickerRef,
    guaranteedStopFeePercentage,
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
    tidebitPromotion,
    getCandlestickChartData,
    getCFDQuotation,
    /** Deprecated: replaced by pusher (20230424 - tzuhan)
    getTickerHistory,
    */
    listTickerPositions,
    init,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
