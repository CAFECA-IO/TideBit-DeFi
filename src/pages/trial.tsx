import React, {useEffect} from 'react';
import {TimeSpanUnion} from '../constants/time_span_union';
import {useStore} from 'zustand';
import {useMarketStore} from '../contexts/market_store_context';
import {setInterval} from 'timers';

const pickRandomTimeSpan = () => {
  const timeSpans = Object.values(TimeSpanUnion);
  const randomIndex = Math.floor(Math.random() * timeSpans.length);
  return timeSpans[randomIndex];
};

const Trial = () => {
  const marketStore = useMarketStore();
  // TODO: if marketStore is null, throw Alert (20231120 - Shirley)
  if (!marketStore) throw new Error('Missing BearContext.Provider in the tree');
  const [timeSpan, selectTimeSpanHandler] = useStore(marketStore, s => [
    s.timeSpan,
    s.selectTimeSpanHandler,
  ]);

  const subTimeSpan = marketStore.subscribe(
    (state, prev) => {
      // eslint-disable-next-line no-console
      console.log('subTimeSpan state', state, 'prev', prev);
    }
    // s => s.timeSpan,
    // timeSpan => {
    //   console.log('timeSpan', timeSpan);
    // }
  );

  subTimeSpan();

  // eslint-disable-next-line no-console
  console.log('timeSpan in Trial', timeSpan);

  useEffect(() => {
    const timeOut = setInterval(() => {
      const ran = pickRandomTimeSpan();
      selectTimeSpanHandler(ran);
      // eslint-disable-next-line no-console
      console.log('timespan after call handler in CandlestickChart', timeSpan);
    }, 2000);

    return () => {
      clearInterval(timeOut);
    };
  }, []);

  return (
    <div className="w-full h-screen justify-center items-center text-7xl">Trial {timeSpan}</div>
  );
};

export default Trial;
