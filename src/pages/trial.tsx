import React, {useEffect} from 'react';
import {TimeSpanUnion} from '../constants/time_span_union';
import {useStore} from 'zustand';
import {useMarketStoreContext} from '../contexts/market_store_context';
import {setInterval} from 'timers';
import {useWorkerStoreContext} from '../contexts/worker_store_context';
import {APIName, Method} from '../constants/api_request';
import {IResult} from '../interfaces/tidebit_defi_background/result';

const pickRandomTimeSpan = () => {
  const timeSpans = Object.values(TimeSpanUnion);
  const randomIndex = Math.floor(Math.random() * timeSpans.length);
  return timeSpans[randomIndex];
};

// const marketStore = useMarketStore();
// // TODO: if marketStore is null, throw Alert (20231120 - Shirley)
// if (!marketStore) throw new Error('Missing BearContext.Provider in the tree');
// const [timeSpan, selectTimeSpanHandler] = useStore(marketStore, s => [
//   s.timeSpan,
//   s.selectTimeSpanHandler,
// ]);

// const subTimeSpan = marketStore.subscribe(
//   (state, prev) => {
//     // eslint-disable-next-line no-console
//     console.log('subTimeSpan state', state, 'prev', prev);
//   }
//   // s => s.timeSpan,
//   // timeSpan => {
//   //   console.log('timeSpan', timeSpan);
//   // }
// );

// subTimeSpan();

const Trial = () => {
  const [timeSpan, selectTimeSpanHandler] = useMarketStoreContext(s => [
    s.timeSpan,
    s.selectTimeSpanHandler,
  ]);

  const [init, requestHandler] = useWorkerStoreContext(s => [s.init, s.requestHandler]);

  useEffect(() => {
    const timeOut = setInterval(() => {
      const ran = pickRandomTimeSpan();
      selectTimeSpanHandler(ran);
    }, 2000);

    (async () => {
      await init();
      let result;
      try {
        result = (await requestHandler({
          name: APIName.GET_TICKER_STATIC,
          method: Method.GET,
          params: 'ETH-USDT',
        })) as IResult;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`getTickerStatic error in trial`, error);
      }
      // eslint-disable-next-line no-console
      console.log('result', result);
    })();

    return () => {
      clearInterval(timeOut);
    };
  }, []);

  return (
    <div className="w-full h-screen justify-center items-center text-7xl">Trial {timeSpan}</div>
  );
};

export default Trial;
