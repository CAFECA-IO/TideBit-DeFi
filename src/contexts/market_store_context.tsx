import {createStore, useStore} from 'zustand';
import {ITimeSpanUnion, TimeSpanUnion} from '../constants/time_span_union';
import React, {createContext, useCallback, useContext} from 'react';
import TradeBookInstance from '../lib/books/trade_book';
import useState from 'react-usestateref';
import TickerBookInstance from '../lib/books/ticker_book';
import {
  ITickerData,
  dummyTicker,
  toDummyTickers,
} from '../interfaces/tidebit_defi_background/ticker_data';
import {defaultResultFailed, IResult} from '../interfaces/tidebit_defi_background/result';
import {ICandlestickData, ITrade} from '../interfaces/tidebit_defi_background/candlestickData';
import {UserContext} from './user_context';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';
import {
  ICryptocurrency,
  dummyCryptocurrencies,
} from '../interfaces/tidebit_defi_background/cryptocurrency';
import {ITickerStatic} from '../interfaces/tidebit_defi_background/ticker_static';
import {ITickerLiveStatistics} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {
  ITideBitPromotion,
  dummyTideBitPromotion,
} from '../interfaces/tidebit_defi_background/tidebit_promotion';
import {
  IWebsiteReserve,
  dummyWebsiteReserve,
} from '../interfaces/tidebit_defi_background/website_reserve';
import {TideBitEvent} from '../constants/tidebit_event';
import EventEmitter from 'events';
import {isCustomError} from '../lib/custom_error';
import {APIName, Method} from '../constants/api_request';
import {Code, Reason} from '../constants/code';
import {createWorkerStore, useWorkerStoreContext} from './worker_store_context';

// FIXME: use store instead
// const userCtx = useContext(UserContext);
// const notificationCtx = useContext(NotificationContext);

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [cryptocurrencies, setCryptocurrencies, cryptocurrenciesRef] = useState<ICryptocurrency[]>(
//   []
// );
// const [
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   guaranteedStopFeePercentage,
//   setGuaranteedStopFeePercentage,
//   guaranteedStopFeePercentageRef,
// ] = useState<number | null>(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [depositCryptocurrencies, setDepositCryptocurrencies, depositCryptocurrenciesRef] = useState<
//   ICryptocurrency[]
// >([...dummyCryptocurrencies]);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [withdrawCryptocurrencies, setWithdrawCryptocurrencies, withdrawCryptocurrenciesRef] =
//   useState<ICryptocurrency[]>([...dummyCryptocurrencies]);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [tickerStatic, setTickerStatic, tickerStaticRef] = useState<ITickerStatic | null>(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [tickerLiveStatistics, setTickerLiveStatistics, tickerLiveStatisticsRef] =
//   useState<ITickerLiveStatistics | null>(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useState<
//   ICandlestickData[] | null
// >(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [candlestickInterval, setCandlestickInterval, candlestickIntervalRef] = useState<
//   number | null
// >(null);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [availableTickers, setAvailableTickers, availableTickersRef] = useState<{
//   [instId: string]: ITickerData;
// }>(toDummyTickers);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [isCFDTradable, setIsCFDTradable] = useState<boolean>(false);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [candlestickId, setCandlestickId] = useState<string>(''); // Deprecated: stale (20231019 - Shirley)
// /* ToDo: (20230419 - Julian) get TideBit data from backend */
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [tidebitPromotion, setTidebitPromotion, tidebitPromotionRef] =
//   useState<ITideBitPromotion>(dummyTideBitPromotion);
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [websiteReserve, setWebsiteReserve, websiteReserveRef] =
//   useState<IWebsiteReserve>(dummyWebsiteReserve);

interface MarketProps {
  // bears: number;
  isInit: boolean;
  timeSpan: ITimeSpanUnion;
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;
  availableTickers: {[instId: string]: ITickerData};
  tickerStatic: ITickerStatic | null;
  tickerLiveStatistics: ITickerLiveStatistics | null;
  tidebitPromotion: ITideBitPromotion;
  websiteReserve: IWebsiteReserve;
  guaranteedStopFeePercentage: number | null;

  candlestickChartData: ICandlestickData[] | null;
}

const DEFAULT_PROPS: MarketProps = {
  // bears: 20,
  isInit: false,
  timeSpan: TimeSpanUnion._1s,
  selectedTicker: dummyTicker,
  selectedTickerRef: React.createRef<ITickerData>(),
  availableTickers: {},
  tickerStatic: null,
  tickerLiveStatistics: null,
  tidebitPromotion: dummyTideBitPromotion,
  websiteReserve: dummyWebsiteReserve,
  guaranteedStopFeePercentage: null,

  candlestickChartData: [],
};

interface MarketState extends MarketProps {
  // addBear: () => void;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;

  // selectTickerHandler: (instId: string) => Promise<IResult>;
  init: () => Promise<void>;

  setCandlestickChartData: (data: ICandlestickData[] | null) => void;

  listCandlesticks: (
    instId: string,
    options: {
      timeSpan: ITimeSpanUnion;
      begin?: number;
      end?: number;
      limit?: number;
    }
  ) => Promise<IResult>;
  testFetch: () => Promise<void>;
}

type MarketStore = ReturnType<typeof createMarketStore>;

export const createMarketStore = (initProps?: Partial<MarketProps>) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);

  // const [init] = createWorkerStore(s => [s.init]);

  // const [init, requestHandler] = useWorkerStoreContext(s => [s.init, s.requestHandler]);

  // (async () => {
  //   await init();
  //   let result;
  //   try {
  //     result = (await requestHandler({
  //       name: APIName.GET_TICKER_STATIC,
  //       method: Method.GET,
  //       params: 'ETH-USDT',
  //     })) as IResult;
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error(`getTickerStatic error in marektStore`, error);
  //   }

  //   console.log('result', result);
  // })();

  return createStore<MarketState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    // addBear: () => set(state => ({bears: ++state.bears})),
    // timeSpan: timeSpan,
    timeSpan: TimeSpanUnion._1s,

    // FIXME: init to put another place
    init: async () => {
      const listCandlestick = await get().listCandlesticks('eth-usdt', {
        timeSpan: TimeSpanUnion._12h,
      });
      // eslint-disable-next-line no-console
      console.log('init called listCandlestick', listCandlestick);
      const rs = await Promise.resolve();
      return rs;
    },

    setCandlestickChartData(data) {
      set(state => ({...state, candlestickChartData: data}));
    },

    selectTimeSpanHandler: (timeSpan: ITimeSpanUnion, instId?: string) => {
      // eslint-disable-next-line no-console
      console.log('in selectTimeSpanHandler timeSpan INPUT: ', timeSpan);
      const updatedTimeSpan = timeSpan;

      // if (instId) {
      //   const candlestickDataByInstId = tradeBook.getCandlestickData(instId);
      //   if (candlestickDataByInstId && candlestickDataByInstId?.[timeSpan]?.length <= 0) {
      //     updatedTimeSpan = TimeSpanUnion._1s;
      //   }
      // }

      tickerBook.timeSpan = updatedTimeSpan;
      // setTimeSpan(tickerBook.timeSpan);
      set(state => ({...state, timeSpan: updatedTimeSpan}));

      // syncCandlestickData(selectedTickerRef.current?.instId ?? DEFAULT_INSTID, updatedTimeSpan);
    },

    testFetch: async () => {
      const rs = await fetch(
        'https://api.tidebit-defi.com/api/v1/candlesticks/ETH-USDT?timeSpan=1h&limit=50',
        {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      const data = await rs.json();

      // eslint-disable-next-line no-console
      console.log('data in testFetch', data);
      return data;
    },

    listCandlesticks: async (
      instId: string,
      options: {
        begin?: number; // Info: in milliseconds (20230530 - tzuhan)
        end?: number; // Info: in milliseconds (20230530 - tzuhan)
        timeSpan: ITimeSpanUnion;
        limit?: number;
      }
    ) => {
      // eslint-disable-next-line no-console
      console.log('listCandlesticks called in MarketStore func');

      let result: IResult = {...defaultResultFailed};
      try {
        // result = (await workerCtx.requestHandler({
        //   name: APIName.LIST_CANDLESTICKS,
        //   method: Method.GET,
        //   params: instId,
        //   query: {...options},
        // })) as IResult;
        // if (result.success) {
        //   // Info: call API 拿到資料
        //   // const candlesticks = result.data as IInstCandlestick;
        // }
        // eslint-disable-next-line no-console
        console.log(
          'listCandlesticks(store) instId: ',
          instId,
          'options: ',
          options,
          'result: ',
          result
        );
      } catch (error) {
        result = {
          success: false,
          code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
          reason: isCustomError(error)
            ? Reason[error.code]
            : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
        };

        // eslint-disable-next-line no-console
        console.log(
          'listCandlesticks(store) instId catch error: ',
          instId,
          'options: ',
          options,
          'error: ',
          error
        );
      }
      return result;
    },
  }));
};

export const MarketStoreContext = createContext<MarketStore | null>(null);

// export const useMarketStore = () => {
//   const context = useContext(MarketStoreContext);
//   // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

//   return context;
// };

// FIXME: folder structure and `CustomError`
export function useMarketStoreContext<T>(selector: (state: MarketState) => T): T {
  const store = useContext(MarketStoreContext);
  if (!store) throw new Error('Missing MarketStoreContext.Provider in the tree');
  return useStore(store, selector);
}
