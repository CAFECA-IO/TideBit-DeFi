import {createStore} from 'zustand';
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
import {IResult} from '../interfaces/tidebit_defi_background/result';
import {ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';
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

interface MarketProps {
  // bears: number;
  isInit: boolean;
  timeSpan: ITimeSpanUnion;
  selectedTicker: ITickerData | null;
  selectedTickerRef: React.MutableRefObject<ITickerData | null>;

  // candlestickChartData: ICandlestickData[] | null;
}

const DEFAULT_PROPS: MarketProps = {
  // bears: 20,
  isInit: false,
  timeSpan: TimeSpanUnion._1s,
  selectedTicker: dummyTicker,
  selectedTickerRef: React.createRef<ITickerData>(),

  // candlestickChartData: [],
};

interface MarketState extends MarketProps {
  // addBear: () => void;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;

  // selectTickerHandler: (instId: string) => Promise<IResult>;
}

type MarketStore = ReturnType<typeof createMarketStore>;

export const createMarketStore = (initProps?: Partial<MarketProps>) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);

  // FIXME: use store instead
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
  // const [timeSpan, setTimeSpan, timeSpanRef] = useState<ITimeSpanUnion>(tickerBook.timeSpan);
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

  // const selectTimeSpanHandler

  return createStore<MarketState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    // addBear: () => set(state => ({bears: ++state.bears})),
    // timeSpan: timeSpan,
    timeSpan: TimeSpanUnion._1s,

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

      // console.log('after setTimeSpan timeSpan: ', timeSpanRef.current);
      set(state => ({...state, timeSpan: updatedTimeSpan}));
      // eslint-disable-next-line no-console
      console.log(
        'use set in selectTimeSpanHandler timeSpan INPUT: ',
        timeSpan,
        'get().timeSpan: ',
        get().timeSpan
      );

      // syncCandlestickData(selectedTickerRef.current?.instId ?? DEFAULT_INSTID, updatedTimeSpan);
    },

    // selectTickerHandlerasync: (instId: string) => {
    //   if (!instId) return {...defaultResultFailed};
    //   const ticker: ITickerData = availableTickersRef.current[instId];
    //   if (!ticker) return {...defaultResultFailed};
    //   notificationCtx.emitter.emit(TideBitEvent.CHANGE_TICKER, ticker);
    //   setTickerLiveStatistics(null);
    //   setTickerStatic(null);
    //   setSelectedTicker(ticker);
    //   await listMarketTrades(ticker.instId);
    //   selectTimeSpanHandler(timeSpanRef.current, ticker.instId);
    //   // ++ TODO: get from api
    //   const getTickerStaticResult = await getTickerStatic(ticker.instId);
    //   if (getTickerStaticResult?.success)
    //     setTickerStatic(getTickerStaticResult.data as ITickerStatic);
    //   const getTickerLiveStatisticsResult = await getTickerLiveStatistics(ticker.instId);
    //   if (getTickerLiveStatisticsResult?.success)
    //     setTickerLiveStatistics(getTickerLiveStatisticsResult.data as ITickerLiveStatistics);
    //   notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    //   return {...defaultResultSuccess};
    // },
  }));
};

export const MarketStoreContext = createContext<MarketStore | null>(null);

export const useMarketStore = () => {
  const context = useContext(MarketStoreContext);
  // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

  return context;
};
