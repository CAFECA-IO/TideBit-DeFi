import {defaultResultFailed, IResult} from './../interfaces/tidebit_defi_background/result';
import {create} from 'zustand';
import {ITickerData, dummyTicker} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITickerLiveStatistics} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {ITickerStatic} from '../interfaces/tidebit_defi_background/ticker_static';
import {
  ICryptocurrency,
  dummyCryptocurrencies,
} from '../interfaces/tidebit_defi_background/cryptocurrency';
import {
  ITideBitPromotion,
  dummyTideBitPromotion,
} from '../interfaces/tidebit_defi_background/tidebit_promotion';
import {
  IWebsiteReserve,
  dummyWebsiteReserve,
} from '../interfaces/tidebit_defi_background/website_reserve';
import {
  ICandlestickData,
  ICandlestick,
  ITrade,
  TradeSideText,
  IInstCandlestick,
  isIInstCandlestick,
} from '../interfaces/tidebit_defi_background/candlestickData';
import {ITimeSpanUnion, TimeSpanUnion, getTime} from '../constants/time_span_union';
import {INITIAL_TRADES_BUFFER, INITIAL_TRADES_INTERVAL} from '../constants/config';
import {
  APIName,
  FormatedTypeRequest,
  Method,
  TypeRequest,
  formatAPIRequest,
} from '../constants/api_request';
import {isCustomError} from '../lib/custom_error';
import {Code, Reason} from '../constants/code';
import TradeBookInstance from '../lib/books/trade_book';
import {useCallback, useEffect, useMemo} from 'react';
import {CANDLESTICK_SIZE, SAMPLE_NUMBER} from '../constants/display';
import {millisecondsToSeconds} from '../lib/common';
import useState from 'react-usestateref';
import TickerBookInstance from '../lib/books/ticker_book';
import useWorkerStore from './worker';

type MarketStore = {
  selectedTicker: ITickerData | null;
  // selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  availableTickers: {[instId: string]: ITickerData};

  depositCryptocurrencies: ICryptocurrency[];
  withdrawCryptocurrencies: ICryptocurrency[];

  tidebitPromotion: ITideBitPromotion;
  websiteReserve: IWebsiteReserve;
  guaranteedStopFeePercentage: number | null;

  candlestickChartData: ICandlestickData[] | null;

  candlestickInterval: number | null;
  candlestickIsLoading: boolean;
  timeSpanState: ITimeSpanUnion;

  setCandlestickInterval: (interval: number | null) => void;
  setCandlestickIsLoading: (isLoading: boolean) => void;
  setTimeSpan: (timeSpan: ITimeSpanUnion) => void;

  // listCandlesticks: (
  //   instId: string,
  //   options: {
  //     timeSpan: ITimeSpanUnion;
  //     begin?: number;
  //     end?: number;
  //     limit?: number;
  //   }
  // ) => Promise<IResult>;

  // FIXME: IResult
  fetchData: (url: string) => Promise<IResult>;
  init: () => Promise<void>;
};

const useMarketStore = create<MarketStore>((set, get) => {
  const tickerBook = TickerBookInstance;
  const tradeBook = TradeBookInstance;
  // let trades: ITrade[] = [];

  // const workerInit = useWorkerStore.getState().init;

  // const sub1 = useWorkerStore.subscribe(s => {
  //   trades = s.trades;

  //   // eslint-disable-next-line no-console
  //   console.log('s in marketStore', s, s.trades, trades);
  // }); // eslint-disable-next-line no-console
  // console.log('sub1 in marketStore', sub1);

  // useEffect(() => {
  // const initWorker = () => {
  //   let active = true;

  //   if (active) {
  //     console.log('before workerInit, sub1 in marketStore');

  //     workerInit();
  //     sub1();

  //     console.log('after workerInit, sub1 in marketStore');
  //   }

  //   return () => {
  //     active = false;
  //   };
  // };

  // initWorker();

  // }, []);

  // const trades = useWorkerStore.getState().trades;
  // const unsub1 = useWorkerStore.subscribe(s => {
  //   console.log(s);
  // });

  //   (state, prev) => {
  //     // eslint-disable-next-line no-console
  //     console.log('subTimeSpan state', state, 'prev', prev);
  //   }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [candlestickInterval, setCandlestickInterval, candlestickIntervalRef] = useState<
  //   number | null
  // >(null);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [candlestickIsLoading, setCandlestickIsLoading, candlestickIsLoadingRef] =
  //   useState<boolean>(true);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);

  const listWebsiteReserve = async () => {
    const result = await get().fetchData('https://api.tidebit-defi.com/api/v1/website_reserve');
    return result;
  };

  const listPromotion = async () => {
    const result = await get().fetchData('https://api.tidebit-defi.com/api/v1/tidebit_promotion');
    return result;
  };

  const listCurrencies = async () => {
    const result = await get().fetchData('https://api.tidebit-defi.com/api/v1/currencies');
    return result;
  };

  const listTickers = async () => {
    const result = await get().fetchData('https://api.tidebit-defi.com/api/v1/market/tickers');
    return result;
  };

  const listGuaranteedStopLossFeePercentage = async () => {
    const result = await get().fetchData(
      'https://api.tidebit-defi.com/api/v1/market/guaranteed-stop-fee'
    );
    return result;
  };

  const listCandlesticks = async (
    instId: string,
    options: {
      begin?: number; // Info: in milliseconds (20230530 - tzuhan)
      end?: number; // Info: in milliseconds (20230530 - tzuhan)
      timeSpan: ITimeSpanUnion;
      limit?: number;
    }
  ) => {
    const result = await get().fetchData(
      'https://api.tidebit-defi.com/api/v1/candlesticks/ETH-USDT?timeSpan=1h&limit=50'
    );
    return result;
  };

  const initWebsiteReserve = async () => {
    const result = await listWebsiteReserve();
    if (result.success) {
      const websiteReserve = result.data as IWebsiteReserve;
      set({websiteReserve});
    }
  };

  const initPromotion = async () => {
    const result = await listPromotion();
    if (result.success) {
      const tidebitPromotion = result.data as ITideBitPromotion;
      set({tidebitPromotion});
    }
  };

  const initCurrencies = async () => {
    const result = await listCurrencies();
    if (result.success) {
      const currencies = result.data as ICryptocurrency[];
      set({depositCryptocurrencies: currencies});

      set({withdrawCryptocurrencies: currencies});
    }
  };

  const initTickers = async () => {
    const result = await listTickers();
    if (result.success) {
      const tickers = result.data as ITickerData[];
      tickerBook.updateTickers(tickers);

      const listedTickers = tickerBook.listTickers();
      set({availableTickers: listedTickers});
    }
  };

  const initGuaranteedStopLossFeePercentage = async () => {
    const result = await listGuaranteedStopLossFeePercentage();
    if (result.success) {
      const guaranteedStopFeePercentage = result.data as number;
      set({guaranteedStopFeePercentage});
    }
  };

  const initBasicInfo = async () => {
    await initCurrencies();
    await initTickers();
    await initGuaranteedStopLossFeePercentage();
  };

  const init = async () => {
    // eslint-disable-next-line no-console
    console.log('init called');
    await initBasicInfo();
    await initCandlestickData('ETH-USDT', TimeSpanUnion._1h);
  };

  const initCandlestickData = async (instId: string, timeSpan?: ITimeSpanUnion) => {
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

        // const raw = result.data as ICandlestick;
        // const candlestickChartData = raw.candlesticks;
        // eslint-disable-next-line no-console
        console.log('data in initCandlestickData', data);
        set({candlestickChartData: data});
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
          set({candlestickChartData: candlestickDataByInstId?.[timeSpan] || null});
          // setCandlestickChartData(candlestickDataByInstId?.[timeSpan] || null);
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
  };

  const processCandlesticks = (timeSpan: ITimeSpanUnion, instCandlestick: IInstCandlestick) => {
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
  };

  const syncCandlestickData = async (instId: string, timeSpan?: ITimeSpanUnion) => {
    const interval = get().candlestickInterval;
    if (typeof interval === 'number') {
      clearInterval(interval);
      // setCandlestickInterval(null);
      set({candlestickInterval: null});
    }

    // setCandlestickIsLoading(true);
    set({candlestickIsLoading: true});

    const candlestickDataByInstId = tradeBook.getCandlestickData(instId);

    if (timeSpan) set({timeSpanState: timeSpan});
    const ts = timeSpan ? timeSpan : get().timeSpanState;

    // Info: initialize the candlestick chart data (20231018 - Shirley)
    if (candlestickDataByInstId && candlestickDataByInstId?.[ts]?.length <= 0) {
      await initCandlestickData(instId, ts);
    }

    const candlesticks = tradeBook.getCandlestickData(instId)?.[ts] || [];

    // setCandlestickChartData(candlesticks);
    set({candlestickChartData: candlesticks});

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

        // setCandlestickChartData(liveCandlesticks);
        set({candlestickChartData: liveCandlesticks});
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

        // setCandlestickChartData(newData);
        set({candlestickChartData: newData});
      }
    }, 100);

    // setCandlestickInterval(candlestickInterval);
    // setCandlestickIsLoading(false);
    set({candlestickInterval: candlestickInterval});

    set({candlestickIsLoading: false});
  };

  // const listMarketTrades = useCallback(
  //   async (
  //     instId: string,
  //     options?: {
  //       begin?: number; // Info: in milliseconds (20230530 - tzuhan)
  //       end?: number; // Info: in milliseconds (20230530 - tzuhan)
  //       asc?: boolean;
  //       limit?: number;
  //     }
  //   ) => {
  //     let result: IResult = {...defaultResultFailed};
  //     if (!options) {
  //       const dateTime = new Date().getTime();
  //       options = {
  //         begin: dateTime - INITIAL_TRADES_INTERVAL,
  //         end: dateTime + INITIAL_TRADES_BUFFER,
  //         asc: false,
  //       };
  //     }
  //     try {
  //       result = (await get().fetchData({
  //         name: APIName.LIST_MARKET_TRADES,
  //         method: Method.GET,
  //         params: instId,
  //         query: {...(options || {})},
  //       })) as IResult;
  //       if (result.success) {
  //         const trades = (result.data as ITrade[]).map(trade => ({
  //           ...trade,
  //           tradeId: trade.tradeId,
  //           targetAsset: trade.baseUnit,
  //           unitAsset: trade.quoteUnit,
  //           direct: TradeSideText[trade.side],
  //           price: trade.price,
  //           timestampMs: trade.timestamp,
  //           quantity: trade.amount,
  //         }));
  //         const target = trades[0]?.instId;
  //         trades.sort((a, b) => parseInt(a.tradeId) - parseInt(b.tradeId));
  //         tradeBook.addTrades(target, trades);
  //       }
  //     } catch (error) {
  //       // Deprecate: error handle (Tzuhan - 20230321)
  //       // eslint-disable-next-line no-console
  //       console.error(`listMarketTrades error`, error);
  //       result = {
  //         success: false,
  //         code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
  //         reason: isCustomError(error)
  //           ? Reason[error.code]
  //           : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
  //       };

  //       // notificationCtx.addException(
  //       //   'listMarketTrades',
  //       //   error as Error,
  //       //   Code.INTERNAL_SERVER_ERROR
  //       // );
  //     }
  //     return result;
  //   },
  //   [tradeBook]
  // );

  return {
    selectedTicker: dummyTicker,
    // selectedTickerRef: React.createRef<ITickerData>(),
    availableTickers: {},
    guaranteedStopFeePercentage: null,
    tickerStatic: null,
    tickerLiveStatistics: null,
    depositCryptocurrencies: [...dummyCryptocurrencies],
    withdrawCryptocurrencies: [...dummyCryptocurrencies],
    tidebitPromotion: dummyTideBitPromotion,
    websiteReserve: dummyWebsiteReserve,
    candlestickChartData: null,
    candlestickInterval: null,
    candlestickIsLoading: true,
    timeSpanState: TimeSpanUnion._1s,

    setCandlestickInterval: (interval: number | null) => set({candlestickInterval: interval}),
    setCandlestickIsLoading: (isLoading: boolean) => set({candlestickIsLoading: isLoading}),
    setTimeSpan: (timeSpan: ITimeSpanUnion) => set({timeSpanState: timeSpan}),

    fetchData: async (url: string) => {
      // const request: FormatedTypeRequest = formatAPIRequest(data);
      let result: IResult = {...defaultResultFailed};
      // eslint-disable-next-line no-console
      console.log('fetchData called');
      try {
        const response = await fetch(url);
        result = (await response.json()) as IResult;
        // eslint-disable-next-line no-console
        console.log('data in fetchData', result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error in fetchData', error);
      }

      return result;
    },
    init,
  };
});

export default useMarketStore;
