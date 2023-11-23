import React, {use} from 'react';
import useMarketStore from '../stores/market';
import useWorkerStore from '../stores/worker';
import {APIName, Method} from '../constants/api_request';
import useSyncTrades from '../lib/hooks/use_sync_trades';

const Trial = () => {
  // const syncCandlestickData = useMarketStore(s => s.syncCandlestickData);
  // const setCandlestickInterval = useMarketStore(s => s.setCandlestickInterval);

  // const syncTrades = useSyncTrades();

  // React.useEffect(() => {
  //   syncCandlestickData('ETH-USDT');

  //   return () => {
  //     setCandlestickInterval(null);
  //   };
  // }, []);

  // const [workerInit] = useWorkerStore(s => [s.init]);

  // eslint-disable-next-line no-console
  console.log('trial page');
  // console.log('candlestickchartData in trial', candlestickchartData);
  // // eslint-disable-next-line no-console
  // console.log('availableTickers in trial', availableTickers);
  // eslint-disable-next-line no-console
  // console.log('trades from workerStore in trial', trades);

  // React.useEffect(() => {
  //   let flag = true;

  //   if (flag) {
  //     // // eslint-disable-next-line no-console
  //     // console.log('ready for `api request` in trial');
  //     // init();

  //     workerInit();
  //     // eslint-disable-next-line no-console
  //     console.log('worker init in trial');

  //     // const workerRs = workerRequestHandler({
  //     //   name: APIName.LIST_TICKERS,
  //     //   method: Method.GET,
  //     // });
  //     // eslint-disable-next-line no-console
  //     // console.log('worker result in trial', workerRs);
  //   }

  //   return () => {
  //     flag = false;
  //   };
  // }, []);
  return <div>Trial</div>;
};

export default Trial;
