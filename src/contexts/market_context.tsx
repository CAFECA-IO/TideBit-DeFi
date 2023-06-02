import React, {useContext, createContext, useCallback} from 'react';
import useState from 'react-usestateref';
import {CANDLESTICK_SIZE, INITIAL_POSITION_LABEL_DISPLAYED_STATE} from '../constants/display';
import {ITickerLiveStatistics} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {ITickerStatic} from '../interfaces/tidebit_defi_background/ticker_static';
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
  toDummyTickers,
} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion, TimeSpanUnion, getTime} from '../constants/time_span_union';
import {
  ICandlestickData,
  ITrade,
  TradeSideText,
} from '../interfaces/tidebit_defi_background/candlestickData';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {APIName, Method} from '../constants/api_request';
import TickerBookInstance from '../lib/books/ticker_book';
import {INITIAL_TRADES_BUFFER, INITIAL_TRADES_INTERVAL, unitAsset} from '../constants/config';
import {ITypeOfPosition} from '../constants/type_of_position';
import {
  dummyTideBitPromotion,
  ITideBitPromotion,
} from '../interfaces/tidebit_defi_background/tidebit_promotion';
import {ICurrency} from '../constants/currency';
import {CustomError} from '../lib/custom_error';
import {Code, Reason} from '../constants/code';
import {IPusherAction} from '../interfaces/tidebit_defi_background/pusher_data';
import {IQuotation} from '../interfaces/tidebit_defi_background/quotation';
import {IRankingTimeSpan} from '../constants/ranking_time_span';
import {ILeaderboard, getDummyLeaderboard} from '../interfaces/tidebit_defi_background/leaderboard';
import TradeBookInstance from '../lib/books/trade_book';
import {millesecondsToSeconds} from '../lib/common';
import {
  IWebsiteReserve,
  dummyWebsiteReserve,
} from '../interfaces/tidebit_defi_background/website_reserve';
import {
  INews,
  IRecommendedNews,
  dummyNews,
  dummyRecommendationNews,
  dummyRecommendedNewsList,
  getDummyNews,
  getDummyRecommendationNews,
} from '../interfaces/tidebit_defi_background/news';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  availableTickers: {[currency: string]: ITickerData};
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  candlestickId: string;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  timeSpan: ITimeSpanUnion;
  candlestickChartData: ICandlestickData[] | null;
  depositCryptocurrencies: ICryptocurrency[];
  withdrawCryptocurrencies: ICryptocurrency[];
  tidebitPromotion: ITideBitPromotion;
  websiteReserve: IWebsiteReserve;
  guaranteedStopFeePercentage: number | null;
  init: () => Promise<void>;
  showPositionOnChartHandler: (bool: boolean) => void;
  candlestickChartIdHandler: (id: string) => void;
  listAvailableTickers: () => ITickerData[];
  selectTickerHandler: (props: ICurrency) => Promise<IResult>;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;
  getCFDQuotation: (tickerId: string, typeOfPosition: ITypeOfPosition) => Promise<IResult>;
  getCFDSuggestion: (
    tickerId: string,
    typeOfPosition: ITypeOfPosition,
    price: number
  ) => Promise<IResult>;
  getGuaranteedStopFeePercentage: (instId: string) => Promise<IResult>;
  getLeaderboard: (timeSpan: IRankingTimeSpan) => ILeaderboard | null;
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
    ticker: ICurrency,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => number[];
  getNews: (currency: ICurrency) => INews;
  getPaginationNews: (
    currency: ICurrency,
    page?: number,
    itemsPerPage?: number
  ) => IRecommendedNews[];
  getRecommendedNews: (currency: ICurrency) => IRecommendedNews[];
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  selectedTicker: dummyTicker,
  selectedTickerRef: React.createRef<ITickerData>(),
  availableTickers: {},
  isCFDTradable: false,
  showPositionOnChart: false,
  candlestickId: '',
  candlestickChartData: [],
  timeSpan: TimeSpanUnion._1s,
  guaranteedStopFeePercentage: null,
  selectTimeSpanHandler: () => null,
  // liveStatstics: null,
  // bullAndBearIndex: 0,
  // cryptoBriefNews: [],
  // cryptoSummary: null,
  tickerStatic: null,
  tickerLiveStatistics: null,
  depositCryptocurrencies: [...dummyCryptocurrencies],
  withdrawCryptocurrencies: [...dummyCryptocurrencies],
  tidebitPromotion: dummyTideBitPromotion,
  init: () => Promise.resolve(),
  showPositionOnChartHandler: () => null,
  candlestickChartIdHandler: () => null,
  listAvailableTickers: () => [],
  selectTickerHandler: () => Promise.resolve(defaultResultSuccess),
  getCFDQuotation: () => Promise.resolve(defaultResultSuccess),
  getCFDSuggestion: () => Promise.resolve(defaultResultSuccess),
  getGuaranteedStopFeePercentage: () => Promise.resolve(defaultResultSuccess),
  getLeaderboard: () => null,
  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  getTickerHistory: (): IResult => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  */
  listTickerPositions: (): number[] => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  websiteReserve: dummyWebsiteReserve,
  getNews: () => dummyNews,
  getPaginationNews: () => dummyRecommendedNewsList,
  getRecommendedNews: () => dummyRecommendationNews,
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  const [cryptocurrencies, setCryptocurrencies, cryptocurrenciesRef] = useState<ICryptocurrency[]>(
    []
  );
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
  const [candlestickInterval, setCandlestickInterval, candlestickIntervalRef] =
    useState<NodeJS.Timer | null>(null);
  const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);
  const [availableTickers, setAvailableTickers, availableTickersRef] = useState<{
    [currency in ICurrency]: ITickerData;
  }>(toDummyTickers);
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
  const [candlestickId, setCandlestickId] = useState<string>('');
  /* ToDo: (20230419 - Julian) get TideBit data from backend */
  const [tidebitPromotion, setTidebitPromotion, tidebitPromotionRef] =
    useState<ITideBitPromotion>(dummyTideBitPromotion);
  const [websiteReserve, setWebsiteReserve, websiteReserveRef] =
    useState<IWebsiteReserve>(dummyWebsiteReserve);
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

  const getNews = (currency: ICurrency) => {
    const news: INews = getDummyNews(currency);
    return news;
  };

  const getPaginationNews = (currency: ICurrency, page?: number, itemsPerPage?: number) => {
    const paginationNews: IRecommendedNews[] = dummyRecommendedNewsList;
    if (page && itemsPerPage) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      return paginationNews.slice(start, end);
    }
    return paginationNews;
  };

  const getRecommendedNews = (currency: ICurrency) => {
    const briefNews = getDummyRecommendationNews(currency);
    return briefNews;
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

    syncCandlestickData(timeSpan);
  };

  const getTickerStatic = async (instId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_TICKER_STATIC,
        method: Method.GET,
        params: instId,
      })) as IResult;
    } catch (error) {
      setIsCFDTradable(false);
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getTickerStatic error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const getTickerLiveStatistics = async (instId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_TICKER_LIVE_STATISTICS,
        method: Method.GET,
        params: instId,
      })) as IResult;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getTickerLiveStatistics error`, error);
      setIsCFDTradable(false);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const selectTickerHandler = async (tickerId: ICurrency) => {
    if (!tickerId) return {...defaultResultFailed};
    const ticker: ITickerData = availableTickersRef.current[tickerId];
    if (!ticker) return {...defaultResultFailed};
    setSelectedTicker(ticker);
    notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    await listMarketTrades(ticker.instId);
    syncCandlestickData();
    // ++ TODO: get from api
    const {success: isGetTickerStaticSuccess, data: tickerStatic} = await getTickerStatic(
      ticker.instId
    );
    if (isGetTickerStaticSuccess) setTickerStatic(tickerStatic as ITickerStatic);
    const {success: isGetTickerLiveStatisticsSuccess, data: tickerLiveStatistics} =
      await getTickerLiveStatistics(ticker.instId);
    if (isGetTickerLiveStatisticsSuccess)
      setTickerLiveStatistics(tickerLiveStatistics as ITickerLiveStatistics);
    await getGuaranteedStopFeePercentage(ticker.instId);
    return {...defaultResultSuccess};
  };

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  const listTradesData = async (tickerId: string) => {
    let result: IResult = defaultResultFailed;
    try {
      const trades = (await workerCtx.requestHandler({
        name: APIName.LIST_TBE_TRADES,
        method: Method.GET,
        query: {
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

  const getCFDQuotation = async (currency: string, typeOfPosition: ITypeOfPosition) => {
    let result: IResult = {...defaultResultFailed};
    const instId = `${currency}-${unitAsset}`;
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_CFD_QUOTATION,
        method: Method.GET,
        params: instId,
        query: {
          typeOfPosition,
        },
      })) as IResult;
      // ToDo: Check if the quotation is expired, if so return `failed result` in `catch`. (20230414 - Shirley)
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log(`getCFDQuotation result(${(result.data as IQuotation)?.deadline})`);
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getCFDQuotation error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const getCFDSuggestion = async (
    currency: string,
    typeOfPosition: ITypeOfPosition,
    price: number
  ) => {
    let result: IResult = {...defaultResultFailed};
    const instId = `${currency}-${unitAsset}`;
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_CFD_QUOTATION,
        method: Method.GET,
        params: instId,
        query: {
          typeOfPosition,
          price,
        },
      })) as IResult;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getCFDSuggestion error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const listTickerPositions = (
    ticker: ICurrency,
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

  const getGuaranteedStopFeePercentage = async (instId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_GUARANTEED_STOP_FEE_PERCENTAGE,
        method: Method.GET,
        params: instId,
      })) as IResult;
      if (result.success) {
        const data = result.data as number;
        setGuaranteedStopFeePercentage(data);
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getGuaranteedStopFeePercentage error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  // TODO: (20230511 - Julian) get data from backend
  const getLeaderboard = (timeSpan: IRankingTimeSpan) => {
    return getDummyLeaderboard(timeSpan);
  };

  const listTickers = async (selectedTickerCurrency?: ICurrency) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // 1. get tickers from backend
      result = (await workerCtx.requestHandler({
        name: APIName.LIST_TICKERS,
        method: Method.GET,
      })) as IResult;
      if (result.success) {
        const tickers = result.data as ITickerData[];
        tickerBook.updateTickers(tickers);
        setAvailableTickers({...tickerBook.listTickers()});
        await selectTickerHandler(selectedTickerCurrency || tickers[0].currency);
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listTickers error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const listCurrencies = async () => {
    let result: IResult = {...defaultResultFailed};
    const depositCryptocurrencies: ICryptocurrency[] = [];
    const withdrawCryptocurrencies: ICryptocurrency[] = [];
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.LIST_CURRENCIES,
        method: Method.GET,
      })) as IResult;
      if (result.success) {
        setCryptocurrencies([...(result.data as ICryptocurrency[])]);
        for (const currency of result.data as ICryptocurrency[]) {
          if (currency.enableDeposit) depositCryptocurrencies.push(currency);
          if (currency.enableWithdraw) withdrawCryptocurrencies.push(currency);
        }
        setDepositCryptocurrencies([...depositCryptocurrencies]);
        setWithdrawCryptocurrencies([...withdrawCryptocurrencies]);
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listCurrencies error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const listMarketTrades = async (
    instId: string,
    options?: {
      begin?: number; // Info: in milliseconds (20230530 - tzuhan)
      end?: number; // Info: in milliseconds (20230530 - tzuhan)
      asc?: boolean;
      limit?: number;
    }
  ) => {
    let result: IResult = {...defaultResultFailed};
    if (!options) {
      const dateTime = new Date().getTime();
      options = {
        begin: dateTime - INITIAL_TRADES_INTERVAL,
        end: dateTime + INITIAL_TRADES_BUFFER,
        asc: false,
      };
    }
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.LIST_MARKET_TRADES,
        method: Method.GET,
        params: instId,
        query: {...(options || {})},
      })) as IResult;
      if (result.success) {
        const trades = (result.data as ITrade[]).map(trade => ({
          tradeId: trade.tradeId,
          targetAsset: trade.baseUnit,
          unitAsset: trade.quoteUnit,
          direct: TradeSideText[trade.side],
          price: trade.price,
          timestampMs: trade.timestamp,
          quantity: trade.amount,
        }));
        trades.sort((a, b) => parseInt(a.tradeId) - parseInt(b.tradeId));
        tradeBook.addTrades(trades);
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listMarketTrades error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const syncCandlestickData = (timeSpan?: ITimeSpanUnion) => {
    if (!!candlestickIntervalRef.current) {
      clearInterval(candlestickIntervalRef.current);
      setCandlestickInterval(null);
    }

    const candlestickInterval = setInterval(() => {
      const ts = timeSpan ? timeSpan : timeSpanRef.current;
      if (timeSpan) setTimeSpan(timeSpan);
      const interval = Math.round(getTime(ts) / CANDLESTICK_SIZE);

      const candlesticks = tradeBook.toCandlestick(millesecondsToSeconds(getTime(ts)), 100);

      setCandlestickChartData(candlesticks);

      // const trades = tradeBook
      //   .listTrades()
      //   .map(t => t.timestampMs)
      //   .sort();
    }, 100);
    setCandlestickInterval(candlestickInterval);
  };

  const getWebsiteReserve = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_WEBSITE_RESERVE,
        method: Method.GET,
      })) as IResult;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getWebsiteReserve error`, error);
      setIsCFDTradable(false);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    if (result.success) {
      setWebsiteReserve(result.data as IWebsiteReserve);
    }
    return result;
  };

  const getTideBitPromotion = async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_TIDEBIT_PROMOTION,
        method: Method.GET,
      })) as IResult;
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getTideBitPromotion error`, error);
      setIsCFDTradable(false);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    if (result.success) {
      setTidebitPromotion(result.data as ITideBitPromotion);
    }
    return result;
  };

  const init = async () => {
    await getTideBitPromotion();
    await getWebsiteReserve();
    await listTickers();
    await listCurrencies();
    setIsCFDTradable(true);
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
        setAvailableTickers({...updateTickers});
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
      notificationCtx.emitter.on(TideBitEvent.TRADES, (action: IPusherAction, trade: ITrade) => {
        if (trade.instId === selectedTickerRef.current?.instId) {
          tradeBook.add({
            tradeId: trade.tradeId,
            targetAsset: trade.baseUnit,
            unitAsset: trade.quoteUnit,
            direct: TradeSideText[trade.side],
            price: trade.price,
            timestampMs: trade.timestamp,
            quantity: trade.amount,
          });
        }
      }),
    []
  );

  const defaultValue = {
    selectedTicker: selectedTickerRef.current,
    selectedTickerRef,
    guaranteedStopFeePercentage: guaranteedStopFeePercentageRef.current,
    selectTickerHandler,
    selectTimeSpanHandler,
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    showPositionOnChartHandler,
    candlestickId,
    candlestickChartData: candlestickChartDataRef.current,
    timeSpan,
    candlestickChartIdHandler,
    tickerStatic,
    tickerLiveStatistics,
    listAvailableTickers,
    depositCryptocurrencies: depositCryptocurrenciesRef.current,
    withdrawCryptocurrencies: withdrawCryptocurrenciesRef.current,
    tidebitPromotion: tidebitPromotionRef.current,
    websiteReserve: websiteReserveRef.current,
    getCFDQuotation,
    getCFDSuggestion,
    getGuaranteedStopFeePercentage,
    getLeaderboard,
    /** Deprecated: replaced by pusher (20230424 - tzuhan)
    getTickerHistory,
    */
    listTickerPositions,
    init,
    getNews,
    getRecommendedNews,
    getPaginationNews,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
