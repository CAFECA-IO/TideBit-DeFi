import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../contexts/market_context';
import {UserProvider} from '../contexts/user_context';
import {GlobalProvider} from '../contexts/global_context';
import {NotificationProvider} from '../contexts/notification_context';
import {AppProvider} from '../contexts/app_context';
import {WorkerProvider} from '../contexts/worker_context';
import React from 'react';
import useMarketStore from '../stores/market';
import useWorkerStore from '../stores/worker';
import useSyncTrades from '../lib/hooks/use_sync_trades';
import {useShallow} from 'zustand/react/shallow';

function MyApp({Component, pageProps}: AppProps) {
  const marketInit = useMarketStore(s => s.init);
  const marketIsInit = useMarketStore(s => s.isInit);
  const syncCandlestickData = useMarketStore(s => s.syncCandlestickData);
  const setCandlestickInterval = useMarketStore(s => s.setCandlestickInterval);
  const candlestickChartData = useMarketStore(useShallow(s => s.candlestickChartData));

  const workerInit = useWorkerStore(s => s.init);

  // const syncTrades = useSyncTrades();

  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('candlestickChartData in _app', candlestickChartData);
  // }, [candlestickChartData]);

  // React.useEffect(() => {
  //   // // eslint-disable-next-line no-console
  //   // console.log('marketIsInit in _app', marketIsInit);
  //   if (marketIsInit) {
  //     syncCandlestickData('ETH-USDT');
  //   }
  //   return () => {
  //     setCandlestickInterval(null);
  //   };
  // }, [marketIsInit]);

  React.useEffect(() => {
    let active = true;
    if (active) {
      // // eslint-disable-next-line no-console
      // console.log('before marketInit in _app');
      marketInit();
      workerInit();
      // // eslint-disable-next-line no-console
      // console.log('after marketInit in _app');
    }

    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <div className="selection:bg-tidebitTheme dark:selection:bg-tidebitTheme">
        {/* <NotificationProvider>
          <WorkerProvider>
            <UserProvider>
              <MarketProvider>
                <GlobalProvider>
                  <AppProvider> */}
        <Component {...pageProps} />
        {/* </AppProvider>
                </GlobalProvider>
              </MarketProvider>
            </UserProvider>
          </WorkerProvider>
        </NotificationProvider> */}
      </div>
    </>
  );
}

export default appWithTranslation(MyApp);
