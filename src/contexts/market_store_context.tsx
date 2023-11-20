import {createStore} from 'zustand';
import {ITimeSpanUnion, TimeSpanUnion} from '../constants/time_span_union';
import React, {createContext, useCallback, useContext} from 'react';
import TradeBookInstance from '../lib/books/trade_book';
import useStateRef from 'react-usestateref';
import TickerBookInstance from '../lib/books/ticker_book';

interface MarketProps {
  // bears: number;
  isInit: boolean;
  timeSpan: ITimeSpanUnion;
}

const DEFAULT_PROPS: MarketProps = {
  // bears: 20,
  isInit: false,
  timeSpan: TimeSpanUnion._1s,
};

interface MarketState extends MarketProps {
  // addBear: () => void;
  selectTimeSpanHandler: (props: ITimeSpanUnion) => void;
}

type MarketStore = ReturnType<typeof createMarketStore>;

export const createMarketStore = (initProps?: Partial<MarketProps>) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const tradeBook = React.useMemo(() => TradeBookInstance, []);

  const [timeSpan, setTimeSpan, timeSpanRef] = useStateRef<ITimeSpanUnion>(tickerBook.timeSpan);

  return createStore<MarketState>()(set => ({
    ...DEFAULT_PROPS,
    ...initProps,
    // addBear: () => set(state => ({bears: ++state.bears})),
    selectTimeSpanHandler: (timeSpan: ITimeSpanUnion, instId?: string) => {
      let updatedTimeSpan = timeSpan;

      if (instId) {
        const candlestickDataByInstId = tradeBook.getCandlestickData(instId);
        if (candlestickDataByInstId && candlestickDataByInstId?.[timeSpan]?.length <= 0) {
          updatedTimeSpan = TimeSpanUnion._1s;
        }
      }

      tickerBook.timeSpan = updatedTimeSpan;
      setTimeSpan(tickerBook.timeSpan);
      // syncCandlestickData(selectedTickerRef.current?.instId ?? DEFAULT_INSTID, updatedTimeSpan);
    },
  }));
};

export const MarketStoreContext = createContext<MarketStore | null>(null);

export const useMarketStore = () => {
  const context = useContext(MarketStoreContext);
  // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

  return context;
};
