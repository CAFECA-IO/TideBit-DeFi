import React from 'react';
import useMarketStore from '../stores/market';
import useWorkerStore from '../stores/worker';
import {APIName, Method} from '../constants/api_request';

const Trial = () => {
  const [candlestickchartData, fetchData, init, availableTickers] = useMarketStore(s => [
    s.candlestickChartData,
    s.fetchData,
    s.init,
    s.availableTickers,
  ]);

  const [workerInit, trades, subTickers] = useWorkerStore(s => [
    s.init,
    s.trades,
    s.subscribeTickers,
  ]);

  // eslint-disable-next-line no-console
  console.log('candlestickchartData in trial', candlestickchartData);
  // eslint-disable-next-line no-console
  console.log('availableTickers in trial', availableTickers);
  // eslint-disable-next-line no-console
  console.log('trades from workerStore in trial', trades);

  React.useEffect(() => {
    let flag = true;

    if (flag) {
      // eslint-disable-next-line no-console
      console.log('ready for `api request` in trial');
      init();

      workerInit();
      // eslint-disable-next-line no-console
      console.log('worker init in trial');

      subTickers();
      // eslint-disable-next-line no-console
      console.log('subTickers in trial');

      // const workerRs = workerRequestHandler({
      //   name: APIName.LIST_TICKERS,
      //   method: Method.GET,
      // });
      // eslint-disable-next-line no-console
      // console.log('worker result in trial', workerRs);
    }

    return () => {
      flag = false;
    };
  }, []);
  return <div>Trial</div>;
};

export default Trial;
