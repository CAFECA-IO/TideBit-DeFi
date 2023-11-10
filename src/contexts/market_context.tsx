import React, {useContext, createContext, useCallback} from 'react';
import useState from 'react-usestateref';
import {
  CANDLESTICK_SIZE,
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  SAMPLE_NUMBER,
} from '../constants/display';
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
  IInstCandlestick,
  ITrade,
  TradeSideText,
  isIInstCandlestick,
} from '../interfaces/tidebit_defi_background/candlestickData';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {APIName, Method} from '../constants/api_request';
import TickerBookInstance from '../lib/books/ticker_book';
import {DEFAULT_INSTID, INITIAL_TRADES_BUFFER, INITIAL_TRADES_INTERVAL} from '../constants/config';
import {ITypeOfPosition, TypeOfPosition} from '../constants/type_of_position';
import {
  dummyTideBitPromotion,
  ITideBitPromotion,
} from '../interfaces/tidebit_defi_background/tidebit_promotion';
import {ICurrency} from '../constants/currency';
import {CustomError, isCustomError} from '../lib/custom_error';
import {Code, Reason} from '../constants/code';
import {IQuotation} from '../interfaces/tidebit_defi_background/quotation';
import {IRankingTimeSpan} from '../constants/ranking_time_span';
import {ILeaderboard} from '../interfaces/tidebit_defi_background/leaderboard';
import TradeBookInstance from '../lib/books/trade_book';
import {millisecondsToSeconds, roundToDecimalPlaces} from '../lib/common';
import {
  IWebsiteReserve,
  dummyWebsiteReserve,
  isIWebsiteReserve,
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
import SafeMath from '../lib/safe_math';
import {ErrorSearchProps} from '../constants/exception';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  isInit: boolean;
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  availableTickers: {[instId: string]: ITickerData};
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
  getTideBitPromotion: () => Promise<IResult>;
  getWebsiteReserve: () => Promise<IResult>;
  showPositionOnChartHandler: (bool: boolean) => void;
  candlestickChartIdHandler: (id: string) => void;
  listAvailableTickers: () => ITickerData[];
  selectTickerHandler: (instId: string) => Promise<IResult>;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;
  getCFDQuotation: (instId: string, typeOfPosition: ITypeOfPosition) => Promise<IResult>;
  getCFDSuggestion: (
    instId: string,
    typeOfPosition: ITypeOfPosition,
    price: number
  ) => Promise<IResult>;
  getGuaranteedStopFeePercentage: () => Promise<IResult>;
  getTickerSpread: (instId: string) => number;
  predictCFDClosePrice: (instId: string, typeOfPosition: ITypeOfPosition) => number;
  getLeaderboard: (timeSpan: IRankingTimeSpan) => Promise<IResult>;
  getTickerLiveStatistics: (instId: string) => Promise<IResult>;
  listTickerPositions: (
    instId: string,
    options: {
      timespan?: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => number[];
  getNews: (currency: ICurrency, newsId: string) => INews;
  getPaginationNews: (
    currency: ICurrency,
    page?: number,
    itemsPerPage?: number
  ) => IRecommendedNews[];
  getRecommendedNews: (currency: ICurrency) => IRecommendedNews[];
  listCandlesticks: (
    instId: string,
    options: {
      timeSpan: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => Promise<IResult>;
  candlestickIsLoading: boolean;
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  isInit: false,
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
  getLeaderboard: function (): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
  getTickerLiveStatistics: () => Promise.resolve(defaultResultSuccess),
  listTickerPositions: (): number[] => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  websiteReserve: dummyWebsiteReserve,
  getNews: () => dummyNews,
  getPaginationNews: () => dummyRecommendedNewsList,
  getRecommendedNews: () => dummyRecommendationNews,
  getTickerSpread: function (): number {
    throw new Error('Function not implemented.');
  },
  predictCFDClosePrice: function (): number {
    throw new Error('Function not implemented.');
  },
  getTideBitPromotion: function (): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
  getWebsiteReserve: function (): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
  listCandlesticks: function (): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
  candlestickIsLoading: true,
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cryptocurrencies, setCryptocurrencies, cryptocurrenciesRef] = useState<ICryptocurrency[]>(
    []
  );
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    guaranteedStopFeePercentage,
    setGuaranteedStopFeePercentage,
    guaranteedStopFeePercentageRef,
  ] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [depositCryptocurrencies, setDepositCryptocurrencies, depositCryptocurrenciesRef] =
    useState<ICryptocurrency[]>([...dummyCryptocurrencies]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [withdrawCryptocurrencies, setWithdrawCryptocurrencies, withdrawCryptocurrenciesRef] =
    useState<ICryptocurrency[]>([...dummyCryptocurrencies]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tickerStatic, setTickerStatic, tickerStaticRef] = useState<ITickerStatic | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tickerLiveStatistics, setTickerLiveStatistics, tickerLiveStatisticsRef] =
    useState<ITickerLiveStatistics | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useState<
    ICandlestickData[] | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candlestickInterval, setCandlestickInterval, candlestickIntervalRef] = useState<
    number | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availableTickers, setAvailableTickers, availableTickersRef] = useState<{
    [instId: string]: ITickerData;
  }>(toDummyTickers);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candlestickId, setCandlestickId] = useState<string>(''); // Deprecated: stale (20231019 - Shirley)
  /* ToDo: (20230419 - Julian) get TideBit data from backend */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tidebitPromotion, setTidebitPromotion, tidebitPromotionRef] =
    useState<ITideBitPromotion>(dummyTideBitPromotion);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [websiteReserve, setWebsiteReserve, websiteReserveRef] =
    useState<IWebsiteReserve>(dummyWebsiteReserve);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showPositionOnChart, setShowPositionOnChart] = useState<boolean>(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  ); // Deprecated: stale (20231019 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candlestickIsLoading, setCandlestickIsLoading, candlestickIsLoadingRef] =
    useState<boolean>(true);

  const showPositionOnChartHandler = (bool: boolean) => {
    setShowPositionOnChart(bool);
  };

  const candlestickChartIdHandler = (id: string) => {
    setCandlestickId(id);
  };

  // TODO: 從 API 拿新聞資料 (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getNews = (currency: ICurrency, newsId: string) => {
    const news: INews = getDummyNews();
    return news;
  };

  // TODO:? 每次拿 itemsPerPage 筆新聞 (20230602 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPaginationNews = (currency: ICurrency, page?: number, itemsPerPage?: number) => {
    const paginationNews: IRecommendedNews[] = dummyRecommendedNewsList;

    // if (page && itemsPerPage) {
    //   const start = (page - 1) * itemsPerPage;
    //   const end = start + itemsPerPage;

    //   return paginationNews.slice(start, end);
    // }
    return paginationNews;
  };

  // TODO: 從 API 拿新聞資料 (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRecommendedNews = (currency: ICurrency) => {
    const briefNews = getDummyRecommendationNews();
    return briefNews;
  };

  const listAvailableTickers = useCallback(() => {
    const availableTickers: {[instId: string]: ITickerData} = {...availableTickersRef.current};
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

  const selectTimeSpanHandler = useCallback((timeSpan: ITimeSpanUnion, instId?: string) => {
    let updatedTimeSpan = timeSpan;

    if (instId) {
      const candlestickDataByInstId = tradeBook.getCandlestickData(instId);
      if (candlestickDataByInstId && candlestickDataByInstId?.[timeSpan]?.length <= 0) {
        updatedTimeSpan = TimeSpanUnion._1s;
      }
    }

    tickerBook.timeSpan = updatedTimeSpan;
    setTimeSpan(tickerBook.timeSpan);
    syncCandlestickData(selectedTickerRef.current?.instId ?? DEFAULT_INSTID, updatedTimeSpan);
  }, []);

  const getTickerStatic = useCallback(async (instId: string) => {
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
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getTickerStatic',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const getTickerLiveStatistics = useCallback(async (instId: string) => {
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
      // setIsCFDTradable(false);
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getTickerLiveStatistics',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const selectTickerHandler = useCallback(async (instId: string) => {
    if (!instId) return {...defaultResultFailed};
    const ticker: ITickerData = availableTickersRef.current[instId];
    if (!ticker) return {...defaultResultFailed};
    notificationCtx.emitter.emit(TideBitEvent.CHANGE_TICKER, ticker);
    setTickerLiveStatistics(null);
    setTickerStatic(null);
    setSelectedTicker(ticker);
    await listMarketTrades(ticker.instId);
    selectTimeSpanHandler(timeSpanRef.current, ticker.instId);
    // ++ TODO: get from api
    const getTickerStaticResult = await getTickerStatic(ticker.instId);
    if (getTickerStaticResult?.success)
      setTickerStatic(getTickerStaticResult.data as ITickerStatic);
    const getTickerLiveStatisticsResult = await getTickerLiveStatistics(ticker.instId);
    if (getTickerLiveStatisticsResult?.success)
      setTickerLiveStatistics(getTickerLiveStatisticsResult.data as ITickerLiveStatistics);
    notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    return {...defaultResultSuccess};
  }, []);

  const getCFDQuotation = useCallback(async (instId: string, typeOfPosition: ITypeOfPosition) => {
    let result: IResult = {...defaultResultFailed};
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
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getCFDQuotation',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const getCFDSuggestion = useCallback(
    async (instId: string, typeOfPosition: ITypeOfPosition, price: number) => {
      let result: IResult = {...defaultResultFailed};
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
        result = {
          success: false,
          code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
          reason: isCustomError(error)
            ? Reason[error.code]
            : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
        };

        if (
          !isCustomError(error) ||
          (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
        ) {
          // Info: add exception to exceptionCollector (20231109 - Shirley)
          const rs = notificationCtx.exceptionCollector.add(
            {
              code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
              reason: isCustomError(error)
                ? Reason[error.code]
                : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
              where: 'getCFDSuggestion',
              when: new Date().getTime(),
              message: (error as Error)?.message,
            },
            '0'
          );

          if (rs) {
            const exception = notificationCtx.exceptionCollector.getSeverest();
            if (exception?.length > 0) {
              notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
            }
          }
        }
      }
      return result;
    },
    []
  );

  const listTickerPositions = useCallback((instId: string) => {
    let positions: number[] = [];
    try {
      positions = tickerBook.listTickerPositions(instId);
    } catch (error) {
      // TODO: error handle (20230331 - tzuhan)

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'listTickerPositions',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return positions;
  }, []);

  const getGuaranteedStopFeePercentage = useCallback(async () => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_GUARANTEED_STOP_FEE_PERCENTAGE,
        method: Method.GET,
      })) as IResult;
      if (result.success) {
        const data = result.data as number;
        setGuaranteedStopFeePercentage(data);
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`getGuaranteedStopFeePercentage error`, error);
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getGuaranteedStopFeePercentage',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  // TODO: (20230511 - Julian) get data from backend
  const getLeaderboard = useCallback(async (timeSpan: IRankingTimeSpan): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    try {
      // 1. get tickers from backend
      result = (await workerCtx.requestHandler({
        name: APIName.GET_LEADERBOARD,
        method: Method.GET,
        query: {
          timeSpan,
        },
      })) as IResult;
      if (result.success) {
        result.data = result.data as ILeaderboard;
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listTickers error`, error);
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getLeaderboard',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const listTickers = useCallback(async () => {
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
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`listTickers error`, error);
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };
      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getLeaderboard',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const listCurrencies = useCallback(async () => {
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
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };
      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getLeaderboard',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    return result;
  }, []);

  const listMarketTrades = useCallback(
    async (
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
            ...trade,
            tradeId: trade.tradeId,
            targetAsset: trade.baseUnit,
            unitAsset: trade.quoteUnit,
            direct: TradeSideText[trade.side],
            price: trade.price,
            timestampMs: trade.timestamp,
            quantity: trade.amount,
          }));
          const target = trades[0]?.instId;
          trades.sort((a, b) => parseInt(a.tradeId) - parseInt(b.tradeId));
          tradeBook.addTrades(target, trades);
        }
      } catch (error) {
        // Deprecate: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listMarketTrades error`, error);
        result = {
          success: false,
          code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
          reason: isCustomError(error)
            ? Reason[error.code]
            : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
        };

        if (
          !isCustomError(error) ||
          (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
        ) {
          const rs = notificationCtx.exceptionCollector.add(
            {
              code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
              reason: isCustomError(error)
                ? Reason[error.code]
                : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
              where: 'listMarketTrades',
              when: new Date().getTime(),
              message: (error as Error)?.message,
            },
            '0'
          );

          if (rs) {
            const exception = notificationCtx.exceptionCollector.getSeverest();
            if (exception?.length > 0) {
              notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
            }
          }
        }
      }
      return result;
    },
    [tradeBook]
  );

  const processCandlesticks = useCallback(
    (timeSpan: ITimeSpanUnion, instCandlestick: IInstCandlestick) => {
      if (!instCandlestick || !isIInstCandlestick(instCandlestick)) return [];
      // Info: 轉換成圖表要的格式 (20230817 - Shirley)
      const dataWithDate = instCandlestick.candlesticks.map(candlestick => ({
        x: new Date(candlestick.x),
        y: candlestick.y,
      }));

      // Info: 避免重複的資料並從舊到新排序資料 (20230817 - Shirley)
      const uniqueData = dataWithDate
        .reduce((acc: ICandlestickData[], current: ICandlestickData) => {
          const xtime = current.x.getTime();
          if (acc.findIndex(item => item.x.getTime() === xtime) === -1) {
            acc.push(current);
          }
          return acc;
        }, [])
        .sort((a, b) => a.x.getTime() - b.x.getTime());

      const partialData = uniqueData.slice(-SAMPLE_NUMBER);

      const alignedData = tradeBook.alignCandlesticks(
        instCandlestick?.instId ?? '',
        partialData,
        timeSpan
      );

      const organizedData = alignedData
        ? uniqueData.slice(0, -SAMPLE_NUMBER).concat(alignedData)
        : uniqueData;

      return organizedData;
    },
    []
  );

  const listCandlesticks = useCallback(
    async (
      instId: string,
      options: {
        begin?: number; // Info: in milliseconds (20230530 - tzuhan)
        end?: number; // Info: in milliseconds (20230530 - tzuhan)
        timeSpan: ITimeSpanUnion;
        limit?: number;
      }
    ) => {
      let result: IResult = {...defaultResultFailed};
      try {
        result = (await workerCtx.requestHandler({
          name: APIName.LIST_CANDLESTICKS,
          method: Method.GET,
          params: instId,
          query: {...options},
        })) as IResult;
        if (result.success) {
          // Info: call API 拿到資料
          // const candlesticks = result.data as IInstCandlestick;
        }
      } catch (error) {
        result = {
          success: false,
          code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
          reason: isCustomError(error)
            ? Reason[error.code]
            : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
        };
      }
      return result;
    },
    []
  );

  const initCandlestickData = useCallback(
    async (instId: string, timeSpan?: ITimeSpanUnion) => {
      const candlestickDataByInstId = tradeBook.getCandlestickData(instId);
      // Info: initialize the candlestick chart data (20231018 - Shirley)
      if (timeSpan) {
        if (timeSpan !== TimeSpanUnion._1s) {
          const result = await listCandlesticks(instId, {
            timeSpan,
            limit: CANDLESTICK_SIZE,
          });
          const candlesticks = result.data as IInstCandlestick;
          const data = processCandlesticks(timeSpan, candlesticks);
          tradeBook.addCandlestickData(instId, timeSpan, data);
        } else {
          const candlesticks = tradeBook.toCandlestick(
            instId,
            millisecondsToSeconds(getTime(timeSpan)),
            CANDLESTICK_SIZE
          );
          tradeBook.addCandlestickData(instId, timeSpan, candlesticks);
        }
      } else {
        for (const timeSpan of Object.values(TimeSpanUnion)) {
          if (candlestickDataByInstId && candlestickDataByInstId?.[timeSpan]?.length > 0) {
            setCandlestickChartData(candlestickDataByInstId?.[timeSpan] || null);
          } else {
            if (timeSpan !== TimeSpanUnion._1s) {
              const result = await listCandlesticks(instId, {
                timeSpan,
                limit: CANDLESTICK_SIZE,
              });
              const candlesticks = result.data as IInstCandlestick;
              const data = processCandlesticks(timeSpan, candlesticks);
              tradeBook.addCandlestickData(instId, timeSpan, data);
            }
          }
        }
      }
    },
    [tradeBook]
  );

  const syncCandlestickData = useCallback(async (instId: string, timeSpan?: ITimeSpanUnion) => {
    if (typeof candlestickIntervalRef.current === 'number') {
      clearInterval(candlestickIntervalRef.current);
      setCandlestickInterval(null);
    }

    setCandlestickIsLoading(true);

    const candlestickDataByInstId = tradeBook.getCandlestickData(instId);

    if (timeSpan) setTimeSpan(timeSpan);
    const ts = timeSpan ? timeSpan : timeSpanRef.current;

    // Info: initialize the candlestick chart data (20231018 - Shirley)
    if (candlestickDataByInstId && candlestickDataByInstId?.[ts]?.length <= 0) {
      await initCandlestickData(instId, ts);
    }

    const candlesticks = tradeBook.getCandlestickData(instId)?.[ts] || [];

    setCandlestickChartData(candlesticks);

    // Info: update the candlestick chart data every 0.1 seconds (20231018 - Shirley)
    const candlestickInterval = window.setInterval(() => {
      const interval = millisecondsToSeconds(getTime(ts));

      if (ts === TimeSpanUnion._1s) {
        const candlesticks = tradeBook.toCandlestick(
          instId,
          millisecondsToSeconds(getTime(ts)),
          CANDLESTICK_SIZE
        );

        tradeBook.addCandlestickData(instId, ts, candlesticks);
        const liveCandlesticks = tradeBook.getCandlestickData(instId)?.[ts] || [];

        setCandlestickChartData(liveCandlesticks);
      } else {
        const origin = tradeBook.getCandlestickData(instId)?.[ts] || [];
        const sample = origin.slice(-SAMPLE_NUMBER);
        const latestTimestampMs = tradeBook.getLatestTimestampMs(sample, ts) ?? 0;
        const lastOfOrigin = origin[origin.length - 1];
        const lastTsOfOrigin = lastOfOrigin?.x.getTime() ?? 0;
        const now = new Date().getTime();
        const futureTs = latestTimestampMs + interval * 1000;

        /* 
        Info: 如果最新的時間戳記是最後一筆資料的時間戳記，就合併最後一筆資料 (20231018 - Shirley)
        如果最新的時間戳記大於最後一筆資料的時間戳記，就直接加入最後一筆資料 (20231018 - Shirley)
        */
        if (latestTimestampMs === lastTsOfOrigin && latestTimestampMs < now && now < futureTs) {
          const newCandle = tradeBook.toCandlestick(instId, interval, 1, latestTimestampMs);
          const merged =
            tradeBook.mergeCandlesticks(
              [lastOfOrigin, ...newCandle],
              new Date(latestTimestampMs)
            ) ?? [];
          const result = origin.slice(0, origin.length - 1).concat(merged);

          tradeBook.addCandlestickData(instId, ts, result);
        } else if (latestTimestampMs > lastTsOfOrigin) {
          const newCandle = tradeBook.toCandlestick(instId, interval, 1, latestTimestampMs);
          const result = origin.concat(newCandle);

          tradeBook.addCandlestickData(instId, ts, result);
        }

        const newData = tradeBook.getCandlestickData(instId)?.[ts] || [];
        const fiveMinData =
          ts === TimeSpanUnion._5m
            ? newData
            : tradeBook.getCandlestickData(instId)?.[TimeSpanUnion._5m] || [];

        if (fiveMinData.length > CANDLESTICK_SIZE) {
          tradeBook.trimCandlestickData(CANDLESTICK_SIZE);
        }

        setCandlestickChartData(newData);
      }
    }, 100);

    setCandlestickInterval(candlestickInterval);

    setCandlestickIsLoading(false);
  }, []);

  const getWebsiteReserve = useCallback(async () => {
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
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getWebsiteReserve',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    if (result.success) {
      // TODO: 要檢查 string 中的資料是不是 number 樣子的資料 (用 isNumber) (20230914 - Shirley)
      const valid = isIWebsiteReserve(result.data as IWebsiteReserve);
      // console.log('result.data', result.data);
      if (!valid) {
        const dummy = {...dummyWebsiteReserve};
        // console.log('dummy in getWebisteReserve', dummy);
        setWebsiteReserve(dummy);

        // Deprecate: error handle (Shirley - 20230914)
        // eslint-disable-next-line no-console
        console.error(`getWebsiteReserve invalid data interface`);
      } else {
        setWebsiteReserve(result.data as IWebsiteReserve);
      }
    }
    return result;
  }, []);

  const getTideBitPromotion = useCallback(async () => {
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
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };

      if (
        !isCustomError(error) ||
        (isCustomError(error) && error.code === Code.INTERNAL_SERVER_ERROR)
      ) {
        // Info: add exception to exceptionCollector (20231109 - Shirley)
        const rs = notificationCtx.exceptionCollector.add(
          {
            code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
            reason: isCustomError(error)
              ? Reason[error.code]
              : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            where: 'getTideBitPromotion',
            when: new Date().getTime(),
            message: (error as Error)?.message,
          },
          '0'
        );

        if (rs) {
          const exception = notificationCtx.exceptionCollector.getSeverest();
          if (exception?.length > 0) {
            notificationCtx.emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
          }
        }
      }
    }
    if (result.success) {
      setTidebitPromotion(result.data as ITideBitPromotion);
    }
    return result;
  }, []);

  const getTickerSpread = useCallback((instId: string): number => {
    if (!guaranteedStopFeePercentageRef.current) return 0;
    const ticker: ITickerData = tickerBook.tickers[instId];
    if (!ticker) return 0;
    const {fluctuating} = ticker;
    const spread = +SafeMath.mult(guaranteedStopFeePercentageRef.current, Math.abs(fluctuating));
    // Deprecated: [debug] (tzuhan - 20230712)
    // eslint-disable-next-line no-console
    // console.log(`getTickerSpread fluctuating: ${fluctuating}, spread: ${spread}, guaranteedStopFeePercentage: ${guaranteedStopFeePercentageRef.current}`);
    return spread;
  }, []);

  const predictCFDClosePrice = useCallback(
    (instId: string, typeOfPosition: ITypeOfPosition): number => {
      const ticker: ITickerData = tickerBook.tickers[instId];
      if (!ticker) return 0;
      const oppositeTypeOfPosition =
        typeOfPosition === TypeOfPosition.BUY ? TypeOfPosition.SELL : TypeOfPosition.BUY;
      const {price} = ticker;
      const spread = getTickerSpread(instId);
      const closePrice =
        oppositeTypeOfPosition === TypeOfPosition.BUY
          ? +SafeMath.mult(price, SafeMath.plus(1, spread))
          : +SafeMath.mult(price, SafeMath.minus(1, spread));
      // Deprecated: [debug] (tzuhan - 20230712)
      // eslint-disable-next-line no-console
      // console.log(`predictCFDClosePrice price: ${price}, closePrice: ${closePrice}`);
      return roundToDecimalPlaces(closePrice, 2);
    },
    []
  );

  const init = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log(`MarketContext.init is called`);
    const {success: listCurrenciesIsSuccess} = await listCurrencies();
    const {success: listTickersIsSuccess} = await listTickers();
    const {success: getStopFeeIsSuccess} = await getGuaranteedStopFeePercentage();
    if (listCurrenciesIsSuccess && listTickersIsSuccess && getStopFeeIsSuccess) {
      setIsCFDTradable(true);
      setTimeSpan(TimeSpanUnion._1s);
    }
    setIsInit(true);

    return await Promise.resolve();
  }, []);

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER, (tickerData: ITickerData) => {
        tickerBook.updateTicker(tickerData);
        const updateTickers = {...tickerBook.listTickers()};
        setAvailableTickers({...updateTickers});
        if (tickerData.instId === selectedTickerRef.current?.instId)
          setSelectedTicker(updateTickers[tickerData.instId]);
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
      notificationCtx.emitter.on(TideBitEvent.TRADES, (trades: ITrade[]) => {
        for (const trade of trades) {
          if (trade.instId === selectedTickerRef.current?.instId) {
            tradeBook.add(trade.instId, {
              tradeId: trade.tradeId,
              targetAsset: trade.baseUnit,
              unitAsset: trade.quoteUnit,
              direct: TradeSideText[trade.side],
              price: trade.price,
              timestampMs: trade.timestamp,
              quantity: trade.amount,
            });
          }
        }
      }),
    []
  );

  const defaultValue = {
    isInit: isInitRef.current,
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
    tickerStatic: tickerStaticRef.current,
    tickerLiveStatistics: tickerLiveStatisticsRef.current,
    listAvailableTickers,
    depositCryptocurrencies: depositCryptocurrenciesRef.current,
    withdrawCryptocurrencies: withdrawCryptocurrenciesRef.current,
    tidebitPromotion: tidebitPromotionRef.current,
    websiteReserve: websiteReserveRef.current,
    getCFDQuotation,
    getCFDSuggestion,
    getGuaranteedStopFeePercentage,
    getLeaderboard,
    getTickerLiveStatistics,
    listTickerPositions,
    init,
    getTideBitPromotion,
    getWebsiteReserve,
    getNews,
    getRecommendedNews,
    getPaginationNews,
    getTickerSpread,
    predictCFDClosePrice,
    listCandlesticks,
    candlestickIsLoading: candlestickIsLoadingRef.current,
  };

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
