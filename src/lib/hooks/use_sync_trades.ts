import {useEffect} from 'react';
import useWorkerStore from '../../stores/worker_store';
import useMarketStore from '../../stores/market_store';

function useSyncTrades() {
  useEffect(() => {
    const unsubscribe = useWorkerStore.subscribe(data => {
      // eslint-disable-next-line no-console
      console.log('trades in useSyncTrades', data.trades);
      useMarketStore.getState().setTrades(data.trades);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // useMarketStore.getState().logTrades();
    }, 100);

    return () => clearInterval(interval);
  }, []);
}

export default useSyncTrades;
// Info: 用這個方法會造成不必要的元件重新渲染
