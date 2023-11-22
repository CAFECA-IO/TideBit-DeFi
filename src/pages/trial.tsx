import React from 'react';
import useMarketStore from '../stores/market';

const Trial = () => {
  const [candlestickchartData, fetchData, init, availableTickers] = useMarketStore(s => [
    s.candlestickChartData,
    s.fetchData,
    s.init,
    s.availableTickers,
  ]);
  // eslint-disable-next-line no-console
  console.log('candlestickchartData in trial', candlestickchartData);
  // eslint-disable-next-line no-console
  console.log('availableTickers in trial', availableTickers);

  React.useEffect(() => {
    let flag = true;

    if (flag) {
      // eslint-disable-next-line no-console
      console.log('ready for `api request` in trial');
      init();
      // fetchData('https://api.tidebit-defi.com/api/v1/candlesticks/ETH-USDT?timeSpan=1h&limit=50');
      // fetchData('https://api.tidebit-defi.com/api/v1/public/promotion');
      // fetchData('https://api.tidebit-defi.com/api/v1/public/reserve');
    }

    return () => {
      flag = false;
    };
  }, []);
  return <div>Trial</div>;
};

export default Trial;
