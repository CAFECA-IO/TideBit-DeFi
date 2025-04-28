import React, {useContext, createContext, useCallback, useEffect} from 'react';
import useState from 'react-usestateref';
import {
  CANDLESTICK_SIZE,
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  SAMPLE_NUMBER,
} from '../constants/display';
import {defaultResultFailed, IResult} from '../interfaces/tidebit_defi_background/result';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
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
import {isCustomError} from '../lib/custom_error';
import {Code, Reason} from '../constants/code';
import TradeBookInstance from '../lib/books/trade_book';
import {millisecondsToSeconds} from '../lib/common';
import {MarketContext} from './market_context';
import {useGlobal} from './global_context';

export interface ICandlestickProvider {
  children: React.ReactNode;
}

export interface ICandlestickContext {
  candlestickId: string;
  candlestickIsLoading: boolean;
  timeSpan: ITimeSpanUnion;
  selectTimeSpanHandler: (props: ITimeSpanUnion, instId?: string) => void;
  candlestickChartData: ICandlestickData[] | null;
  candlestickChartIdHandler: (id: string) => void;
  showPositionOnChart: boolean;
  showPositionOnChartHandler: (bool: boolean) => void;
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const CandlestickContext = createContext<ICandlestickContext>({
  candlestickId: '',
  candlestickIsLoading: false,
  candlestickChartData: [],
  timeSpan: TimeSpanUnion._1s,
  selectTimeSpanHandler: () => null,
  candlestickChartIdHandler: () => null,
  showPositionOnChart: false,
  showPositionOnChartHandler: () => null,
});

export const CandlestickProvider = ({children}: ICandlestickProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);
  const marketCtx = useContext(MarketContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  const globalCtx = useGlobal();

  const [candlestickId, setCandlestickId] = useState<string>(''); // Deprecated: stale (20231019 - Shirley)
  const [showPositionOnChart, setShowPositionOnChart] = useState<boolean>(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  ); // Deprecated: stale (20231019 - Shirley)
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
  const [candlestickIsLoading, setCandlestickIsLoading, candlestickIsLoadingRef] =
    useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [frequency, setFrequency, frequencyRef] = useState<number>(100);

  /**
   * Info: (20250428 - Shirley) Track last update time to prevent excessive updates
   * This helps avoid performance issues when frequent updates are requested
   */
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [updateCount, setUpdateCount] = useState<number>(0);
  const MAX_UPDATES_PER_SECOND = 20; // 限制每秒最大更新次數

  const candlestickChartIdHandler = (id: string) => {
    setCandlestickId(id);
  };

  const showPositionOnChartHandler = (bool: boolean) => {
    setShowPositionOnChart(bool);
  };

  const selectTimeSpanHandler = useCallback((timeSpan: ITimeSpanUnion, instId?: string) => {
    tickerBook.timeSpan = timeSpan;

    setTimeSpan(tickerBook.timeSpan);

    syncCandlestickData(
      instId ?? marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
      timeSpan
    );
  }, []);

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

  const listMarketTrades = useCallback(
    async (
      instId: string,
      options?: {
        begin?: number; // Info: in milliseconds (20230530 - tzuhan)
        end?: number; // Info: in milliseconds (20230530 - tzuhan)
        asc?: boolean;
        limit?: number;
      },
      suppressError?: boolean // Info: (20250428 - Shirley) 添加 suppressError 參數，默認為 false
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

        /**
         * Info: (20250428 - Shirley) Only show error notification if suppressError is false
         * This allows silently handling errors for initial API calls on trade page load
         */
        if (!suppressError) {
          notificationCtx.addException(
            'listMarketTrades',
            error as Error,
            Code.INTERNAL_SERVER_ERROR
          );
        }
      }
      return result;
    },
    [tradeBook]
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

    /**
     * Info: (20250428 - Shirley) Reset update counters when starting new interval
     * This helps track and limit updates within each second
     */
    setLastUpdateTime(Date.now());
    setUpdateCount(0);

    // Info: update the candlestick chart data every 0.1 seconds (20231018 - Shirley)
    const candlestickInterval = window.setInterval(() => {
      /**
       * Info: (20250428 - Shirley) Implement update throttling mechanism
       * This prevents too many updates in a short period which could cause browser crashes
       */
      const now = Date.now();
      const elapsedSinceLastCount = now - lastUpdateTime;

      //  Info: (20250428 - Shirley) 如果過去1秒內更新次數超過限制，則跳過此次更新
      if (elapsedSinceLastCount < 1000 && updateCount >= MAX_UPDATES_PER_SECOND) {
        return;
      }

      //  Info: (20250428 - Shirley) 重置計數器（如果已經過了1秒）
      if (elapsedSinceLastCount >= 1000) {
        setLastUpdateTime(now);
        setUpdateCount(1);
      } else {
        setUpdateCount(prev => prev + 1);
      }

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
    }, frequencyRef.current);

    setCandlestickInterval(candlestickInterval);

    setCandlestickIsLoading(false);
  }, []);

  useEffect(() => {
    /**
     * Info: (20250428 - Shirley) Set frequency based on device type and limit updates
     * Mobile devices use slower updates (1000ms) to conserve resources
     * Desktop uses faster updates (100ms = 10 times per second) but with safety mechanisms
     */
    if (globalCtx.layoutAssertion === 'MOBILE') {
      setFrequency(1000); // Info: (20250428 - Shirley) 移動設備每秒更新1次
    } else {
      setFrequency(100); // Info: (20250428 - Shirley) 桌面設備每秒更新10次
    }
  }, [globalCtx.layoutAssertion]);

  // Info: (20250428 - Shirley) 修改使用useMemo註冊事件監聽器的方式，改用useEffect並提供清理函數
  useEffect(() => {
    /**
     * Info: (20250428 - Shirley) Set up event listener for CHANGE_TICKER event
     * Using useEffect with cleanup to prevent memory leaks
     */
    const changeTicker = async (tickerData: ITickerData) => {
      setCandlestickIsLoading(true);
      selectTimeSpanHandler(timeSpanRef.current, tickerData.instId);
    };

    notificationCtx.emitter.on(TideBitEvent.CHANGE_TICKER, changeTicker);

    return () => {
      notificationCtx.emitter.off(TideBitEvent.CHANGE_TICKER, changeTicker);
    };
  }, []);

  useEffect(() => {
    /**
     * Info: (20250428 - Shirley) Set up event listener for TICKER_CHANGE event
     * Using useEffect with cleanup to prevent memory leaks
     */
    const tickerChange = async (tickerData: ITickerData) => {
      selectTimeSpanHandler(timeSpanRef.current, tickerData.instId);
      await listMarketTrades(tickerData.instId, undefined, true);
    };

    notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, tickerChange);

    return () => {
      notificationCtx.emitter.off(TideBitEvent.TICKER_CHANGE, tickerChange);
    };
  }, []);

  /* Deprecated: in observation (20240115 - Shirley)
  // React.useMemo(
  //   () =>
  //     notificationCtx.emitter.on(TideBitEvent.TRADES, (trades: ITrade[]) => {
  //       // eslint-disable-next-line no-console
  //       console.log(
  //         'receive trades',
  //         trades,
  //         'selectedTickerProperty',
  //         marketCtx.selectedTickerProperty
  //       );
  //       for (const trade of trades) {
  //         if (
  //           trade.instId === marketCtx.selectedTickerProperty?.instId &&
  //           trade.instId === ticker
  //         ) {
  //           // eslint-disable-next-line no-console
  //           console.log(
  //             'condition is met',
  //             trade.instId,
  //             marketCtx.selectedTickerProperty?.instId,
  //             ticker
  //           );
  //           tradeBook.add(trade.instId, {
  //             tradeId: trade.tradeId,
  //             targetAsset: trade.baseUnit,
  //             unitAsset: trade.quoteUnit,
  //             direct: TradeSideText[trade.side],
  //             price: trade.price,
  //             timestampMs: trade.timestamp,
  //             quantity: trade.amount,
  //           });
  //         }
  //       }
  //     }),
  //   [marketCtx.selectedTickerProperty, ticker]
  // );
  */

  useEffect(() => {
    /**
     * Info: (20250428 - Shirley) Set up event listener for TRADES event
     * Using dependency array with selectedTickerProperty.instId to ensure
     * listener is re-attached when selected ticker changes
     */
    const tradesListener = (trades: ITrade[]) => {
      for (const trade of trades) {
        if (trade.instId === marketCtx.selectedTickerProperty?.instId) {
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
    };

    notificationCtx.emitter.on(TideBitEvent.TRADES, tradesListener);

    return () => {
      notificationCtx.emitter.off(TideBitEvent.TRADES, tradesListener);
    };
  }, [marketCtx.selectedTickerProperty.instId]);

  const defaultValue = {
    selectTimeSpanHandler,
    showPositionOnChart,
    showPositionOnChartHandler,
    candlestickId,
    candlestickChartData: candlestickChartDataRef.current,
    timeSpan,
    candlestickChartIdHandler,
    listCandlesticks,
    candlestickIsLoading: candlestickIsLoadingRef.current,
  };

  return <CandlestickContext.Provider value={defaultValue}>{children}</CandlestickContext.Provider>;
};
