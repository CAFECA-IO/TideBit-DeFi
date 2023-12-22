import React, {useContext, createContext, useEffect} from 'react';
import useState from 'react-usestateref';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import TickerBookInstance from '../lib/books/ticker_book';
import {MarketContext} from './market_context';

export interface ITickerProvider {
  children: React.ReactNode;
}

export interface ITickerContext {
  selectedTicker: ITickerData | null;
  availableTickers: {[instId: string]: ITickerData};
}
// TODO: Note: _app.tsx 啟動的時候 => createContext
export const TickerContext = createContext<ITickerContext>({
  selectedTicker: null,
  availableTickers: {},
});

export const TickerProvider = ({children}: ITickerProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const marketCtx = useContext(MarketContext);
  const notificationCtx = useContext(NotificationContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availableTickers, setAvailableTickers, availableTickersRef] = useState<{
    [instId: string]: ITickerData;
  }>({});

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.IS_INITIALIZE, () => {
        setAvailableTickers({...tickerBook.listTickers()});
      }),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, (tickerData: ITickerData) => {
        setSelectedTicker({...tickerBook.listTickers()[tickerData.instId]});
      }),
    []
  );

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

  // Info: Change the selectedTicker immediately after selectedTickerProperty is changed (20231222 - Shirley)
  useEffect(() => {
    if (
      !marketCtx.selectedTickerProperty ||
      selectedTickerRef.current?.instId === marketCtx.selectedTickerProperty.instId
    )
      return;
    setSelectedTicker({...tickerBook.listTickers()[marketCtx.selectedTickerProperty.instId]});
  }, [marketCtx.selectedTickerProperty]);

  const defaultValue = {
    selectedTicker: selectedTickerRef.current,
    availableTickers,
  };

  return <TickerContext.Provider value={defaultValue}>{children}</TickerContext.Provider>;
};
