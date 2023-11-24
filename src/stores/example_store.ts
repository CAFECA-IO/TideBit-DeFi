import {defaultResultFailed, IResult} from '../interfaces/tidebit_defi_background/result';
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
import useWorkerStore from './worker_store';
import {useShallow} from 'zustand/react/shallow';

type MarketStore = {
  isInit: boolean;
  timeSpanState: ITimeSpanUnion;
  setTimeSpan: (timeSpan: ITimeSpanUnion) => void;
  fetchData: (url: string) => Promise<IResult>;
  init: () => Promise<void>;
  addTradesToTradeBook: (trades: ITrade[]) => boolean | undefined;
  convertTradesToCandlesticks: () => ICandlestickData[];
};

const useMarketStore = create<MarketStore>((set, get) => {
  const tradeBook = TradeBookInstance;

  const listCandlesticks = async (
    instId: string,
    options: {
      begin?: number;
      end?: number;
      timeSpan: ITimeSpanUnion;
      limit?: number;
    }
  ) => {
    const result = await get().fetchData(
      'https://api.tidebit-defi.com/api/v1/candlesticks/ETH-USDT?timeSpan=1h&limit=50'
    );
    return result;
  };

  const listMarketTrades = async (
    instId: string,
    options?: {
      begin?: number;
      end?: number;
      asc?: boolean;
      limit?: number;
    }
  ) => {
    if (!options) {
      const dateTime = new Date().getTime();
      options = {
        begin: dateTime - INITIAL_TRADES_INTERVAL,
        end: dateTime + INITIAL_TRADES_BUFFER,
        asc: false,
      };
    }

    const result = await get().fetchData(
      `https://api.tidebit-defi.com/api/v1/market/trades/${instId}?begin=${options.begin}&end=${options.end}&asc=false
      `
    );
    return result;
  };

  const initMarketTrades = async (instId: string) => {
    const result = await listMarketTrades(instId);
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
      trades.sort((a, b) => parseInt(a.tradeId) - parseInt(b.tradeId));
      tradeBook.addTrades(instId, trades);
    }
  };

  const init = async () => {
    if (!get().isInit) {
      await initCandlestickData('ETH-USDT', TimeSpanUnion._1h);
      await initMarketTrades('ETH-USDT');
      set({isInit: true});
    }
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

        // // const raw = result.data as ICandlestick;
        // // const candlestickChartData = raw.candlesticks;
        // set({candlestickChartData: data});
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
          // set({candlestickChartData: candlestickDataByInstId?.[timeSpan] || null});
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

  const addTradesToTradeBook = (trades: ITrade[]): boolean | undefined => {
    if (trades === undefined || !trades || trades.length === 0) return;

    const t = tradeBook.getTrades('ETH-USDT');
    if (t.length > 0 && t[t.length - 1].tradeId === trades[trades.length - 1]?.tradeId) return;

    for (const trade of trades) {
      tradeBook.add('ETH-USDT', {
        tradeId: trade.tradeId,
        targetAsset: trade.baseUnit,
        unitAsset: trade.quoteUnit,
        direct: TradeSideText[trade.side],
        price: trade.price,
        timestampMs: trade.timestamp,
        quantity: trade.amount,
      });
    }

    return true;
  };

  const convertTradesToCandlesticks = (): ICandlestickData[] => {
    const candlesticks = tradeBook.toCandlestick(
      'ETH-USDT',
      millisecondsToSeconds(getTime(TimeSpanUnion._1s)),
      CANDLESTICK_SIZE
    );
    tradeBook.addCandlestickData('ETH-USDT', TimeSpanUnion._1s, candlesticks);
    const candlestickChartData =
      tradeBook.getCandlestickData('ETH-USDT')?.[TimeSpanUnion._1s] || [];

    return candlestickChartData;
  };

  return {
    isInit: false,
    timeSpanState: TimeSpanUnion._1s,
    setTimeSpan: (timeSpan: ITimeSpanUnion) => set({timeSpanState: timeSpan}),
    fetchData: async (url: string) => {
      let result: IResult = {...defaultResultFailed};
      try {
        const response = await fetch(url);
        result = (await response.json()) as IResult;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error in fetchData', error);
      }
      return result;
    },
    init,
    addTradesToTradeBook,
    convertTradesToCandlesticks,
  };
});

export default useMarketStore;
